import React, { useState, useCallback } from 'react';
import '../ConstructionWorkData.css';
import MaterialTable from '../MaterialTable';

// ── Helpers ───────────────────────────────────────────────────────────────────

let _uid = 0;
const uid = () => `row-${++_uid}`;

const emptyRow = () => ({
    id: uid(),
    workName: '',
    rate: '',
    qty: '',
    source: '',
});

// ── Default sections for Foundation ──────────────────────────────────────────

const DEFAULT_SECTIONS = [
    { id: 'excavation', name: 'Excavation', rows: [] },
    { id: 'pile',       name: 'Pile',       rows: [] },
    { id: 'pile-cap',   name: 'Pile Cap',   rows: [] },
];

// (MaterialTable imported from shared component)

// ── Foundation main component ─────────────────────────────────────────────────

const Foundation = ({ controller }) => {
    const [sections, setSections] = useState(DEFAULT_SECTIONS);

    const handleRowChange = useCallback((sectionId, rowId, field, value) => {
        setSections((prev) =>
            prev.map((sec) =>
                sec.id !== sectionId ? sec : {
                    ...sec,
                    rows: sec.rows.map((r) =>
                        r.id !== rowId ? r : { ...r, [field]: value }
                    ),
                }
            )
        );
    }, []);

    const handleRowDelete = useCallback((sectionId, rowId) => {
        setSections((prev) =>
            prev.map((sec) =>
                sec.id !== sectionId ? sec : {
                    ...sec,
                    rows: sec.rows.filter((r) => r.id !== rowId),
                }
            )
        );
    }, []);

    const handleAddRow = useCallback((sectionId, newRowData) => {
        setSections((prev) =>
            prev.map((sec) =>
                sec.id !== sectionId ? sec : {
                    ...sec,
                    rows: [...sec.rows, { id: uid(), ...newRowData }],
                }
            )
        );
    }, []);

    const handleAddSection = () => {
        const name = `Section ${sections.length + 1}`;
        setSections((prev) => [
            ...prev,
            { id: uid(), name, rows: [] },
        ]);
    };

    return (
        <div>
            {sections.map((sec) => (
                <MaterialTable
                    key={sec.id}
                    section={sec}
                    onRowChange={handleRowChange}
                    onRowDelete={handleRowDelete}
                    onAddRow={handleAddRow}
                />
            ))}

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

export default Foundation;
