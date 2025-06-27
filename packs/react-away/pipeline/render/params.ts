import { getTagName } from "standard"

export function params(args: RenderArgs<string>): Params | null {
   if (typeof args.jsx.type != 'string') return null

   return {
      uid: args.id++,
      own: args.root,
      ioc: global.ioc,
      tag: getTagName(args.jsx.type)
   }
}
