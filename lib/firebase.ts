import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK (bypasses security rules)
let app: App;

if (!getApps().length) {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;

    if (serviceAccountJson) {
        const serviceAccount = JSON.parse(serviceAccountJson);
        app = initializeApp({
            credential: cert(serviceAccount),
            projectId: process.env.FIREBASE_PROJECT_ID,
        });
    } else {
        app = initializeApp({
            projectId: process.env.FIREBASE_PROJECT_ID,
        });
    }
} else {
    app = getApps()[0];
}

export const db: Firestore = getFirestore(app);

// Types
export interface ChatSessionMessage {
    text: string;
    isUser: boolean;
    timestamp: number;
    source?: 'visitor' | 'michael' | 'gemini';
}

export interface ChatSession {
    sessionId: string;
    messages: ChatSessionMessage[];
    mode: 'gemini-active' | 'michael-active';
    createdAt: number;
    lastMessageAt: number;
    michaelLastReplyAt?: number;
    telegramMessageId?: number;
    pendingMichaelReply?: string;
}

// Create a new chat session
export async function createChatSession(sessionId: string, userMessage: string): Promise<void> {
    await db.collection('chat_sessions').doc(sessionId).set({
        sessionId,
        messages: [{
            text: userMessage,
            isUser: true,
            timestamp: Date.now(),
            source: 'visitor',
        }],
        mode: 'gemini-active',
        createdAt: Date.now(),
        lastMessageAt: Date.now(),
    });
}

// Get a chat session
export async function getChatSession(sessionId: string): Promise<ChatSession | null> {
    const snapshot = await db.collection('chat_sessions').doc(sessionId).get();
    if (!snapshot.exists) return null;
    return snapshot.data() as ChatSession;
}

// Add a message to a session
export async function addMessageToSession(
    sessionId: string,
    text: string,
    isUser: boolean,
    source: 'visitor' | 'michael' | 'gemini'
): Promise<void> {
    const session = await getChatSession(sessionId);
    if (!session) return;

    session.messages.push({
        text,
        isUser,
        timestamp: Date.now(),
        source,
    });

    const updates: Record<string, unknown> = {
        messages: session.messages,
        lastMessageAt: Date.now(),
    };

    if (source === 'michael') {
        updates.mode = 'michael-active';
        updates.michaelLastReplyAt = Date.now();
        updates.pendingMichaelReply = text;
    } else if (source === 'gemini') {
        // Gemini replied, clear pending
        updates.pendingMichaelReply = null;
    } else if (source === 'visitor') {
        // New visitor message, clear pending reply
        updates.pendingMichaelReply = null;
    }

    await db.collection('chat_sessions').doc(sessionId).update(updates);
}

// Set session mode back to gemini
export async function setGeminiActive(sessionId: string): Promise<void> {
    await db.collection('chat_sessions').doc(sessionId).update({
        mode: 'gemini-active',
    });
}

// Save Telegram message ID for a session
export async function updateSessionTelegramId(sessionId: string, telegramMessageId: number): Promise<void> {
    await db.collection('chat_sessions').doc(sessionId).update({ telegramMessageId });
}
