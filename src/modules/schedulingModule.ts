import { TableState } from "../core/types";

export function schedulingModule(table: TableState) {
  let raf = 0;

  function renderTick() {
    raf = 0;
    table.onBeforeRender.emit();
    table.onRender.emit();
  }

  function schedule() {
    if (raf === 0) {
      raf = requestAnimationFrame(renderTick);
    }
  }

  table.onDirty.add(schedule);
  table.onResize.add(schedule);
  table.onInvalidate.add(schedule);
  table.onStart.add(schedule);
  table.onDispose.add(() => {
    if (raf !== 0) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  });
}
