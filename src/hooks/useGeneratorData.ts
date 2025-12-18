import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useGeneratorData<T extends Record<string, unknown>>(storageKey: string, initialData: T) {
    const [data, setData] = useState<T>(initialData);
    const [importError, setImportError] = useState("");
    const [copySuccess, setCopySuccess] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Check for URL parameter first
        const urlParams = new URLSearchParams(location.search);
        const urlData = urlParams.get('data');

        if (urlData) {
            try {
                const decoded = decodeURIComponent(escape(atob(urlData)));
                const parsed = JSON.parse(decoded);
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setData(parsed as T);
                // Clear the URL parameter after loading
                window.history.replaceState({}, '', location.pathname);
                return;
            } catch {
                console.error("Failed to load data from URL");
            }
        }

        // Fall back to localStorage
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            try {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setData(JSON.parse(saved));
            } catch {
                console.error("Failed to load saved data for", storageKey);
            }
        }
    }, [storageKey, location.search]);

    const saveToLocal = (newData: T) => {
        setData(newData);
        localStorage.setItem(storageKey, JSON.stringify(newData));
    };

    const updateField = (category: keyof T, index: number | null, key: string, value: unknown) => {
        const newData = { ...data };
        if (index === null) {
            (newData as Record<keyof T, unknown>)[category] = value;
        } else {
            ((newData as Record<keyof T, unknown[]>)[category] as Record<string, unknown>[])[index][key] = value;
        }
        saveToLocal(newData);
    };

    const addItem = (category: keyof T, template: unknown) => {
        const newData = { ...data };
        (newData as Record<keyof T, unknown[]>)[category].push(template);
        saveToLocal(newData);
    };

    const removeItem = (category: keyof T, index: number) => {
        const newData = { ...data };
        (newData as Record<keyof T, unknown[]>)[category].splice(index, 1);
        saveToLocal(newData);
    };

    const handleExport = () => {
        try {
            const json = JSON.stringify(data);
            const base64 = btoa(unescape(encodeURIComponent(json)));

            // Fallback copy logic for iFrames
            const tempInput = document.createElement('textarea');
            tempInput.value = base64;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);

            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (e) {
            console.error("Export failed", e);
        }
    };

    const handleImport = (importString: string) => {
        setImportError("");
        if (!importString) return false;
        try {
            const decoded = decodeURIComponent(escape(atob(importString)));
            const parsed = JSON.parse(decoded);

            // Basic structure validation - check for speeds, weight balance, or emergency checklist data
            const isSpeedsData = parsed.aircraftModel && parsed.speeds;
            const isWeightBalanceData = parsed.aircraft && parsed.positions;
            const isEmergencyData = parsed.aircraft && parsed.sections;

            if (isSpeedsData || isWeightBalanceData || isEmergencyData) {
                saveToLocal(parsed as T);
                return true;
            } else {
                setImportError("Invalid data structure");
                return false;
            }
        } catch (e) {
            setImportError("Invalid Base64 or JSON format");
            console.error("Import failed", e);
            return false;
        }
    };

    const getShareableUrl = () => {
        try {
            const json = JSON.stringify(data);
            const base64 = btoa(unescape(encodeURIComponent(json)));
            const url = `${window.location.origin}${window.location.pathname}?data=${base64}`;
            return url;
        } catch (e) {
            console.error("Failed to generate shareable URL", e);
            return null;
        }
    };

    const copyShareableUrl = async () => {
        const url = getShareableUrl();
        if (!url) return false;

        try {
            await navigator.clipboard.writeText(url);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
            return true;
        } catch {
            // Fallback for older browsers
            const tempInput = document.createElement('textarea');
            tempInput.value = url;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
            return true;
        }
    };

    return {
        data,
        updateField,
        addItem,
        removeItem,
        handleExport,
        handleImport,
        importError,
        copySuccess,
        setImportError,
        getShareableUrl,
        copyShareableUrl
    };
}
