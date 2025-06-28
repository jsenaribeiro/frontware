import { global, REACTIVE } from "common"

const ignores = ["await", "route", "children"] as any[]

export function useProxy<T = any>(args: ProxyArgs): T{
   args.data[REACTIVE] = true

   const timed = () => { args.sync(); }

   return new Proxy(args.data, {
      get(refer, field) { return refer[field] },
      set(refer, field, value) {
         refer[field] = value

         if (ignores.includes(field)) return true
         if (typeof value == "function") return true

         const delay = global.env.DELAY || 33

         args.time && clearTimeout(args.time)
         args.time = setTimeout(timed, delay)

         return true
      }
   })
}