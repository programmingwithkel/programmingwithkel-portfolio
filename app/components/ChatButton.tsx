'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

const MAX_CHARS = 1000;
const POLL_INTERVAL = 3000;

export default function ChatButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState<{ text: string; isUser: boolean; source?: string }[]>([
        { text: "Hi there! 👋 Thanks for visiting my website. Feel free to ask me anything about programming, web development, or my experiences in tech. Let me know how I can help!", isUser: false, source: 'gemini' }
    ]);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [waitingForMichael, setWaitingForMichael] = useState(false);
    const [countdown, setCountdown] = useState<number | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const bgPollRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const lastSeenRef = useRef<number>(0);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => { scrollToBottom(); }, [messages, isLoading]);

    useEffect(() => {
        return () => {
            if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
            if (countdownRef.current) clearInterval(countdownRef.current);
            if (bgPollRef.current) clearInterval(bgPollRef.current);
        };
    }, []);

    const stopWaitingPoll = useCallback(() => {
        if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
        }
        if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
        }
        setCountdown(null);
    }, []);

    // Process new messages from poll response
    const processNewMessages = useCallback((data: { messages?: { text: string; timestamp: number; source: string }[] }) => {
        if (!data.messages?.length) return;

        const newMsgs = data.messages.filter((m: { timestamp: number }) => m.timestamp > lastSeenRef.current);
        if (newMsgs.length === 0) return;

        // Update lastSeen to the latest timestamp
        const maxTimestamp = Math.max(...newMsgs.map((m: { timestamp: number }) => m.timestamp));
        lastSeenRef.current = maxTimestamp;

        setMessages(prev => {
            const toAdd = newMsgs.filter((newMsg: { text: string }) =>
                !prev.some(existing => !existing.isUser && existing.text === newMsg.text)
            );
            if (toAdd.length === 0) return prev;
            return [...prev, ...toAdd.map((m: { text: string; source: string }) => ({
                text: m.text,
                isUser: false,
                source: m.source,
            }))];
        });
    }, []);

    // Waiting-mode polling (when Michael has taken over and visitor sent a message)
    const startWaitingPoll = useCallback((sid: string) => {
        stopWaitingPoll();

        // Smooth countdown timer
        setCountdown(30);
        countdownRef.current = setInterval(() => {
            setCountdown(prev => {
                if (prev === null || prev <= 0) return 0;
                return prev - 1;
            });
        }, 1000);

        const poll = async () => {
            try {
                const response = await fetch(`/api/chat/poll?sessionId=${sid}&lastSeen=${lastSeenRef.current}`);
                const data = await response.json();

                if (data.status === 'new-messages') {
                    processNewMessages(data);
                    setIsLoading(false);
                    setWaitingForMichael(false);
                    stopWaitingPoll();
                }
            } catch (error) {
                console.error('Polling error:', error);
            }
        };

        poll();
        pollIntervalRef.current = setInterval(poll, POLL_INTERVAL);
    }, [stopWaitingPoll, processNewMessages]);

    // Background polling — always runs when we have a session
    // Picks up Michael's messages even after Gemini has replied
    useEffect(() => {
        if (!sessionId || waitingForMichael) return;

        const bgPoll = async () => {
            try {
                const response = await fetch(`/api/chat/poll?sessionId=${sessionId}&lastSeen=${lastSeenRef.current}`);
                const data = await response.json();

                if (data.status === 'new-messages') {
                    processNewMessages(data);
                }
            } catch { /* ignore */ }
        };

        // Poll every 3 seconds in background
        bgPollRef.current = setInterval(bgPoll, POLL_INTERVAL);
        return () => {
            if (bgPollRef.current) {
                clearInterval(bgPollRef.current);
                bgPollRef.current = null;
            }
        };
    }, [sessionId, waitingForMichael, processNewMessages]);

    const handleSendMessage = async () => {
        if (message.trim() && !isLoading) {
            const userMessage = { text: message, isUser: true };
            const updatedMessages = [...messages, userMessage];
            setMessages(updatedMessages);
            setMessage('');
            setIsLoading(true);
            setCountdown(null);

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: updatedMessages,
                        sessionId,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    if (response.status === 429 && errorData.reply) {
                        setMessages(prev => [...prev, { text: errorData.reply, isUser: false }]);
                        setIsLoading(false);
                        return;
                    }
                    throw new Error('Failed to get response');
                }

                const data = await response.json();

                if (data.sessionId) {
                    setSessionId(data.sessionId);
                }

                if (data.mode === 'michael' && data.status === 'waiting') {
                    // Michael active mode — poll and wait
                    setWaitingForMichael(true);
                    startWaitingPoll(data.sessionId || sessionId!);
                } else if (data.reply) {
                    // Gemini instant reply
                    setMessages(prev => [...prev, {
                        text: data.reply,
                        isUser: false,
                        source: data.source || 'gemini',
                    }]);
                    lastSeenRef.current = Date.now();
                    setIsLoading(false);
                }
            } catch {
                setMessages(prev => [...prev, {
                    text: "Oops, something went wrong! 😅 Please try again, or email me at asismichael143@gmail.com",
                    isUser: false
                }]);
                setIsLoading(false);
            }
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.length <= MAX_CHARS) {
            setMessage(e.target.value);
        }
    };

    return (
        <>
            <button
                className="chat-button"
                aria-label="Chat with Michael"
                onClick={() => setIsOpen(!isOpen)}
            >
                <svg viewBox="0 0 24 24" fill="currentColor" className="chat-icon">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                </svg>
                <span>Chat with Michael</span>
            </button>

            {isOpen && (
                <div className="chat-modal">
                    <div className="chat-modal__header">
                        <div className="chat-modal__header-left">
                            <div className="chat-modal__avatar">
                                <img src="/images/portfolioImage7.jpg" alt="Michael Asis" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                            </div>
                            <div className="chat-modal__header-info">
                                <h3 className="chat-modal__name">Chat with Michael</h3>
                                <div className="chat-modal__status">
                                    <span className="chat-modal__status-dot"></span>
                                    <span className="chat-modal__status-text">Online</span>
                                </div>
                            </div>
                        </div>
                        <button className="chat-modal__close" onClick={() => setIsOpen(false)} aria-label="Close chat">
                            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                            </svg>
                        </button>
                    </div>

                    <div className="chat-modal__messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`chat-message-wrapper ${msg.isUser ? 'chat-message-wrapper--user' : 'chat-message-wrapper--bot'}`}>
                                {!msg.isUser && (
                                    <div className="chat-message__sender">
                                        <div className="chat-message__sender-avatar">
                                            <img src="/images/portfolioImage7.jpg" alt="Michael Asis" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                        </div>
                                        <span className="chat-message__sender-name">
                                            Michael Asis
                                            {msg.source === 'michael' && (
                                                <span className="chat-message__direct-badge">DIRECT</span>
                                            )}
                                        </span>
                                    </div>
                                )}
                                <div className={`chat-message ${msg.isUser ? 'chat-message--user' : 'chat-message--bot'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="chat-message-wrapper chat-message-wrapper--bot">
                                <div className="chat-message__sender">
                                    <div className="chat-message__sender-avatar">
                                        <img src="/images/portfolioImage7.jpg" alt="Michael Asis" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                    </div>
                                    <span className="chat-message__sender-name">Michael Asis</span>
                                </div>
                                <div className="chat-message chat-message--bot chat-message--typing">
                                    {waitingForMichael ? (
                                        <span className="waiting-text">
                                            {countdown !== null && countdown > 0
                                                ? `Waiting for Michael to reply (${countdown}s)...`
                                                : 'Replying...'
                                            }
                                        </span>
                                    ) : (
                                        <>
                                            <span className="typing-dot"></span>
                                            <span className="typing-dot"></span>
                                            <span className="typing-dot"></span>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-modal__input-area">
                        <div className="chat-modal__input">
                            <input
                                type="text"
                                placeholder="Type a message..."
                                value={message}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                maxLength={MAX_CHARS}
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSendMessage}
                                aria-label="Send message"
                                className="chat-modal__send-btn"
                                disabled={isLoading || !message.trim()}
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z" />
                                </svg>
                            </button>
                        </div>
                        <div className="chat-modal__input-footer">
                            <span className="chat-modal__helper-text">Ask me about programming, web dev, or tech!</span>
                            <span className="chat-modal__char-count">{message.length}/{MAX_CHARS}</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
