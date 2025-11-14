
// This helper function formats test types for use in test annotations
export function getTestType(t_type: string[]): string {

    if (!Array.isArray(t_type)) {
        throw new TypeError('t_type must be an array of strings');
    }

    if (t_type.length === 0) {
        throw new TypeError('t_type cannot be an empty array');
    }

    return t_type.map(type => `@${type}`).join('');
} 