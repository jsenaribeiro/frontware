import React from "react"

export function children<T=Component>(this: RenderFlow, args: RenderArgs<T>) {
   const mapper = jsx => this.parent({ ...args, jsx })
   return React.Children.map(args.jsx, mapper)
}

export function syblings<T=Component>(args: RenderArgs<T>) {
   const mapper = ([key, jsx]) => [key, this.parent({ ...args, jsx })]
   const entries = Object.entries(args.jsx).map(mapper)
   return Object.fromEntries(entries)
}