export class ToastController {
    constructor() {
        this.container = document.getElementById('toast-container');
        this.setupGlobalHandlers();
    }

    setupGlobalHandlers() {
        // Capture unhandled errors
        window.onerror = (message, source, lineno, colno, error) => {
            console.error('Global Error Caught:', message, error);
            this.show(`Error: ${message}`, 'error');
            return false; // Let it bubble to console
        };

        // Capture promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.warn('Unhandled Rejection Caught:', event.reason);
            this.show(`Error: ${event.reason}`, 'error');
        });
    }

    show(message, type = 'info') {
        if (!this.container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        toast.innerHTML = `
            <div class="toast-message">${message}</div>
            <div class="toast-close">×</div>
        `;

        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.isConnected) {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(100%)';
                toast.style.transition = 'all 0.3s ease-in';
                setTimeout(() => toast.remove(), 300);
            }
        }, 8000);

        this.container.appendChild(toast);
    }
}
