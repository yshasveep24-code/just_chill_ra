/**
 * BatchTester.js
 * Tests multiple strings against the current DFA.
 */

import { appState } from '../../app/state.js';

export class BatchTester {
    constructor() {
        this.init();
    }

    init() {
        // Toggle batch test section
        const toggleBtn = document.getElementById('toggle-batch-btn');
        const batchContent = document.getElementById('batch-test-content');

        if (toggleBtn && batchContent) {
            toggleBtn.addEventListener('click', () => {
                const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
                toggleBtn.setAttribute('aria-expanded', !isExpanded);
                toggleBtn.textContent = isExpanded ? '+' : '−';
                batchContent.style.display = isExpanded ? 'none' : 'block';
            });
        }

        // Run batch test
        const batchTestBtn = document.getElementById('batch-test-btn');
        if (batchTestBtn) {
            batchTestBtn.addEventListener('click', () => this.runBatchTest());
        }
    }

    runBatchTest() {
        const batchInput = document.getElementById('batch-test-input');
        const resultsContainer = document.getElementById('batch-test-results');

        if (!batchInput || !resultsContainer) return;

        const testStrings = batchInput.value
            .split('\n')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        if (testStrings.length === 0) {
            resultsContainer.innerHTML = '<p style="color: var(--text-muted);">No test strings entered.</p>';
            return;
        }

        // Check if DFA exists
        if (!appState.automata || !appState.automata.dfa) {
            resultsContainer.innerHTML = '<p style="color: var(--danger);">Please visualize a regex first before running batch tests.</p>';
            return;
        }

        const dfa = appState.automata.dfa;
        let accepted = 0;
        let rejected = 0;

        let resultsHTML = '<div style="overflow-x: auto;"><table class="syntax-table"><thead><tr><th>String</th><th>Result</th></tr></thead><tbody>';

        testStrings.forEach(str => {
            const result = this.simulateDFA(dfa, str);
            if (result) accepted++;
            else rejected++;

            const resultText = result ? '✓ Accepted' : '✗ Rejected';
            const resultColor = result ? 'var(--success)' : 'var(--danger)';

            resultsHTML += `<tr>
                <td><code>${this.escapeHtml(str)}</code></td>
                <td style="color: ${resultColor}; font-weight: 600;">${resultText}</td>
            </tr>`;
        });

        resultsHTML += '</tbody></table></div>';
        resultsHTML += `<div style="margin-top: 0.75rem; padding: 0.5rem; border-radius: 8px; background: var(--bg); color: var(--text);">
            <strong>Summary:</strong> ${accepted} accepted, ${rejected} rejected out of ${testStrings.length} strings
        </div>`;

        resultsContainer.innerHTML = resultsHTML;
    }

    simulateDFA(dfa, input) {
        let currentState = dfa.startState;

        for (const symbol of input) {
            // Find transition for this symbol
            const transition = currentState.transitions.find(t => t.symbol === symbol);

            if (!transition) {
                return false; // No transition — rejected
            }

            currentState = transition.to;
        }

        // Check if we ended in an accepting state
        return currentState.isAccepting;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
