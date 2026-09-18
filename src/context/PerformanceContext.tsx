import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { PerformanceState, RenderEventLog } from '../types';

interface PerformanceContextType extends PerformanceState {
  toggleOptimization: () => void;
  setIsOptimized: (val: boolean) => void;
  toggleReactMemo: () => void;
  toggleUseMemo: () => void;
  toggleUseCallback: () => void;
  setReactMemoEnabled: (val: boolean) => void;
  setUseMemoEnabled: (val: boolean) => void;
  setUseCallbackEnabled: (val: boolean) => void;
  toggleVisualFlashing: () => void;
  setCpuStressMs: (ms: number) => void;
  toggleDiagnosticsHud: () => void;
  logRenderEvent: (componentName: string, durationMs: number, reason: string, isWasted?: boolean) => void;
  clearRenderLogs: () => void;
  simulateArtificialLag: () => void;
  onProfilerRender: (
    id: string,
    phase: 'mount' | 'update' | 'nested-update',
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number
  ) => void;
}

const PerformanceContext = createContext<PerformanceContextType | null>(null);

export const PerformanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Individual Optimization Primitive Toggles
  const [isReactMemoEnabled, setIsReactMemoEnabled] = useState<boolean>(true);
  const [isUseMemoEnabled, setIsUseMemoEnabled] = useState<boolean>(true);
  const [isUseCallbackEnabled, setIsUseCallbackEnabled] = useState<boolean>(true);

  const [visualFlashingEnabled, setVisualFlashingEnabled] = useState<boolean>(true);
  const [cpuStressMs, setCpuStressMs] = useState<number>(0);
  const [showDiagnosticsHud, setShowDiagnosticsHud] = useState<boolean>(true);

  // Telemetry metrics (synced on 500ms RAF interval to prevent feedback loops)
  const [fps, setFps] = useState<number>(60);
  const [lastRenderDuration, setLastRenderDuration] = useState<number>(0);
  const [totalRenderCount, setTotalRenderCount] = useState<number>(0);
  const [wastedRenderCount, setWastedRenderCount] = useState<number>(0);
  const [renderLogs, setRenderLogs] = useState<RenderEventLog[]>([]);

  // Mutable refs for high-frequency telemetry without render cascades
  const totalCountRef = useRef(0);
  const wastedCountRef = useRef(0);
  const lastDurationRef = useRef(0);
  const logsRef = useRef<RenderEventLog[]>([]);

  // Master optimization status
  const isOptimized = isReactMemoEnabled && isUseMemoEnabled && isUseCallbackEnabled;

  // FPS and Telemetry sync loop
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const calculateFps = (now: number) => {
      frameCount++;
      const delta = now - lastTime;

      if (delta >= 500) {
        const currentFps = Math.min(60, Math.round((frameCount * 1000) / delta));
        setFps(currentFps);
        frameCount = 0;
        lastTime = now;

        setLastRenderDuration(lastDurationRef.current);
        setTotalRenderCount(totalCountRef.current);
        setWastedRenderCount(wastedCountRef.current);
        setRenderLogs([...logsRef.current]);
      }

      animId = requestAnimationFrame(calculateFps);
    };

    animId = requestAnimationFrame(calculateFps);
    return () => cancelAnimationFrame(animId);
  }, []);

  const toggleOptimization = useCallback(() => {
    setIsReactMemoEnabled((prev) => {
      const nextVal = !prev;
      setIsUseMemoEnabled(nextVal);
      setIsUseCallbackEnabled(nextVal);
      return nextVal;
    });
  }, []);

  const setIsOptimized = useCallback((val: boolean) => {
    setIsReactMemoEnabled(val);
    setIsUseMemoEnabled(val);
    setIsUseCallbackEnabled(val);
  }, []);

  const toggleReactMemo = useCallback(() => {
    setIsReactMemoEnabled((prev) => !prev);
  }, []);

  const toggleUseMemo = useCallback(() => {
    setIsUseMemoEnabled((prev) => !prev);
  }, []);

  const toggleUseCallback = useCallback(() => {
    setIsUseCallbackEnabled((prev) => !prev);
  }, []);

  const setReactMemoEnabled = useCallback((val: boolean) => {
    setIsReactMemoEnabled(val);
  }, []);

  const setUseMemoEnabled = useCallback((val: boolean) => {
    setIsUseMemoEnabled(val);
  }, []);

  const setUseCallbackEnabled = useCallback((val: boolean) => {
    setIsUseCallbackEnabled(val);
  }, []);

  const toggleVisualFlashing = useCallback(() => {
    setVisualFlashingEnabled((prev) => !prev);
  }, []);

  const toggleDiagnosticsHud = useCallback(() => {
    setShowDiagnosticsHud((prev) => !prev);
  }, []);

  const clearRenderLogs = useCallback(() => {
    logsRef.current = [];
    totalCountRef.current = 0;
    wastedCountRef.current = 0;
    lastDurationRef.current = 0;
    setRenderLogs([]);
    setTotalRenderCount(0);
    setWastedRenderCount(0);
    setLastRenderDuration(0);
  }, []);

  const logRenderEvent = useCallback((componentName: string, durationMs: number, reason: string, isWasted = false) => {
    totalCountRef.current += 1;
    if (isWasted) {
      wastedCountRef.current += 1;
    }

    const newLog: RenderEventLog = {
      id: Math.random().toString(36).substring(2, 9),
      componentName,
      timestamp: Date.now(),
      renderCount: 1,
      durationMs: Number(durationMs.toFixed(2)),
      reason,
      isWasted
    };

    logsRef.current = [newLog, ...logsRef.current.slice(0, 49)];
  }, []);

  const simulateArtificialLag = useCallback(() => {
    if (cpuStressMs <= 0 || isOptimized) return;
    const start = performance.now();
    while (performance.now() - start < cpuStressMs) {
      Math.sqrt(Math.random() * 1000000);
    }
  }, [cpuStressMs, isOptimized]);

  const onProfilerRender = useCallback(
    (
      id: string,
      phase: 'mount' | 'update' | 'nested-update',
      actualDuration: number,
      baseDuration: number
    ) => {
      lastDurationRef.current = Number(actualDuration.toFixed(2));
    },
    []
  );

  return (
    <PerformanceContext.Provider
      value={{
        isOptimized,
        isReactMemoEnabled,
        isUseMemoEnabled,
        isUseCallbackEnabled,
        visualFlashingEnabled,
        cpuStressMs,
        showDiagnosticsHud,
        fps,
        lastRenderDuration,
        totalRenderCount,
        wastedRenderCount,
        recentRenderLogs: renderLogs,
        toggleOptimization,
        setIsOptimized,
        toggleReactMemo,
        toggleUseMemo,
        toggleUseCallback,
        setReactMemoEnabled,
        setUseMemoEnabled,
        setUseCallbackEnabled,
        toggleVisualFlashing,
        setCpuStressMs,
        toggleDiagnosticsHud,
        logRenderEvent,
        clearRenderLogs,
        simulateArtificialLag,
        onProfilerRender
      }}
    >
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformance = (): PerformanceContextType => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};
