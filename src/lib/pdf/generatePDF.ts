import jsPDF from 'jspdf';
import type { AircraftData } from '../../types';
import { drawPageBorder, addFooter, addSectionHeader, addRowWithDots, drawCutMarks } from './pdfUtils';

export const generateSpeedsBriefingPDF = (data: AircraftData, mode: 'individual' | 'combo' = 'individual') => {
    // US Letter dimensions in mm
    const LETTER_WIDTH_LANDSCAPE = 279.4;
    const LETTER_HEIGHT_LANDSCAPE = 215.9;

    const STRIP_WIDTH = mode === 'combo' ? (LETTER_WIDTH_LANDSCAPE / 3) : 72;
    const STRIP_HEIGHT = mode === 'combo' ? LETTER_HEIGHT_LANDSCAPE : 280;

    const doc = new jsPDF({
        orientation: mode === 'combo' ? 'landscape' : 'portrait',
        unit: 'mm',
        format: mode === 'combo' ? 'letter' : [STRIP_WIDTH, STRIP_HEIGHT]
    });

    const drawSpeedsPage = (xOffset: number) => {
        const isCombo = mode === 'combo';
        let y = isCombo ? 8 : 10;
        drawPageBorder(doc, xOffset, STRIP_WIDTH, STRIP_HEIGHT);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(isCombo ? 11 : 13);
        doc.text(data.aircraftModel, xOffset + (STRIP_WIDTH / 2), y + 4, { align: 'center' });
        y += (isCombo ? 9 : 12);

        y = addSectionHeader(doc, "AIRSPEEDS", y, xOffset, STRIP_WIDTH, mode);
        if (data.speeds) data.speeds.forEach(item => { y = addRowWithDots(doc, item.label, item.value, y, xOffset, STRIP_WIDTH, mode); });

        y += (isCombo ? 2 : 4);
        y = addSectionHeader(doc, "TAKEOFF", y, xOffset, STRIP_WIDTH, mode);
        if (data.takeoff) data.takeoff.forEach(item => { y = addRowWithDots(doc, item.label, item.value, y, xOffset, STRIP_WIDTH, mode); });

        y += (isCombo ? 2 : 4);
        y = addSectionHeader(doc, "LANDING", y, xOffset, STRIP_WIDTH, mode);
        if (data.landing) data.landing.forEach(item => { y = addRowWithDots(doc, item.label, item.value, y, xOffset, STRIP_WIDTH, mode); });

        y += (isCombo ? 2 : 4);
        y = addSectionHeader(doc, "EMERGENCY OPERATIONS", y, xOffset, STRIP_WIDTH, mode, true);
        if (data.emergency) data.emergency.forEach(item => { y = addRowWithDots(doc, item.label, item.value, y, xOffset, STRIP_WIDTH, mode); });

        addFooter(doc, 1, xOffset, STRIP_WIDTH, STRIP_HEIGHT, data.footer);
    };

    const drawBriefingPage = (xOffset: number) => {
        const isCombo = mode === 'combo';
        let y = isCombo ? 8 : 10;
        drawPageBorder(doc, xOffset, STRIP_WIDTH, STRIP_HEIGHT);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(isCombo ? 10 : 11);
        doc.text(data.aircraftModel, xOffset + (STRIP_WIDTH / 2), y + 4, { align: 'center' });
        y += (isCombo ? 8 : 10);

        y = addSectionHeader(doc, "PRE-TAKEOFF BRIEFING", y, xOffset, STRIP_WIDTH, mode);
        if (data.briefing) {
            data.briefing.forEach(section => {
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(isCombo ? 7 : 7.5);
                const titleLines = doc.splitTextToSize(section.title.toUpperCase(), STRIP_WIDTH - 10);
                titleLines.forEach((line: string) => {
                    doc.text(line, xOffset + (STRIP_WIDTH / 2), y, { align: 'center' });
                    y += 3.2;
                });

                y += 1;
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(isCombo ? 7 : 7.5);
                const stepLines = doc.splitTextToSize(section.steps, STRIP_WIDTH - 10);
                stepLines.forEach((line: string) => {
                    doc.text(line, xOffset + 6, y);
                    y += 3.2;
                });
                y += (isCombo ? 3 : 5);
            });
        }
        addFooter(doc, 2, xOffset, STRIP_WIDTH, STRIP_HEIGHT, data.footer);
    };

    if (mode === 'combo') {
        drawSpeedsPage(0);
        drawSpeedsPage(STRIP_WIDTH);
        drawSpeedsPage(STRIP_WIDTH * 2);
        drawCutMarks(doc, STRIP_WIDTH, LETTER_HEIGHT_LANDSCAPE);

        doc.addPage('letter', 'landscape');
        drawBriefingPage(0);
        drawBriefingPage(STRIP_WIDTH);
        drawBriefingPage(STRIP_WIDTH * 2);
        drawCutMarks(doc, STRIP_WIDTH, LETTER_HEIGHT_LANDSCAPE);
    } else {
        drawSpeedsPage(0);
        doc.addPage([STRIP_WIDTH, STRIP_HEIGHT], 'portrait');
        drawBriefingPage(0);
    }

    // Generate blob and open in new tab for preview
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // Open in new tab for preview only (no auto-download)
    window.open(pdfUrl, '_blank');
};
