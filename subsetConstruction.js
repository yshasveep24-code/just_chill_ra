/**
 * subsetConstruction.js
 * Converts an NFA to a DFA using the Subset Construction algorithm.
 */

import { Automaton } from '../model/Automaton.js';
import { State } from '../model/State.js';
import { move } from '../nfa/move.js';
import { getStateSetKey } from '../utils/stateSet.js';
// We might need epsilon closure if the input is ε-NFA, but usually we convert to NFA first
// or we do Subset Construction directly on ε-NFA (calling E-Closure).
// The task structure has "epsilonRemoval" as a step, so we assume input here is NFA (no epsilon).
// BUT, to be robust, we can handle epsilon if present, or assume explicit stage flow.
// Task requirement 3: "NFA -> DFA via subset construction".
// So input is NFA.

export function toDFA(nfa) {
    const dfa = new Automaton();
    dfa.alphabet = nfa.alphabet; // Same alphabet

    // Map of Set-of-IDs (stringified) -> DFA State
    const statesMap = new Map();
    const unprocessedStates = [];

    // 1. Start State = { nfa.startState } (since it's NFA without epsilon, or handled before)
    // If input was ε-NFA, start would be E-Closure(start).
    // Let's assume input is from epsilonRemoval, so it's ready.
    // BUT wait, epsilonRemoval returns an NFA where transitions encompass epsilon paths.
    // So current start state is sufficient.

    const startSet = new Set([nfa.startState]);
    const startKey = getStateSetKey(startSet);

    const dfaStart = new State(startKey); // Temp label
    dfaStart.metadata.nfaStates = Array.from(startSet).map(s => s.id);

    dfa.setStartState(dfaStart);
    statesMap.set(startKey, dfaStart);
    unprocessedStates.push(startSet);

    while (unprocessedStates.length > 0) {
        const currentSet = unprocessedStates.shift();
        const currentKey = getStateSetKey(currentSet);
        const dfaState = statesMap.get(currentKey);

        // Mark accepting if any in set is accepting
        // (This should be done when creating the state, but we can do it here)
        for (const s of currentSet) {
            if (s.isAccepting) {
                dfaState.isAccepting = true;
                dfa.acceptStates.add(dfaState);
                break;
            }
        }

        // For each symbol
        for (const symbol of dfa.alphabet) {
            // Move(currentSet, symbol)
            const nextSet = move(currentSet, symbol);

            // if (nextSet.size === 0) continue; // Dead state logic: Allow it!
            // We want to show the dead state explicitly.

            // However, we need to handle the empty set correctly.
            // getStateSetKey(new Set()) returns "" usually (or however it's implemented).
            // Let's ensure it works.


            const nextKey = getStateSetKey(nextSet);
            let nextDfaState = statesMap.get(nextKey);

            if (!nextDfaState) {
                nextDfaState = new State(nextKey);
                if (nextSet.size === 0) {
                    nextDfaState.label = 'Φ';
                    nextDfaState.isDead = true; // Mark given for styling
                }
                nextDfaState.metadata.nfaStates = Array.from(nextSet).map(s => s.id);

                statesMap.set(nextKey, nextDfaState);
                dfa.addState(nextDfaState);
                unprocessedStates.push(nextSet);
            }

            dfa.addTransition(dfaState, nextDfaState, symbol);
        }
    }

    return dfa;
}




