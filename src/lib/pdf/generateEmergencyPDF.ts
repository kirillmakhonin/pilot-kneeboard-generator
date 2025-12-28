import jsPDF from 'jspdf';
import type {
    EmergencyChecklistData,
    EmergencyChecklistSection,
    EmergencyChecklistScript,
    EmergencyChecklistItemOrGroup,
    EmergencyChecklistItem
} from '../../types';

// Half letter size in mm (5.5" x 8.5")
const PAGE_WIDTH = 139.7;
const PAGE_HEIGHT = 215.9;
const MARGIN = 8;
const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2);
const COLUMN_WIDTH = (CONTENT_WIDTH - 4) / 2; // 4mm gap between columns
const FOOTER_HEIGHT = 12;
const SHEET_WIDTH = 279.4;
const SHEET_HEIGHT = 215.9;

interface RenderContext {
    doc: jsPDF;
    currentY: number;
    currentPage: number;
    columnX: number;
    isEmergencyType: boolean;
    headerText: string;
    footer: string;
    xOffset: number;
    sheetWidth: number;
    sheetHeight: number;
    allowAddPages: boolean;
}

const getTypeColor = (isEmergency: boolean): [number, number, number] => {
    return isEmergency ? [220, 38, 38] : [217, 119, 6]; // red-600 or amber-600
};

const getTypeBgColor = (isEmergency: boolean): [number, number, number] => {
    return isEmergency ? [220, 38, 38] : [217, 119, 6]; // red-600 or amber-600
};

const getTypeTextColor = (isEmergency: boolean): [number, number, number] => {
    return isEmergency ? [255, 255, 255] : [255, 255, 255]; // white
};

const checkPageBreak = (ctx: RenderContext, neededHeight: number): boolean => {
    if (ctx.currentY + neededHeight > PAGE_HEIGHT - FOOTER_HEIGHT - MARGIN) {
        addFooter(ctx);

        if (ctx.allowAddPages) {
            ctx.doc.addPage([ctx.sheetWidth, ctx.sheetHeight]);
        } else {
            ctx.doc.setPage(ctx.currentPage + 1);
        }
        ctx.currentPage++;
        ctx.currentY = MARGIN + 8;
        drawHeaderRepeat(ctx);
        ctx.currentY = MARGIN + 12;
        return true;
    }
    return false;
};

// Estimate height of a script to avoid page breaks mid-script
const estimateScriptHeight = (script: EmergencyChecklistScript, showHeader: boolean): number => {
    let height = 0;

    const estimateItemHeight = (item: EmergencyChecklistItem): number => {
        if (item.type === 'INFO') {
            const titleLines = Math.max(1, Math.ceil(item.title.length / 28));
            const contentLines = item.content ? Math.ceil(item.content.length / 32) : 0;
            return (titleLines * 3.5) + (contentLines * 3.2) + 2;
        }

        if (item.type === 'CONDITION') {
            const lines = Math.max(1, Math.ceil(item.title.length / 32));
            return (lines * 3.5) + 1;
        }

        return 5;
    };

    // Header
    if (showHeader && script.title) {
        height += 6;
    }

    // Steps
    script.steps.forEach((step) => {
        if (step.type === 'ITEM' && step.item) {
            height += estimateItemHeight(step.item);
        } else if (step.type === 'GROUP' && step.group) {
            const groupTitleHeight = step.group.title ? 5 : 0;
            const groupItemsHeight = step.group.items.reduce((sum, item) => sum + estimateItemHeight(item), 0);
            height += groupTitleHeight + groupItemsHeight + 2;
        }
    });

    // Internal code footer
    if (script.internalCode) {
        height += 6;
    }

    return height;
};

// Estimate height of entire section (header + all scripts)
const estimateSectionHeight = (section: EmergencyChecklistSection): number => {
    let height = 10; // Section header (~8) + spacing (~2)

    if (section.scripts.length === 1) {
        // Single script - no script header
        height += estimateScriptHeight(section.scripts[0], false);
    } else {
        // Multiple scripts - each has header, but they go in columns
        // Return max height of any single script (they're side by side)
        const scriptHeights = section.scripts.map(s => estimateScriptHeight(s, true));
        height += Math.max(...scriptHeights);
    }

    return height;
};

const addFooter = (ctx: RenderContext) => {
    const { doc, footer } = ctx;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(120);
    doc.text(footer, ctx.xOffset + (PAGE_WIDTH / 2), PAGE_HEIGHT - 6, { align: 'center' });
    doc.setTextColor(40);
};

const drawHeaderRepeat = (ctx: RenderContext) => {
    const { doc, headerText } = ctx;
    const [r, g, b] = getTypeColor(true);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(r, g, b);
    doc.text(headerText.toUpperCase(), ctx.xOffset + (PAGE_WIDTH / 2), MARGIN + 3, { align: 'center' });
    doc.setTextColor(40);
};

const drawCenterCutMark = (doc: jsPDF, x: number, sheetHeight: number) => {
    doc.setDrawColor(180, 180, 180);
    doc.setLineWidth(0.1);
    doc.setLineDashPattern([2, 2], 0);
    doc.line(x, 0, x, sheetHeight);
    doc.setLineDashPattern([], 0);
};

const renderEmergencyDocument = (
    doc: jsPDF,
    data: EmergencyChecklistData,
    mode: 'preview' | 'build',
    xOffset: number,
    sheetWidth: number,
    sheetHeight: number,
    allowAddPages: boolean
) => {
    doc.setFont('helvetica');

    let currentY = MARGIN;
    let currentPage = 1;

    const headerText = [data.aircraft, data.tailNumber]
        .filter(Boolean)
        .join(' • ');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    const [r, g, b] = getTypeColor(true);
    doc.setTextColor(r, g, b);

    const headerSpacing = 4;
    const headerWidth = doc.getTextWidth(headerText.toUpperCase());
    const availableWidth = CONTENT_WIDTH;
    const repeatCount = Math.floor((availableWidth + headerSpacing) / (headerWidth + headerSpacing));
    const totalWidth = repeatCount * headerWidth + (repeatCount - 1) * headerSpacing;
    const startX = xOffset + MARGIN + (CONTENT_WIDTH - totalWidth) / 2;

    for (let i = 0; i < repeatCount; i++) {
        const x = startX + i * (headerWidth + headerSpacing) + headerWidth / 2;
        doc.text(headerText.toUpperCase(), x, currentY + 3, { align: 'center' });
    }
    currentY += 8;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(36);
    const [headerR, headerG, headerB] = getTypeColor(true);
    doc.setTextColor(headerR, headerG, headerB);
    doc.text('IMMEDIATE ACTION', xOffset + (PAGE_WIDTH / 2), currentY + 7.5, { align: 'center' });
    doc.text('IMMEDIATE ACTION', xOffset + (PAGE_WIDTH / 2), currentY + 7.5, { align: 'center' });
    currentY += 10;

    doc.setTextColor(40);

    const leftColumnX = xOffset + MARGIN;
    const rightColumnX = xOffset + MARGIN + COLUMN_WIDTH + 4;
    let leftColumnY = currentY;
    let rightColumnY = currentY;
    let useLeftColumn = true;

    data.sections.forEach((section) => {
        const isEmergency = section.type === 'EMERGENCY';
        const hasMultipleScripts = section.scripts.length > 1;

        if (hasMultipleScripts) {
            const maxY = Math.max(leftColumnY, rightColumnY);
            leftColumnY = maxY + 2;
            rightColumnY = maxY + 2;
            useLeftColumn = true;
        }

        if (!hasMultipleScripts) {
            const columnX = useLeftColumn ? leftColumnX : rightColumnX;
            const columnY = useLeftColumn ? leftColumnY : rightColumnY;

            const ctx: RenderContext = {
                doc,
                currentY: columnY,
                currentPage,
                columnX,
                isEmergencyType: isEmergency,
                headerText,
                footer: data.footer,
                xOffset,
                sheetWidth,
                sheetHeight,
                allowAddPages
            };

            const sectionHeight = estimateSectionHeight(section);
            checkPageBreak(ctx, sectionHeight);

            const newY = drawSection(ctx, section, COLUMN_WIDTH);

            if (useLeftColumn) {
                leftColumnY = newY + 2;
            } else {
                rightColumnY = newY + 2;
            }
            useLeftColumn = !useLeftColumn;
            currentPage = ctx.currentPage;
        } else {
            const ctx: RenderContext = {
                doc,
                currentY: leftColumnY,
                currentPage,
                columnX: leftColumnX,
                isEmergencyType: isEmergency,
                headerText,
                footer: data.footer,
                xOffset,
                sheetWidth,
                sheetHeight,
                allowAddPages
            };

            const sectionHeight = estimateSectionHeight(section);
            checkPageBreak(ctx, sectionHeight);
            leftColumnY = ctx.currentY;
            rightColumnY = ctx.currentY;

            drawSectionHeader(ctx, section.title, CONTENT_WIDTH, isEmergency);
            leftColumnY = ctx.currentY + 2;
            rightColumnY = ctx.currentY + 2;

            section.scripts.forEach((script, idx) => {
                const isLeft = idx % 2 === 0;
                const columnX = isLeft ? leftColumnX : rightColumnX;
                const columnY = isLeft ? leftColumnY : rightColumnY;

                const scriptCtx: RenderContext = {
                    doc,
                    currentY: columnY,
                    currentPage: ctx.currentPage,
                    columnX,
                    isEmergencyType: isEmergency,
                    headerText,
                    footer: data.footer,
                    xOffset,
                    sheetWidth,
                    sheetHeight,
                    allowAddPages
                };

                checkPageBreak(scriptCtx, 30);

                const newY = drawScript(scriptCtx, script, COLUMN_WIDTH, true);

                if (isLeft) {
                    leftColumnY = newY + 1;
                } else {
                    rightColumnY = newY + 1;
                }
                currentPage = scriptCtx.currentPage;
            });

            const maxY = Math.max(leftColumnY, rightColumnY);
            leftColumnY = maxY + 2;
            rightColumnY = maxY + 2;
            useLeftColumn = true;
            currentPage = ctx.currentPage;
        }
    });

    const finalCtx: RenderContext = {
        doc,
        currentY: Math.max(leftColumnY, rightColumnY),
        currentPage,
        columnX: leftColumnX,
        isEmergencyType: true,
        headerText,
        footer: data.footer,
        xOffset,
        sheetWidth,
        sheetHeight,
        allowAddPages
    };
    addFooter(finalCtx);

    if (mode === 'preview') {
        return;
    }
};

export const generateEmergencyPDF = (
    data: EmergencyChecklistData,
    mode: 'preview' | 'build' = 'build',
    layout: 'single' | 'combo' = 'single'
): string | null => {
    const isCombo = layout === 'combo';
    const doc = new jsPDF({
        orientation: isCombo ? 'landscape' : 'portrait',
        unit: 'mm',
        format: isCombo ? 'letter' : [PAGE_WIDTH, PAGE_HEIGHT]
    });

    renderEmergencyDocument(doc, data, mode, 0, isCombo ? SHEET_WIDTH : PAGE_WIDTH, isCombo ? SHEET_HEIGHT : PAGE_HEIGHT, true);

    if (isCombo) {
        doc.setPage(1);
        renderEmergencyDocument(doc, data, mode, PAGE_WIDTH, SHEET_WIDTH, SHEET_HEIGHT, false);

        const pagesAfter = doc.getNumberOfPages();
        for (let page = 1; page <= pagesAfter; page++) {
            doc.setPage(page);
            drawCenterCutMark(doc, PAGE_WIDTH, SHEET_HEIGHT);
        }
    }

    if (mode === 'preview') {
        return doc.output('datauristring');
    }

    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    window.open(url, '_blank');
    return null;
};

const drawSection = (
    ctx: RenderContext,
    section: EmergencyChecklistSection,
    width: number
): number => {
    const isEmergency = section.type === 'EMERGENCY';

    // Section header
    drawSectionHeader(ctx, section.title, width, isEmergency);
    ctx.currentY += 2;

    // Single script (no script header needed)
    if (section.scripts.length === 1) {
        return drawScript(ctx, section.scripts[0], width, false);
    }

    // Multiple scripts
    section.scripts.forEach((script) => {
        ctx.currentY = drawScript(ctx, script, width, true);
        ctx.currentY += 2;
    });

    return ctx.currentY;
};

const drawSectionHeader = (
    ctx: RenderContext,
    title: string,
    width: number,
    isEmergency: boolean
) => {
    const { doc, columnX } = ctx;
    const [bgR, bgG, bgB] = getTypeBgColor(isEmergency);
    const [textR, textG, textB] = getTypeTextColor(isEmergency);

    // Background
    doc.setFillColor(bgR, bgG, bgB);
    doc.rect(columnX, ctx.currentY, width, 7, 'F');

    // Border
    doc.setDrawColor(textR, textG, textB);
    doc.setLineWidth(0.5);
    doc.rect(columnX, ctx.currentY, width, 7, 'S');

    // Text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(textR, textG, textB);

    const lines = doc.splitTextToSize(title.toUpperCase(), width - 4);
    doc.text(lines[0], columnX + width / 2, ctx.currentY + 4.5, { align: 'center' });

    ctx.currentY += 8;
    doc.setTextColor(40);
};

const drawScript = (
    ctx: RenderContext,
    script: EmergencyChecklistScript,
    width: number,
    showHeader: boolean
): number => {
    const { doc, columnX, isEmergencyType } = ctx;

    // Check if entire script fits on current page, if not start new page
    const scriptHeight = estimateScriptHeight(script, showHeader);
    checkPageBreak(ctx, scriptHeight);

    // Script header (if needed)
    if (showHeader && script.title) {

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(60);
        doc.text(script.title.toUpperCase(), columnX + width / 2, ctx.currentY + 4, { align: 'center' });
        ctx.currentY += 6;
        doc.setTextColor(40);
    }

    // Draw steps (no page break checks - script already verified to fit)
    script.steps.forEach((step) => {
        ctx.currentY = drawStep(ctx, step, width);
    });

    // Internal code footer (if exists)
    if (script.internalCode) {
        const [bgR, bgG, bgB] = getTypeBgColor(isEmergencyType);
        const [textR, textG, textB] = getTypeTextColor(isEmergencyType);

        const padding = 15;
        doc.setFillColor(bgR, bgG, bgB);
        doc.rect(columnX + padding, ctx.currentY, width - (padding * 2), 5, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(textR, textG, textB);
        doc.text(script.internalCode.toUpperCase(), columnX + width / 2, ctx.currentY + 3.5, { align: 'center' });
        ctx.currentY += 4;
        doc.setTextColor(40);
    }

    return ctx.currentY;
};

const drawStep = (
    ctx: RenderContext,
    step: EmergencyChecklistItemOrGroup,
    width: number
): number => {
    if (step.type === 'ITEM' && step.item) {
        return drawItem(ctx, step.item, width, 0);
    } else if (step.type === 'GROUP' && step.group) {
        return drawGroup(ctx, step.group, width);
    }
    return ctx.currentY;
};

const drawItem = (
    ctx: RenderContext,
    item: EmergencyChecklistItem,
    width: number,
    indent: number
): number => {
    const { doc, columnX, isEmergencyType } = ctx;
    const startX = columnX + indent + 2;
    const availableWidth = width - indent - 4;

    if (item.type === 'SUBTITLE') {
        // Subtitle - centered, bold
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.5);
        doc.setTextColor(80);
        doc.text(item.title.toUpperCase(), columnX + width / 2, ctx.currentY + 3, { align: 'center' });
        ctx.currentY += 5;
        doc.setTextColor(40);
        return ctx.currentY;
    }

    if (item.type === 'CONDITION') {
        // Condition - italic, smaller
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(6);
        doc.setTextColor(100);
        const lines = doc.splitTextToSize(item.title, availableWidth);
        lines.forEach((line: string) => {
            doc.text(line, startX, ctx.currentY + 3);
            ctx.currentY += 3.5;
        });
        doc.setTextColor(40);
        return ctx.currentY;
    }

    if (item.type === 'INFO') {
        // Info - small note block (title + optional content)
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6);
        doc.setTextColor(80);
        const titleLines = doc.splitTextToSize(item.title, availableWidth);
        titleLines.forEach((line: string) => {
            doc.text(line, startX, ctx.currentY + 3);
            ctx.currentY += 3.5;
        });

        const infoContent = item.content || '';
        if (infoContent.trim()) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(6);
            doc.setTextColor(100);
            const contentLines = doc.splitTextToSize(infoContent, availableWidth);
            contentLines.forEach((line: string) => {
                doc.text(line, startX, ctx.currentY + 3);
                ctx.currentY += 3.2;
            });
        }

        doc.setTextColor(40);
        ctx.currentY += 1;
        return ctx.currentY;
    }

    // CHECK_LINE - main item with dots
    const isHighlighted = item.isHighlighted || false;
    const [highlightR, highlightG, highlightB] = getTypeColor(isEmergencyType);

    doc.setFont('helvetica', isHighlighted ? 'bold' : 'normal');
    doc.setFontSize(7);

    if (isHighlighted) {
        doc.setTextColor(highlightR, highlightG, highlightB);
    } else {
        doc.setTextColor(40);
    }

    // Draw title
    const titleWidth = doc.getTextWidth(item.title);
    doc.text(item.title, startX, ctx.currentY + 3);

    // Draw dots and value
    if (item.desiredState) {
        doc.setFont('helvetica', 'bold');
        const valueWidth = doc.getTextWidth(item.desiredState);
        const dotsStart = startX + titleWidth + 2;
        const dotsEnd = columnX + width - 2 - valueWidth;

        if (dotsEnd > dotsStart) {
            doc.setTextColor(180);
            doc.setFont('helvetica', 'normal');
            const dotWidth = doc.getTextWidth('.');
            const numDots = Math.floor((dotsEnd - dotsStart) / dotWidth);
            let dots = '';
            for (let i = 0; i < numDots; i++) dots += '.';
            doc.text(dots, dotsStart, ctx.currentY + 3);
        }

        doc.setFont('helvetica', 'bold');
        if (isHighlighted) {
            doc.setTextColor(highlightR, highlightG, highlightB);
        } else {
            doc.setTextColor(40);
        }
        doc.text(item.desiredState, columnX + width - 2, ctx.currentY + 3, { align: 'right' });
    }

    doc.setTextColor(40);
    ctx.currentY += 5;
    return ctx.currentY;
};

const drawGroup = (
    ctx: RenderContext,
    group: { title?: string; items: EmergencyChecklistItem[], isHighlighted?: boolean },
    width: number
): number => {
    const { doc, columnX, isEmergencyType } = ctx;
    const [borderR, borderG, borderB] = getTypeColor(isEmergencyType);

    // Check if group has highlighted items
    const hasHighlighted = group.isHighlighted || false;

    const groupStartY = ctx.currentY;
    let widthPadding = 0;
    if (hasHighlighted) {
        widthPadding = 2;
    }

    // Group title
    if (group.title) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(6.5);
        doc.setTextColor(hasHighlighted ? borderR : 60, hasHighlighted ? borderG : 60, hasHighlighted ? borderB : 60);
        doc.text(group.title.toUpperCase(), columnX + 4, ctx.currentY + 3);
        ctx.currentY += 5;
        doc.setTextColor(40);
    }

    if (hasHighlighted) {
        ctx.currentY += 1;
    }

    // Group items (indented)
    group.items.forEach((item) => {
        checkPageBreak(ctx, 6);
        ctx.currentY = drawItem(ctx, item, width - widthPadding, widthPadding);
    });

    // Draw border around group if highlighted
    if (hasHighlighted) {
        doc.setDrawColor(borderR, borderG, borderB);
        doc.setLineWidth(0.6);
        doc.setLineDashPattern([1, 1], 0);
        doc.rect(columnX + 1, groupStartY - 1, width - 2, ctx.currentY - groupStartY + 1, 'S');
        doc.setLineDashPattern([], 0);
    }

    ctx.currentY += 1;
    return ctx.currentY;
};
