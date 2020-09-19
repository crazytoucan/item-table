import { TinyEmitter } from "tiny-emitter";

export class Emitter<T extends object> {
  private te = new TinyEmitter();

  on<K extends keyof T>(type: K, cb: (evt: T[K]) => void) {
    this.te.on(type as string, cb);
  }

  off<K extends keyof T>(type: K, cb: (evt: T[K]) => void) {
    this.te.off(type as string, cb);
  }

  emit<K extends keyof T>(type: K, evt: T[K]) {
    this.te.emit(type as string, evt);
  }
}
