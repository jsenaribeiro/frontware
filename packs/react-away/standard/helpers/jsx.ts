import { Path } from "standard"

export function getComponentName(jsx: JSX) {
   if (!jsx.type) throw new Error('invalid jsx in getComponentName')

   const name = jsx.type.name
   const meta = jsx.type.metadata
   const wrap = jsx.type.toString().match(WRAP_COMPONENT)
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

export const REACTIVE = Symbol.for("reactive")