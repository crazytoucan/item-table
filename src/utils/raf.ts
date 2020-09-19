export function raf(cb: () => void) {
  let scheduled = 0;
  const cbAndClear = () => {
    scheduled = 0;
    cb();
  };

  const schedule = () => {
    if (scheduled === 0) {
      scheduled = requestAnimationFrame(cbAndClear);
    }
  };

  const flush = () => {
    if (scheduled !== 0) {
      cancelAnimationFrame(scheduled);
      scheduled = 0;
    }

    cb();
  };

  const cancel = () => {
    if (scheduled !== 0) {
      cancelAnimationFrame(scheduled);
      scheduled = 0;
    }
  };

  return { schedule, flush, cancel };
}
