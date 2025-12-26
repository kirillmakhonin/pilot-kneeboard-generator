import React, { useState, useEffect } from 'react';
import {
    FileText,
    Settings2,
    Trash2,
    Plus,
    ChevronDown,
    Database,
    Copy,
    Upload,
    Check,
    ArrowLeft,
    Calculator,
    AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PDFButton } from '../components/PDFButton';
import { ShareButton, ShareModal } from '../components/ShareModal';
import { generateWeightBalancePDF } from '../lib/pdf/generateWeightBalancePDF';
import { useGeneratorData } from '../hooks/useGeneratorData';
import type { WeightBalanceData, WeightBalancePosition } from '../types';

const INITIAL_DATA: WeightBalanceData = {
    aircraft: "Cessna 172S",
    tailNumber: "N738NY",
    makeModel: "CESSNA 172S SKYHAWK",
    date: new Date().toISOString().split('T')[0],
    category: "Normal",
    maxTakeoffWeight: "2550",
    referenceDatum: "40.0",
    positions: [
        { name: "Basic Empty Weight", weight: "1654.5", arm: "38.7", moment: "64028.2" },
        { name: "Pilot", weight: "170", arm: "37.0", moment: "6290.0" },
        { name: "Front Passenger", weight: "130", arm: "37.0", moment: "4810.0" },
        { name: "Rear Passenger 1", weight: "0", arm: "73.0", moment: "0.0" },
        { name: "Rear Passenger 2", weight: "0", arm: "73.0", moment: "0.0" },
        { name: "Baggage Area 1", weight: "50", arm: "95.0", moment: "4750.0" },
        { name: "Baggage Area 2", weight: "0", arm: "123.0", moment: "0.0" },
        { name: "Fuel (usable)", weight: "240", arm: "48.0", moment: "11520.0" }
    ],
    footer: "FLIGHT SCHOOL"
};

export const WeightAndBalanceGenerator: React.FC = () => {
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
    } = useGeneratorData<WeightBalanceData>('weight_balance_data_v1', INITIAL_DATA, 'weight-balance');

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsPdfLibLoaded(true);
    }, []);

    const calculateMoment = (weight: string, arm: string): string => {
        const w = parseFloat(weight) || 0;
        const a = parseFloat(arm) || 0;
        return (w * a).toFixed(1);
    };

    const updatePosition = (index: number, field: keyof WeightBalancePosition, value: string) => {
        const newPositions = [...data.positions];
        newPositions[index] = { ...newPositions[index], [field]: value };

        // Auto-calculate moment when weight or arm changes
        if (field === 'weight' || field === 'arm') {
            newPositions[index].moment = calculateMoment(
                newPositions[index].weight,
                newPositions[index].arm
            );
        }

        updateField('positions', null, '', newPositions);
    };

    const generatePDF = () => {
        if (!isPdfLibLoaded) return;
        generateWeightBalancePDF(data);
    };

    const handleImportSubmit = () => {
        const success = handleImport(importString);
        if (success) {
            setImportString("");
            setShowDataExchange(false);
        }
    };

    const addPosition = () => {
        const newPosition: WeightBalancePosition = {
            name: "New Position",
            weight: "0",
            arm: "0",
            moment: "0"
        };
        addItem('positions', newPosition);
    };

    const calculateTotals = () => {
        const totalWeight = data.positions.reduce((sum, pos) => sum + (parseFloat(pos.weight) || 0), 0);
        const totalMoment = data.positions.reduce((sum, pos) => sum + (parseFloat(pos.moment) || 0), 0);
        const cg = totalWeight > 0 ? (totalMoment / totalWeight).toFixed(1) : "0.0";

        return { totalWeight: totalWeight.toFixed(1), totalMoment: totalMoment.toFixed(1), cg };
    };

    const totals = calculateTotals();

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
                            <div className="bg-green-600 p-2 rounded-lg">
                                <Calculator className="text-white" size={18} />
                            </div>
                            <h1 className="text-sm font-black uppercase tracking-widest text-slate-800 hidden sm:block">Weight & Balance Generator</h1>
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
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 overflow-hidden">
                        <div className="flex items-center gap-3 mb-6">
                            <Settings2 className="text-green-600" size={20} />
                            <h2 className="text-lg font-bold">Aircraft Information</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Aircraft</label>
                                <input
                                    type="text"
                                    value={data.aircraft}
                                    onChange={(e) => updateField('aircraft', null, '', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-bold focus:ring-1 focus:ring-green-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Tail Number</label>
                                <input
                                    type="text"
                                    value={data.tailNumber}
                                    onChange={(e) => updateField('tailNumber', null, '', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-bold focus:ring-1 focus:ring-green-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Make/Model</label>
                                <input
                                    type="text"
                                    value={data.makeModel}
                                    onChange={(e) => updateField('makeModel', null, '', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-bold focus:ring-1 focus:ring-green-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Date</label>
                                <input
                                    type="date"
                                    value={data.date}
                                    onChange={(e) => updateField('date', null, '', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-bold focus:ring-1 focus:ring-green-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Category</label>
                                <input
                                    type="text"
                                    value={data.category}
                                    onChange={(e) => updateField('category', null, '', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-bold focus:ring-1 focus:ring-green-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Max Takeoff Weight</label>
                                <input
                                    type="text"
                                    value={data.maxTakeoffWeight}
                                    onChange={(e) => updateField('maxTakeoffWeight', null, '', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-bold focus:ring-1 focus:ring-green-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Reference Datum</label>
                                <input
                                    type="text"
                                    value={data.referenceDatum}
                                    onChange={(e) => updateField('referenceDatum', null, '', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-bold focus:ring-1 focus:ring-green-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Organization (Footer)</label>
                                <input
                                    type="text"
                                    value={data.footer}
                                    onChange={(e) => updateField('footer', null, '', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-bold focus:ring-1 focus:ring-green-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Weight & Balance Positions</h3>
                                <button onClick={addPosition} className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-green-600 hover:text-green-700">
                                    <Plus size={14} /> Add Position
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200">
                                            <th className="text-left p-2 text-xs font-black uppercase text-slate-600">Position</th>
                                            <th className="text-left p-2 text-xs font-black uppercase text-slate-600">Weight (lbs)</th>
                                            <th className="text-left p-2 text-xs font-black uppercase text-slate-600">Arm (in)</th>
                                            <th className="text-left p-2 text-xs font-black uppercase text-slate-600">Moment (in-lbs)</th>
                                            <th className="p-2"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.positions?.map((position, idx) => (
                                            <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                                                <td className="p-2">
                                                    <input
                                                        type="text"
                                                        value={position.name}
                                                        onChange={(e) => updatePosition(idx, 'name', e.target.value)}
                                                        className="w-full bg-transparent border-none text-xs font-medium focus:ring-0 focus:bg-white focus:border focus:border-slate-300 rounded px-1 py-0.5"
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <input
                                                        type="text"
                                                        value={position.weight}
                                                        onChange={(e) => updatePosition(idx, 'weight', e.target.value)}
                                                        className="w-full bg-transparent border-none text-xs font-medium focus:ring-0 focus:bg-white focus:border focus:border-slate-300 rounded px-1 py-0.5"
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <input
                                                        type="text"
                                                        value={position.arm}
                                                        onChange={(e) => updatePosition(idx, 'arm', e.target.value)}
                                                        className="w-full bg-transparent border-none text-xs font-medium focus:ring-0 focus:bg-white focus:border focus:border-slate-300 rounded px-1 py-0.5"
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <input
                                                        type="text"
                                                        value={position.moment}
                                                        readOnly
                                                        className="w-full bg-slate-50 border-none text-xs font-medium text-slate-600 rounded px-1 py-0.5"
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <button
                                                        onClick={() => removeItem('positions', idx)}
                                                        className="text-slate-300 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        <tr className="bg-slate-100 font-bold">
                                            <td className="p-2 text-xs">TOTALS</td>
                                            <td className="p-2 text-xs">{totals.totalWeight}</td>
                                            <td className="p-2 text-xs">CG: {totals.cg}</td>
                                            <td className="p-2 text-xs">{totals.totalMoment}</td>
                                            <td className="p-2"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Import/Export Block - Same as SpeedsBriefingGenerator */}
                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <button
                                onClick={() => setShowDataExchange(!showDataExchange)}
                                className="w-full flex items-center justify-between group py-2"
                            >
                                <div className="flex items-center gap-2">
                                    <Database size={16} className="text-slate-400 group-hover:text-green-600 transition-colors" />
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
                                                className={`flex items-center gap-1.5 text-[9px] font-black uppercase px-2 py-1 rounded transition-colors ${copySuccess ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-green-600 hover:bg-green-50'
                                                    }`}
                                            >
                                                {copySuccess ? <Check size={10} /> : <Copy size={10} />}
                                                {copySuccess ? 'Copied' : 'Copy to Clipboard'}
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 w-1 bg-green-100 rounded-l"></div>
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
                                            className="w-full bg-slate-50 border border-slate-200 rounded p-3 text-xs font-mono focus:ring-1 focus:ring-green-500 outline-none h-20 resize-none"
                                        />
                                        {importError && <p className="text-[10px] font-bold text-red-500">{importError}</p>}
                                        <button
                                            onClick={handleImportSubmit}
                                            disabled={!importString}
                                            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-200 text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-lg transition-all"
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

                {/* Preview */}
                <div className="w-full xl:w-1/2">
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <FileText className="text-green-600" size={20} />
                            <h2 className="text-lg font-bold">Weight & Balance Summary</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-[10px] font-black uppercase text-slate-400">Aircraft:</span>
                                    <p className="font-bold">{data.aircraft}</p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase text-slate-400">Tail Number:</span>
                                    <p className="font-bold">{data.tailNumber}</p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase text-slate-400">Date:</span>
                                    <p className="font-bold">{data.date}</p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-black uppercase text-slate-400">Category:</span>
                                    <p className="font-bold">{data.category}</p>
                                </div>
                            </div>

                            <div className="border-t border-slate-200 pt-4">
                                <h3 className="text-sm font-bold mb-3">Weight Distribution</h3>
                                <div className="space-y-2">
                                    {data.positions.filter(p => parseFloat(p.weight) > 0).map((position, idx) => (
                                        <div key={idx} className="flex justify-between text-xs">
                                            <span className="text-slate-600">{position.name}</span>
                                            <span className="font-medium">{position.weight} lbs @ {position.arm}"</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-slate-200 pt-4">
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className="bg-slate-50 rounded-lg p-3">
                                        <div className="text-[10px] font-black uppercase text-slate-400">Total Weight</div>
                                        <div className="text-lg font-bold text-slate-900">{totals.totalWeight}</div>
                                        <div className="text-xs text-slate-500">lbs</div>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-3">
                                        <div className="text-[10px] font-black uppercase text-green-600">Center of Gravity</div>
                                        <div className="text-lg font-bold text-green-700">{totals.cg}</div>
                                        <div className="text-xs text-slate-500">inches</div>
                                    </div>
                                    <div className="bg-blue-50 rounded-lg p-3">
                                        <div className="text-[10px] font-black uppercase text-blue-600">Total Moment</div>
                                        <div className="text-lg font-bold text-blue-700">{totals.totalMoment}</div>
                                        <div className="text-xs text-slate-500">in-lbs</div>
                                    </div>
                                </div>
                            </div>

                            {parseFloat(totals.totalWeight) > parseFloat(data.maxTakeoffWeight) && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                    <div className="flex items-center gap-2 text-red-700">
                                        <AlertTriangle size={16} />
                                        <span className="text-sm font-bold">Weight Exceeds Maximum Takeoff Weight</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer with Disclaimer */}
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
