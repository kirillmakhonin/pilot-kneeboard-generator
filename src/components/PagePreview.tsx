import React from 'react';

interface PagePreviewProps {
    children: React.ReactNode;
    pageNum: number;
    footer: string;
}

export const PagePreview: React.FC<PagePreviewProps> = ({ children, pageNum, footer }) => (
    <div className="flex flex-col items-center gap-2">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preview: Page {pageNum}</div>
        <div className="bg-white shadow-2xl rounded-sm border-2 border-slate-300 p-6 flex flex-col h-[780px] w-[300px] overflow-y-auto overflow-x-hidden no-scrollbar relative">
            <div className="absolute inset-2 border-[1px] border-slate-400 pointer-events-none rounded-[1px]"></div>
            {children}
            <div className="mt-auto pt-6 text-center text-[9px] font-black tracking-[3px] text-slate-300 uppercase z-10">{footer} | Page {pageNum}</div>
        </div>
    </div>
);
