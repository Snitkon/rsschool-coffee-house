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
