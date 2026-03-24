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

    const nodeBg = isActive ? '#1b4332' : (isHovered ? 'rgba(27, 67, 50, 0.4)' : 'transparent');
    const nodeColor = isActive ? '#ffffff' : (isHovered ? '#ffffff' : 'var(--app-text-secondary)');
    const expanderColor = (isActive || isHovered) ? '#ffffff' : 'var(--app-text-muted)';

    return (
        <div className="w-100">
            <div 
                className="d-flex align-items-center py-1 position-relative" 
                style={{ 
                    paddingLeft: `${depth * 12 + 8}px`,
                    cursor: 'pointer',
                    color: nodeColor,
                    backgroundColor: nodeBg,
                    transition: 'background-color 0.2s, color 0.2s'
                }}
                onClick={handleToggle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
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

const Sidebar = ({ activeNode, setActiveNode, width }) => {
    return (
        <div className="d-flex flex-column sidebar-scrollbar" style={{ 
            width: `${width}px`, 
            minWidth: `${width}px`,
            height: '100%', 
            backgroundColor: 'var(--app-bg-card)', 
            color: 'var(--app-text-primary)', 
            overflowY: 'auto', 
            borderRight: '1px solid var(--app-border-light)', 
            fontFamily: '"Segoe UI", system-ui, sans-serif', 
            fontSize: '14px', 
            paddingTop: '10px', 
            userSelect: 'none'
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
