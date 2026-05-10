import React, { useState, useCallback } from 'react';
import '../ConstructionWorkData.css';
import MaterialTable from '../MaterialTable';

let _uid = 0;
const uid = () => `row-${++_uid}`;
const emptyRow = () => ({ id: uid(), workName: '', rate: '', qty: '', source: '' });
// calcTotal removed as it's in MaterialTable.jsx

const DEFAULT_SECTIONS = [
    { id: 'bearing',       name: 'Bearing',         rows: [] },
    { id: 'railing',       name: 'Railing',         rows: [] },
    { id: 'drain_spouts',  name: 'Drainage Spouts', rows: [] },
    { id: 'asphalt',       name: 'Asphalt Work',    rows: [] },
    { id: 'utilities',     name: 'Utilities',       rows: [] },
    { id: 'drainage',      name: 'Drainage',        rows: [] },
    { id: 'waterproofing', name: 'Waterproofing',   rows: [] },
];

// MaterialTable imported from shared component

const Miscellaneous = ({ controller, projectData, data, onUpdate }) => {
    const [sections, setSections] = useState(() => {
        return data?.miscellaneous || DEFAULT_SECTIONS;
    });

    const persist = useCallback((nextSections) => {
        if (onUpdate) onUpdate({ ...data, miscellaneous: nextSections });
    }, [onUpdate, data]);

    const handleRowChange = useCallback((sId, rId, field, val) => {
        setSections((prev) => {
            const next = prev.map((s) => s.id !== sId ? s : { ...s, rows: s.rows.map((r) => r.id !== rId ? r : { ...r, [field]: val }) });
            persist(next);
            return next;
        });
    }, [persist]);

    const handleRowDelete = useCallback((sId, rId) => {
        setSections((prev) => {
            const next = prev.map((s) => s.id !== sId ? s : { ...s, rows: s.rows.filter((r) => r.id !== rId) });
            persist(next);
            return next;
        });
    }, [persist]);

    const handleAddRow = useCallback((sId, newRowData) => {
        setSections((prev) => {
            const next = prev.map((s) => s.id !== sId ? s : { ...s, rows: [...s.rows, { id: uid(), ...newRowData }] });
            persist(next);
            return next;
        });
    }, [persist]);

    const handleAddSection = () => {
        setSections((prev) => {
            const next = [...prev, { id: uid(), name: `Section ${prev.length + 1}`, rows: [] }];
            persist(next);
            return next;
        });
    };

    return (
        <div>
            {sections.map((sec) => <MaterialTable key={sec.id} section={sec} onRowChange={handleRowChange} onRowDelete={handleRowDelete} onAddRow={handleAddRow} projectData={projectData} />)}
            <button
                className="btn btn-sm mt-3"
                style={{ backgroundColor: 'transparent', color: 'var(--app-text-primary)', border: '1px solid var(--app-border-mid)', transition: 'background-color 0.2s', fontWeight: 500 }}
                onClick={handleAddSection}
                onMouseEnter={(e) => { e.target.style.backgroundColor = 'var(--app-bg-alt)'; }}
                onMouseLeave={(e) => { e.target.style.backgroundColor = 'transparent'; }}
            >
                + Add Component Section
            </button>
        </div>
    );
};

export default Miscellaneous;
