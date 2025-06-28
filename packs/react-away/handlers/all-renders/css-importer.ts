"use client"

import { getModularCSS, JSXON, PRIMITIVES, router } from "common"

/** apply css-import into element in client-side */
export function clientStyler(args: Params) {
   if (typeof args.jsx.type != 'string') return args.jsx
   if (global.own.is.serve) return args.jsx

   const joinCSS = (obj, css) => (obj[css.selector] = css.stylings) && obj
   const element = createElementFromJSX(args.jsx)
   
   const style = getModularCSS(router.now)
      .filter(css => element.matches(css.selector))
      .reduce(joinCSS, { } as object)

   return { ...args.jsx, props: { ...args.jsx.props, style }}
}

export function createElementFromJSX(node: JSX): HTMLElement {
   const htmlString = JSXON.htmlfy(node)
   const div = document.createElement('div')
   div.innerHTML = htmlString.trim()
   return div.firstChild as HTMLElement
}

/** apply css-import into element in server-side */
export async function serverStyler(args: Params) {
   if (typeof args.jsx.type != 'string') return args.jsx
   if (!global.own.is.serve) return args.jsx

   const JSDOM = await import('jsdom').then(x => x.JSDOM)
   const applyCSS = (obj, css) => (obj[css.selector] = css.stylings) && obj
   const [node] = new JSDOM(htmlfyJSX(args.jsx)).window.document.body.childNodes   

   const style = getModularCSS(router.now)
      .filter(css => node.matches(css.selector))
      .reduce(applyCSS, { } as object)

   return { ...args.jsx, props: { ...args.jsx.props, style }}
}

function htmlfyJSX(child: JSX<any, any>) {
   if (Array.isArray(child)) return child.map(htmlfyJSX).join('')

   const props = child?.props
   const feeds = global.ioc
   const basic = PRIMITIVES.includes(typeof child)

   if (!child?.type || basic) return child
   if (child?.type != "function") return child

   function retype(p, f) {
      const reducer = ([key, obj]) => [key, htmlfyJSX(obj)]
      const element = child.type({ ...props, p }, { ...feeds, ...f })
      const entries = Object.entries(element.props).map(reducer)

      return { ...element, props: Object.fromEntries(entries) }
   }

   return JSXON.htmlfy({ ...child, type: retype })
}