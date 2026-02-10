/**
 * DiagramInteraction.js
 * Handles pan/drag and individual zoom for each diagram
 */

export class DiagramInteraction {
    constructor() {
        this.diagrams = new Map(); // Store diagram states
        this.setupObserver();
    }

    setupObserver() {
        // Watch for new diagrams being added
        const container = document.getElementById('graph-container');
        const observer = new MutationObserver(() => {
            this.initializeDiagrams();
        });

        observer.observe(container, { childList: true, subtree: true });
        this.initializeDiagrams();
    }

    initializeDiagrams() {
        const wrappers = document.querySelectorAll('.graph-wrapper');

        wrappers.forEach(wrapper => {
            if (this.diagrams.has(wrapper)) return; // Already initialized

            const canvas = wrapper.querySelector('.graph-canvas');
            if (!canvas) return;

            const state = {
                zoom: 1.0,
                panX: 0,
                panY: 0,
                isDragging: false,
                startX: 0,
                startY: 0
            };

            this.diagrams.set(wrapper, state);
            this.attachEvents(wrapper, canvas, state);
        });
    }

    attachEvents(wrapper, canvas, state) {
        // Zoom on hover + mouse wheel
        canvas.addEventListener('wheel', (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -0.1 : 0.1;
                state.zoom = Math.max(0.3, Math.min(3.0, state.zoom + delta));
                this.updateTransform(canvas, state);
            }
        }, { passive: false });

        // Pan with mouse drag
        canvas.addEventListener('mousedown', (e) => {
            if (e.button === 0) { // Left click only
                state.isDragging = true;
                state.startX = e.clientX - state.panX;
                state.startY = e.clientY - state.panY;
                canvas.style.cursor = 'grabbing';
                e.preventDefault();
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (state.isDragging) {
                state.panX = e.clientX - state.startX;
                state.panY = e.clientY - state.startY;
                this.updateTransform(canvas, state);
            }
        });

        document.addEventListener('mouseup', () => {
            if (state.isDragging) {
                state.isDragging = false;
                canvas.style.cursor = 'grab';
            }
        });

        // Set initial cursor
        canvas.style.cursor = 'grab';

        // Hover effect for visual feedback
        canvas.addEventListener('mouseenter', () => {
            wrapper.style.outline = '2px solid rgba(37, 99, 235, 0.3)';
        });

        canvas.addEventListener('mouseleave', () => {
            wrapper.style.outline = 'none';
        });
    }

    updateTransform(canvas, state) {
        const svg = canvas.querySelector('svg');
        if (svg) {
            svg.style.transform = `translate(${state.panX}px, ${state.panY}px) scale(${state.zoom})`;
            svg.style.transformOrigin = 'top left';
            svg.style.transition = 'transform 0.1s ease-out';
        }
    }

    resetDiagram(wrapper) {
        const state = this.diagrams.get(wrapper);
        if (state) {
            state.zoom = 1.0;
            state.panX = 0;
            state.panY = 0;
            const canvas = wrapper.querySelector('.graph-canvas');
            if (canvas) {
                this.updateTransform(canvas, state);
            }
        }
    }

    resetAll() {
        this.diagrams.forEach((state, wrapper) => {
            this.resetDiagram(wrapper);
        });
    }
}
