import { global, getModularCSS, JSXON, PRIMITIVES, router } from "common"

export const cssImportMerge = (args: Params) =>
   typeof args.jsx.type != 'string' ? args.jsx
      : global.own.is.serve ? clientStyler(args.jsx)
      : serverStyler(args.jsx)

/** apply css-import into element in client-side */
function clientStyler(jsx: JSX) {
   if (typeof jsx.type != 'string') return jsx
   if (global.own.is.serve) return jsx

   const joinCSS = (obj, css) => (obj[css.selector] = css.stylings) && obj
   const element = createElementFromJSX(jsx)
   
   const style = getModularCSS(router.now)
      .filter(css => element.matches(css.selector))
      .reduce(joinCSS, { } as object)

   return { ...jsx, props: { ...jsx.props, style }}
}

/** apply css-import into element in server-side */
async function serverStyler(jsx: JSX) {
   if (typeof jsx.type != 'string') return jsx
   if (!global.own.is.serve) return jsx

   const JSDOM = await import('jsdom').then(x => x.JSDOM)
   const applyCSS = (obj, css) => (obj[css.selector] = css.stylings) && obj
   const [node] = new JSDOM(htmlfyJSX(jsx)).window.document.body.childNodes   

   const style = getModularCSS(router.now)
      .filter(css => node.matches(css.selector))
      .reduce(applyCSS, { } as object)

   return { ...jsx, props: { ...jsx.props, style }}
}

function createElementFromJSX(jsx: JSX): HTMLElement {
   const htmlString = JSXON.htmlfy(jsx)
   const div = document.createElement('div')
   div.innerHTML = htmlString.trim()
   return div.firstChild as HTMLElement
}

function htmlfyJSX(jsx: JSX<any, any>) {
   if (Array.isArray(jsx)) return jsx.map(htmlfyJSX).join('')

   const props = jsx?.props
   const feeds = global.ioc
   const basic = PRIMITIVES.includes(typeof jsx)

   if (!jsx?.type || basic) return jsx
   if (jsx?.type != "function") return jsx

   function retype(p, f) {
      const reducer = ([key, obj]) => [key, htmlfyJSX(obj)]
      const element = jsx.type({ ...props, p }, { ...feeds, ...f })
      const entries = Object.entries(element.props).map(reducer)

      return { ...element, props: Object.fromEntries(entries) }
   }

   return JSXON.htmlfy({ ...jsx, type: retype })
}