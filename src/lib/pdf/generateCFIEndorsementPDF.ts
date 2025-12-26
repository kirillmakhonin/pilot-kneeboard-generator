import jsPDF from 'jspdf';
import type { CFIEndorsementData } from '../../types';

export const generateCFIEndorsementPDF = (
    data: CFIEndorsementData,
    mode: string, // 'single_2x4' | 'avery'
    labelPosition: number = 1, // 1-10
    averyTemplate: string = '18163'
) => {
    // Dimensions in mm
    // 2x4 inches = 50.8 x 101.6 mm
    const LABEL_WIDTH = 101.6;
    const LABEL_HEIGHT = 50.8;

    // Avery 18163/5163/8163/18663 share the same 2"x4" 2x5 layout.
    const AVERY_TOP_MARGIN = 12.7;
    const AVERY_LEFT_MARGIN = 4.0;
    const AVERY_HORIZ_GUTTER = 4.8;
    const AVERY_VERT_GUTTER = 0;

    let doc: jsPDF;

    const renderRichText = (
        pdf: jsPDF,
        text: string,
        x: number,
        y: number,
        w: number,
        fontSize: number
    ) => {
        pdf.setFontSize(fontSize);
        const lineHeight = fontSize * 0.3527 * 1.2; // pt -> mm

        const renderLine = (lineText: string, startY: number) => {
            const parts = lineText.split(/(\*\*.*?\*\*|\*.*?\*)/g);

            interface Token {
                text: string;
                style: 'bold' | 'italic' | 'normal';
                width: number;
            }

            const tokens: Token[] = [];

            parts.forEach((part) => {
                let style: 'bold' | 'italic' | 'normal' = 'normal';
                let cleanText = part;

                if (part.startsWith('**') && part.endsWith('**')) {
                    style = 'bold';
                    cleanText = part.slice(2, -2);
                } else if (part.startsWith('*') && part.endsWith('*')) {
                    style = 'italic';
                    cleanText = part.slice(1, -1);
                }

                if (style === 'bold') pdf.setFont('helvetica', 'bold');
                else if (style === 'italic') pdf.setFont('helvetica', 'italic');
                else pdf.setFont('helvetica', 'normal');

                // Keep whitespace tokens so wrapping is accurate.
                const words = cleanText.split(/(\s+)/);
                for (const word of words) {
                    if (word.length === 0) continue;
                    tokens.push({
                        text: word,
                        style,
                        width: pdf.getTextWidth(word)
                    });
                }
            });

            const lines: Token[][] = [];
            let currentLine: Token[] = [];
            let currentLineWidth = 0;

            for (const token of tokens) {
                const isSpace = token.text.trim().length === 0;

                if (currentLineWidth + token.width > w && !isSpace) {
                    if (currentLine.length > 0) lines.push(currentLine);
                    currentLine = [];
                    currentLineWidth = 0;
                }

                if (currentLine.length === 0 && isSpace) continue;

                currentLine.push(token);
                currentLineWidth += token.width;
            }
            if (currentLine.length > 0) lines.push(currentLine);

            let cursorY = startY;
            for (const line of lines) {
                let cursorX = x;
                for (const token of line) {
                    if (token.style === 'bold') pdf.setFont('helvetica', 'bold');
                    else if (token.style === 'italic') pdf.setFont('helvetica', 'italic');
                    else pdf.setFont('helvetica', 'normal');

                    pdf.text(token.text, cursorX, cursorY);
                    cursorX += token.width;
                }
                cursorY += lineHeight;
            }

            return cursorY;
        };

        const paragraphs = text.replace(/\r\n/g, '\n').split('\n');
        let cursorY = y;

        for (const line of paragraphs) {
            if (line.trim().length === 0) {
                cursorY += lineHeight;
                continue;
            }
            cursorY = renderLine(line, cursorY);
        }

        return cursorY;
    };

    const drawEndorsement = (pdf: jsPDF, x: number, y: number, w: number, h: number) => {
        const PADDING = 2.5;
        const contentW = w - (PADDING * 2);

        let cursorY = y + PADDING + 3;
        const startX = x + PADDING;

        // Title (wrapped)
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9);
        const title = data.endorsementTitle || 'Endorsement';
        const titleLines = pdf.splitTextToSize(title, contentW);
        const titleLineHeight = 9 * 0.3527 * 1.2;

        titleLines.forEach((line: string) => {
            pdf.text(line, x + (w / 2), cursorY, { align: 'center' });
            cursorY += titleLineHeight;
        });

        cursorY += 1;
        pdf.setLineWidth(0.4);
        pdf.setDrawColor(0);
        pdf.line(startX, cursorY, startX + contentW, cursorY);

        cursorY += 3.5;

        // Body
        pdf.setTextColor(0);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7.5);

        let text = data.endorsementText || '';
        if (data.endorsementType === 'template' && data.fieldValues) {
            Object.entries(data.fieldValues).forEach(([key, value]) => {
                text = text.replace(new RegExp(`\\[${key}\\]`, 'g'), value || `[${key}]`);
            });
        }

        renderRichText(pdf, text, startX, cursorY, contentW, 7.5);

        // Footer
        const footerH = 11;
        const footerY = y + h - PADDING - footerH;

        pdf.setLineWidth(0.15);

        // Date
        pdf.setTextColor(0);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(5.5);
        const dateStr = new Date().toLocaleDateString();
        pdf.text(dateStr, startX + contentW, footerY + 2, { align: 'right' });
        pdf.setTextColor(150);
        pdf.setFontSize(4.5);
        pdf.text('DATE', startX + contentW, footerY + 4, { align: 'right' });

        // Signature line
        pdf.setTextColor(0);
        pdf.setDrawColor(0);
        pdf.line(startX, footerY + 3, startX + (contentW * 0.6), footerY + 3);
        pdf.setTextColor(150);
        pdf.setFontSize(4.5);
        pdf.text('CFI SIGNATURE', startX, footerY + 5.5);

        // Name + certificate
        const bottomRowY = footerY + 8.5;
        pdf.setTextColor(0);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(6.5);
        pdf.text(data.cfiName || '', startX, bottomRowY);
        pdf.text(
            data.cfiNumber ? `${data.cfiNumber} (Exp: ${data.expirationDate})` : '',
            startX + contentW,
            bottomRowY,
            { align: 'right' }
        );

        pdf.setTextColor(150);
        pdf.setFontSize(4.5);
        pdf.text('CFI NAME', startX, bottomRowY + 2);
        pdf.text('CERT. NUMBER', startX + contentW, bottomRowY + 2, { align: 'right' });

        pdf.setTextColor(0);
    };

    if (mode === 'single_2x4') {
        doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: [LABEL_HEIGHT, LABEL_WIDTH]
        });

        drawEndorsement(doc, 0, 0, LABEL_WIDTH, LABEL_HEIGHT);
    } else {
        // avery
        void averyTemplate; // for future: per-template tweaks

        doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'letter'
        });

        const posIndex = Math.min(Math.max(labelPosition, 1), 10) - 1;
        const col = posIndex % 2;
        const row = Math.floor(posIndex / 2);

        const x = AVERY_LEFT_MARGIN + (col * (LABEL_WIDTH + AVERY_HORIZ_GUTTER));
        const y = AVERY_TOP_MARGIN + (row * (LABEL_HEIGHT + AVERY_VERT_GUTTER));

        drawEndorsement(doc, x, y, LABEL_WIDTH, LABEL_HEIGHT);
    }

    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
};
