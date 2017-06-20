export const runAsync = (callback: Function) => {
  if (!callback) return;

  setTimeout(() => {
    callback();
  }, 0);
};
