import React, { useState } from 'react';
import { X, Copy, Check, Link2, Share2 } from 'lucide-react';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    shareableUrl: string | null;
    onCopyUrl: () => Promise<boolean>;
}

export const ShareModal: React.FC<ShareModalProps> = ({
    isOpen,
    onClose,
    shareableUrl,
    onCopyUrl
}) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopy = async () => {
        const success = await onCopyUrl();
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full animate-in zoom-in-95 fade-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <Share2 className="text-blue-600" size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900">Share Configuration</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div>
                        <p className="text-sm text-slate-600 mb-4">
                            Share this link with others to let them use your current configuration.
                            The link includes all your data encoded in the URL.
                        </p>
                    </div>

                    {/* URL Box */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Shareable Link
                        </label>
                        <div className="relative">
                            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-3">
                                <Link2 className="text-slate-400 flex-shrink-0" size={16} />
                                <input
                                    type="text"
                                    readOnly
                                    value={shareableUrl || ''}
                                    className="flex-1 bg-transparent text-sm text-slate-700 font-mono truncate outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Copy Button */}
                    <button
                        onClick={handleCopy}
                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all ${copied
                                ? 'bg-green-100 text-green-700'
                                : 'bg-slate-900 hover:bg-black text-white'
                            }`}
                    >
                        {copied ? (
                            <>
                                <Check size={16} />
                                Copied to Clipboard!
                            </>
                        ) : (
                            <>
                                <Copy size={16} />
                                Copy Link
                            </>
                        )}
                    </button>

                    {/* Instructions */}
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <h4 className="text-sm font-bold text-blue-900 mb-2">How to share:</h4>
                        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                            <li>Click "Copy Link" to copy the URL</li>
                            <li>Send the link via email, message, or any other method</li>
                            <li>Recipients will see your exact configuration when they open the link</li>
                        </ol>
                    </div>

                    <p className="text-xs text-slate-400 text-center">
                        Note: The URL contains your data encoded in Base64. Very long configurations may create long URLs.
                    </p>
                </div>
            </div>
        </div>
    );
};

interface ShareButtonProps {
    onClick: () => void;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="px-4 h-10 font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 rounded-full border-2 border-slate-300 hover:border-slate-400 text-slate-600 hover:text-slate-800 bg-white"
        >
            <Share2 size={14} />
            Share
        </button>
    );
};
