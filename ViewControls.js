export class ViewControls {
    constructor() {
        this.currentZoom = 1;
        this.init();
    }

    init() {
        // Zoom in
        const zoomInBtn = document.getElementById('zoom-in-btn');
        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => this.zoomIn());
        }

        // Zoom out
        const zoomOutBtn = document.getElementById('zoom-out-btn');
        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => this.zoomOut());
        }

        // Reset view
        const resetViewBtn = document.getElementById('reset-view-btn');
        if (resetViewBtn) {
            resetViewBtn.addEventListener('click', () => this.resetView());
        }

        // Fullscreen
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey) return; // Don't interfere with Ctrl shortcuts

            if (e.key === '+' || e.key === '=') {
                e.preventDefault();
                this.zoomIn();
            } else if (e.key === '-') {
                e.preventDefault();
                this.zoomOut();
            } else if (e.key.toLowerCase() === 'r') {
                e.preventDefault();
                this.resetView();
            }
        });
    }

    zoomIn() {
        this.currentZoom = Math.min(this.currentZoom + 0.1, 3);
        this.applyZoom();
    }

    zoomOut() {
        this.currentZoom = Math.max(this.currentZoom - 0.1, 0.3);
        this.applyZoom();
    }

    resetView() {
        this.currentZoom = 1;
        this.applyZoom();

        // Reset pan if DiagramInteraction exists
        const container = document.getElementById('graph-container');
        if (container) {
            const svg = container.querySelector('svg');
            if (svg) {
                svg.style.transform = 'scale(1)';
            }
        }
    }

    applyZoom() {
        const container = document.getElementById('graph-container');
        if (container) {
            const svg = container.querySelector('svg');
            if (svg) {
                svg.style.transform = `scale(${this.currentZoom})`;
            }
        }
    }

    toggleFullscreen() {
        const panel = document.getElementById('visualization-section');
        if (!panel) return;

        if (!document.fullscreenElement) {
            panel.requestFullscreen().catch(err => {
                console.error('Fullscreen error:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
}
