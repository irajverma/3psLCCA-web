import React, { useState } from 'react';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';
import ICONS from './utils/icons';

const SIDEBAR_TREE = {
    "General Information": {},
    "Bridge Data": {},
    "Input Parameters": {
        "Construction Work Data": [
            "Foundation",
            "Super Structure",
            "Sub Structure",
            "Miscellaneous",
        ],
        "Traffic Data": [],
        "Financial Data": [],
        "Carbon Emission Data": [
            "Material Emissions",
            "Transportation Emissions",
            "Machinery Emissions",
            "Traffic Diversion Emissions",
            "Social Cost of Carbon",
        ],
        "Maintenance and Repair": [],
        "Recycling": [],
        "Demolition": [],
    },
    "Outputs": {},
};

const ICON_MAP = {
    "General Information": "info",
    "Bridge Data": "layers",
    "Input Parameters": "folder",
    "Construction Work Data": "build",
    "Traffic Data": "truck",
    "Financial Data": "cash",
    "Carbon Emission Data": "cloud",
    "Maintenance and Repair": "settings",
    "Recycling": "autorenew",
    "Demolition": "trash",
    "Outputs": "bar-chart",
};

const TreeNode = ({ label, childrenData, depth, activeNode, setActiveNode }) => {
    const hasChildren = childrenData && (Array.isArray(childrenData) ? childrenData.length > 0 : Object.keys(childrenData).length > 0);
    const [isExpanded, setIsExpanded] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const isActive = activeNode === label;

    const handleToggle = (e) => {
        e.stopPropagation();

        let targetNode = label;
        if (hasChildren) {
            setIsExpanded(true);
            if (Array.isArray(childrenData) && childrenData.length > 0) {
                targetNode = childrenData[0];
            } else if (childrenData && typeof childrenData === 'object' && Object.keys(childrenData).length > 0) {
                targetNode = Object.keys(childrenData)[0];
            }
        }

        setActiveNode(targetNode);
    };

    const nodeColor = isActive ? 'var(--app-text-primary)' : 'var(--app-text-secondary)';
    const expanderColor = (isActive || isHovered) ? 'var(--app-text-primary)' : 'var(--app-text-muted)';

    const iconName = ICON_MAP[label];
    const iconSvg = iconName ? ICONS[iconName] : null;

    return (
        <div className="w-100">
            <div
                className={`d-flex align-items-center py-1 position-relative sidebar-btn ${isActive ? 'checked' : ''}`}
                style={{
                    paddingLeft: `${depth * 15 + 10}px`,
                    cursor: 'pointer',
                    color: isActive ? '#9acd32' : nodeColor,
                }}
                onClick={handleToggle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {isActive && (
                    <div style={{ position: 'absolute', left: 0, top: '4px', bottom: '4px', width: '3px', backgroundColor: '#9acd32', borderRadius: '0 3px 3px 0' }}></div>
                )}
                <span className="d-inline-flex justify-content-center align-items-center me-1" style={{ width: '20px', color: expanderColor, visibility: hasChildren ? 'visible' : 'hidden' }}>
                    {isExpanded ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
                </span>

                {iconSvg && (
                    <span
                        className="d-inline-flex justify-content-center align-items-center me-2"
                        style={{ width: '18px', height: '18px', fill: 'currentColor' }}
                        dangerouslySetInnerHTML={{
                            __html: `<svg viewBox="0 0 24 24" width="100%" height="100%">${iconSvg}</svg>`
                        }}
                    />
                )}

                <span className="text-nowrap overflow-hidden text-truncate">{label}</span>
            </div>

            {hasChildren && isExpanded && (
                <div className="w-100">
                    {Array.isArray(childrenData)
                        ? childrenData.map(child => (
                            <TreeNode
                                key={child}
                                label={child}
                                childrenData={{}}
                                depth={depth + 1}
                                activeNode={activeNode}
                                setActiveNode={setActiveNode}
                            />
                        ))
                        : Object.entries(childrenData).map(([key, val]) => (
                            <TreeNode
                                key={key}
                                label={key}
                                childrenData={val}
                                depth={depth + 1}
                                activeNode={activeNode}
                                setActiveNode={setActiveNode}
                            />
                        ))
                    }
                </div>
            )}
        </div>
    );
};

const Sidebar = ({ activeNode, setActiveNode }) => {
    const [sidebarWidth, setSidebarWidth] = useState(250);
    const [isResizing, setIsResizing] = useState(false);

    React.useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isResizing) return;
            // Depending on the layout, clientX might not perfectly match width, but it's close enough if standard left align.
            // Minimum 200px, maximum 600px width
            const newWidth = Math.min(Math.max(e.clientX, 200), 600);
            setSidebarWidth(newWidth);
        };
        const handleMouseUp = () => {
            if (isResizing) {
                setIsResizing(false);
                document.body.style.cursor = 'default';
            }
        };

        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    const handleMouseDown = (e) => {
        setIsResizing(true);
        document.body.style.cursor = 'col-resize';
        e.preventDefault();
    };

    return (
        <div className="position-relative" style={{ width: `${sidebarWidth}px`, height: '100%', flexShrink: 0 }}>
            <div className="d-flex flex-column sidebar-scrollbar" style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'var(--app-bg-card)',
                color: 'var(--app-text-primary)',
                overflowY: 'auto',
                borderRight: '1px solid var(--app-border-light)',
                fontFamily: '"Segoe UI", system-ui, sans-serif',
                fontSize: '14px',
                paddingTop: '10px',
                userSelect: isResizing ? 'none' : 'auto',
                transition: isResizing ? 'none' : 'width 0.3s ease'
            }}>
                <style>{`
                .sidebar-scrollbar::-webkit-scrollbar { width: 8px; }
                .sidebar-scrollbar::-webkit-scrollbar-track { background: var(--app-bg-card); }
                .sidebar-scrollbar::-webkit-scrollbar-thumb { background: var(--app-border-mid); border-radius: 4px; }
                .sidebar-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--app-border-dark); }
                
                .sidebar-btn {
                    border-radius: 15px;
                    border: none;
                    background: transparent;
                    transition: background 0.2s, color 0.2s;
                }
                .sidebar-btn:hover {
                    border-radius: 15px;
                    background: var(--app-bg-alt, rgba(255,255,255,0.05));
                }
                .sidebar-btn:active {
                    border-radius: 15px;
                    background: var(--app-border-mid, rgba(255,255,255,0.1));
                }
                .sidebar-btn.checked {
                    border-radius: 15px;
                    background: rgba(154, 205, 50, 0.15);
                }
                .sidebar-btn.checked:hover {
                    border-radius: 15px;
                    background: rgba(154, 205, 50, 0.25);
                }
            `}</style>

                <div className="w-100">
                    {Object.entries(SIDEBAR_TREE).map(([key, val]) => (
                        <TreeNode
                            key={key}
                            label={key}
                            childrenData={val}
                            depth={0}
                            activeNode={activeNode}
                            setActiveNode={setActiveNode}
                        />
                    ))}
                </div>
            </div> {/* End of inner container */}

            {/* Draggable Resizer Line */}
            <div
                onMouseDown={handleMouseDown}
                style={{
                    position: 'absolute',
                    top: 0,
                    right: -3,
                    width: '6px',
                    height: '100%',
                    cursor: 'col-resize',
                    zIndex: 100,
                    backgroundColor: isResizing ? 'rgba(154, 205, 50, 0.8)' : 'transparent',
                    transition: 'background-color 0.2s ease',
                }}
                onMouseEnter={(e) => { if (!isResizing) e.target.style.backgroundColor = 'rgba(154, 205, 50, 0.5)'; }}
                onMouseLeave={(e) => { if (!isResizing) e.target.style.backgroundColor = 'transparent'; }}
            />
        </div>
    );
};

export default Sidebar;
