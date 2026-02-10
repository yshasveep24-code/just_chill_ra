export class InfoPanelToggles {
    constructor() {
        this.init();
    }

    init() {
        // Setup all toggle buttons
        this.setupToggle('toggle-table-btn', 'transition-table-container');
        this.setupToggle('toggle-states-btn', 'state-info-container');
        this.setupToggle('toggle-log-btn', 'conversion-log');
    }

    setupToggle(btnId, containerId) {
        const btn = document.getElementById(btnId);
        const container = document.getElementById(containerId);

        if (btn && container) {
            btn.addEventListener('click', () => {
                const isExpanded = btn.getAttribute('aria-expanded') === 'true';
                btn.setAttribute('aria-expanded', !isExpanded);
                btn.textContent = isExpanded ? '+' : '−';
                container.style.display = isExpanded ? 'none' : 'block';
            });
        }
    }
}
