/**
 * regexTokenizer.js
 * Splits a regex string into tokens.
 * Handles escapes and basic operators.
 */

export const TokenType = {
    LITERAL: 'LITERAL',
    STAR: 'STAR',         // *
    PLUS: 'PLUS',         // +
    OR: 'OR',             // |
    LPAREN: 'LPAREN',     // (
    RPAREN: 'RPAREN',     // )
    EPSILON: 'EPSILON'    // ε (represented as 'ε' or empty in some contexts, strictly we use a symbol)
};

export const EPSILON_SYMBOL = 'ε';

/**
 * Tokenizes the input regex string.
 * @param {string} regex 
 * @returns {Array} Array of token objects { type, value }
 */
export function tokenize(regex) {
    const tokens = [];
    const len = regex.length;
    let i = 0;

    while (i < len) {
        const char = regex[i];

        if (char === '\\') {
            // Escape handling
            if (i + 1 < len) {
                tokens.push({ type: TokenType.LITERAL, value: regex[i + 1] });
                i += 2;
            } else {
                throw new Error('Invalid escape at end of pattern');
            }
        } else {
            switch (char) {
                case '*':
                    tokens.push({ type: TokenType.STAR, value: '*' });
                    break;
                case '+':
                    tokens.push({ type: TokenType.PLUS, value: '+' });
                    break;
                case '|':
                    tokens.push({ type: TokenType.OR, value: '|' });
                    break;
                case '(':
                    tokens.push({ type: TokenType.LPAREN, value: '(' });
                    break;
                case ')':
                    tokens.push({ type: TokenType.RPAREN, value: ')' });
                    break;
                case ' ':
                    // Ignore spaces? Or treat as literal? 
                    // Usually regex ignores whitespace unless escaped, but let's assume strict for now or ignore.
                    // For this visualizer, let's ignore whitespace to be user friendly, unless user wants space literal.
                    // If they want space literal they should escape or we can just decide space is literal.
                    // Let's decide: SPACE IS IGNORED unless escaped.
                    break;
                default:
                    tokens.push({ type: TokenType.LITERAL, value: char });
            }
            i++;
        }
    }
    return tokens;
}
