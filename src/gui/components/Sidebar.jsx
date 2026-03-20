import React, { useState } from 'react';
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';

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

const TreeNode = ({ label, childrenData, depth, activeNode, setActiveNode }) => {
    const hasChildren = childrenData && (Array.isArray(childrenData) ? childrenData.length > 0 : Object.keys(childrenData).length > 0);
    const [isExpanded, setIsExpanded] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const isActive = activeNode === label;

    const handleToggle = (e) => {
        e.stopPropagation();
        if (hasChildren) {
            setIsExpanded(!isExpanded);
        }
        setActiveNode(label);
    };

    const nodeBg = isActive ? 'rgba(46, 204, 113, 0.15)' : (isHovered ? 'var(--app-bg-alt)' : 'transparent');
    const nodeColor = isActive ? 'var(--app-text-primary)' : 'var(--app-text-secondary)';
    const expanderColor = (isActive || isHovered) ? 'var(--app-text-primary)' : 'var(--app-text-muted)';

    return (
        <div className="w-100">
            <div 
                className="d-flex align-items-center py-1 position-relative" 
                style={{ 
                    paddingLeft: `${depth * 15 + 10}px`,
                    cursor: 'pointer',
                    color: nodeColor,
                    backgroundColor: nodeBg,
                    transition: 'background-color 0.2s, color 0.2s'
                }}
                onClick={handleToggle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {isActive && (
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', backgroundColor: 'var(--app-primary-accent, #2ecc71)' }}></div>
                )}
                <span className="d-inline-flex justify-content-center align-items-center me-1" style={{ width: '20px', color: expanderColor, visibility: hasChildren ? 'visible' : 'hidden' }}>
                    {isExpanded ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
                </span>
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
    return (
        <div className="d-flex flex-column sidebar-scrollbar" style={{ 
            width: '250px', 
            height: '100%', 
            backgroundColor: 'var(--app-bg-card)', 
            color: 'var(--app-text-primary)', 
            overflowY: 'auto', 
            borderRight: '1px solid var(--app-border-light)', 
            fontFamily: '"Segoe UI", system-ui, sans-serif', 
            fontSize: '14px', 
            paddingTop: '10px', 
            userSelect: 'none', 
            transition: 'all 0.3s ease' 
        }}>
            <style>{`
                .sidebar-scrollbar::-webkit-scrollbar { width: 8px; }
                .sidebar-scrollbar::-webkit-scrollbar-track { background: var(--app-bg-card); }
                .sidebar-scrollbar::-webkit-scrollbar-thumb { background: var(--app-border-mid); border-radius: 4px; }
                .sidebar-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--app-border-dark); }
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
        </div>
    );
};

export default Sidebar;
