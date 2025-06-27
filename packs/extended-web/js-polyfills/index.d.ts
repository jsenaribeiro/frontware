export { }

declare global {
   type Infer<T> = T extends [infer A] ? A : T

   type AnyKeyOf<T, K extends keyof T = keyof T> =
      Pick<T, K> & { [P in Exclude<keyof T, K>]?: never };

   type Predicate<T> = (entity: T) => boolean

   type Writable<T> = { -readonly [P in keyof T]: T[P]; };
}