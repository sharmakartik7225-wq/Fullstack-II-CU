import { useRef, useEffect } from 'react';
import { usePerformance } from '../context/PerformanceContext';

interface UseRenderCounterOptions {
  componentName: string;
  propsToTrack?: Record<string, any>;
  isWastedRender?: boolean;
}

export const useRenderCounter = ({
  componentName,
  propsToTrack,
  isWastedRender = false
}: UseRenderCounterOptions) => {
  const { visualFlashingEnabled, isOptimized, logRenderEvent, simulateArtificialLag } = usePerformance();
  const renderCount = useRef(0);
  const elementRef = useRef<HTMLElement | null>(null);
  const prevProps = useRef<Record<string, any> | undefined>(propsToTrack);
  const renderStartTime = useRef(performance.now());

  renderStartTime.current = performance.now();
  renderCount.current += 1;

  // Run simulated CPU bottleneck if in unoptimized mode
  simulateArtificialLag();

  useEffect(() => {
    const renderEndTime = performance.now();
    const duration = renderEndTime - renderStartTime.current;

    // Detect what changed in props if provided
    let changeReason = 'Component updated';
    if (prevProps.current && propsToTrack) {
      const changedKeys: string[] = [];
      for (const key of Object.keys(propsToTrack)) {
        if (prevProps.current[key] !== propsToTrack[key]) {
          changedKeys.push(key);
        }
      }
      if (changedKeys.length > 0) {
        changeReason = `Props changed: ${changedKeys.join(', ')}`;
      } else if (renderCount.current > 1) {
        changeReason = 'Parent re-rendered (unmemoized parent cascade)';
      }
      prevProps.current = propsToTrack;
    }

    logRenderEvent(
      componentName,
      duration,
      changeReason,
      !isOptimized && isWastedRender
    );

    // Apply visual highlight animation if enabled
    if (visualFlashingEnabled && elementRef.current) {
      const el = elementRef.current;
      const flashClass = isOptimized ? 'animate-render-flash-green' : 'animate-render-flash';

      el.classList.remove('animate-render-flash', 'animate-render-flash-green');
      void el.offsetWidth; // force DOM reflow
      el.classList.add(flashClass);

      const timer = setTimeout(() => {
        el.classList.remove(flashClass);
      }, 600);

      return () => clearTimeout(timer);
    }
  });

  return {
    renderCount: renderCount.current,
    elementRef
  };
};
