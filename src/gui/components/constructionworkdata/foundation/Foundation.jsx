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

const Foundation = ({ controller, projectData, data, onUpdate }) => {
    const [sections, setSections] = useState(() => {
        return data?.foundation || DEFAULT_SECTIONS;
    });

    // Persist changes to parent
    const persist = useCallback((nextSections) => {
        if (onUpdate) {
            onUpdate({ ...data, foundation: nextSections });
        }
    }, [onUpdate, data]);

    const handleRowChange = useCallback((sectionId, rowId, field, value) => {
        setSections((prev) => {
            const next = prev.map((sec) =>
                sec.id !== sectionId ? sec : {
                    ...sec,
                    rows: sec.rows.map((r) =>
                        r.id !== rowId ? r : { ...r, [field]: value }
                    ),
                }
            );
            persist(next);
            return next;
        });
    }, [persist]);

    const handleRowDelete = useCallback((sectionId, rowId) => {
        setSections((prev) => {
            const next = prev.map((sec) =>
                sec.id !== sectionId ? sec : {
                    ...sec,
                    rows: sec.rows.filter((r) => r.id !== rowId),
                }
            );
            persist(next);
            return next;
        });
    }, [persist]);

    const handleAddRow = useCallback((sectionId, newRowData) => {
        setSections((prev) => {
            const next = prev.map((sec) =>
                sec.id !== sectionId ? sec : {
                    ...sec,
                    rows: [...sec.rows, { id: uid(), ...newRowData }],
                }
            );
            persist(next);
            return next;
        });
    }, [persist]);

    const handleAddSection = () => {
        const name = `Section ${sections.length + 1}`;
        setSections((prev) => {
            const next = [
                ...prev,
                { id: uid(), name, rows: [] },
            ];
            persist(next);
            return next;
        });
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
                    projectData={projectData}
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
