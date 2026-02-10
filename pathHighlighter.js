/**
 * pathHighlighter.js
 * Handles visual highlighting of states and transitions during simulation.
 */

import { defaultTheme } from '../visualization/themes/defaultTheme.js';

export class PathHighlighter {
    constructor() {
        this.activeClass = 'active';
    }

    /**
     * Highlights the current state.
     * @param {State} state 
     */
    highlightState(state) {
        // Clear previous highlights
        this.clearHighlights();

        // Highlight new state
        // We need to access the DOM elements.
        // Ideally we shouldn't query selector all the time, but for this scale it's fine.
        // Or we could have a reference to the active node.

        const node = document.querySelector(`.node[data-id="${state.id}"]`);
        if (node) {
            node.classList.add(this.activeClass);

            // Apply inline style for specific color (overriding default)
            const circle = node.querySelector('circle');
            if (circle) {
                circle.style.fill = defaultTheme.activeNodeColor;
                // Maybe stroke too?
            }
        }
    }

    /**
     * Highlights a transition (optional, for step animation).
     */
    highlightTransition(from, to, symbol) {
        // Complex to find exact edge element without ID.
        // Renderer doesn't put IDs on edges yet.
        // Future improvement.
    }

    clearHighlights() {
        const nodes = document.querySelectorAll('.node');
        nodes.forEach(n => {
            n.classList.remove(this.activeClass);
            const circle = n.querySelector('circle');

            // Revert color based on class
            // Start state? Accept state?
            // This is tricky because we lost the original color if we just assigned it inline.
            // But nodeRenderer sets inline styles initially.
            // We should re-apply the correct style based on state data?
            // OR we just remove the inline override and let CSS handle it?
            // But we are using inline styles for EXPORT.

            // Better: Read state from data-id and determining color?
            // Or just check classes.
            if (circle) {
                if (n.classList.contains('start')) {
                    circle.style.fill = defaultTheme.startNodeColor;
                } else if (n.classList.contains('accept')) {
                    circle.style.fill = defaultTheme.acceptNodeColor;
                } else {
                    circle.style.fill = defaultTheme.nodeColor;
                }
            }
        });
    }
}
