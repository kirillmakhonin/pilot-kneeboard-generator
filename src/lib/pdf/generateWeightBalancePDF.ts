import jsPDF from 'jspdf';
import type { WeightBalanceData } from '../../types';

export const generateWeightBalancePDF = (data: WeightBalanceData) => {
    // Half Letter portrait dimensions: 5.5" x 8.5" in mm (half of landscape letter)
    const PAGE_WIDTH = 139.7;  // 5.5 inches
    const PAGE_HEIGHT = 215.9; // 8.5 inches

    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [PAGE_WIDTH, PAGE_HEIGHT]
    });

    const margin = 8;
    const contentWidth = PAGE_WIDTH - (margin * 2);

    // Helper function to draw professional table
    const drawProfessionalTable = (startY: number, headers: string[], rows: string[][], columnWidths: number[]) => {
        let currentY = startY;

        // Draw table header with shading
        doc.setFillColor(240, 242, 246);
        doc.rect(margin, currentY, contentWidth, 8, 'F');

        // Draw header borders
        doc.setDrawColor(60, 60, 60);
        doc.setLineWidth(0.8);
        doc.rect(margin, currentY, contentWidth, 8);

        // Draw vertical lines for header
        doc.setLineWidth(0.3);
        let currentX = margin;
        columnWidths.forEach((width, index) => {
            if (index < columnWidths.length - 1) {
                currentX += width;
                doc.line(currentX, currentY, currentX, currentY + 8);
            }
        });

        // Add header text
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(30, 30, 30);
        currentX = margin + 2;
        headers.forEach((header, index) => {
            doc.text(header, currentX, currentY + 5);
            currentX += columnWidths[index];
        });

        currentY += 8;

        // Draw table rows with alternating shading
        rows.forEach((row, rowIndex) => {
            const isShaded = rowIndex % 2 === 1;

            if (isShaded) {
                doc.setFillColor(249, 250, 251);
                doc.rect(margin, currentY, contentWidth, 6, 'F');
            }

            // Draw row borders
            doc.setDrawColor(120, 120, 120);
            doc.setLineWidth(0.3);
            doc.line(margin, currentY, margin + contentWidth, currentY);

            // Draw vertical lines
            let currentX = margin;
            columnWidths.forEach((width, index) => {
                if (index < columnWidths.length - 1) {
                    currentX += width;
                    doc.line(currentX, currentY, currentX, currentY + 6);
                }
            });

            // Add row text
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.setTextColor(40, 40, 40);
            currentX = margin + 2;
            row.forEach((cell, index) => {
                doc.text(cell, currentX, currentY + 4);
                currentX += columnWidths[index];
            });

            currentY += 6;
        });

        // Draw bottom border
        doc.setDrawColor(60, 60, 60);
        doc.setLineWidth(0.8);
        doc.line(margin, currentY, margin + contentWidth, currentY);

        return currentY;
    };

    // Draw professional header
    const drawHeader = () => {
        // Top accent line
        doc.setFillColor(20, 50, 100);
        doc.rect(margin, margin, contentWidth, 2, 'F');

        // Main title area
        doc.setFillColor(245, 247, 250);
        doc.rect(margin, margin + 2, contentWidth, 14, 'F');

        // Bottom border
        doc.setDrawColor(20, 50, 100);
        doc.setLineWidth(0.8);
        doc.line(margin, margin + 16, margin + contentWidth, margin + 16);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.setTextColor(20, 50, 100);
        doc.text('WEIGHT AND BALANCE FORM', margin + contentWidth / 2, margin + 9, { align: 'center' });

        // Subtitle
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        doc.text('AIRCRAFT LOADING CALCULATION', margin + contentWidth / 2, margin + 13, { align: 'center' });
    };

    // Draw section header with underline
    const drawSectionHeader = (y: number, title: string) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(20, 50, 100);
        doc.text(title, margin, y);

        doc.setDrawColor(20, 50, 100);
        doc.setLineWidth(0.5);
        doc.line(margin, y + 1.5, margin + contentWidth, y + 1.5);

        return y + 5;
    };

    // Draw aircraft information section
    const drawAircraftInfo = (startY: number) => {
        let currentY = drawSectionHeader(startY, 'AIRCRAFT INFORMATION');

        // Helper to draw a clean labeled field
        const drawField = (x: number, y: number, width: number, label: string, value: string) => {
            const fieldHeight = 9;

            // Clean white background with subtle border
            doc.setFillColor(255, 255, 255);
            doc.rect(x, y, width, fieldHeight, 'F');
            doc.setDrawColor(180, 180, 180);
            doc.setLineWidth(0.3);
            doc.rect(x, y, width, fieldHeight);

            // Label (uppercase, small)
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(5.5);
            doc.setTextColor(100, 100, 100);
            doc.text(label.toUpperCase(), x + 1.5, y + 3);

            // Value
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8);
            doc.setTextColor(30, 30, 30);
            doc.text(value, x + 1.5, y + 7);

            return fieldHeight;
        };

        const fieldHeight = 9;
        const gap = 1;
        const col3Width = (contentWidth - gap * 2) / 3;
        const col2Width = (contentWidth - gap) / 2;

        // Row 1: Aircraft, Tail Number, Date (3 columns)
        drawField(margin, currentY, col3Width, 'Aircraft', data.aircraft);
        drawField(margin + col3Width + gap, currentY, col3Width, 'Tail Number', data.tailNumber);
        drawField(margin + (col3Width + gap) * 2, currentY, col3Width, 'Date', data.date);
        currentY += fieldHeight + gap;

        // Row 2: Make/Model, Category (2 columns)
        drawField(margin, currentY, col2Width, 'Make/Model', data.makeModel);
        drawField(margin + col2Width + gap, currentY, col2Width, 'Category', data.category);
        currentY += fieldHeight + gap;

        // Row 3: Max Takeoff Weight, Reference Datum (2 columns)
        drawField(margin, currentY, col2Width, 'Max Takeoff Weight (lbs)', data.maxTakeoffWeight);
        drawField(margin + col2Width + gap, currentY, col2Width, 'Reference Datum (in)', data.referenceDatum);
        currentY += fieldHeight;

        return currentY + 6;
    };

    // Draw weight and balance table
    const drawWeightBalanceTable = (startY: number) => {
        let currentY = drawSectionHeader(startY, 'WEIGHT AND BALANCE DATA');

        // Prepare table data with portrait-optimized columns
        const headers = ['POSITION', 'WEIGHT', 'ARM', 'MOMENT'];
        const columnWidths = [50, 25, 25, 30]; // Optimized for 5.5" width

        const rows = data.positions.map(position => [
            position.name.length > 15 ? position.name.substring(0, 15) + '...' : position.name,
            position.weight,
            position.arm,
            position.moment
        ]);

        // Calculate totals
        const totalWeight = data.positions.reduce((sum, pos) => sum + (parseFloat(pos.weight) || 0), 0);
        const totalMoment = data.positions.reduce((sum, pos) => sum + (parseFloat(pos.moment) || 0), 0);
        const cg = totalWeight > 0 ? (totalMoment / totalWeight).toFixed(1) : "0.0";

        // Draw main table
        currentY = drawProfessionalTable(currentY, headers, rows, columnWidths);
        currentY += 5;

        // Draw totals section with emphasis
        doc.setFillColor(240, 242, 246);
        doc.rect(margin, currentY, contentWidth, 8, 'F');

        doc.setDrawColor(60, 60, 60);
        doc.setLineWidth(0.8);
        doc.rect(margin, currentY, contentWidth, 8);

        // Draw vertical lines for totals
        doc.setLineWidth(0.3);
        let currentX = margin;
        columnWidths.forEach((width, index) => {
            if (index < columnWidths.length - 1) {
                currentX += width;
                doc.line(currentX, currentY, currentX, currentY + 8);
            }
        });

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(30, 30, 30);

        const totalsRow = ['TOTALS', totalWeight.toFixed(1), `CG: ${cg}`, totalMoment.toFixed(1)];
        currentX = margin + 2;
        totalsRow.forEach((cell, index) => {
            doc.text(cell, currentX, currentY + 5);
            currentX += columnWidths[index];
        });

        return currentY + 12;
    };

    // Draw notes section
    const drawNotes = (startY: number) => {
        let currentY = drawSectionHeader(startY, 'NOTES & CERTIFICATION');

        // Notes box with professional styling
        doc.setFillColor(252, 252, 252);
        doc.rect(margin, currentY, contentWidth, 22, 'F');
        doc.setDrawColor(180, 180, 180);
        doc.setLineWidth(0.3);
        doc.rect(margin, currentY, contentWidth, 22);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6);
        doc.setTextColor(60, 60, 60);

        const notes = [
            '1. Verify all weights with actual measurements before flight.',
            '2. Ensure aircraft is within weight and balance limits per POH/AFM.',
            '3. Consult qualified instructor for unfamiliar aircraft configurations.',
            '4. This form is for reference only — official documentation takes precedence.'
        ];

        notes.forEach((note, index) => {
            doc.text(note, margin + 2, currentY + 4 + (index * 4.5));
        });

        return currentY + 25;
    };

    // Build the document
    let currentY = margin;

    // Header
    drawHeader();
    currentY += 25;

    // Aircraft Information
    currentY = drawAircraftInfo(currentY);

    // Weight & Balance Table
    currentY = drawWeightBalanceTable(currentY);

    // Notes section
    currentY = drawNotes(currentY);

    // Professional footer
    const footerY = currentY + 3;

    if (footerY + 8 < PAGE_HEIGHT) {
        doc.setDrawColor(20, 50, 100);
        doc.setLineWidth(0.5);
        doc.line(margin, footerY, margin + contentWidth, footerY);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6);
        doc.setTextColor(100, 100, 100);
        doc.text(data.footer, margin, footerY + 4);
        doc.text('Weight & Balance Form', margin + contentWidth, footerY + 4, { align: 'right' });
    }

    // Generate blob and open in new tab for preview
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // Open in new tab for preview only (no auto-download)
    window.open(pdfUrl, '_blank');
};
