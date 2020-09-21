export class Hook<T = {}> {
  private listeners: {
    order: number;
    cb: (t: T) => void;
  }[] = [];

  add(order: number, cb: (t: T) => void) {
    const idx = this.listeners.findIndex((e) => e.order > order);
    if (idx === -1) {
      this.listeners.push({ order, cb });
    } else {
      this.listeners.splice(idx, 0, { order, cb });
    }
  }

  remove(cb: (t: T) => void) {
    const idx = this.listeners.findIndex((e) => e.cb === cb);
    if (idx !== -1) {
      this.listeners.splice(idx, 1);
    }
  }

  emit(t: T) {
    for (const { cb } of this.listeners) {
      try {
        cb(t);
      } catch (e) {
        console.error(e);
      }
    }
  }
}
