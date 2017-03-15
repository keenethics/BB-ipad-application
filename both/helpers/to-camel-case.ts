export function toCamelCase(str: string) {
  return str.replace(/^([A-Z])|[\s-_&/](\w)/g, (match: string, p1: string, p2: string) => {
    if (p2) return p2.toUpperCase();
    return p1.toLowerCase();
  });
}
