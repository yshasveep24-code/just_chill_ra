/**
 * ZoomController.js
 * Handles zoom controls for the visualization
 */

export class ZoomController {
    constructor() {
        this.zoomLevel = 1.0;
        this.container = document.getElementById('graph-container');
        this.zoomDisplay = document.getElementById('zoom-level');

        // Bind buttons
        document.getElementById('zoom-in-btn').addEventListener('click', () => this.zoomIn());
        document.getElementById('zoom-out-btn').addEventListener('click', () => this.zoomOut());
        document.getElementById('zoom-reset-btn').addEventListener('click', () => this.reset());

        // Mouse wheel zoom
        this.container.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });
    }

    zoomIn() {
        this.setZoom(this.zoomLevel + 0.1);
    }

    zoomOut() {
        this.setZoom(this.zoomLevel - 0.1);
    }

    reset() {
        this.setZoom(1.0);
    }

    setZoom(level) {
        // Clamp between 0.3 and 3.0
        this.zoomLevel = Math.max(0.3, Math.min(3.0, level));
        this.container.style.transform = `scale(${this.zoomLevel})`;
        this.zoomDisplay.textContent = `${Math.round(this.zoomLevel * 100)}%`;
    }

    handleWheel(e) {
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.05 : 0.05;
            this.setZoom(this.zoomLevel + delta);
        }
    }
}
