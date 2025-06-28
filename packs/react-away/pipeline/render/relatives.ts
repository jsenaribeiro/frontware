import React from "react"
import { fixKey, getTagName, REACTIVE } from "common"
import * as client from './client'
import { flow } from "./shared"

export function parent(args: Params) {
   if (!args.jsx) return undefined
   if (args.jsx[REACTIVE]) return args.jsx
   if (Array.isArray(args.jsx)) return this.children(args)
   if (typeof args.jsx == "object" && !args.jsx.type) return this.syblings(args)

   const props = args.jsx.props
   const where = x => typeof args.jsx?.type == x
   const fixed = { ...args.jsx, props, key: fixKey(args.jsx) }
   const model = where("string") ? "element"
      : where("symbol") ? "fragment"
      : where("function") ? "component"
      : undefined
      
   args = { ...args, jsx: fixed }

   if (model == "component") {
      args.earlier = args.jsx.props
      args.parent = getTagName(args.jsx)
   }
   
   if (globalThis.document) switch (model) {
      case "element": return client.element(args, flow)
      case "fragment": return client.fragment(args, flow)
      case "component": return client.component(args, flow)
   }

   else return parentAsync(model, args)
}

async function parentAsync(type: string, args: Params) {
   const server = await import('./server').then(x => x)

   switch (type) {
      case "element": return await server.element(args, flow)
      case "fragment": return await server.fragment(args, flow)
      case "component": return await server.component(args, flow)
   }   

   return undefined
}

export function children<T=Component>(this: Renderer, args: Params<T>) {
   const mapper = jsx => this.parent({ ...args, jsx })
   return React.Children.map(args.jsx, mapper)
}

export function syblings<T=Component>(args: Params<T>) {
   const mapper = ([key, jsx]) => [key, this.parent({ ...args, jsx })]
   const entries = Object.entries(args.jsx).map(mapper)
   return Object.fromEntries(entries)
}