/**
 * nodeRenderer.js
 * Renders SVG elements for states.
 */

export class NodeRenderer {
    constructor(container) {
        this.container = container; // The SVG group for nodes
    }

    render(state, x, y, theme) {
        // Detect dead state: a state that only has self-loops or no outgoing transitions
        const isDead = this.isDeadState(state);

        // Create group for node
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("class", `node ${state.isAccepting ? 'accept' : ''} ${state.isStart ? 'start' : ''} ${isDead ? 'dead' : ''}`);
        g.setAttribute("transform", `translate(${x}, ${y})`);
        g.setAttribute("data-id", state.id);

        // Circle
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("r", 20);

        // Determine fill color based on state type
        let fillColor = theme.nodeColor;
        if (isDead) {
            fillColor = theme.deadNodeColor || '#FF6B6B';
        } else if (state.isStart) {
            fillColor = theme.startNodeColor;
        } else if (state.isAccepting) {
            fillColor = theme.acceptNodeColor;
        }

        circle.style.fill = fillColor;
        circle.style.stroke = theme.strokeColor;
        circle.style.strokeWidth = "2px";

        if (state.isAccepting) {
            // Double circle for accepting states
            const inner = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            inner.setAttribute("r", 15);
            inner.style.fill = "none";
            inner.style.stroke = '#ffffff'; // White inner circle on green bg
            inner.style.strokeWidth = "2px";
            g.appendChild(circle);
            g.appendChild(inner);
        } else {
            g.appendChild(circle);
        }

        // Label - use phi symbol for dead states
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("dy", 5);
        text.setAttribute("text-anchor", "middle");
        text.textContent = isDead ? "φ" : state.label;
        text.style.fontFamily = "Arial";
        text.style.fontSize = isDead ? "18px" : "14px";
        // White text for colored backgrounds (start, accept, dead)
        text.style.fill = (state.isAccepting || state.isStart || isDead) ? '#ffffff' : theme.textColor;
        text.style.fontWeight = (state.isAccepting || state.isStart) ? 'bold' : 'normal';
        text.style.userSelect = "none";

        g.appendChild(text);

        this.container.appendChild(g);
        return g;
    }

    isDeadState(state) {
        // A dead state is typically:
        // 1. Not an accepting state
        // 2. All outgoing transitions lead back to itself
        if (state.isAccepting) return false;

        // Check if all transitions are self-loops
        if (state.transitions.length === 0) return false;

        const allSelfLoops = state.transitions.every(t => t.to.id === state.id);
        return allSelfLoops;
    }
}
