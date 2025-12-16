import React, { useEffect, useRef } from 'react';
import { X, Terminal, Download, Pause, Play, Trash2 } from 'lucide-react';

interface DevLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolName: string;
}

export const DevLogModal: React.FC<DevLogModalProps> = ({ isOpen, onClose, toolName }) => {
  const [logs, setLogs] = React.useState<string[]>([]);
  const [isPaused, setIsPaused] = React.useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Simulate incoming logs
  useEffect(() => {
    if (!isOpen) return;
    setLogs([`[INFO] Starting ${toolName}...`, `[INFO] Initializing environment...`]);

    const interval = setInterval(() => {
      if (!isPaused) {
        const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
        const randomLogs = [
            `[INFO] ${timestamp} Fetching market data segment...`,
            `[DEBUG] ${timestamp} Processing batch #2392`,
            `[INFO] ${timestamp} Heartbeat signal sent.`,
            `[WARN] ${timestamp} Latency spike detected (120ms)`,
            `[INFO] ${timestamp} API Quota: 85% remaining`
        ];
        const randomLog = randomLogs[Math.floor(Math.random() * randomLogs.length)];
        setLogs(prev => [...prev.slice(-99), randomLog]); // Keep last 100 logs
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [isOpen, isPaused, toolName]);

  // Auto-scroll
  useEffect(() => {
    if (logContainerRef.current && !isPaused) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs, isPaused]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center animate-fade-in p-4">
      <div className="bg-gray-900 rounded-xl w-full max-w-4xl h-[70vh] flex flex-col shadow-2xl border border-gray-700 overflow-hidden font-mono">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-green-400" />
                <span className="text-gray-200 text-sm font-bold">Terminal :: {toolName}</span>
            </div>
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => setIsPaused(!isPaused)} 
                    className={`p-1.5 rounded hover:bg-gray-700 ${isPaused ? 'text-yellow-400' : 'text-gray-400'}`}
                    title={isPaused ? "Resume" : "Pause"}
                >
                    {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </button>
                <button onClick={() => setLogs([])} className="p-1.5 rounded hover:bg-gray-700 text-gray-400 hover:text-red-400" title="Clear">
                    <Trash2 className="w-4 h-4" />
                </button>
                <div className="h-4 w-px bg-gray-700 mx-1"></div>
                <button onClick={onClose} className="p-1.5 rounded hover:bg-red-900/50 text-gray-400 hover:text-red-400 transition-colors">
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>

        {/* Log Content */}
        <div 
            ref={logContainerRef}
            className="flex-1 p-4 overflow-y-auto bg-[#0c0c0c] text-sm leading-relaxed"
        >
            {logs.map((log, i) => (
                <div key={i} className="font-mono">
                    <span className="text-gray-500 select-none mr-2">$</span>
                    <span className={
                        log.includes('[ERROR]') ? 'text-red-500' :
                        log.includes('[WARN]') ? 'text-yellow-500' :
                        log.includes('[DEBUG]') ? 'text-blue-400' :
                        'text-gray-300'
                    }>
                        {log}
                    </span>
                </div>
            ))}
            {isPaused && (
                <div className="text-yellow-500 text-xs mt-2 italic opacity-70">-- Output Paused --</div>
            )}
        </div>
      </div>
    </div>
  );
};