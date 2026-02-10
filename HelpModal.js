import { ModalController } from './ModalController.js';

export class HelpModal extends ModalController {
    constructor() {
        super('help-modal');
        this.setupTriggers();
    }

    setupTriggers() {
        // Help button in header
        const helpBtn = document.getElementById('help-btn');
        console.log('HelpModal: help button found?', !!helpBtn);
        if (helpBtn) {
            helpBtn.addEventListener('click', () => {
                console.log('Help button clicked!');
                this.open();
            });
        } else {
            console.warn('HelpModal: help-btn element not found in DOM');
        }

        // Keyboard shortcut: ?
        document.addEventListener('keydown', (e) => {
            if (e.key === '?' && !this.isOpen()) {
                e.preventDefault();
                this.open();
            }
        });
    }
}
