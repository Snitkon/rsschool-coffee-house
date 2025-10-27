export function handleResize(callback: () => void) {
  callback();
}

export function debounce(fn: () => Promise<void>, ms: number) {
  let timeout: number;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(), ms);
  };
}

export function removeKeysFromPayload<T extends object, K extends keyof T>(
  payload: { items: T[]; totalPrice: number },
  keysToRemove: K[],
): { items: Omit<T, K>[]; totalPrice: number } {
  return {
    items: payload.items.map(obj => {
      const newObj = { ...obj };
      keysToRemove.forEach(key => {
        delete newObj[key];
      });
      return newObj;
    }),
    totalPrice: payload.totalPrice,
  };
}
