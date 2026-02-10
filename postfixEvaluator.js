/**
 * postfixEvaluator.js
 * Evaluates postfix tokens to build an ε-NFA.
 */

import { TokenType, EPSILON_SYMBOL } from './regexTokenizer.js';
import { Automaton } from '../automata/model/Automaton.js';
import * as Thompson from '../automata/epsilonNFA/thompson.js';

/**
 * Evaluates the postfix tokens and returns an ε-NFA.
 * @param {Array} postfixTokens 
 * @returns {Automaton} The constructed ε-NFA
 */
export function evaluate(postfixTokens) {
    const stack = [];

    for (const token of postfixTokens) {
        if (token.type === TokenType.LITERAL) {
            stack.push(Thompson.createLiteral(token.value));
        } else if (token.type === TokenType.OR) {
            const second = stack.pop();
            const first = stack.pop();
            stack.push(Thompson.createUnion(first, second));
        } else if (token.type === 'CONCAT') { // explicit concat
            const second = stack.pop();
            const first = stack.pop();
            stack.push(Thompson.createConcat(first, second));
        } else if (token.type === TokenType.STAR) {
            const fragment = stack.pop();
            stack.push(Thompson.createKleeneStar(fragment));
        } else if (token.type === TokenType.PLUS) {
            const fragment = stack.pop();
            stack.push(Thompson.createPlus(fragment));
        }
    }

    const finalFragment = stack.pop();
    if (stack.length > 0) {
        throw new Error('Invalid regex: stack not empty after evaluation');
    }

    // Convert Fragment to Automaton
    const automaton = new Automaton();

    // We need to traverse the fragment to add all states/transitions to the automaton
    // Or we can just rely on the start/accept states and traverse from there?
    // The Automaton class usually wants to know about all states.
    // Let's traverse using BFS/DFS from finalFragment.start

    // Set start and accept
    automaton.setStartState(finalFragment.start);
    finalFragment.end.isAccepting = true;
    automaton.addState(finalFragment.end);

    const queue = [finalFragment.start];
    const visited = new Set();
    visited.add(finalFragment.start.id);

    while (queue.length > 0) {
        const current = queue.shift();
        automaton.addState(current);

        for (const t of current.transitions) {
            // Add symbol to vocabulary
            if (t.symbol !== EPSILON_SYMBOL) {
                automaton.alphabet.add(t.symbol);
            }

            if (!visited.has(t.to.id)) {
                visited.add(t.to.id);
                queue.push(t.to);
            }
        }
    }

    return automaton;
}
