/**
 * main.js
 * Entry point for the application.
 * Wiring modules together.
 */

import { bootstrap } from './app/bootstrap.js';

window.onerror = function (message, source, lineno, colno, error) {
    console.error(`Error: ${message}\nSource: ${source}:${lineno}:${colno}`);
    // Hide loading overlay on any error
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.style.display = 'none';
};

document.addEventListener('DOMContentLoaded', () => {
    console.log('Application starting...');
    try {
        bootstrap();
    } catch (e) {
        console.error('Bootstrap error:', e);
        // Ensure loading overlay is hidden even on error
        const overlay = document.getElementById('loading-overlay');
        if (overlay) overlay.classList.add('hidden');

        // Show in toast if possible, or fallback
        const toastContainer = document.getElementById('toast-container');
        if (toastContainer) {
            const toast = document.createElement('div');
            toast.className = 'toast toast-error';
            toast.innerHTML = `<div class="toast-message">Startup Error: ${e.message}</div>`;
            toastContainer.appendChild(toast);
        }
    }
});
