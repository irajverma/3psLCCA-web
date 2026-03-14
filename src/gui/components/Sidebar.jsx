import React, { useState } from 'react';
import './Sidebar.css';
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
    const isActive = activeNode === label;

    const handleToggle = (e) => {
        e.stopPropagation();
        if (hasChildren) {
            setIsExpanded(!isExpanded);
        }
        setActiveNode(label);
    };

    return (
        <div className="tree-node-container">
            <div 
                className={`tree-node ${isActive ? 'active' : ''}`} 
                style={{ paddingLeft: `${depth * 15 + 10}px` }}
                onClick={handleToggle}
            >
                <span className="expander-icon" style={{ visibility: hasChildren ? 'visible' : 'hidden' }}>
                    {isExpanded ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
                </span>
                <span className="node-label">{label}</span>
            </div>
            
            {hasChildren && isExpanded && (
                <div className="tree-children">
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

const Sidebar = () => {
    const [activeNode, setActiveNode] = useState("General Information");

    return (
        <div className="project-sidebar">
            <div className="sidebar-tree">
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
