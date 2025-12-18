import React, { useState, useEffect } from 'react';
import {
    AlertTriangle,
    Settings2,
    Trash2,
    Plus,
    ChevronDown,
    ChevronRight,
    Database,
    Copy,
    Upload,
    Check,
    ArrowLeft,
    FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PDFButton } from '../components/PDFButton';
import { ShareButton, ShareModal } from '../components/ShareModal';
import { generateEmergencyPDF } from '../lib/pdf/generateEmergencyPDF';
import { useGeneratorData } from '../hooks/useGeneratorData';
import type {
    EmergencyChecklistData,
    EmergencyChecklistSection,
    EmergencyChecklistScript,
    EmergencyChecklistItemOrGroup,
    EmergencyChecklistItem,
    EmergencyChecklistGroup
} from '../types';
import { EmergencyChecklistType } from '../types';

const INITIAL_DATA: EmergencyChecklistData = {
    aircraft: "DA-20",
    tailNumber: "",
    makeModel: "DIAMOND DA20-C1",
    footer: "Rev 4.24.18",
    sections: [
        // PAGE 1
        {
            type: 'EMERGENCY',
            title: "ENGINE FIRE | SEVERE DAMAGE",
            scripts: [
                {
                    title: "ON GROUND",
                    internalCode: "EMERGENCY 2-1",
                    steps: [
                        {
                            type: 'GROUP', group: {
                                items: [
                                    { type: 'CHECK_LINE', title: "Mixture", desiredState: "IDLE CUT-OFF" },
                                    { type: 'CHECK_LINE', title: "Fuel Shut-off Valve", desiredState: "Pull Out" },
                                    { type: 'CHECK_LINE', title: "Cabin Heat", desiredState: "OFF" },
                                    { type: 'CHECK_LINE', title: "Fuel Pump", desiredState: "OFF" },
                                    { type: 'CHECK_LINE', title: "GEN/BAT Master", desiredState: "OFF" },
                                ],
                                isHighlighted: true
                            },
                        },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Airspeed", desiredState: "73 KIAS" } }
                    ]
                },
                {
                    title: "IN FLIGHT",
                    internalCode: "EMERGENCY 2-2",
                    steps: [
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Fuel Shut-off Valve", desiredState: "Pull Out" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Cabin Heat", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Fuel Pump", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Airspeed", desiredState: "73 KIAS" } }
                    ]
                }
            ]
        },
        {
            type: 'EMERGENCY',
            title: "ENGINE FAILURE",
            scripts: [
                {
                    title: "DURING TAKEOFF ROLL",
                    internalCode: "EMERGENCY 3-1",
                    steps: [
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Throttle", desiredState: "IDLE" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Flaps", desiredState: "UP" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Brakes", desiredState: "As required" } }
                    ]
                },
                {
                    title: "AFTER TAKEOFF BELOW 500'",
                    internalCode: "EMERGENCY 3-2",
                    steps: [
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Pitch", desiredState: "Lower nose IMMEDIATELY to maintain airspeed", isHighlighted: true } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Best Landing Site w/in 30°", desiredState: "Choose" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Alternate Air", desiredState: "OPEN" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Fuel Prime", desiredState: "ON" } },
                        { type: 'ITEM', item: { type: 'SUBTITLE', title: "If time and altitude permit", isHighlighted: true } }
                    ]
                },
                {
                    title: "AFTER TAKEOFF ABOVE 500'",
                    internalCode: "EMERGENCY 3-3",
                    steps: [
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Pitch", desiredState: "Lower nose IMMEDIATELY to maintain airspeed", isHighlighted: true } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "IF ADEQUATE ALTITUDE turn back to airport", desiredState: "" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Alternate Air", desiredState: "OPEN" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Fuel Prime", desiredState: "ON" } },
                        { type: 'ITEM', item: { type: 'SUBTITLE', title: "If time and altitude permit", isHighlighted: true } }
                    ]
                },
                {
                    title: "IN FLIGHT",
                    internalCode: "EMERGENCY 3-4",
                    steps: [
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Airspeed", desiredState: "73 KIAS" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Suitable Landing Site", desiredState: "Choose & Turn" } }
                    ]
                }
            ]
        },
        {
            type: 'EMERGENCY',
            title: "EMERGENCY DESCENT",
            scripts: [
                {
                    internalCode: "EMERGENCY 4-1",
                    steps: [
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Mixture", desiredState: "Full RICH" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Fuel Pump", desiredState: "ON" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Throttle", desiredState: "IDLE" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Pitch", desiredState: "Lower to increase airspeed" } }
                    ]
                }
            ]
        },
        // PAGE 2
        {
            type: 'EMERGENCY',
            title: "FIRE | ELECTRICAL FIRE | SMOKE IN COCKPIT",
            scripts: [
                {
                    title: "ON GROUND",
                    internalCode: "EMERGENCY 2-3",
                    steps: [
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "GEN/BAT Master", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Mixture", desiredState: "IDLE CUT-OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Fuel Shut-Off Valve", desiredState: "Pull Out" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Ignition", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Canopy", desiredState: "Open" } }
                    ]
                },
                {
                    title: "IN FLIGHT",
                    internalCode: "EMERGENCY 2-4",
                    steps: [
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "GEN/BAT Master", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Cabin Air Vents/Windows", desiredState: "Open" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Cabin Heat", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'SUBTITLE', title: "If Smoke Continues:", isHighlighted: true } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Fire Extinguisher", desiredState: "Discharge" } }
                    ]
                }
            ]
        },
        {
            type: 'EMERGENCY',
            title: "LOSS OF DIRECTIONAL CONTROL ON LANDING",
            scripts: [
                {
                    internalCode: "EMERGENCY 4-3",
                    steps: [
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Brakes", desiredState: "Release" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Mixture", desiredState: "IDLE CUT-OFF" } }
                    ]
                }
            ]
        },
        {
            type: 'EMERGENCY',
            title: "RECOVERY FROM UNINTENTIONAL SPIN",
            scripts: [
                {
                    internalCode: "EMERGENCY 4-4",
                    steps: [
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Throttle", desiredState: "IDLE" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Ailerons", desiredState: "Neutral" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Rudder", desiredState: "FULL Opposite Spin" } },
                        { type: 'ITEM', item: { type: 'SUBTITLE', title: "AFTER ROTATION STOPS" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Rudder", desiredState: "NEUTRAL" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Elevator", desiredState: "Ease Back out of Dive" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Flaps", desiredState: "Check CRUISE" } }
                    ]
                }
            ]
        },
        {
            type: 'ABNORMAL',
            title: "LOSS OF BRAKING ON LANDING",
            scripts: [
                {
                    internalCode: "ABNORMAL 1-3",
                    steps: [
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Brakes", desiredState: "Release" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Mixture", desiredState: "IDLE CUT-OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Rudder", desiredState: "Maintain directional control" } }
                    ]
                }
            ]
        },
        {
            type: 'ABNORMAL',
            title: "ABORTED TAKE-OFF",
            scripts: [
                {
                    internalCode: "ABNORMAL 6-1",
                    steps: [
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Throttle", desiredState: "IDLE" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Mixture", desiredState: "IDLE CUT-OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Flaps", desiredState: "UP" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Brakes", desiredState: "As required" } }
                    ]
                }
            ]
        },
        {
            type: 'ABNORMAL',
            title: "TRIM SYSTEM RUNAWAY",
            scripts: [
                {
                    internalCode: "ABNORMAL 3-2",
                    steps: [
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Control Stick", desiredState: "Maintain Control of A/C" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Trim Motor Circuit Breaker", desiredState: "Pull OUT" } }
                    ]
                }
            ]
        }
    ]
};

export const EmergencyChecklistGenerator: React.FC = () => {
    const [isPdfLibLoaded, setIsPdfLibLoaded] = useState(false);
    const [showDataExchange, setShowDataExchange] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [importString, setImportString] = useState("");
    const [activeSectionIndex, setActiveSectionIndex] = useState(0);
    const [expandedScripts, setExpandedScripts] = useState<Record<string, boolean>>({});
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const {
        data,
        updateField,
        handleExport,
        handleImport,
        importError,
        copySuccess,
        getShareableUrl,
        copyShareableUrl
    } = useGeneratorData<EmergencyChecklistData>('emergency_checklist_data_v2', INITIAL_DATA);

    useEffect(() => {
        setIsPdfLibLoaded(true);
    }, []);

    // Update preview when data changes
    useEffect(() => {
        if (isPdfLibLoaded) {
            try {
                const url = generateEmergencyPDF(data, 'preview');
                setPreviewUrl(url);
            } catch (e) {
                console.error('Failed to generate preview:', e);
            }
        }
    }, [data, isPdfLibLoaded]);

    const generatePDF = () => {
        if (!isPdfLibLoaded) return;
        generateEmergencyPDF(data, 'build');
    };

    const handleImportSubmit = () => {
        const success = handleImport(importString);
        if (success) {
            setImportString("");
            setShowDataExchange(false);
        }
    };

    const toggleScriptExpanded = (sectionIdx: number, scriptIdx: number) => {
        const key = `${sectionIdx}-${scriptIdx}`;
        setExpandedScripts(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Section management
    const addSection = () => {
        const newSections = [...data.sections, {
            type: 'EMERGENCY' as keyof typeof EmergencyChecklistType,
            title: "NEW SECTION",
            scripts: [{
                title: "New Procedure",
                internalCode: "",
                steps: []
            }]
        }];
        updateField('sections', null, '', newSections);
        setActiveSectionIndex(newSections.length - 1);
    };

    const removeSection = (index: number) => {
        const newSections = data.sections.filter((_, i) => i !== index);
        updateField('sections', null, '', newSections);
        if (activeSectionIndex >= newSections.length) {
            setActiveSectionIndex(Math.max(0, newSections.length - 1));
        }
    };

    const updateSection = (index: number, field: keyof EmergencyChecklistSection, value: unknown) => {
        const newSections = [...data.sections];
        newSections[index] = { ...newSections[index], [field]: value };
        updateField('sections', null, '', newSections);
    };

    // Script management
    const addScript = (sectionIndex: number) => {
        const newSections = [...data.sections];
        newSections[sectionIndex].scripts.push({
            title: "New Procedure",
            internalCode: "",
            steps: []
        });
        updateField('sections', null, '', newSections);
    };

    const removeScript = (sectionIndex: number, scriptIndex: number) => {
        const newSections = [...data.sections];
        newSections[sectionIndex].scripts = newSections[sectionIndex].scripts.filter((_, i) => i !== scriptIndex);
        updateField('sections', null, '', newSections);
    };

    const updateScript = (sectionIndex: number, scriptIndex: number, field: keyof EmergencyChecklistScript, value: unknown) => {
        const newSections = [...data.sections];
        newSections[sectionIndex].scripts[scriptIndex] = {
            ...newSections[sectionIndex].scripts[scriptIndex],
            [field]: value
        };
        updateField('sections', null, '', newSections);
    };

    // Step management
    const addStep = (sectionIndex: number, scriptIndex: number, type: 'item' | 'group') => {
        const newSections = [...data.sections];
        const newStep: EmergencyChecklistItemOrGroup = type === 'item'
            ? {
                type: 'ITEM',
                item: {
                    type: 'CHECK_LINE',
                    title: "New Item",
                    desiredState: "",
                    isHighlighted: false
                }
            }
            : {
                type: 'GROUP',
                group: {
                    title: "New Group",
                    items: []
                }
            };
        newSections[sectionIndex].scripts[scriptIndex].steps.push(newStep);
        updateField('sections', null, '', newSections);
    };

    const removeStep = (sectionIndex: number, scriptIndex: number, stepIndex: number) => {
        const newSections = [...data.sections];
        newSections[sectionIndex].scripts[scriptIndex].steps =
            newSections[sectionIndex].scripts[scriptIndex].steps.filter((_, i) => i !== stepIndex);
        updateField('sections', null, '', newSections);
    };

    const updateStepItem = (
        sectionIndex: number,
        scriptIndex: number,
        stepIndex: number,
        field: keyof EmergencyChecklistItem,
        value: unknown
    ) => {
        const newSections = [...data.sections];
        const step = newSections[sectionIndex].scripts[scriptIndex].steps[stepIndex];
        if (step.item) {
            step.item = { ...step.item, [field]: value };
        }
        updateField('sections', null, '', newSections);
    };

    const updateStepGroup = (
        sectionIndex: number,
        scriptIndex: number,
        stepIndex: number,
        field: keyof EmergencyChecklistGroup,
        value: unknown
    ) => {
        const newSections = [...data.sections];
        const step = newSections[sectionIndex].scripts[scriptIndex].steps[stepIndex];
        if (step.group) {
            step.group = { ...step.group, [field]: value };
        }
        updateField('sections', null, '', newSections);
    };

    // Group item management
    const addGroupItem = (sectionIndex: number, scriptIndex: number, stepIndex: number) => {
        const newSections = [...data.sections];
        const step = newSections[sectionIndex].scripts[scriptIndex].steps[stepIndex];
        if (step.group) {
            step.group.items.push({
                type: 'CHECK_LINE',
                title: "New Item",
                desiredState: "",
                isHighlighted: false
            });
        }
        updateField('sections', null, '', newSections);
    };

    const removeGroupItem = (sectionIndex: number, scriptIndex: number, stepIndex: number, itemIndex: number) => {
        const newSections = [...data.sections];
        const step = newSections[sectionIndex].scripts[scriptIndex].steps[stepIndex];
        if (step.group) {
            step.group.items = step.group.items.filter((_, i) => i !== itemIndex);
        }
        updateField('sections', null, '', newSections);
    };

    const updateGroupItem = (
        sectionIndex: number,
        scriptIndex: number,
        stepIndex: number,
        itemIndex: number,
        field: keyof EmergencyChecklistItem,
        value: unknown
    ) => {
        const newSections = [...data.sections];
        const step = newSections[sectionIndex].scripts[scriptIndex].steps[stepIndex];
        if (step.group) {
            step.group.items[itemIndex] = { ...step.group.items[itemIndex], [field]: value };
        }
        updateField('sections', null, '', newSections);
    };

    const activeSection = data.sections[activeSectionIndex];

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900 font-sans">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            to="/"
                            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
                        >
                            <ArrowLeft size={18} />
                            <span className="text-sm font-medium">Back to Home</span>
                        </Link>
                        <div className="flex items-center gap-2">
                            <div className="bg-red-600 p-2 rounded-lg">
                                <AlertTriangle className="text-white" size={18} />
                            </div>
                            <h1 className="text-sm font-black uppercase tracking-widest text-slate-800 hidden sm:block">Emergency Checklist Generator</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <ShareButton onClick={() => setShowShareModal(true)} />
                        <PDFButton
                            onClick={generatePDF}
                            disabled={!isPdfLibLoaded}
                            loading={!isPdfLibLoaded}
                            label="Preview PDF"
                        />
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-4 lg:p-8 flex flex-col xl:flex-row gap-8 items-start">
                {/* Editor */}
                <div className="w-full xl:w-1/2 space-y-6">
                    {/* Aircraft Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <Settings2 className="text-red-600" size={20} />
                            <h2 className="text-lg font-bold">Aircraft Information</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Aircraft</label>
                                <input
                                    type="text"
                                    value={data.aircraft}
                                    onChange={(e) => updateField('aircraft', null, '', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-bold focus:ring-1 focus:ring-red-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Tail Number</label>
                                <input
                                    type="text"
                                    value={data.tailNumber}
                                    onChange={(e) => updateField('tailNumber', null, '', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-bold focus:ring-1 focus:ring-red-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Make/Model</label>
                                <input
                                    type="text"
                                    value={data.makeModel}
                                    onChange={(e) => updateField('makeModel', null, '', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-bold focus:ring-1 focus:ring-red-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Footer</label>
                                <input
                                    type="text"
                                    value={data.footer}
                                    onChange={(e) => updateField('footer', null, '', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-bold focus:ring-1 focus:ring-red-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sections */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="text-red-600" size={20} />
                                <h2 className="text-lg font-bold">Checklist Sections</h2>
                            </div>
                            <button
                                onClick={addSection}
                                className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-red-600 hover:text-red-700"
                            >
                                <Plus size={14} /> Add Section
                            </button>
                        </div>

                        {/* Section Tabs */}
                        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg mb-6 overflow-x-auto no-scrollbar">
                            {data.sections.map((section, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveSectionIndex(idx)}
                                    className={`px-3 py-2 text-[9px] font-black uppercase tracking-widest rounded-md transition-all whitespace-nowrap flex items-center gap-2 ${activeSectionIndex === idx
                                        ? 'bg-white text-red-600 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    <span className={`w-2 h-2 rounded-full ${section.type === 'EMERGENCY' ? 'bg-red-500' : 'bg-amber-500'}`} />
                                    {section.title.substring(0, 15)}{section.title.length > 15 ? '...' : ''}
                                </button>
                            ))}
                        </div>

                        {activeSection && (
                            <div className="space-y-4">
                                {/* Section Header */}
                                <div className="flex gap-3 items-start bg-red-50/50 p-4 rounded-lg border border-red-100">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex gap-3">
                                            <div className="flex-1 space-y-1">
                                                <label className="text-[9px] font-black text-slate-400 uppercase">Section Title</label>
                                                <input
                                                    type="text"
                                                    value={activeSection.title}
                                                    onChange={(e) => updateSection(activeSectionIndex, 'title', e.target.value)}
                                                    className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-sm font-bold focus:ring-1 focus:ring-red-500 outline-none"
                                                />
                                            </div>
                                            <div className="w-32 space-y-1">
                                                <label className="text-[9px] font-black text-slate-400 uppercase">Type</label>
                                                <select
                                                    value={activeSection.type}
                                                    onChange={(e) => updateSection(activeSectionIndex, 'type', e.target.value)}
                                                    className="w-full bg-white border border-slate-200 rounded px-3 py-2 text-sm font-bold focus:ring-1 focus:ring-red-500 outline-none"
                                                >
                                                    <option value="EMERGENCY">Emergency</option>
                                                    <option value="ABNORMAL">Abnormal</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    {data.sections.length > 1 && (
                                        <button
                                            onClick={() => removeSection(activeSectionIndex)}
                                            className="text-slate-300 hover:text-red-500 transition-all pt-6"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>

                                {/* Scripts */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Procedures</h3>
                                        <button
                                            onClick={() => addScript(activeSectionIndex)}
                                            className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-red-600 hover:text-red-700"
                                        >
                                            <Plus size={12} /> Add Procedure
                                        </button>
                                    </div>

                                    {activeSection.scripts.map((script, scriptIdx) => {
                                        const isExpanded = expandedScripts[`${activeSectionIndex}-${scriptIdx}`] ?? true;
                                        return (
                                            <div key={scriptIdx} className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                                                {/* Script Header */}
                                                <div
                                                    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-100 transition-colors"
                                                    onClick={() => toggleScriptExpanded(activeSectionIndex, scriptIdx)}
                                                >
                                                    <ChevronRight
                                                        size={14}
                                                        className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                                    />
                                                    <div className="flex-1 flex items-center gap-2">
                                                        <input
                                                            type="text"
                                                            value={script.internalCode || ''}
                                                            onChange={(e) => {
                                                                e.stopPropagation();
                                                                updateScript(activeSectionIndex, scriptIdx, 'internalCode', e.target.value);
                                                            }}
                                                            onClick={(e) => e.stopPropagation()}
                                                            placeholder="Code"
                                                            className="w-16 bg-white border border-slate-200 rounded px-2 py-1 text-[10px] font-bold focus:ring-1 focus:ring-red-500 outline-none"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={script.title || ''}
                                                            onChange={(e) => {
                                                                e.stopPropagation();
                                                                updateScript(activeSectionIndex, scriptIdx, 'title', e.target.value);
                                                            }}
                                                            onClick={(e) => e.stopPropagation()}
                                                            placeholder="Procedure Title"
                                                            className="flex-1 bg-white border border-slate-200 rounded px-2 py-1 text-xs font-bold focus:ring-1 focus:ring-red-500 outline-none"
                                                        />
                                                    </div>
                                                    {activeSection.scripts.length > 1 && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removeScript(activeSectionIndex, scriptIdx);
                                                            }}
                                                            className="text-slate-300 hover:text-red-500 transition-all"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Script Steps */}
                                                {isExpanded && (
                                                    <div className="p-3 pt-0 space-y-2">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => addStep(activeSectionIndex, scriptIdx, 'item')}
                                                                className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-red-600"
                                                            >
                                                                <Plus size={10} /> Item
                                                            </button>
                                                            <button
                                                                onClick={() => addStep(activeSectionIndex, scriptIdx, 'group')}
                                                                className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-red-600"
                                                            >
                                                                <Plus size={10} /> Group
                                                            </button>
                                                        </div>

                                                        {script.steps.map((step, stepIdx) => (
                                                            <div key={stepIdx} className="bg-white rounded border border-slate-100 p-2">
                                                                {step.type === 'ITEM' && step.item && (
                                                                    <div className="flex gap-2 items-start group">
                                                                        <select
                                                                            value={step.item.type}
                                                                            onChange={(e) => updateStepItem(activeSectionIndex, scriptIdx, stepIdx, 'type', e.target.value)}
                                                                            className="w-24 bg-slate-50 border border-slate-200 rounded px-1 py-1 text-[9px] font-bold"
                                                                        >
                                                                            <option value="CHECK_LINE">Check</option>
                                                                            <option value="SUBTITLE">Subtitle</option>
                                                                            <option value="CONDITION">Condition</option>
                                                                        </select>
                                                                        <input
                                                                            type="text"
                                                                            value={step.item.title}
                                                                            onChange={(e) => updateStepItem(activeSectionIndex, scriptIdx, stepIdx, 'title', e.target.value)}
                                                                            placeholder="Item"
                                                                            className="flex-1 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[10px] font-medium"
                                                                        />
                                                                        {step.item.type === 'CHECK_LINE' && (
                                                                            <input
                                                                                type="text"
                                                                                value={step.item.desiredState || ''}
                                                                                onChange={(e) => updateStepItem(activeSectionIndex, scriptIdx, stepIdx, 'desiredState', e.target.value)}
                                                                                placeholder="State"
                                                                                className="w-28 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[10px] font-bold"
                                                                            />
                                                                        )}
                                                                        <label className="flex items-center gap-1 text-[8px] text-slate-400">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={step.item.isHighlighted || false}
                                                                                onChange={(e) => updateStepItem(activeSectionIndex, scriptIdx, stepIdx, 'isHighlighted', e.target.checked)}
                                                                                className="w-3 h-3"
                                                                            />
                                                                            HL
                                                                        </label>
                                                                        <button
                                                                            onClick={() => removeStep(activeSectionIndex, scriptIdx, stepIdx)}
                                                                            className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                                        >
                                                                            <Trash2 size={12} />
                                                                        </button>
                                                                    </div>
                                                                )}

                                                                {step.type === 'GROUP' && step.group && (
                                                                    <div className="space-y-2">
                                                                        <div className="flex gap-2 items-center group">
                                                                            <span className="text-[9px] font-black text-slate-400 uppercase">Group:</span>
                                                                            <input
                                                                                type="text"
                                                                                value={step.group.title}
                                                                                onChange={(e) => updateStepGroup(activeSectionIndex, scriptIdx, stepIdx, 'title', e.target.value)}
                                                                                placeholder="Group Title"
                                                                                className="flex-1 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[10px] font-bold"
                                                                            />
                                                                            <button
                                                                                onClick={() => addGroupItem(activeSectionIndex, scriptIdx, stepIdx)}
                                                                                className="text-[9px] font-black text-red-600 hover:text-red-700"
                                                                            >
                                                                                <Plus size={12} />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => removeStep(activeSectionIndex, scriptIdx, stepIdx)}
                                                                                className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                                            >
                                                                                <Trash2 size={12} />
                                                                            </button>
                                                                        </div>
                                                                        <div className="pl-4 space-y-1">
                                                                            {step.group.items.map((item, itemIdx) => (
                                                                                <div key={itemIdx} className="flex gap-2 items-center group/item">
                                                                                    <select
                                                                                        value={item.type}
                                                                                        onChange={(e) => updateGroupItem(activeSectionIndex, scriptIdx, stepIdx, itemIdx, 'type', e.target.value)}
                                                                                        className="w-20 bg-slate-50 border border-slate-200 rounded px-1 py-1 text-[9px] font-bold"
                                                                                    >
                                                                                        <option value="CHECK_LINE">Check</option>
                                                                                        <option value="SUBTITLE">Subtitle</option>
                                                                                        <option value="CONDITION">Condition</option>
                                                                                    </select>
                                                                                    <input
                                                                                        type="text"
                                                                                        value={item.title}
                                                                                        onChange={(e) => updateGroupItem(activeSectionIndex, scriptIdx, stepIdx, itemIdx, 'title', e.target.value)}
                                                                                        placeholder="Item"
                                                                                        className="flex-1 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[10px] font-medium"
                                                                                    />
                                                                                    {item.type === 'CHECK_LINE' && (
                                                                                        <input
                                                                                            type="text"
                                                                                            value={item.desiredState || ''}
                                                                                            onChange={(e) => updateGroupItem(activeSectionIndex, scriptIdx, stepIdx, itemIdx, 'desiredState', e.target.value)}
                                                                                            placeholder="State"
                                                                                            className="w-24 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[10px] font-bold"
                                                                                        />
                                                                                    )}
                                                                                    <label className="flex items-center gap-1 text-[8px] text-slate-400">
                                                                                        <input
                                                                                            type="checkbox"
                                                                                            checked={item.isHighlighted || false}
                                                                                            onChange={(e) => updateGroupItem(activeSectionIndex, scriptIdx, stepIdx, itemIdx, 'isHighlighted', e.target.checked)}
                                                                                            className="w-3 h-3"
                                                                                        />
                                                                                        HL
                                                                                    </label>
                                                                                    <button
                                                                                        onClick={() => removeGroupItem(activeSectionIndex, scriptIdx, stepIdx, itemIdx)}
                                                                                        className="text-slate-300 hover:text-red-500 opacity-0 group-hover/item:opacity-100 transition-all"
                                                                                    >
                                                                                        <Trash2 size={10} />
                                                                                    </button>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Import/Export Block */}
                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <button
                                onClick={() => setShowDataExchange(!showDataExchange)}
                                className="w-full flex items-center justify-between group py-2"
                            >
                                <div className="flex items-center gap-2">
                                    <Database size={16} className="text-slate-400 group-hover:text-red-600 transition-colors" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-700 transition-colors">Data Portability</span>
                                </div>
                                <ChevronDown size={14} className={`text-slate-300 transition-transform duration-300 ${showDataExchange ? 'rotate-180' : ''}`} />
                            </button>

                            {showDataExchange && (
                                <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-end">
                                            <label className="text-[9px] font-bold text-slate-400 uppercase">Export Current Data (Base64)</label>
                                            <button
                                                onClick={handleExport}
                                                className={`flex items-center gap-1.5 text-[9px] font-black uppercase px-2 py-1 rounded transition-colors ${copySuccess ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-red-600 hover:bg-red-50'
                                                    }`}
                                            >
                                                {copySuccess ? <Check size={10} /> : <Copy size={10} />}
                                                {copySuccess ? 'Copied' : 'Copy to Clipboard'}
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 w-1 bg-red-100 rounded-l"></div>
                                            <pre className="text-[10px] bg-slate-50 p-3 rounded-r border border-slate-100 font-mono break-all line-clamp-2 text-slate-500 select-all overflow-hidden max-h-20">
                                                {btoa(unescape(encodeURIComponent(JSON.stringify(data))))}
                                            </pre>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] font-bold text-slate-400 uppercase">Import Data</label>
                                        <textarea
                                            value={importString}
                                            onChange={(e) => setImportString(e.target.value)}
                                            placeholder="Paste your Base64 encoded JSON here..."
                                            className="w-full bg-slate-50 border border-slate-200 rounded p-3 text-xs font-mono focus:ring-1 focus:ring-red-500 outline-none h-20 resize-none"
                                        />
                                        {importError && <p className="text-[10px] font-bold text-red-500">{importError}</p>}
                                        <button
                                            onClick={handleImportSubmit}
                                            disabled={!importString}
                                            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-200 text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-lg transition-all"
                                        >
                                            <Upload size={12} />
                                            Verify and Import
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* PDF Preview */}
                <div className="w-full xl:w-1/2 flex justify-center sticky top-20">
                    <div
                        className="bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden"
                        style={{
                            width: '320px',
                            height: '495px',
                            // Half letter: 5.5" x 8.5" scaled
                        }}
                    >
                        {previewUrl ? (
                            <iframe
                                src={previewUrl}
                                className="w-full h-full border-0"
                                title="PDF Preview"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center">
                                <FileText className="text-slate-300 mb-4" size={48} />
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Generating Preview...</p>
                            </div>
                        )}
                    </div>
                </div>
            </main >

            <footer className="bg-white border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-start gap-3">
                            <div className="text-amber-600 mt-0.5">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-amber-900 mb-1">Important Disclaimer</h3>
                                <p className="text-sm text-amber-800">
                                    This tool is provided for informational purposes only. Pilots must verify all information against official aircraft documentation, POH/AFM, and regulatory requirements. Use at your own risk and always consult with qualified instructors and aviation authorities. The site owners assume no responsibility for the accuracy or use of this information.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                shareableUrl={getShareableUrl()}
                onCopyUrl={copyShareableUrl}
            />
        </div >
    );
};
