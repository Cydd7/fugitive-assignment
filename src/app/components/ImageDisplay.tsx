import Image from "next/image";

interface ImageDisplayProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
}

export function ImageDisplay({ src, alt, width = 150, height = 150, className = "" }: ImageDisplayProps) {
    return (
        <div className={`relative ${className}`}>
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className="rounded-lg object-cover"
            />
        </div>
    );
} 