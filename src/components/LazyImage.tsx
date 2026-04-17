"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  containerClassName?: string;
  onLoadingComplete?: () => void;
}

const LazyImage = React.forwardRef<HTMLImageElement, LazyImageProps>(
  (
    {
      src,
      alt,
      placeholder,
      containerClassName,
      onLoadingComplete,
      className,
      ...props
    },
    ref
  ) => {
    const [imageSrc, setImageSrc] = useState<string>(placeholder || "");
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // Start loading the image
            const img = new Image();
            img.onload = () => {
              setImageSrc(src);
              setIsLoading(false);
              onLoadingComplete?.();
            };
            img.onerror = () => {
              setIsError(true);
              setIsLoading(false);
            };
            img.src = src;
            observer.unobserve(entry.target);
          }
        },
        {
          rootMargin: "50px", // Start loading 50px before entering viewport
        }
      );

      if (containerRef.current) {
        observer.observe(containerRef.current);
      }

      return () => {
        observer.disconnect();
      };
    }, [src, onLoadingComplete]);

    return (
      <div ref={containerRef} className={cn("relative overflow-hidden", containerClassName)}>
        {isLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse z-10" />
        )}
        <img
          ref={ref}
          src={imageSrc || placeholder}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            isLoading && "opacity-0",
            className
          )}
          {...props}
        />
        {isError && (
          <div className="absolute inset-0 bg-muted flex items-center justify-center">
            <span className="text-xs text-muted-foreground">Image failed to load</span>
          </div>
        )}
      </div>
    );
  }
);

LazyImage.displayName = "LazyImage";

export default LazyImage;
