import jsPDF from 'jspdf';
import type { FlightPlanData } from '../../types';

export const generateFlightPlanPDF = (data: FlightPlanData, mode: 'download' | 'preview' = 'download') => {
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
        doc.rect(margin, currentY, contentWidth, 7, 'F');

        // Draw header borders
        doc.setDrawColor(60, 60, 60);
        doc.setLineWidth(0.8);
        doc.rect(margin, currentY, contentWidth, 7);

        // Draw vertical lines for header
        doc.setLineWidth(0.3);
        let currentX = margin;
        columnWidths.forEach((width, index) => {
            if (index < columnWidths.length - 1) {
                currentX += width;
                doc.line(currentX, currentY, currentX, currentY + 7);
            }
        });

        // Add header text
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(30, 30, 30);
        currentX = margin + 2;
        headers.forEach((header, index) => {
            doc.text(header, currentX, currentY + 4.5);
            currentX += columnWidths[index];
        });

        currentY += 7;

        // Draw table rows with alternating shading
        rows.forEach((row, rowIndex) => {
            const isShaded = rowIndex % 2 === 1;

            if (isShaded) {
                doc.setFillColor(249, 250, 251);
                doc.rect(margin, currentY, contentWidth, 5, 'F');
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
                    doc.line(currentX, currentY, currentX, currentY + 5);
                }
            });

            // Add row text
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7);
            doc.setTextColor(40, 40, 40);
            currentX = margin + 2;
            row.forEach((cell, index) => {
                doc.text(cell, currentX, currentY + 3.5);
                currentX += columnWidths[index];
            });

            currentY += 5;
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
        doc.text('VFR FLIGHT PLAN', margin + contentWidth / 2, margin + 9, { align: 'center' });

        // Subtitle
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        doc.text('VISUAL FLIGHT RULES NAVIGATION LOG', margin + contentWidth / 2, margin + 13, { align: 'center' });
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

    // Draw airport information
    const drawAirports = (startY: number) => {
        let currentY = drawSectionHeader(startY, 'AIRPORT INFORMATION');

        // Helper to draw airport info
        const drawAirportInfo = (x: number, y: number, title: string, airport: any) => {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8);
            doc.setTextColor(20, 50, 100);
            doc.text(title, x, y);

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(7);
            doc.setTextColor(40, 40, 40);

            const fields = [
                ['Code:', airport.code],
                ['Elevation:', airport.elevation],
                ['WX:', airport.wxFreq],
                ['Approach:', airport.approachFreq],
                ['Tower:', airport.towerFreq],
                ['Ground:', airport.groundFreq],
                ['CTAF:', airport.ctafFreq],
                ['FSS:', airport.fssFreq],
                ['UNICOM:', airport.unicomFreq]
            ];

            fields.forEach(([label, value], index) => {
                doc.text(`${label} ${value || '--'}`, x, y + 4 + (index * 3));
            });

            return 32; // Height of airport info
        };

        const airportHeight = drawAirportInfo(margin, currentY, 'DEPARTURE', data.departure);
        const arrivalHeight = drawAirportInfo(margin + contentWidth / 2 + 5, currentY, 'ARRIVAL', data.arrival);

        return currentY + Math.max(airportHeight, arrivalHeight) + 5;
    };

    // Draw performance planning
    const drawPerformance = (startY: number) => {
        let currentY = drawSectionHeader(startY, 'PERFORMANCE PLANNING');

        // Climb Planning
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(20, 50, 100);
        doc.text('CLIMB', margin, currentY);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(40, 40, 40);
        doc.text(`Cruise Alt: ${data.climb.cruiseAlt || '--'}`, margin + 20, currentY);
        doc.text(`Field Elev: ${data.climb.fieldElev || '--'}`, margin + 65, currentY);
        currentY += 3;
        doc.text(`Climb FPM: ${data.climb.climbFpm || '--'}`, margin + 20, currentY);
        doc.text(`Climb GPH: ${data.climb.climbGph || '--'}`, margin + 65, currentY);

        // Cruise Planning
        currentY += 4;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(20, 50, 100);
        doc.text('CRUISE', margin, currentY);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(40, 40, 40);
        doc.text(`Power: ${data.cruise.powerPercent || '--'}%`, margin + 20, currentY);
        doc.text(`Manifold: ${data.cruise.manifoldPressure || '--'}`, margin + 65, currentY);
        currentY += 3;
        doc.text(`RPM: ${data.cruise.rpm || '--'}`, margin + 20, currentY);
        doc.text(`GPH: ${data.cruise.gph || '--'}`, margin + 65, currentY);
        currentY += 3;
        doc.text(`TAS: ${data.cruise.tas || '--'}`, margin + 20, currentY);

        // Descent Planning
        currentY += 4;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(20, 50, 100);
        doc.text('DESCENT', margin, currentY);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(40, 40, 40);
        doc.text(`Descent Rate: ${data.descent.descentRate || '--'} FPM`, margin + 20, currentY);

        return currentY + 8;
    };

    // Draw flight legs table
    const drawFlightLegs = (startY: number) => {
        let currentY = drawSectionHeader(startY, 'FLIGHT LEGS');

        const headers = ['WAYPOINT', 'VOR', 'ALT', 'WIND', 'TEMP', 'TAS', 'TC', 'MH', 'HDG', 'GS', 'DIST', 'ETE'];
        const columnWidths = [18, 12, 10, 10, 8, 8, 8, 8, 8, 8, 8, 8];

        const rows = data.legs.map(leg => [
            leg.name || '',
            leg.vorFreq || '',
            leg.altitude || '',
            `${leg.windDirection || ''}°${leg.windVelocity || ''}`,
            leg.temperature || '',
            leg.tas || '',
            leg.trueCourse || '',
            leg.magneticHeading || '',
            leg.heading || '',
            leg.groundSpeed || '',
            leg.distance || '',
            leg.ete || ''
        ]);

        currentY = drawProfessionalTable(currentY, headers, rows, columnWidths);

        return currentY + 5;
    };

    // Build the document
    let currentY = margin;

    // Header
    drawHeader();
    currentY += 25;

    // Airport Information
    currentY = drawAirports(currentY);

    // Performance Planning
    currentY = drawPerformance(currentY);

    // Flight Legs
    currentY = drawFlightLegs(currentY);

    // Footer
    const footerY = currentY + 3;

    if (footerY + 8 < PAGE_HEIGHT) {
        doc.setDrawColor(20, 50, 100);
        doc.setLineWidth(0.5);
        doc.line(margin, footerY, margin + contentWidth, footerY);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(6);
        doc.setTextColor(100, 100, 100);
        doc.text(data.footer, margin, footerY + 4);
        doc.text('VFR Flight Plan', margin + contentWidth, footerY + 4, { align: 'right' });
    }

    // Generate the PDF
    if (mode === 'download') {
        doc.save(`flight-plan-${data.departure.code || 'departure'}-${data.arrival.code || 'arrival'}.pdf`);
    } else {
        return doc.output('blob');
    }
};
