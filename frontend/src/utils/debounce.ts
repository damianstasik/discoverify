export function debounce<T extends (...args: any[]) => any>(
  cb: T,
  wait?: number,
): T & Cancelable {
  let timeout: number;
  function debounced(...args) {
    const later = () => {
      cb.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  }

  debounced.cancel = () => {
    clearTimeout(timeout);
  };

  return debounced;
}

interface Cancelable {
  cancel(): void;
}
