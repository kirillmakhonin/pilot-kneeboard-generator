import React, { useState, useEffect, useMemo } from 'react';
import {
    FileText,
    Settings2,
    Search,
    Printer,
    Database,
    Copy,
    Upload,
    Check,
    ArrowLeft,
    Bold,
    Italic,
    Edit3,
    LayoutTemplate
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PDFButtonWithDropdown } from '../components/PDFButton';
import type { DropdownOption } from '../components/PDFButton';
import { ShareButton, ShareModal } from '../components/ShareModal';
import { generateCFIEndorsementPDF } from '../lib/pdf/generateCFIEndorsementPDF'; // We will create this
import { useGeneratorData } from '../hooks/useGeneratorData';
import type { CFIEndorsementData } from '../types';
import { ENDORSEMENT_TEMPLATES } from '../data/endorsementTemplates';

const INITIAL_DATA: CFIEndorsementData = {
    cfiName: "",
    cfiNumber: "",
    expirationDate: "",
    endorsementDate: new Date().toISOString().slice(0, 10),
    endorsementTitle: "",
    endorsementText: "",
    endorsementType: 'template',
    templateId: "",
    fieldValues: {},
    footer: "FLIGHT SCHOOL"
};

const PDF_OPTIONS: DropdownOption[] = [
    {
        id: 'single_2x4',
        label: 'Single 2"x4" (PDF)',
        description: 'Just the card, sized 2x4 inches',
        icon: <FileText className="text-slate-400" size={18} />
    },
    {
        id: 'avery',
        label: 'Avery Labels (Letter)',
        description: 'Pick template + label position',
        icon: <Printer className="text-blue-600" size={18} />
    }
];

export const CFIEndorsementsGenerator: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isPdfLibLoaded, setIsPdfLibLoaded] = useState(false);
    const [showDataExchange, setShowDataExchange] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showAveryModal, setShowAveryModal] = useState(false);
    const [importString, setImportString] = useState("");
    const [labelPosition, setLabelPosition] = useState<number>(1); // 1-10 for Avery 18163
    const [averyTemplate, setAveryTemplate] = useState<string>('18163');

    const {
        data,
        updateField,
        handleExport,
        handleImport,
        importError,
        copySuccess,
        getShareableUrl,
        copyShareableUrl,
        updateState
    } = useGeneratorData<CFIEndorsementData>('cfi_endorsement_data_v1', INITIAL_DATA);

    useEffect(() => {
        setIsPdfLibLoaded(true);
    }, []);

    const handleGenerateClick = (mode: string) => {
        if (mode === 'avery') {
            setShowAveryModal(true);
            return;
        }
        generatePDF(mode);
    };

    const generatePDF = (mode: string) => {
        if (!isPdfLibLoaded) return;
        const displayTitle = getDisplayTitle();
        const dataForPrint: CFIEndorsementData = {
            ...data,
            endorsementTitle: displayTitle
        };
        if (mode === 'single_2x4') {
            generateCFIEndorsementPDF(dataForPrint, 'single_2x4');
        } else {
            generateCFIEndorsementPDF(dataForPrint, 'avery', labelPosition, averyTemplate);
        }
    };

    const handleImportSubmit = () => {
        const success = handleImport(importString);
        if (success) {
            setImportString("");
            setShowDataExchange(false);
        }
    };

    const filteredTemplates = useMemo(() => {
        if (!searchTerm) return ENDORSEMENT_TEMPLATES;
        const lowerTerm = searchTerm.toLowerCase();
        return ENDORSEMENT_TEMPLATES.filter(t =>
            t.title.toLowerCase().includes(lowerTerm) ||
            t.id.toLowerCase().includes(lowerTerm) ||
            t.text.toLowerCase().includes(lowerTerm)
        );
    }, [searchTerm]);

    const handleTemplateSelect = (templateId: string) => {
        const template = ENDORSEMENT_TEMPLATES.find(t => t.id === templateId);
        if (template) {
            updateState({
                ...data,
                endorsementType: 'template',
                templateId: template.id,
                endorsementTitle: template.title,
                endorsementText: template.text,
                fieldValues: {} // Reset fields when changing template
            });
        }
    };

    const handleFieldValueChange = (field: string, value: string) => {
        const newFieldValues = { ...data.fieldValues, [field]: value };
        updateState({ ...data, fieldValues: newFieldValues });
    };

    const insertTextAtCursor = (textToInsert: string) => {
        const textarea = document.getElementById('custom-text-editor') as HTMLTextAreaElement;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const text = data.endorsementText;
            const newText = text.substring(0, start) + textToInsert + text.substring(end);
            updateField('endorsementText', null, '', newText);

            // Restore focus and selection (roughly)
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
            }, 0);
        }
    };

    // Helper to process text with field values for display
    const getProcessedText = () => {
        let text = data.endorsementText;
        if (data.endorsementType === 'template' && data.fieldValues) {
            Object.entries(data.fieldValues).forEach(([key, value]) => {
                // specific replacement for [Field Name]
                text = text.replace(new RegExp(`\\[${key}\\]`, 'g'), value || `[${key}]`);
            });
        }
        return text;
    };

    const formatLocalDate = (yyyyMmDd: string) => {
        const match = /^\d{4}-\d{2}-\d{2}$/.test(yyyyMmDd);
        if (!match) return '';

        const [y, m, d] = yyyyMmDd.split('-').map((v) => Number(v));
        const dt = new Date(y, m - 1, d);
        if (Number.isNaN(dt.getTime())) return '';
        return dt.toLocaleDateString();
    };

    const currentTemplate = ENDORSEMENT_TEMPLATES.find(t => t.id === data.templateId);

    const getDisplayTitle = () => {
        const baseTitle = data.endorsementTitle || 'Endorsement';

        const template = currentTemplate;
        const id = template?.id || data.templateId || '';
        const farRef = template?.farReference || '';

        const prefix = id ? `${id} - ` : '';
        const suffix = farRef ? `: ${farRef}` : '';

        if (template?.title) {
            return `${prefix}${template.title}${suffix}`;
        }

        return `${prefix}${baseTitle}${suffix}`;
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
                                <FileText className="text-white" size={18} />
                            </div>
                            <h1 className="text-sm font-black uppercase tracking-widest text-slate-800 hidden sm:block">CFI Endorsements</h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <ShareButton onClick={() => setShowShareModal(true)} />

                        <PDFButtonWithDropdown
                            onSelect={handleGenerateClick}
                            disabled={!isPdfLibLoaded}
                            loading={!isPdfLibLoaded}
                            label="Print Endorsement"
                            options={PDF_OPTIONS}
                            defaultOptionId="single_2x4"
                        />
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-4 lg:p-8 flex flex-col xl:flex-row gap-8 items-start">
                {/* Editor Side */}
                <div className="w-full xl:w-1/2 space-y-6">

                    {/* CFI Config */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Settings2 className="text-blue-600" size={20} />
                            <h2 className="text-lg font-bold">CFI Information</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">CFI Name</label>
                                <input
                                    type="text"
                                    value={data.cfiName}
                                    onChange={(e) => updateField('cfiName', null, '', e.target.value)}
                                    placeholder="e.g. John Doe"
                                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-bold focus:ring-1 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Cert Number</label>
                                <input
                                    type="text"
                                    value={data.cfiNumber}
                                    onChange={(e) => updateField('cfiNumber', null, '', e.target.value)}
                                    placeholder="e.g. 1234567CFI"
                                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-bold focus:ring-1 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Expiration</label>
                                <input
                                    type="text"
                                    value={data.expirationDate}
                                    onChange={(e) => updateField('expirationDate', null, '', e.target.value)}
                                    placeholder="e.g. 12/2026"
                                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-bold focus:ring-1 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Date</label>
                                <input
                                    type="date"
                                    value={data.endorsementDate}
                                    onChange={(e) => updateField('endorsementDate', null, '', e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-bold focus:ring-1 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Mode Selection */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg mb-6">
                            <button
                                onClick={() => updateField('endorsementType', null, '', 'template')}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${data.endorsementType === 'template' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <LayoutTemplate size={14} /> Templates
                            </button>
                            <button
                                onClick={() => updateField('endorsementType', null, '', 'custom')}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-md transition-all ${data.endorsementType === 'custom' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <Edit3 size={14} /> Custom Text
                            </button>
                        </div>

                        {data.endorsementType === 'template' ? (
                            <div className="space-y-6">
                                {/* Search */}
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search templates (e.g. 'Solo', 'Knowledge Test')..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                    />
                                </div>

                                {/* Template List */}
                                <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-lg bg-slate-50 divide-y divide-slate-200">
                                    {filteredTemplates.map(template => (
                                        <button
                                            key={template.id}
                                            onClick={() => handleTemplateSelect(template.id)}
                                            className={`w-full text-left p-3 hover:bg-blue-50 transition-colors ${data.templateId === template.id ? 'bg-blue-50 ring-1 ring-inset ring-blue-500' : ''}`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-xs font-bold text-slate-900">{template.id} - {template.title}</span>
                                                {template.farReference && (
                                                    <span className="text-[10px] font-medium text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">
                                                        {template.farReference}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-slate-500 line-clamp-2">{template.text}</p>
                                        </button>
                                    ))}
                                </div>

                                {/* Dynamic Fields */}
                                {currentTemplate && currentTemplate.fields.length > 0 && (
                                    <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
                                        <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3">Fill Details</h3>
                                        <div className="space-y-3">
                                            {currentTemplate.fields.map(field => (
                                                <div key={field}>
                                                    <label className="text-[11px] font-bold text-slate-600 mb-1 block">{field}</label>
                                                    <input
                                                        type="text"
                                                        value={data.fieldValues?.[field] || ''}
                                                        onChange={(e) => handleFieldValueChange(field, e.target.value)}
                                                        className="w-full bg-white border border-blue-200 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                                        placeholder={`Enter ${field}...`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 block">Endorsement Title</label>
                                    <input
                                        type="text"
                                        value={data.endorsementTitle}
                                        onChange={(e) => updateField('endorsementTitle', null, '', e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-bold focus:ring-1 focus:ring-blue-500 outline-none"
                                        placeholder="e.g. High Performance Endorsement"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Content</label>
                                        <div className="flex gap-1">
                                            <button
                                                onClick={() => insertTextAtCursor('**bold**')}
                                                className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded"
                                                title="Bold"
                                            >
                                                <Bold size={14} />
                                            </button>
                                            <button
                                                onClick={() => insertTextAtCursor('*italic*')}
                                                className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded"
                                                title="Italic"
                                            >
                                                <Italic size={14} />
                                            </button>
                                        </div>
                                    </div>
                                    <textarea
                                        id="custom-text-editor"
                                        value={data.endorsementText}
                                        onChange={(e) => updateField('endorsementText', null, '', e.target.value)}
                                        className="w-full h-48 bg-slate-50 border border-slate-200 rounded p-3 text-sm focus:ring-1 focus:ring-blue-500 outline-none resize-none font-sans"
                                        placeholder="Enter endorsement text..."
                                    />
                                    <p className="text-[10px] text-slate-400">Use **text** for bold and *text* for italics.</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Import/Export Block */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                        <button
                            onClick={() => setShowDataExchange(!showDataExchange)}
                            className="w-full flex items-center justify-between group py-2"
                        >
                            <div className="flex items-center gap-2">
                                <Database size={16} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-700 transition-colors">Data Portability</span>
                            </div>
                            <Check size={14} className={`text-slate-300 transition-transform duration-300 ${showDataExchange ? 'rotate-180' : ''}`} />
                        </button>

                        {showDataExchange && (
                            <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <label className="text-[9px] font-bold text-slate-400 uppercase">Export Data</label>
                                        <button
                                            onClick={handleExport}
                                            className={`flex items-center gap-1.5 text-[9px] font-black uppercase px-2 py-1 rounded transition-colors ${copySuccess ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-blue-600 hover:bg-blue-50'}`}
                                        >
                                            {copySuccess ? <Check size={10} /> : <Copy size={10} />}
                                            {copySuccess ? 'Copied' : 'Copy'}
                                        </button>
                                    </div>
                                    <pre className="text-[10px] bg-slate-50 p-3 rounded border border-slate-100 font-mono break-all line-clamp-2 text-slate-500 select-all">
                                        {btoa(unescape(encodeURIComponent(JSON.stringify(data))))}
                                    </pre>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold text-slate-400 uppercase">Import Data</label>
                                    <textarea
                                        value={importString}
                                        onChange={(e) => setImportString(e.target.value)}
                                        placeholder="Paste Base64 data..."
                                        className="w-full bg-slate-50 border border-slate-200 rounded p-3 text-xs font-mono h-20 resize-none"
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

                {/* Preview */}
                <div className="w-full xl:w-1/2 flex justify-center sticky top-24">
                    {/* Visual representation of 2x4 card */}
                    <div className="w-[384px] aspect-[2/1] bg-white shadow-xl rounded-sm border border-slate-200 p-3 flex flex-col relative overflow-hidden">
                        {/* Content */}
                        <div className="flex-1 flex flex-col justify-between">
                            <div className="space-y-0.5">
                                <h3 className="font-bold text-center border-b-[1.5px] border-slate-900 pb-0.5 mb-0.5 text-xs leading-tight">
                                    {getDisplayTitle() || "Endorsement Title"}
                                </h3>
                                <div className="text-[9px] leading-[1.15] text-justify whitespace-pre-wrap font-serif">
                                    {getProcessedText()
                                        .split(/(\*\*.*?\*\*|\*.*?\*)/g)
                                        .map((part, i) => {
                                            if (part.startsWith('**') && part.endsWith('**')) {
                                                return <strong key={i}>{part.slice(2, -2)}</strong>;
                                            }
                                            if (part.startsWith('*') && part.endsWith('*')) {
                                                return <em key={i}>{part.slice(1, -1)}</em>;
                                            }
                                            return part;
                                        })}
                                </div>
                            </div>

                            <div className="mt-1 pt-1 border-t border-slate-200 space-y-0.5">
                                <div className="flex justify-between items-end">
                                    <div className="flex-1">
                                        <div className="h-px bg-slate-300 w-28 mb-[2px]"></div>
                                        <p className="text-[7px] font-bold uppercase text-slate-500">CFI Signature</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[8px] font-bold">{formatLocalDate(data.endorsementDate) || new Date().toLocaleDateString()}</p>
                                        <p className="text-[7px] font-bold uppercase text-slate-500">Date</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-end pt-[2px]">
                                    <div>
                                        <p className="text-[8px] font-bold">{data.cfiName || "________________"}</p>
                                        <p className="text-[7px] font-bold uppercase text-slate-500">CFI Name</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[8px] font-bold">{data.cfiNumber || "__________"} <span className="text-[7px] font-normal text-slate-400">Exp: {data.expirationDate || "N/A"}</span></p>
                                        <p className="text-[7px] font-bold uppercase text-slate-500">Cert. Number</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                shareableUrl={getShareableUrl()}
                onCopyUrl={copyShareableUrl}
            />

            {/* Avery Selection Modal */}
            {showAveryModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-slate-900">Print on Avery Labels</h3>
                            <button onClick={() => setShowAveryModal(false)} className="text-slate-400 hover:text-slate-600">
                                <span className="sr-only">Close</span>
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-slate-600 mb-4">
                                Choose an Avery template and which label position to print on.
                                Position 1 = row 1, left; Position 2 = row 1, right; ... Position 10 = row 5, right.
                            </p>

                            <div className="mb-4">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1 block">Avery Template</label>
                                <select
                                    value={averyTemplate}
                                    onChange={(e) => setAveryTemplate(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-sm font-bold focus:ring-1 focus:ring-blue-500 outline-none"
                                >
                                    <option value="18163">18163 (2"x4" shipping labels)</option>
                                    <option value="5163">5163 (2"x4" address labels)</option>
                                    <option value="8163">8163 (2"x4" address labels)</option>
                                    <option value="18663">18663 (2"x4" shipping labels)</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-6 bg-slate-100 p-4 rounded-lg">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                    <button
                                        key={num}
                                        onClick={() => setLabelPosition(num)}
                                        className={`flex items-center justify-center h-12 rounded border text-sm font-bold transition-all ${labelPosition === num
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600'
                                            }`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowAveryModal(false)}
                                    className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => generatePDF('avery')}
                                    className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                                >
                                    <Printer size={16} />
                                    Print Label
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
