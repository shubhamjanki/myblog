"use client";

import React, { useState, useEffect, useRef, ReactNode } from "react";

interface IntersectionObserverOptions {
  threshold?: number | number[];
  rootMargin?: string;
}

interface LazyLoadSectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  options?: IntersectionObserverOptions;
  onVisible?: () => void;
}

/**
 * Component that uses Intersection Observer to lazy load content when it comes into view
 * Perfect for below-the-fold sections that don't need to render immediately
 */
const LazyLoadSection: React.FC<LazyLoadSectionProps> = ({
  children,
  fallback,
  options = { rootMargin: "100px" },
  onVisible,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        onVisible?.();
        observer.unobserve(entry.target);
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [options, onVisible]);

  return (
    <div ref={ref}>
      {isVisible ? children : fallback}
    </div>
  );
};

export default LazyLoadSection;
