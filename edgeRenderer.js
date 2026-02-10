/**
 * edgeRenderer.js
 * Renders SVG elements for transitions.
 * Arrows split around the label to create an integrated look.
 */

export class EdgeRenderer {
    constructor(container) {
        this.container = container;
        this.arrowSize = 10;
    }

    render(transition, fromPos, toPos, theme, isBidirectional = false, offsetIndex = 0, selfLoopDir = 'right') {
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("class", "edge");

        const dx = toPos.x - fromPos.x;
        const dy = toPos.y - fromPos.y;

        let endX, endY, startX, startY;
        let midX, midY;
        let angle;
        let controlX, controlY;
        let isCurved = false;
        let isSelfLoop = false;

        if (transition.from.id === transition.to.id) {
            // Self loop - uses large elliptical arc
            isSelfLoop = true;
            const r = 22; // node radius
            const x = fromPos.x;
            const y = fromPos.y;

            // Label positioned outside the arc
            if (selfLoopDir === 'top') {
                midX = x; midY = y - r - 35;
                angle = -Math.PI / 2;
            } else if (selfLoopDir === 'bottom') {
                midX = x; midY = y + r + 35;
                angle = Math.PI / 2;
            } else if (selfLoopDir === 'left') {
                midX = x - r - 35; midY = y;
                angle = Math.PI;
            } else { // right
                midX = x + r + 35; midY = y;
                angle = 0;
            }
            // Start/end not needed for arc approach
            startX = x; startY = y; endX = x; endY = y;
        } else if (isBidirectional || offsetIndex !== 0) {
            // Curved line for bidirectional edges
            isCurved = true;
            angle = Math.atan2(dy, dx);
            const r = 22;
            startX = fromPos.x + Math.cos(angle) * r;
            startY = fromPos.y + Math.sin(angle) * r;
            endX = toPos.x - Math.cos(angle) * r;
            endY = toPos.y - Math.sin(angle) * r;

            const midX0 = (startX + endX) / 2;
            const midY0 = (startY + endY) / 2;

            const nx = -dy;
            const ny = dx;
            const len = Math.sqrt(nx * nx + ny * ny);

            const curveDirection = isBidirectional ? 1 : (offsetIndex % 2 === 0 ? 1 : -1);
            const offset = (isBidirectional ? 50 : 45 * offsetIndex) * curveDirection; // Larger curve for cleaner look

            controlX = midX0 + (nx / len) * offset;
            controlY = midY0 + (ny / len) * offset;

            // Label at curve midpoint
            midX = 0.25 * startX + 0.5 * controlX + 0.25 * endX;
            midY = 0.25 * startY + 0.5 * controlY + 0.25 * endY;

            angle = Math.atan2(endY - controlY, endX - controlX);
        } else {
            // Straight line
            angle = Math.atan2(dy, dx);
            const r = 22;
            startX = fromPos.x + Math.cos(angle) * r;
            startY = fromPos.y + Math.sin(angle) * r;
            endX = toPos.x - Math.cos(angle) * r;
            endY = toPos.y - Math.sin(angle) * r;

            // Random offset for label position (range 0.25 to 0.7)
            const t = 0.25 + Math.random() * 0.45;
            midX = startX + (endX - startX) * t;
            midY = startY + (endY - startY) * t;
        }

        // Calculate label dimensions (reduced size)
        const padding = 3;
        const textWidth = transition.symbol.length * 7 + padding * 2;
        const textHeight = 14 + padding;
        const gapSize = textWidth / 2 + 4;

        // Create split arrow paths (line broken around label)
        const arrowPaths = this.createSplitArrowPath(
            startX, startY, endX, endY, midX, midY,
            angle, theme, isCurved, controlX, controlY,
            isSelfLoop, fromPos, selfLoopDir, gapSize
        );

        arrowPaths.forEach(p => g.appendChild(p));

        // Label box (integrated into arrow)
        const bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        bgRect.setAttribute("x", midX - textWidth / 2);
        bgRect.setAttribute("y", midY - textHeight / 2);
        bgRect.setAttribute("width", textWidth);
        bgRect.setAttribute("height", textHeight);
        bgRect.setAttribute("rx", 2);
        bgRect.setAttribute("ry", 2);
        bgRect.style.fill = "white";
        bgRect.style.stroke = theme.edgeColor;
        bgRect.style.strokeWidth = "1.5px";

        // Label text
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", midX);
        text.setAttribute("y", midY);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "middle");
        text.textContent = transition.symbol;
        text.style.fill = theme.edgeLabelColor;
        text.style.fontSize = "12px";
        text.style.fontFamily = "Inter, sans-serif";
        text.style.fontWeight = "bold";

        g.appendChild(bgRect);
        g.appendChild(text);
        this.container.appendChild(g);

        return g;
    }

    createSplitArrowPath(startX, startY, endX, endY, midX, midY, angle, theme, isCurved, controlX, controlY, isSelfLoop, fromPos, selfLoopDir, gapSize) {
        const paths = [];
        const size = this.arrowSize;

        // For straight lines, split into two segments around the midpoint
        if (!isCurved && !isSelfLoop) {
            const lineAngle = Math.atan2(endY - startY, endX - startX);

            // First segment: start to gap start
            const gap1X = midX - Math.cos(lineAngle) * gapSize;
            const gap1Y = midY - Math.sin(lineAngle) * gapSize;

            // Second segment: gap end to arrow tip
            const gap2X = midX + Math.cos(lineAngle) * gapSize;
            const gap2Y = midY + Math.sin(lineAngle) * gapSize;

            // Arrowhead
            const tipX = endX;
            const tipY = endY;
            const lineEndX = endX - Math.cos(angle) * size;
            const lineEndY = endY - Math.sin(angle) * size;
            const baseAngle1 = angle + Math.PI / 2;
            const baseAngle2 = angle - Math.PI / 2;
            const baseX1 = lineEndX + Math.cos(baseAngle1) * (size / 2.5);
            const baseY1 = lineEndY + Math.sin(baseAngle1) * (size / 2.5);
            const baseX2 = lineEndX + Math.cos(baseAngle2) * (size / 2.5);
            const baseY2 = lineEndY + Math.sin(baseAngle2) * (size / 2.5);

            // First path (start to label)
            const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path1.setAttribute("d", `M ${startX} ${startY} L ${gap1X} ${gap1Y}`);
            path1.style.stroke = theme.edgeColor;
            path1.style.strokeWidth = "2px";
            path1.style.fill = "none";
            paths.push(path1);

            // Second path (label to end with arrowhead)
            const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
            let d2 = `M ${gap2X} ${gap2Y} L ${lineEndX} ${lineEndY}`;
            d2 += ` L ${baseX1} ${baseY1} L ${tipX} ${tipY} L ${baseX2} ${baseY2} L ${lineEndX} ${lineEndY}`;
            path2.setAttribute("d", d2);
            path2.style.stroke = theme.edgeColor;
            path2.style.strokeWidth = "2px";
            path2.style.fill = theme.edgeColor;
            path2.style.strokeLinejoin = "round";
            paths.push(path2);

        } else if (isSelfLoop) {
            // Self-loop as single path (no split needed, label is outside)
            const path = this.createSelfLoopPath(startX, startY, endX, endY, angle, theme, fromPos, selfLoopDir);
            paths.push(path);
        } else {
            // Curved path - draw as single curve with arrowhead
            const path = this.createCurvedPath(startX, startY, endX, endY, controlX, controlY, angle, theme);
            paths.push(path);
        }

        return paths;
    }

    createSelfLoopPath(startX, startY, endX, endY, angle, theme, fromPos, selfLoopDir) {
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const x = fromPos.x;
        const y = fromPos.y;
        const nodeR = 22;

        // Arc parameters for smooth circular loop
        const loopRadius = 30;
        const arrowSize = 12;

        let arcPath, arrowPath, arcStartX, arcStartY, arcEndX, arcEndY, arrowTipX, arrowTipY;

        if (selfLoopDir === 'top') {
            // Arc starts from left side of node top, goes up and around, ends at right side
            arcStartX = x - 15;
            arcStartY = y - nodeR;
            arcEndX = x + 15;
            arcEndY = y - nodeR;

            // Create smooth arc path
            arcPath = `M ${arcStartX} ${arcStartY} A ${loopRadius} ${loopRadius} 0 1 1 ${arcEndX} ${arcEndY}`;

            // Arrow points down-left into the node
            arrowTipX = arcEndX;
            arrowTipY = arcEndY;
            const arrowBase1X = arrowTipX + arrowSize * 0.5;
            const arrowBase1Y = arrowTipY - arrowSize * 0.8;
            const arrowBase2X = arrowTipX + arrowSize * 0.8;
            const arrowBase2Y = arrowTipY + arrowSize * 0.3;
            arrowPath = `M ${arrowTipX} ${arrowTipY} L ${arrowBase1X} ${arrowBase1Y} L ${arrowBase2X} ${arrowBase2Y} Z`;

        } else if (selfLoopDir === 'bottom') {
            arcStartX = x + 15;
            arcStartY = y + nodeR;
            arcEndX = x - 15;
            arcEndY = y + nodeR;

            arcPath = `M ${arcStartX} ${arcStartY} A ${loopRadius} ${loopRadius} 0 1 1 ${arcEndX} ${arcEndY}`;

            arrowTipX = arcEndX;
            arrowTipY = arcEndY;
            const arrowBase1X = arrowTipX - arrowSize * 0.5;
            const arrowBase1Y = arrowTipY + arrowSize * 0.8;
            const arrowBase2X = arrowTipX - arrowSize * 0.8;
            const arrowBase2Y = arrowTipY - arrowSize * 0.3;
            arrowPath = `M ${arrowTipX} ${arrowTipY} L ${arrowBase1X} ${arrowBase1Y} L ${arrowBase2X} ${arrowBase2Y} Z`;

        } else if (selfLoopDir === 'left') {
            arcStartX = x - nodeR;
            arcStartY = y + 15;
            arcEndX = x - nodeR;
            arcEndY = y - 15;

            arcPath = `M ${arcStartX} ${arcStartY} A ${loopRadius} ${loopRadius} 0 1 1 ${arcEndX} ${arcEndY}`;

            arrowTipX = arcEndX;
            arrowTipY = arcEndY;
            const arrowBase1X = arrowTipX - arrowSize * 0.8;
            const arrowBase1Y = arrowTipY - arrowSize * 0.5;
            const arrowBase2X = arrowTipX + arrowSize * 0.3;
            const arrowBase2Y = arrowTipY - arrowSize * 0.8;
            arrowPath = `M ${arrowTipX} ${arrowTipY} L ${arrowBase1X} ${arrowBase1Y} L ${arrowBase2X} ${arrowBase2Y} Z`;

        } else { // right
            arcStartX = x + nodeR;
            arcStartY = y - 15;
            arcEndX = x + nodeR;
            arcEndY = y + 15;

            arcPath = `M ${arcStartX} ${arcStartY} A ${loopRadius} ${loopRadius} 0 1 1 ${arcEndX} ${arcEndY}`;

            arrowTipX = arcEndX;
            arrowTipY = arcEndY;
            const arrowBase1X = arrowTipX + arrowSize * 0.8;
            const arrowBase1Y = arrowTipY + arrowSize * 0.5;
            const arrowBase2X = arrowTipX - arrowSize * 0.3;
            const arrowBase2Y = arrowTipY + arrowSize * 0.8;
            arrowPath = `M ${arrowTipX} ${arrowTipY} L ${arrowBase1X} ${arrowBase1Y} L ${arrowBase2X} ${arrowBase2Y} Z`;
        }

        // Create arc element (stroke only, no fill)
        const arc = document.createElementNS("http://www.w3.org/2000/svg", "path");
        arc.setAttribute("d", arcPath);
        arc.style.stroke = theme.edgeColor;
        arc.style.strokeWidth = "2px";
        arc.style.fill = "none";
        g.appendChild(arc);

        // Create arrow element (filled triangle)
        const arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
        arrow.setAttribute("d", arrowPath);
        arrow.style.fill = theme.edgeColor;
        arrow.style.stroke = "none";
        g.appendChild(arrow);

        return g;
    }

    createCurvedPath(startX, startY, endX, endY, controlX, controlY, angle, theme) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        const size = this.arrowSize;

        const lineEndX = endX - Math.cos(angle) * size;
        const lineEndY = endY - Math.sin(angle) * size;
        const baseAngle1 = angle + Math.PI / 2;
        const baseAngle2 = angle - Math.PI / 2;
        const baseX1 = lineEndX + Math.cos(baseAngle1) * (size / 2.5);
        const baseY1 = lineEndY + Math.sin(baseAngle1) * (size / 2.5);
        const baseX2 = lineEndX + Math.cos(baseAngle2) * (size / 2.5);
        const baseY2 = lineEndY + Math.sin(baseAngle2) * (size / 2.5);

        let d = `M ${startX} ${startY} Q ${controlX} ${controlY} ${lineEndX} ${lineEndY}`;
        d += ` L ${baseX1} ${baseY1} L ${endX} ${endY} L ${baseX2} ${baseY2} L ${lineEndX} ${lineEndY}`;

        path.setAttribute("d", d);
        path.style.stroke = theme.edgeColor;
        path.style.strokeWidth = "2px";
        path.style.fill = theme.edgeColor;
        path.style.strokeLinejoin = "round";
        return path;
    }
}
