/**
 * ThemeController.js
 * Handles light/dark theme switching with persistence
 */

export class ThemeController {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeIcon = this.themeToggle?.querySelector('.theme-icon');
        this.themeText = this.themeToggle?.querySelector('.theme-text');

        // Load saved theme or default to light
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.applyTheme(this.currentTheme);

        // Bind toggle event
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggle());
        }
    }

    toggle() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);

        if (this.themeIcon && this.themeText) {
            if (theme === 'dark') {
                this.themeIcon.textContent = '☀️';
                this.themeText.textContent = 'Light';
            } else {
                this.themeIcon.textContent = '🌙';
                this.themeText.textContent = 'Dark';
            }
        }

        // Dispatch event for components that need to react
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }

    getTheme() {
        return this.currentTheme;
    }

    isDark() {
        return this.currentTheme === 'dark';
    }
}
