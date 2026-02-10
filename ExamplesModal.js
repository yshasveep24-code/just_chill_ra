import { ModalController } from './ModalController.js';

export class ExamplesModal extends ModalController {
    constructor() {
        super('examples-modal');
        this.setupTriggers();
        this.setupExampleCards();
    }

    setupTriggers() {
        // Examples button in header
        const examplesBtn = document.getElementById('examples-btn');
        console.log('ExamplesModal: examples button found?', !!examplesBtn);
        if (examplesBtn) {
            examplesBtn.addEventListener('click', () => {
                console.log('Examples button clicked!');
                this.open();
            });
        } else {
            console.warn('ExamplesModal: examples-btn element not found in DOM');
        }

        // Quick example button in placeholder
        const quickExampleBtn = document.getElementById('quick-example-btn');
        if (quickExampleBtn) {
            quickExampleBtn.addEventListener('click', () => this.open());
        }
    }

    setupExampleCards() {
        const exampleCards = document.querySelectorAll('.example-card');
        exampleCards.forEach(card => {
            const tryBtn = card.querySelector('.try-example-btn');
            if (tryBtn) {
                tryBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.loadExample(card);
                });
            }

            // Click on card to load example
            card.addEventListener('click', () => {
                this.loadExample(card);
            });
        });
    }

    loadExample(card) {
        const regex = card.getAttribute('data-regex');
        if (regex) {
            const regexInput = document.getElementById('regex-input');
            if (regexInput) {
                regexInput.value = regex;

                // Trigger visualize
                const visualizeBtn = document.getElementById('visualize-btn');
                if (visualizeBtn) {
                    visualizeBtn.click();
                }
            }
            this.close();
        }
    }
}
