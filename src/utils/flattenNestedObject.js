export function flattenNestedObject(obj, prefix = '') {
  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    const prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(acc, flattenNestedObject(value, prefixedKey));
    } else {
      acc[prefixedKey] = value;
    }

    return acc;
  }, {});
}
