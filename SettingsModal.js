import { ModalController } from './ModalController.js';

export class SettingsModal extends ModalController {
    constructor() {
        super('settings-modal');
        this.setupTriggers();
        this.loadSettings();
        this.setupEventListeners();
    }

    setupTriggers() {
        // Settings button in header
        const settingsBtn = document.getElementById('settings-btn');
        console.log('SettingsModal: settings button found?', !!settingsBtn);
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                console.log('Settings button clicked!');
                this.open();
            });
        } else {
            console.warn('SettingsModal: settings-btn element not found in DOM');
        }
    }

    loadSettings() {
        // Load settings from localStorage
        const settings = {
            showEpsilon: localStorage.getItem('show-epsilon') !== 'false',
            autoArrange: localStorage.getItem('auto-arrange') !== 'false',
            showLabels: localStorage.getItem('show-labels') !== 'false',
            animateTransitions: localStorage.getItem('animate-transitions') !== 'false',
            showTooltips: localStorage.getItem('show-tooltips') !== 'false',
            autoTest: localStorage.getItem('auto-test') !== 'false',
            exportFormat: localStorage.getItem('export-format') || 'svg'
        };

        // Apply to checkboxes
        document.getElementById('show-epsilon').checked = settings.showEpsilon;
        document.getElementById('auto-arrange').checked = settings.autoArrange;
        document.getElementById('show-labels').checked = settings.showLabels;
        document.getElementById('animate-transitions').checked = settings.animateTransitions;
        document.getElementById('show-tooltips').checked = settings.showTooltips;
        document.getElementById('auto-test').checked = settings.autoTest;
        document.getElementById('export-format').value = settings.exportFormat;
    }

    setupEventListeners() {
        // Save settings on change
        const settingInputs = this.modal.querySelectorAll('input, select');
        settingInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.saveSetting(input.id, input.type === 'checkbox' ? input.checked : input.value);
            });
        });
    }

    saveSetting(key, value) {
        localStorage.setItem(key, value);

        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('settingschange', {
            detail: { key, value }
        }));
    }

    getSetting(key, defaultValue = true) {
        const value = localStorage.getItem(key);
        if (value === null) return defaultValue;
        return value === 'true';
    }
}
