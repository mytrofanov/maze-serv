export const checkForNullUndefined = (value: string | number) => {
    if (value === 'null' || value === 'undefined' || value === null || value === undefined) {
        return null;
    }
    return value;
};
