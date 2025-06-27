/// <reference path="object.d.ts" />
/// <reference path="./index.d.ts" />

/** WARNING!!! Avoid any new object fields, because it bugs Bun,
* only adds static extension or method overrides. */

Object.isEmpty = function(that) {
   if (!that) return true
   return Object.keys(that).length == 0
}

Object.parse = (function(that: any) { return new ParseObject(that) }) as any

Object.merge = function(self, that) {
   Object.keys(self).forEach(function (name) {
      if (that[name] === undefined) return         
      else self[name] = that[name]
   })
}

Object.prototype.toString = function (identation?: number) {
   return identation ? JSON.stringify(this, null, identation) : JSON.stringify(this)
}

Object.fromProxy = function (that) {
   const plain = {}

   for (const key in that) {
      if (Array.isArray(that[key]))
         plain[key] = that[key].map(x => Object.fromProxy(x))

      else if (typeof that[key] == 'object')
         plain[key] = Object.fromProxy(that[key])

      else if (that.hasOwnProperty(key))
         plain[key] = that[key]
   }

   return plain;
}

const valueOf = Object.prototype.valueOf.bind({})

Object.prototype.valueOf = function (fix?: boolean, uri?: string, val?: any, ori?: string, log?: any[]): any {
   if (!uri && typeof fix !== "boolean") return valueOf.bind(this)()

   ori ??= uri
   log = log || []
   uri = (uri || '').trim()
   val = val?.target?.value ?? val

   var that = { ...this }

   const slicing = uri.split('.')
   const getting = val === undefined
   const pathing = /(\.[a-zA-Z_][a-zA-Z0-9_]*)*/gm
   const unfound = slicing.every(k => k in that && (that = that[k]) == that)

   if (uri.match(/^\.|\.$/)) throw 'The path field URI is invalid'
   if (!uri.match(pathing)) throw 'Failed to set bind into object'
   if (!unfound) throw `Not found path binding '${ori}' in ${this.toString(2)}`

   return getting ? getValueOf(this) : setValueOf(this)

   function getValueOf(obj: object) {
      const value = slicing.reduce((x, k) => x[k], obj)
      return fix ? (value?.toString() || '') : value
   }

   function setValueOf(obj: object) {
      const sub = slicing.at(0)?.trim() || ''
      const key = uri?.replace(sub + '.', '')
      const inf = { key: key, sub: sub, uri, val, obj: this }

      try {
         if (sub == key) obj[sub] = val
         else obj[sub].valueOf(fix, key, val, ori, log)
      }
      catch (ex) {
         const info = `: 
            property = ${key}, 
            subfield = ${sub},
            instance = ${obj.toString(2)}`
         console.error('Set binding fails in ' + info)
      }

      return log?.push(inf) || log
   }
}

export class ParseObject<T extends object = any> {
   private readonly entries: [keyof T, any][]

   constructor(that: T) { this.entries = Object.entries(that) as [keyof T, any][] }

   public map = (fn: (value: [keyof T, any], index: number) => [keyof T, any]): [keyof T, any][] => this.entries.map(fn)
   public filter = (fn: (value: [keyof T, any], index: number) => boolean): [keyof T, any][] => this.entries.filter(fn)
   public toObject = () => Object.fromEntries(this.entries) 
   public toArray = () => this.entries
} 