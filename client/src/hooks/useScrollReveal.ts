import { useCallback, useState, useRef, useEffect } from 'react';

export function useScrollReveal(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const ref = useCallback((node: HTMLElement | null) => {
    if (observer.current) {
      observer.current.disconnect();
    }

    if (node && !isVisible) {
      observer.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.current?.disconnect();
          }
        },
        { threshold }
      );
      observer.current.observe(node);
    }
  }, [threshold, isVisible]);

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return { ref, isVisible };
}
