export class ClearButtons {
    constructor() {
        this.init();
    }

    init() {
        // Clear regex input
        const clearRegexBtn = document.getElementById('clear-regex-btn');
        const regexInput = document.getElementById('regex-input');
        if (clearRegexBtn && regexInput) {
            clearRegexBtn.addEventListener('click', () => {
                regexInput.value = '';
                regexInput.focus();
            });

            // Show/hide clear button based on input
            regexInput.addEventListener('input', () => {
                clearRegexBtn.style.display = regexInput.value ? 'block' : 'none';
            });

            // Initial state
            clearRegexBtn.style.display = regexInput.value ? 'block' : 'none';
        }

        // Clear test string input
        const clearTestBtn = document.getElementById('clear-test-btn');
        const testInput = document.getElementById('test-string-input');
        if (clearTestBtn && testInput) {
            clearTestBtn.addEventListener('click', () => {
                testInput.value = '';
                testInput.focus();
            });

            // Show/hide clear button based on input
            testInput.addEventListener('input', () => {
                clearTestBtn.style.display = testInput.value ? 'block' : 'none';
            });

            // Initial state
            clearTestBtn.style.display = testInput.value ? 'block' : 'none';
        }
    }
}
