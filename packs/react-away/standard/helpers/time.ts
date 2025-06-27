
/** promise alternative to setTimeout */
export function delay(time: Time): Promise<void>

/** promise alternative to setTimeout */
export function delay(time: number): Promise<void>

/** promise alternative to setTimeout */
export function delay<T = any>(time: number, call: () => T): Promise<T>
export function delay<T = any>(time: number | Time, call?: () => T) {
   const waiting = getMillisecondsFrom(time)
   const callback = (call || (() => null as any as T))
   const timeout = resolve => () => { resolve(callback()); }
   const promise = resolve => setTimeout(timeout(resolve), waiting)

   return new Promise(promise)
}

/** transform a string time format into millisecond number */
export function getMillisecondsFrom(value: number | Time) {
   if (typeof value == "number") return value

   const maps = { h: 1000 * 60 * 60, min: 1000 * 60, s: 1000 }
   const unit = `${value}`.replace(/\d/g, '')?.trim() || ''
   const data = parseInt(`${value}`.replace(/\D/g, '')?.trim() || '0')
   const time = (maps[unit] || 0) * (data || 0)

   return time
}