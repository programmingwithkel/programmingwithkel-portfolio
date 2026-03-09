import Image from 'next/image';

interface GalleryProps {
    images: {
        src: string;
        alt: string;
    }[];
}

export default function Gallery({ images }: GalleryProps) {
    return (
        <section className="section-card gallery-section animate-fadeInUp animate-delay-5">
            <h2 className="section-title">
                <svg viewBox="0 0 24 24" fill="currentColor" className="section-title-icon">
                    <path d="M22 16V4c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zm-11-4l2.03 2.71L16 11l4 5H8l3-4zM2 6v14c0 1.1.9 2 2 2h14v-2H4V6H2z" />
                </svg>
                Gallery
            </h2>
            <div className="gallery-grid">
                {images.map((image, index) => (
                    <div key={index} className="gallery-item">
                        <Image
                            src={image.src}
                            alt={image.alt}
                            width={400}
                            height={300}
                            className="gallery-image"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
