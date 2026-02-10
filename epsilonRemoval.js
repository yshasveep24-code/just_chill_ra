/**
 * epsilonRemoval.js
 * Converts an ε-NFA to an NFA without epsilon transitions.
 * Algorithm:
 * For each state q, and each symbol a:
 *   NFA_delta(q, a) = epsilonClosure(move(epsilonClosure(q), a))
 * Also, if epsilonClosure(q) contains an accept state, q is an accept state in NFA.
 * Start state remains the same (or closure of it? Effectively closure of start set).
 * Actually, standard NFA without epsilon usually keeps same states but adds transitions.
 * OR we construct a new NFA?
 * 
 * "Regex -> ε-NFA -> NFA" usually implies creating an equivalent NFA without ε.
 * 
 * If we keep the same states:
 * New Transition(q, a) goes to all states in epsilonClosure(move(epsilonClosure(q), a)).
 * 
 * Let's implement keeping the same states but modifying transitions & acceptance.
 * Important: Modifying the Automaton in place might refer to old transitions.
 * Better to create a new Automaton or clear transitions and rebuild.
 * 
 * However, the states in ε-NFA are many. NFA conversion often reduces states if we do Subset Construction directly.
 * But here the stage is ε-NFA -> NFA.
 * Standard algorithm: maintain states, add new transitions.
 * 
 * Delta'(q, a) = Union( E-closure(delta(p, a)) ) for all p in E-closure(q)
 * i.e. E-Closure(Move(E-Closure(q), a))
 * 
 * Also, Start state: strictly can remain same if we define start set = E-Closure(q0).
 * But usually we just say q0 is start, and adjustment is handled.
 * 
 * Acceptance: q is accepting if E-Closure(q) contains any accepting state.
 */

import { Automaton } from '../model/Automaton.js';
import { Transition } from '../model/Transition.js';
import { State } from '../model/State.js';
import { getEpsilonClosure } from './epsilonClosure.js';
import { move } from './move.js';
import { EPSILON } from '../epsilonNFA/epsilonUtils.js';

export function removeEpsilons(eNFA) {
    const nfa = new Automaton();

    // Copy states (create new State objects to avoid mutating eNFA? or reuse?)
    // Constraint says "Graph visualization" - if we reuse id, it's easier to map.
    // Let's create new Automaton with SAME states (logic-wise) but new Transition lists.
    // Actually, Cleaner to make new State objects to avoid "ghost" transitions if we re-visualize.

    // Map oldId -> newState
    const stateMap = new Map();

    for (const oldState of eNFA.states) {
        // Clone state (without transitions)
        const newState = new State(oldState.label);
        newState.id = oldState.id; // Keep ID for tracking? Or let it gen new one?
        // Let's keep original ID if possible roughly, or just mapping.
        // Actually State.js auto-increments. Let's rely on label.
        newState.label = oldState.label || `q${oldState.id}`;

        stateMap.set(oldState.id, newState);
        nfa.addState(newState);
    }

    // Set start state
    nfa.setStartState(stateMap.get(eNFA.startState.id));

    // Calculate Transitions and Acceptance
    const alphabet = eNFA.alphabet; // Symbols only

    for (const oldState of eNFA.states) {
        const newState = stateMap.get(oldState.id);
        const closure = getEpsilonClosure(oldState);

        // 1. Acceptance
        // If any state in closure is accepting, new state is accepting
        // (IsAccepting logic: oldState is accepting if ... wait.
        // Standard: q is accepting if E-closure(q) intersection F != empty)
        for (const s of closure) {
            if (s.isAccepting) {
                newState.isAccepting = true;
                nfa.acceptStates.add(newState);
                break;
            }
        }

        // 2. Transitions
        // For each symbol 'a' in alphabet
        for (const symbol of alphabet) {
            // Target set = E-Closure(Move(E-Closure(q), a))
            // Computed as:
            // S1 = E-Closure(oldState) -> 'closure' variable
            // S2 = Move(S1, a)
            // Target = E-Closure(S2)

            const moveResult = move(closure, symbol);
            const targetStates = getEpsilonClosure(moveResult);

            for (const targetOld of targetStates) {
                const targetNew = stateMap.get(targetOld.id);
                // Add transition newState -> targetNew on 'symbol'
                nfa.addTransition(newState, targetNew, symbol);
            }
        }
    }

    nfa.alphabet = new Set(alphabet);
    return nfa;
}



