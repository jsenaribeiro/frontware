declare global {
   type none = undefined | null
   type record = Record<Key, any>
   type primitive = string | number | boolean | none
   type Key = string | symbol | number
   type Class<T=any> = { new():T }
   type Side = "client" | "server"
   type Types = 'string' | 'number' | 'boolean' | 'object' | 'function' | 'class' | ''
   type Time = `${number}h` | `${number}min` | `${number}s`
   type Type = primitive | object | Function | Type[]
}

export { }