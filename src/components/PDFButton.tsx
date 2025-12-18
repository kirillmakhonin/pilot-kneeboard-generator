import React, { useState, useRef, useEffect } from 'react';
import { Download, Loader2, ChevronDown } from 'lucide-react';

interface PDFButtonProps {
    onClick: () => void;
    disabled?: boolean;
    loading?: boolean;
    label?: string;
}

export const PDFButton: React.FC<PDFButtonProps> = ({
    onClick,
    disabled = false,
    loading = false,
    label = 'Preview PDF'
}) => {
    const isDisabled = disabled || loading;

    return (
        <button
            onClick={onClick}
            disabled={isDisabled}
            className={`px-6 h-10 font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 rounded-full shadow-lg ${!isDisabled
                    ? "bg-slate-900 hover:bg-black text-white"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                }`}
        >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {label}
        </button>
    );
};

export interface DropdownOption {
    id: string;
    label: string;
    description: string;
    icon: React.ReactNode;
}

interface PDFButtonWithDropdownProps {
    onSelect: (optionId: string) => void;
    disabled?: boolean;
    loading?: boolean;
    label?: string;
    options: DropdownOption[];
    defaultOptionId?: string;
}

export const PDFButtonWithDropdown: React.FC<PDFButtonWithDropdownProps> = ({
    onSelect,
    disabled = false,
    loading = false,
    label = 'Build PDF',
    options,
    defaultOptionId
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const isDisabled = disabled || loading;

    const defaultOption = defaultOptionId || (options.length > 0 ? options[0].id : '');

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleOptionClick = (optionId: string) => {
        onSelect(optionId);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div className="flex items-center shadow-lg rounded-full overflow-hidden">
                <button
                    onClick={() => onSelect(defaultOption)}
                    disabled={isDisabled}
                    className={`px-6 h-10 font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 ${!isDisabled
                        ? "bg-slate-900 hover:bg-black text-white"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        }`}
                >
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                    {label}
                </button>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    disabled={isDisabled}
                    className={`border-l border-white/20 px-2 h-10 transition-colors ${!isDisabled
                        ? "bg-slate-800 hover:bg-black text-white"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        }`}
                >
                    <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>
            </div>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    {options.map((option, index) => (
                        <button
                            key={option.id}
                            onClick={() => handleOptionClick(option.id)}
                            className={`w-full px-4 py-3 text-left hover:bg-slate-50 flex items-center gap-3 transition-colors ${index < options.length - 1 ? 'border-b border-slate-100' : ''
                                }`}
                        >
                            {option.icon}
                            <div>
                                <div className="text-xs font-bold text-slate-800">{option.label}</div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-tight">
                                    {option.description}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
