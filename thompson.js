/**
 * thompson.js
 * Implements Thompson's construction algorithm.
 */

import { State } from '../model/State.js';
import { Transition } from '../model/Transition.js';
import { Fragment } from './fragment.js';

const EPSILON = 'ε';

export function createLiteral(char) {
    const start = new State();
    const end = new State();
    const transition = new Transition(start, end, char);
    start.addTransition(transition);
    return new Fragment(start, end);
}

export function createConcat(first, second) {
    // Optimization: Merge first.end and second.start to eliminate epsilon
    // We move all transitions from second.start to first.end

    for (const t of second.start.transitions) {
        // Retarget the transition source to first.end
        // Note: Transition object has immutable 'from', so we create new Transition
        const newT = new Transition(first.end, t.to, t.symbol);
        first.end.addTransition(newT);
    }

    // second.start is now effectively removed/bypassed.
    return new Fragment(first.start, second.end);
}

export function createUnion(first, second) {
    const start = new State();
    const end = new State();

    // Split from new start to both fragments
    start.addTransition(new Transition(start, first.start, EPSILON));
    start.addTransition(new Transition(start, second.start, EPSILON));

    // Join both fragments to new end
    first.end.addTransition(new Transition(first.end, end, EPSILON));
    second.end.addTransition(new Transition(second.end, end, EPSILON));

    return new Fragment(start, end);
}

export function createKleeneStar(fragment) {
    const start = new State();
    const end = new State();

    // 4 Epsilon transitions for Star:
    // 1. start -> fragment.start
    // 2. fragment.end -> fragment.start (loop back)
    // 3. fragment.end -> end (exit)
    // 4. start -> end (zero occurrences)

    start.addTransition(new Transition(start, fragment.start, EPSILON));
    fragment.end.addTransition(new Transition(fragment.end, fragment.start, EPSILON));
    fragment.end.addTransition(new Transition(fragment.end, end, EPSILON));
    start.addTransition(new Transition(start, end, EPSILON));

    return new Fragment(start, end);
}

export function createPlus(fragment) {
    const start = new State();
    const end = new State();

    // Similar to Star but guaranteed at least one pass
    // 1. start -> fragment.start
    // 2. fragment.end -> fragment.start (loop back)
    // 3. fragment.end -> end (exit)

    start.addTransition(new Transition(start, fragment.start, EPSILON));
    fragment.end.addTransition(new Transition(fragment.end, fragment.start, EPSILON));
    fragment.end.addTransition(new Transition(fragment.end, end, EPSILON));

    return new Fragment(start, end);
}
