/**
 * test_manual.js
 * Manual test script providing basic verification of the pipeline.
 * Usage: node src/tests/test_manual.js
 */

import { tokenize } from '../parser/regexTokenizer.js';
import { validate } from '../parser/regexValidator.js';
import { toPostfix } from '../parser/regexToPostfix.js';
import { evaluate } from '../parser/postfixEvaluator.js';
import { removeEpsilons } from '../automata/nfa/epsilonRemoval.js';
import { toDFA } from '../automata/dfa/subsetConstruction.js';
import { renameStates } from '../automata/dfa/dfaStateNaming.js';
import { DFASimulator } from '../simulation/dfaSimulator.js';

const regex = "(a|b)*abb";
const testString = "ababb";
const testStringFail = "abab";

console.log(`Testing Regex: ${regex}`);

try {
    // 1. Parser
    const tokens = tokenize(regex);
    console.log('Tokens:', tokens.map(t => `${t.type}(${t.value})`).join(' '));
    validate(tokens);
    const postfix = toPostfix(tokens);
    console.log('Postfix:', postfix.map(t => t.value).join(' '));

    // 2. ε-NFA
    const enfa = evaluate(postfix);
    console.log(`ε-NFA States: ${enfa.states.size}`);

    // 3. NFA
    const nfa = removeEpsilons(enfa);
    console.log(`NFA States: ${nfa.states.size}`);

    // 4. DFA
    const dfa = toDFA(nfa);
    renameStates(dfa);
    console.log(`DFA States: ${dfa.states.size}`);

    // 5. Simulation
    const simulator = new DFASimulator(dfa);

    console.log(`Simulating '${testString}'...`);
    let res = { done: false };
    while (!res.done) {
        res = simulator.step(testString);
        // console.log(res);
    }
    console.log(`Result for '${testString}': ${res.accepted ? 'ACCEPTED' : 'REJECTED'}`);

    simulator.reset();
    console.log(`Simulating '${testStringFail}'...`);
    res = { done: false };
    while (!res.done) {
        res = simulator.step(testStringFail);
    }
    console.log(`Result for '${testStringFail}': ${res.accepted ? 'ACCEPTED' : 'REJECTED'}`);

} catch (e) {
    console.error('Test Failed:', e);
    process.exit(1);
}
