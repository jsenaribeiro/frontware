export {}

declare global {
   interface Array<T> {
      distinct(): T[]
      distinct<K=any>(selector: (item: T) => K): T[];

      pairs(): [T, T][]
      first(): T | undefined
      first(predicate: (item: T) => boolean): T[keyof T] | undefined
      count(predicate: (item: T) => boolean): number
      pipeline<T=any>(initial: T): T
   }

   interface Array<T extends [string, any]> { toObject(): object }

   interface ArrayConstructor {
      range(total: number): number[]
      range(first: number, final: number): number[]
   }
}

declare global { interface NodeList { toArray<T = any>(): T[] } }