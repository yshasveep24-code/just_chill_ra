// ModalController - Base class for all modals
export class ModalController {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        if (!this.modal) {
            console.warn(`Modal ${modalId} not found`);
            return;
        }

        this.init();
    }

    init() {
        // Close button
        const closeBtn = this.modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Click outside to close
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    }

    open() {
        if (this.modal) {
            this.modal.classList.add('active');
            this.modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    }

    close() {
        if (this.modal) {
            this.modal.classList.remove('active');
            this.modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    isOpen() {
        return this.modal && this.modal.classList.contains('active');
    }
}
