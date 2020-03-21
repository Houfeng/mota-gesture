import { ITouchPoint } from "./ITouchPoint";
import { ITouchEvent } from "./TouchEvents";
import { TouchOptions } from "./TouchOptions";
import { ITouchHandler } from "./ITouchHandler";
import { ITouchProps } from "./ITouchProps";

export class TouchOwner implements TouchOwner {
  public startPoints?: ITouchPoint[];
  public lastPoints?: ITouchPoint[];
  public isPointDown?: boolean;
  public lastTapTime?: number;
  public isDoubleTap?: boolean;
  public isSwipe?: boolean;
  public isPinch?: boolean;
  public direction?: string;
  public scale?: number;
  public moveX?: number;
  public moveY?: number;
  public holdTimer?: number;

  public get startPoint() {
    return this.startPoints?.[0];
  }

  public get lastPoint() {
    return this.lastPoints?.[0];
  }

  public startHoldTimer(done: Function) {
    this.holdTimer = setTimeout(done, TouchOptions.holdDurationThreshold);
  }

  public clearHoldTimer() {
    clearTimeout(this.holdTimer);
  }

  public emit(event: ITouchEvent, ...handlers: ITouchHandler[]) {
    if (!handlers) return;
    Object.assign(event, this);
    handlers.forEach(handler => handler && handler(event));
  }

  public get distanceX() {
    return Math.abs(this.moveX);
  }

  public get distanceY() {
    return Math.abs(this.moveY);
  }
}

export function getEventOwner(
  event: ITouchEvent,
  props: ITouchProps
): TouchOwner {
  const mountKey = `__mota_touch_${String(props?.key || "default")}__`;
  const target = event.currentTarget as any;
  if (!target[mountKey]) {
    target[mountKey] = new TouchOwner();
  }
  return target[mountKey];
}
