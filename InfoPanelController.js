/**
 * InfoPanelController.js
 * Populates the info panel with automaton data (transition table, state info, stats, conversion log).
 */

import { appState } from '../../app/state.js';

export class InfoPanelController {
    constructor() {
        this.currentAutomaton = null;
        this.currentStage = 'dfa';
        this.init();
    }

    init() {
        // Subscribe to state changes
        appState.subscribe((state) => {
            this.updateInfoPanel(state);
        });

        // Popup open buttons
        this.bindPopup('open-transition-popup', 'transition-popup');
        this.bindPopup('open-states-popup', 'states-popup');
        this.bindPopup('open-log-popup', 'log-popup');

        // Close buttons
        document.querySelectorAll('.info-popup-close').forEach(btn => {
            btn.addEventListener('click', () => {
                const popupId = btn.getAttribute('data-close');
                const popup = document.getElementById(popupId);
                if (popup) popup.style.display = 'none';
            });
        });

        // Close on overlay click
        document.querySelectorAll('.info-popup-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) overlay.style.display = 'none';
            });
        });
    }

    bindPopup(btnId, popupId) {
        const btn = document.getElementById(btnId);
        const popup = document.getElementById(popupId);
        if (btn && popup) {
            btn.addEventListener('click', () => {
                popup.style.display = 'flex';
            });
        }
    }

    updateInfoPanel(state) {
        const { automata } = state;

        // Use DFA by default, fall back to NFA, then ε-NFA
        let automaton = automata.dfa || automata.nfa || automata.enfa;

        this.currentAutomaton = automaton;

        if (!automaton) {
            this.showEmptyState();
            return;
        }

        try {
            this.updateTransitionTable(automaton);
            this.updateStateInformation(automaton);
            this.updateStatistics(automaton);
            this.updateConversionLog(state);
        } catch (e) {
            console.error('InfoPanelController error:', e);
        }
    }

    // Convert states Set to array
    getStatesArray(automaton) {
        const { states } = automaton;

        if (Array.isArray(states)) return states;
        if (states instanceof Set) return Array.from(states);
        if (typeof states === 'object' && states !== null) return Object.values(states);
        return [];
    }

    // Get alphabet as array
    getAlphabetArray(automaton) {
        const { alphabet } = automaton;
        if (Array.isArray(alphabet)) return alphabet;
        if (alphabet instanceof Set) return Array.from(alphabet);
        return [];
    }

    updateTransitionTable(automaton) {
        const container = document.getElementById('transition-table-container');
        if (!container) return;

        const states = this.getStatesArray(automaton);
        const alphabet = this.getAlphabetArray(automaton);

        if (states.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No states to display</p></div>';
            return;
        }

        // Build card-based transition display
        let cardsHTML = '<div class="transition-cards">';

        states.forEach(state => {
            const stateName = state.label || `q${state.id}`;
            const badges = [];
            if (state.isStart) badges.push('<span class="state-badge start-badge">START</span>');
            if (state.isAccepting) badges.push('<span class="state-badge final-badge">ACCEPT</span>');

            cardsHTML += `
                <div class="transition-card">
                    <div class="transition-card-header">
                        <strong class="state-name">${stateName}</strong>
                        ${badges.join(' ')}
                    </div>
                    <div class="transition-card-body">`;

            // Show transitions for each symbol
            alphabet.forEach(symbol => {
                const displaySymbol = (symbol === '' || symbol === 'ε') ? 'ε' : symbol;
                const targets = state.transitions
                    .filter(t => t.symbol === symbol)
                    .map(t => t.to.label || `q${t.to.id}`);

                if (targets.length > 0) {
                    cardsHTML += `
                        <div class="transition-row">
                            <span class="transition-symbol">${displaySymbol}</span>
                            <span class="transition-arrow">→</span>
                            <span class="transition-targets">${targets.join(', ')}</span>
                        </div>`;
                }
            });

            if (state.transitions.length === 0) {
                cardsHTML += '<div class="transition-row"><em class="text-muted">No transitions</em></div>';
            }

            cardsHTML += `
                    </div>
                </div>`;
        });

        cardsHTML += '</div>';
        container.innerHTML = cardsHTML;
    }

    updateStateInformation(automaton) {
        const container = document.getElementById('state-info-container');
        if (!container) return;

        const states = this.getStatesArray(automaton);

        let infoHTML = '<div class="state-list">';

        states.forEach(state => {
            const stateName = state.label || `q${state.id}`;
            const badges = [];
            if (state.isStart) badges.push('<span class="state-badge start-badge">Start</span>');
            if (state.isAccepting) badges.push('<span class="state-badge final-badge">Final</span>');

            infoHTML += `
                <div class="state-item">
                    <div class="state-header">
                        <strong>${stateName}</strong>
                        ${badges.join(' ')}
                    </div>
                    <div class="state-transitions">
                        ${this.getStateTransitionsText(state)}
                    </div>
                </div>
            `;
        });

        infoHTML += '</div>';
        container.innerHTML = infoHTML;
    }

    getStateTransitionsText(state) {
        // state.transitions is an Array of Transition objects: { from, to, symbol }
        if (!state.transitions || state.transitions.length === 0) {
            return '<small class="text-muted">No transitions</small>';
        }

        // Group transitions by symbol
        const grouped = {};
        state.transitions.forEach(t => {
            const symbol = (t.symbol === '' || t.symbol === 'ε') ? 'ε' : t.symbol;
            if (!grouped[symbol]) grouped[symbol] = [];
            const targetLabel = t.to.label || `q${t.to.id}`;
            grouped[symbol].push(targetLabel);
        });

        const lines = [];
        for (const [symbol, targets] of Object.entries(grouped)) {
            lines.push(`${symbol} → {${targets.join(', ')}}`);
        }

        return lines.length > 0
            ? `<small>${lines.join('<br>')}</small>`
            : '<small class="text-muted">No transitions</small>';
    }

    updateStatistics(automaton) {
        const states = this.getStatesArray(automaton);
        const alphabet = this.getAlphabetArray(automaton);

        // Count total transitions
        let transitionCount = 0;
        states.forEach(state => {
            transitionCount += state.transitions ? state.transitions.length : 0;
        });

        // Count final states
        const finalStatesCount = states.filter(s => s.isAccepting).length;

        // Update stat values
        const statStates = document.getElementById('stat-states');
        const statTransitions = document.getElementById('stat-transitions');
        const statAlphabet = document.getElementById('stat-alphabet');
        const statFinal = document.getElementById('stat-final');

        if (statStates) statStates.textContent = states.length;
        if (statTransitions) statTransitions.textContent = transitionCount;
        if (statAlphabet) statAlphabet.textContent = alphabet.length;
        if (statFinal) statFinal.textContent = finalStatesCount;
    }

    updateConversionLog(state) {
        const container = document.getElementById('conversion-log');
        if (!container) return;

        let logHTML = '<div class="log-entries">';

        if (state.automata.enfa) {
            logHTML += this.createLogEntry(
                '✓ Step 1: Thompson Construction',
                'Converted regex to ε-NFA using Thompson\'s construction algorithm',
                'success'
            );
        }

        if (state.automata.nfa) {
            logHTML += this.createLogEntry(
                '✓ Step 2: ε-Transition Removal',
                'Removed epsilon transitions to create NFA',
                'success'
            );
        }

        if (state.automata.dfa) {
            logHTML += this.createLogEntry(
                '✓ Step 3: Subset Construction',
                'Converted NFA to DFA using subset construction algorithm',
                'success'
            );
        }

        if (!state.automata.enfa && !state.automata.nfa && !state.automata.dfa) {
            logHTML += '<div class="empty-state"><p>No conversion steps yet</p></div>';
        }

        logHTML += '</div>';
        container.innerHTML = logHTML;
    }

    createLogEntry(title, description, type = 'info') {
        const icon = type === 'success' ? '✓' : 'ℹ';
        const colorClass = type === 'success' ? 'success' : 'info';

        return `
            <div class="log-entry log-${colorClass}">
                <div class="log-icon">${icon}</div>
                <div class="log-content">
                    <div class="log-title">${title}</div>
                    <div class="log-description">${description}</div>
                </div>
            </div>
        `;
    }

    showEmptyState() {
        const transitionTable = document.getElementById('transition-table-container');
        const stateInfo = document.getElementById('state-info-container');
        const conversionLog = document.getElementById('conversion-log');

        if (transitionTable) transitionTable.innerHTML = '<div class="empty-state"><p>No automaton to display</p></div>';
        if (stateInfo) stateInfo.innerHTML = '<div class="empty-state"><p>No states to display</p></div>';
        if (conversionLog) conversionLog.innerHTML = '<div class="empty-state"><p>Conversion steps will appear here</p></div>';

        const statStates = document.getElementById('stat-states');
        const statTransitions = document.getElementById('stat-transitions');
        const statAlphabet = document.getElementById('stat-alphabet');
        const statFinal = document.getElementById('stat-final');

        if (statStates) statStates.textContent = '-';
        if (statTransitions) statTransitions.textContent = '-';
        if (statAlphabet) statAlphabet.textContent = '-';
        if (statFinal) statFinal.textContent = '-';
    }
}
