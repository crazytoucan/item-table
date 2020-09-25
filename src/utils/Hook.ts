import { removeFirst } from "./collectionUtils";

interface IListener<T> {
  (t: T): void;
}

type IEmit<T> = T extends void ? () => void : (t: T) => void;

export class Hook<T = void> {
  private listeners: IListener<T>[] = [];
  private allowEdits = true;

  add(cb: (t: T) => void) {
    this.ensureAllowEdits();
    this.listeners.push(cb);
  }

  remove(cb: (t: T) => void) {
    this.ensureAllowEdits();
    removeFirst(this.listeners, cb);
  }

  emit = ((t: T) => {
    this.allowEdits = false;
    const listeners = this.listeners;
    for (let i = 0; i < listeners.length; i++) {
      try {
        listeners[i](t);
      } catch (e) {
        console.error(e);
      }
    }

    this.allowEdits = true;
  }) as IEmit<T>;

  private ensureAllowEdits() {
    if (!this.allowEdits) {
      this.listeners = [...this.listeners];
      this.allowEdits = true;
    }
  }
}
