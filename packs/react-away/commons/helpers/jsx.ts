import { JSXON } from "./jsxon"
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

export function createElementFromJSX(jsx: JSX<string>): HTMLElement {
   const htmlString = JSXON.htmlfy(jsx)
   const div = document.createElement('div')
   div.innerHTML = htmlString.trim()
   return div.firstChild as HTMLElement
}

export function jsxComponentToHtml(jsx: JSX<Component> | JSX[]) {
   if (Array.isArray(jsx)) return jsx.map(jsxComponentToHtml).join('')
   if (typeof jsx.type != "function") return jsx
   else jsx = jsx as JSX<Component>

   return JSXON.htmlfy({ ...jsx,
      type(props: any, feeds: any) {
         const reducer = ([key, obj]) => [key, jsxComponentToHtml(obj)]
         const params1 = { ...jsx.props, ...props }
         const params2 = { ...global.ioc, ...feeds }
         const element = jsx.type(params1, params2)
         const entries = Object.entries(element.props).map(reducer)

         return { ...element, props: Object.fromEntries(entries) }
      }
   })
}

export function jsxElementToHtml(jsx: JSX<string>): string {
   const { children, ...a } = jsx.props || {}

   const attributeMapper = ([k, v]) => v == null || v === false ? ''
      : `${k === 'className' ? 'class' : k}="${v}"`

   const attributes = Object.entries(a)
      .map(attributeMapper)
      .filter(Boolean)
      .join(' ') || ''

   const content = Array.isArray(children)
      ? children.map(c => typeof c === 'object' ? jsxElementToHtml(c) : c).join('')
      : typeof children === 'object' ? jsxElementToHtml(children) : children ?? ''

   return `<${jsx.type} ${attributes}>${content}</${jsx.type}>`;
}