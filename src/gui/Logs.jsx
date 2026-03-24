import React from 'react';
import { Button } from 'react-bootstrap';

const Logs = () => {
    const [logs, setLogs] = React.useState([
        { time: '22:35:56', msg: "Engine v3.0.0 attached to 'k11' (proj_e94617c0). [readable mode]" },
        { time: '22:35:56', msg: "All copies unreadable for: outputs_data." },
        { time: '22:35:56', msg: "All copies unreadable for: general_info." },
        { time: '22:35:57', msg: "Commit successful." },
    ]);
    const [stats, setStats] = React.useState({ shards: 0, backups: 0, checkpoints: 0, pending: 0 });
    const logContainerRef = React.useRef(null);

    // Color-coding logic based on desktop Python source
    const getLogColor = (msg) => {
        const m = msg.toUpperCase();
        if (m.includes("CRITICAL") || m.includes("FAULT") || m.includes("FAILED") || m.includes("ERROR") || m.includes("CORRUPT") || m.includes("LOSS")) {
            return "#f48771"; // Red
        }
        if (m.includes("WARN") || m.includes("STALE") || m.includes("DENIED")) {
            return "#dcdcaa"; // Yellow
        }
        if (m.includes("CHECKPOINT") || m.includes("RESTORED") || m.toLowerCase().includes("saved")) {
            return "#4ec9b0"; // Teal
        }
        if (m.includes("ATTACHED") || m.includes("SUCCESS")) {
            return "#b5cea8"; // Green
        }
        return "#d4d4d4"; // Default
    };

    // Auto-scroll to bottom
    React.useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    // Polling simulation (every 2 seconds like in desktop)
    React.useEffect(() => {
        const interval = setInterval(() => {
            // Simulated health report update
            setStats(prev => ({ ...prev, checkpoints: prev.checkpoints + (Math.random() > 0.8 ? 1 : 0) }));
            
            // Simulated new log occasionally
            if (Math.random() > 0.7) {
                const now = new Date();
                const time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
                setLogs(prev => [...prev, { time, msg: "Force-save fired after 2.0s." }]);
            }
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleClear = () => {
        setLogs([]);
    };

    return (
        <div className="p-4 h-100 d-flex flex-column" style={{ backgroundColor: 'var(--app-bg-main)', color: 'var(--app-text-primary)', fontFamily: '"Segoe UI", system-ui, sans-serif' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0 fw-bold" style={{ fontSize: '1.4rem' }}>Engine Logs</h4>
                <div className="d-flex align-items-center gap-3">
                    <div className="text-secondary small" style={{ fontSize: '0.85rem' }}>
                        <span>Shards: {stats.shards}</span> | 
                        <span className="ms-2">Backups: {stats.backups}</span> | 
                        <span className="ms-2">Checkpoints: {stats.checkpoints}</span> | 
                        <span className="ms-2">Pending: {stats.pending}</span>
                    </div>
                    <Button 
                        variant="outline-secondary" 
                        size="sm" 
                        className="px-3 hover-opacity"
                        style={{ fontSize: '0.8rem', backgroundColor: '#333', borderColor: '#444', color: '#fff' }}
                        onClick={handleClear}
                    >
                        Clear
                    </Button>
                </div>
            </div>

            <div 
                ref={logContainerRef}
                className="flex-grow-1 p-3 rounded shadow-inner" 
                style={{ 
                    backgroundColor: '#1e1e1e', 
                    border: '1px solid #444', 
                    fontFamily: '"Courier New", Courier, monospace',
                    fontSize: '10pt',
                    overflowY: 'auto',
                    lineHeight: '1.4',
                    minHeight: '450px'
                }}
            >
                {logs.length === 0 ? (
                    <div className="text-muted italic small text-center mt-5">Console cleared. Monitoring system...</div>
                ) : (
                    logs.map((log, idx) => (
                        <div key={idx} className="mb-0 py-0 px-1">
                            <span style={{ color: '#888' }}>[{log.time}]</span>{' '}
                            <span style={{ color: getLogColor(log.msg) }}>
                                {log.msg}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Logs;
