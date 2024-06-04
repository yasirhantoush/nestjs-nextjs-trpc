let obscureRegex = /\S/g;

export function obscureAll(str: string) {
    if (!str) { return '' };
    return str.replace(obscureRegex, '*')
}

export function obscureAllButFirstWord(str: string) {
    if (!str) { return '' };
    return str.split(' ').map((s, i) => i != 0 ? s.replace(obscureRegex, '*') : s).join(' ')
}

export function obscureAllButLastXChars(str: string, x: number) {
    if (!str) { return '' };
    return str.split('').map((s, i, a) => (i < (a.length - x) ? s.replace(obscureRegex, '*') : s)).join('')
}