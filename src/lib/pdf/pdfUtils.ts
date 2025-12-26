import jsPDF from 'jspdf';

export const drawPageBorder = (doc: jsPDF, xOffset: number, stripWidth: number, stripHeight: number) => {
    doc.setDrawColor(40, 40, 40);
    doc.setLineWidth(0.4);
    doc.rect(xOffset + 2, 2, stripWidth - 4, stripHeight - 4);
};

export const addFooter = (doc: jsPDF, currentPage: number, xOffset: number, stripWidth: number, stripHeight: number, footer: string) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(`${footer} | Page ${currentPage}`, xOffset + (stripWidth / 2), stripHeight - 6, { align: 'center' });
    doc.setTextColor(40);
};

export const addSectionHeader = (doc: jsPDF, text: string, currentY: number, xOffset: number, stripWidth: number, mode: 'individual' | 'combo', isEmergency = false) => {
    const isCombo = mode === 'combo';
    const headerHeight = isCombo ? 6 : 7;
    doc.setFillColor(isEmergency ? 255 : 242, isEmergency ? 235 : 242, isEmergency ? 235 : 242);
    doc.rect(xOffset + 5, currentY - 4, stripWidth - 10, headerHeight, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(isCombo ? 10 : 11);
    doc.setTextColor(isEmergency ? 180 : 40, 0, 0);

    const lines = doc.splitTextToSize(text.toUpperCase(), stripWidth - 10);
    let headerY = currentY;
    lines.forEach((line: string) => {
        doc.text(line, xOffset + (stripWidth / 2), headerY + (lines.length === 1 ? 0.5 : -1), { align: 'center' });
        if (lines.length > 1) headerY += 3;
    });

    doc.setTextColor(40);
    return currentY + (isCombo ? 7 : 8);
};

export const addRowWithDots = (doc: jsPDF, label: string, value: string, currentY: number, xOffset: number, stripWidth: number, mode: 'individual' | 'combo') => {
    const isCombo = mode === 'combo';
    const normalSize = isCombo ? 8 : 8.5;
    const subSize = isCombo ? 6 : 6.5;
    const spacing = isCombo ? 5 : 5.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(normalSize);

    let cursorX = xOffset + 6;
    const labelParts = label.split(/([A-Za-z0-9]+_[A-Za-z0-9]+)/g);

    labelParts.forEach(part => {
        if (part.includes('_')) {
            const [base, sub] = part.split('_');
            doc.setFontSize(normalSize);
            doc.text(base, cursorX, currentY);
            cursorX += doc.getTextWidth(base);
            doc.setFontSize(subSize);
            doc.setFont('helvetica', 'bold');
            doc.text(sub, cursorX + 0.1, currentY + 0.6);
            cursorX += doc.getTextWidth(sub) + 0.2;
            doc.setFont('helvetica', 'normal');
        } else {
            doc.setFontSize(normalSize);
            doc.text(part, cursorX, currentY);
            cursorX += doc.getTextWidth(part);
        }
    });

    doc.setFontSize(normalSize);
    const valueWidth = doc.getTextWidth(value);
    const dotsAreaWidth = (xOffset + stripWidth - 6) - cursorX - valueWidth - 4;

    if (dotsAreaWidth > 0) {
        doc.setTextColor(180);
        const dotChar = ".";
        const dotWidth = doc.getTextWidth(dotChar);
        const numDots = Math.floor(dotsAreaWidth / dotWidth);
        let dots = "";
        for (let i = 0; i < numDots; i++) dots += dotChar;
        doc.text(dots, cursorX + 2, currentY);
        doc.setTextColor(40);
    }

    doc.setFont('helvetica', 'bold');
    doc.text(value, xOffset + stripWidth - 6, currentY, { align: 'right' });
    return currentY + spacing;
};

export const drawCutMarks = (doc: jsPDF, stripWidth: number, letterHeight: number) => {
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.1);
    doc.setLineDashPattern([2, 2], 0);
    doc.line(stripWidth, 0, stripWidth, letterHeight);
    doc.line(stripWidth * 2, 0, stripWidth * 2, letterHeight);
    doc.setLineDashPattern([], 0);
};
