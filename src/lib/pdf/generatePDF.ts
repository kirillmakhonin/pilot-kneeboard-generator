import jsPDF from 'jspdf';
import type { AircraftData } from '../../types';
import { drawPageBorder, addFooter, addSectionHeader, addRowWithDots, drawCutMarks } from './pdfUtils';

// Rich text rendering function for **bold** text in PDF
const renderRichText = (doc: jsPDF, text: string, x: number, y: number, maxWidth: number, fontSize: number) => {
    if (!text) return y;

    doc.setFontSize(fontSize);
    const lineHeight = fontSize * 0.3527 * 1.2; // pt -> mm

    // Split text by **bold** patterns
    const parts = text.split(/(\*\*.*?\*\*)/g);

    let currentX = x;
    let currentY = y;

    const addNewLine = () => {
        currentX = x;
        currentY += lineHeight;
    };

    for (const part of parts) {
        if (part.startsWith('**') && part.endsWith('**')) {
            // Bold text
            const boldText = part.slice(2, -2);
            const boldLines = boldText.split(/\r?\n/);

            for (let i = 0; i < boldLines.length; i++) {
                const boldLine = boldLines[i];
                doc.setFont('helvetica', 'bold');

                if (boldLine) {
                    // Check if this text fits on the current line
                    const textWidth = doc.getTextWidth(boldLine);
                    if (currentX + textWidth > x + maxWidth) {
                        addNewLine();
                    }

                    doc.text(boldLine, currentX, currentY);
                    currentX += textWidth;
                }

                if (i < boldLines.length - 1) {
                    addNewLine();
                }
            }
        } else {
            // Regular text
            const regularLines = part.split(/\r?\n/);

            for (let i = 0; i < regularLines.length; i++) {
                const regularLine = regularLines[i];
                doc.setFont('helvetica', 'normal');

                if (regularLine.trim()) {
                    // Split regular text into words to handle wrapping
                    const words = regularLine.split(' ');
                    for (const word of words) {
                        const wordWithSpace = word + (word === words[words.length - 1] ? '' : ' ');
                        const textWidth = doc.getTextWidth(wordWithSpace);

                        if (currentX + textWidth > x + maxWidth) {
                            addNewLine();
                        }

                        doc.text(wordWithSpace, currentX, currentY);
                        currentX += textWidth;
                    }
                }

                if (i < regularLines.length - 1) {
                    addNewLine();
                }
            }
        }
    }

    return currentY + lineHeight;
};

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
                // Show type if present
                if (section.type) {
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(isCombo ? 6 : 6.5);
                    doc.setTextColor(0, 0, 139); // Blue color for type
                    doc.text(section.type.toUpperCase(), xOffset + 6, y);
                    y += 3.5;
                    doc.setTextColor(0); // Reset to black
                }

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
                const content = section.content || section.steps || ''; // Fallback for backward compatibility
                y = renderRichText(doc, content, xOffset + 6, y, STRIP_WIDTH - 10, isCombo ? 8 : 8.5);
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
