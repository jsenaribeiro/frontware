import { Path } from "./path"
import { StyleRule } from "importers"

export function getComponentName(jsx: JSX)
export function getComponentName(component: Component)
export function getComponentName(args: JSX | Component) {
   if (typeof args != 'function') return getComponentName(args.type)
   if (!args) throw new Error(`invalid argument in getComponentName: ${args}`)
   
   const name = args.name
   const meta = args.metadata
   const wrap = args.toString().match(WRAP_COMPONENT)
   const path = Path.from(meta.path)

   if (name?.trim() && name != "default") return name
   else if (path.name) return path.name
   else if (wrap) return wrap[1]
   else throw "Failed to getComponentName"
}

/** get correspondent tag name for each react component type */
export const getTagName = (node: JSX) => 
   typeof node?.type == "function" ? node?.type.name 
 : typeof node?.type == "string" ? node?.type
 : typeof node?.type == "symbol" ? '<>'
 : ''

export const fixKey = (child: { key?: string | null }) =>
   child?.key && child?.key.includes(".") ? null : child?.key

const WRAP_COMPONENT = /\(\) => React\.createElement\(React.Fragment, null, React.createElement\((.+?),/   

export function getModularCSS(route: string) {
   const module = global.own.modules.find(x => x.path.includes(route))
   const isStyleRuleObject = exported => Object.keys(exported).includes('stylings')
   return module.ports.imports.filter(isStyleRuleObject).map(x => x as any as StyleRule)
}