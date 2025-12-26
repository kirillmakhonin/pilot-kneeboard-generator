import React, { useState, useEffect } from 'react';
import {
    Plane,
    FileText,
    Settings2,
    Trash2,
    Plus,
    ChevronDown,
    Printer,
    Database,
    Copy,
    Upload,
    Check,
    ArrowLeft
} from 'lucide-react';
// Note: FileText and Printer are used in PDF_OPTIONS for the dropdown icons
import { Link } from 'react-router-dom';
import { RenderLabel } from '../components/RenderLabel';
import { PagePreview } from '../components/PagePreview';
import { PDFButtonWithDropdown } from '../components/PDFButton';
import type { DropdownOption } from '../components/PDFButton';
import { ShareButton, ShareModal } from '../components/ShareModal';
import { generateSpeedsBriefingPDF } from '../lib/pdf/generatePDF';
import { useGeneratorData } from '../hooks/useGeneratorData';
import type { AircraftData } from '../types';

// Rich text rendering function for **bold** text
const renderRichText = (text: string) => {
    if (!text) return text;

    // Split by **bold** patterns and preserve the delimiters
    const parts = text.split(/(\*\*.*?\*\*)/g);

    const nodes: React.ReactNode[] = [];
    let key = 0;

    for (const part of parts) {
        if (part.startsWith('**') && part.endsWith('**')) {
            const boldText = part.slice(2, -2);
            const boldLines = boldText.split(/\r?\n/);

            for (let i = 0; i < boldLines.length; i++) {
                const line = boldLines[i];
                if (line) nodes.push(<strong key={key++}>{line}</strong>);
                if (i < boldLines.length - 1) nodes.push(<br key={key++} />);
            }
        } else {
            const regularLines = part.split(/\r?\n/);

            for (let i = 0; i < regularLines.length; i++) {
                const line = regularLines[i];
                if (line) nodes.push(<span key={key++}>{line}</span>);
                if (i < regularLines.length - 1) nodes.push(<br key={key++} />);
            }
        }
    }

    return nodes;
};

const INITIAL_DATA: AircraftData = {
    aircraftModel: "DIAMOND DA20-C1",
    footer: "FLIGHT SCHOOL",
    speeds: [
        { label: "Max Speed in Rough Air V_NO", value: "118 Kts" },
        { label: "Max Maneuvering Speed V_A", value: "106 Kts" },
        { label: "Max Speed Flaps T/O V_FE T/O", value: "100 Kts" },
        { label: "Max Speed Flaps LDG V_FE LDG", value: "78 Kts" },
        { label: "Never Exceed Speed V_NE", value: "164 Kts" },
        { label: "Stall Speed Flaps Cruise V_S", value: "44 Kts" },
        { label: "Stall Speed Flaps LDG V_SO", value: "36 Kts" }
    ],
    takeoff: [
        { label: "Normal Rotate", value: "50-55 Kts" },
        { label: "Climb Out (Flaps T/O)", value: "65 Kts" },
        { label: "Climb Out (Flaps Cruise)", value: "75 Kts" },
        { label: "Short Field Rotate", value: "52 Kts" },
        { label: "Short Field Climb (Flaps T/O)", value: "58 Kts" },
        { label: "V_X Cruise", value: "60 Kts" },
        { label: "V_Y Cruise", value: "75 Kts" },
        { label: "V_X T/O", value: "57 Kts" },
        { label: "V_Y T/O", value: "68 Kts" }
    ],
    landing: [
        { label: "Normal Approach Flaps LDG", value: "65 Kts" },
        { label: "Approach Flaps UP", value: "70 Kts" },
        { label: "Short Field Approach Flaps LDG", value: "55-60 Kts" },
        { label: "Balked Landing Flaps LDG", value: "52 Kts" },
        { label: "Max Demonstrated X-Wind", value: "20 Kts" }
    ],
    emergency: [
        { label: "Best Glide (Flaps UP)", value: "73 Kts" },
        { label: "Glide Ratio", value: "11:1" },
        { label: "Distance per 1000ft AGL", value: "1.8 NM" },
        { label: "Eng Off (Flaps UP)", value: "64 Kts" },
        { label: "Eng Off (Flaps T/O)", value: "60 Kts" },
        { label: "Eng Off (Flaps LDG)", value: "55 Kts" }
    ],
    briefing: [
        {
            title: "IN CASE OF ABORTED TAKEOFF, ENGINE FAILURE, FIRE, OR ABNORMALITY PRIOR TO ROTATION",
            steps: "Throttle to Idle, Flaps up, Brakes as necessary."
        },
        {
            title: "IN CASE OF ENGINE FAILURE OR FIRE AFTER ROTATION",
            steps: "Pitch Down for Best Glide attitude. If runway is available land on the remaining runway. If no runway left, land straight ahead w/in 30° of nose. If sufficient altitude no lower than 500', we might attempt to turn back to the runway."
        },
        {
            title: "[For Instruction and Two Pilot Operations]",
            steps: "In Case of Emergency, I am pilot in command and you will back me up with checklists and radios as needed. We will always have a POSITIVE EXCHANGE of controls so we both are aware of who is flying the aircraft."
        },
        {
            title: "[All Operations]",
            steps: "This will be a (type of take off), Flaps are set at ___ and the winds on the takeoff roll will be from the (right, left, center)."
        }
    ]
};

const PDF_OPTIONS: DropdownOption[] = [
    {
        id: 'individual',
        label: 'Standard Individual Strips',
        description: 'Two individual 72mm strips',
        icon: <FileText className="text-slate-400" size={18} />
    },
    {
        id: 'combo',
        label: 'Build Letter Size Combo',
        description: 'Landscape (3-up) + Cut Marks',
        icon: <Printer className="text-blue-600" size={18} />
    }
];

export const SpeedsBriefingGenerator: React.FC = () => {
    const [activeTab, setActiveTab] = useState<keyof AircraftData>('speeds');
    const [isPdfLibLoaded, setIsPdfLibLoaded] = useState(false);
    const [showDataExchange, setShowDataExchange] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [importString, setImportString] = useState("");

    const {
        data,
        updateField,
        addItem,
        removeItem,
        handleExport,
        handleImport,
        importError,
        copySuccess,
        getShareableUrl,
        copyShareableUrl
    } = useGeneratorData<AircraftData>('pilot_checklist_data_v6', INITIAL_DATA, 'speeds');

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsPdfLibLoaded(true);
    }, []);

    const generatePDF = (mode: string) => {
        if (!isPdfLibLoaded) return;
        generateSpeedsBriefingPDF(data, mode as 'individual' | 'combo');
    };

    const handleImportSubmit = () => {
        const success = handleImport(importString);
        if (success) {
            setImportString("");
            setShowDataExchange(false);
        }
    };

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
                            <div className="bg-blue-600 p-2 rounded-lg">
                                <Plane className="text-white" size={18} />
                            </div>
                            <h1 className="text-sm font-black uppercase tracking-widest text-slate-800 hidden sm:block">Speeds & Briefing Generator</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <ShareButton onClick={() => setShowShareModal(true)} />
                        <PDFButtonWithDropdown
                            onSelect={generatePDF}
                            disabled={!isPdfLibLoaded}
                            loading={!isPdfLibLoaded}
                            label="Build PDF"
                            options={PDF_OPTIONS}
                            defaultOptionId="individual"
                        />
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-4 lg:p-8 flex flex-col xl:flex-row gap-8 items-start">
                {/* Editor */}
                <div className="w-full xl:w-1/2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 overflow-hidden">
                        <div className="flex items-center gap-3 mb-6">
                            <Settings2 className="text-blue-600" size={20} />
                            <h2 className="text-lg font-bold">Configuration</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Aircraft Model</label>
                                <input
                                    type="text"
                                    value={data.aircraftModel}
                                    onChange={(e) => updateField('aircraftModel', null, '', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-bold focus:ring-1 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Footer Branding</label>
                                <input
                                    type="text"
                                    value={data.footer}
                                    onChange={(e) => updateField('footer', null, '', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-bold focus:ring-1 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg mb-6 overflow-x-auto no-scrollbar">
                            {(['speeds', 'takeoff', 'landing', 'emergency', 'briefing'] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-md transition-all whitespace-nowrap ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Edit {activeTab} Section</h3>
                                <button
                                    onClick={() => addItem(activeTab, activeTab === 'briefing'
                                        ? { type: "Passenger", title: "New Section Title", content: "" }
                                        : { label: "New Item V_X", value: "" })}
                                    className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700"
                                >
                                    <Plus size={14} /> Add Row
                                </button>
                            </div>
                            <div className="space-y-2">
                                {(data[activeTab] as Array<{ label?: string; title?: string; value?: string; steps?: string; type?: string; content?: string }>)?.map((item, idx) => (
                                    <div key={idx} className="flex gap-3 items-start bg-slate-50/50 p-3 rounded-lg border border-slate-100 group">
                                        <div className="flex-1 space-y-2">
                                            {activeTab === 'briefing' && (
                                                <select
                                                    value={item.type || 'Passenger'}
                                                    onChange={(e) => updateField(activeTab, idx, 'type', e.target.value)}
                                                    className="w-full text-xs font-bold text-blue-600 bg-transparent border-none p-0 focus:ring-0 mb-2"
                                                >
                                                    <option value="Passenger">Passenger</option>
                                                    <option value="Takeoff">Takeoff</option>
                                                </select>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={item.label || item.title || ''}
                                                    onChange={(e) => updateField(activeTab, idx, item.label !== undefined ? 'label' : 'title', e.target.value)}
                                                    placeholder={activeTab === 'briefing' ? "Briefing Title" : "Label (use _ for subscript)"}
                                                    className="w-full text-xs font-black uppercase text-slate-500 bg-transparent border-none p-0 focus:ring-0"
                                                />
                                            </div>
                                            <textarea
                                                value={item.value || item.steps || item.content || ''}
                                                onChange={(e) => updateField(activeTab, idx, item.value !== undefined ? 'value' : (item.steps !== undefined ? 'steps' : 'content'), e.target.value)}
                                                placeholder={activeTab === 'briefing' ? "Briefing Content" : "Content"}
                                                rows={activeTab === 'briefing' ? 3 : 1}
                                                className="w-full text-sm font-medium text-slate-800 bg-transparent border-none p-0 focus:ring-0 resize-none"
                                            />
                                        </div>
                                        <button
                                            onClick={() => removeItem(activeTab, idx)}
                                            className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all pt-1"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Import/Export Block */}
                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <button
                                onClick={() => setShowDataExchange(!showDataExchange)}
                                className="w-full flex items-center justify-between group py-2"
                            >
                                <div className="flex items-center gap-2">
                                    <Database size={16} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
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
                                                className={`flex items-center gap-1.5 text-[9px] font-black uppercase px-2 py-1 rounded transition-colors ${copySuccess ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-blue-600 hover:bg-blue-50'
                                                    }`}
                                            >
                                                {copySuccess ? <Check size={10} /> : <Copy size={10} />}
                                                {copySuccess ? 'Copied' : 'Copy to Clipboard'}
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 w-1 bg-blue-100 rounded-l"></div>
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
                                            className="w-full bg-slate-50 border border-slate-200 rounded p-3 text-xs font-mono focus:ring-1 focus:ring-blue-500 outline-none h-20 resize-none"
                                        />
                                        {importError && <p className="text-[10px] font-bold text-red-500">{importError}</p>}
                                        <button
                                            onClick={handleImportSubmit}
                                            disabled={!importString}
                                            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-lg transition-all"
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

                {/* Live Preview */}
                <div className="w-full xl:w-1/2 flex flex-col md:flex-row gap-6 justify-center">
                    <PagePreview pageNum={1} footer={data.footer}>
                        <h2 className="text-center font-black text-xl mb-6 leading-none uppercase tracking-tight z-10">{data.aircraftModel}</h2>
                        {(['speeds', 'takeoff', 'landing', 'emergency'] as const).map(cat => (
                            <div key={cat} className="z-10">
                                <div className={`py-1 text-center text-[11px] font-bold uppercase mb-3 tracking-wider ${cat === 'emergency' ? 'bg-red-50 text-red-700' : 'bg-slate-100'}`}>
                                    {cat === 'emergency' ? 'Emergency Operations' : cat}
                                </div>
                                <div className="space-y-0 mb-6 px-1">
                                    {(data[cat] as Array<{ label: string; value: string }>)?.map((item, i) => (
                                        <div key={i} className="flex items-end gap-1 text-[11px] leading-tight mb-1">
                                            <RenderLabel text={item.label} className="whitespace-nowrap text-slate-700" />
                                            <div className="flex-1 border-b border-dotted border-slate-300 mb-[3px]"></div>
                                            <span className="font-bold whitespace-nowrap">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </PagePreview>

                    <PagePreview pageNum={2} footer={data.footer}>
                        <h2 className="text-center font-black text-lg mb-6 leading-none uppercase tracking-tight z-10">{data.aircraftModel}</h2>
                        <div className="bg-slate-100 py-1 text-center text-[11px] font-bold uppercase mb-4 tracking-wider z-10">Pre-Takeoff Briefing</div>
                        <div className="space-y-5 px-1 z-10">
                            {data.briefing?.map((item, i) => (
                                <div key={i} className="space-y-1">
                                    {item.type && (
                                        <div className="text-[9px] font-bold text-blue-600 uppercase tracking-wider mb-2">{item.type}</div>
                                    )}
                                    <div className="text-[10px] font-black leading-tight uppercase text-center border-b border-slate-50 pb-0.5">{item.title}</div>
                                    <div className="text-[10px] text-slate-800 leading-[1.5] text-left">{renderRichText(item.content || item.steps || '')}</div>
                                </div>
                            ))}
                        </div>
                    </PagePreview>
                </div>
            </main>

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
        </div>
    );
};
