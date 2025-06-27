declare global {
   type none = undefined | null
   type record = Record<Key, any>
   type primitive = string | number | boolean | none
   type Key = string | symbol | number
   type Class = { new() }
   type types = 'string' | 'number' | 'boolean' | 'object' | 'function' | 'class' | ''
   type Side = "client" | "server"
   type Time = `${number}h` | `${number}min` | `${number}s`
   type Type = primitive | object | Function | Type[]
}

export { }