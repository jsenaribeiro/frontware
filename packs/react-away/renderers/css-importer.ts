import { global, getModularCSS, router, createElementFromJSX, jsxElementToHtml } from "commons"

/** apply css-import into element */
export const cssImportStyler = (args: Params) =>
   typeof args.jsx.type != 'string' ? args.jsx
      : global.own.is.serve ? clientStyler(args.jsx)
      : serverStyler(args.jsx)

function clientStyler(jsx: JSX<string>) {
   const joinCSS = (obj, css) => (obj[css.selector] = css.stylings) && obj
   const element = createElementFromJSX(jsx)
   
   const style = getModularCSS(router.now)
      .filter(css => element.matches(css.selector))
      .reduce(joinCSS, { } as object)

   return { ...jsx, props: { ...jsx.props, style }}
}

async function serverStyler(jsx: JSX<string>) {
   const JSDOM = await import('jsdom').then(x => x.JSDOM)
   const applyCSS = (obj, css) => (obj[css.selector] = css.stylings) && obj
   const htmlDOM = new JSDOM(jsxElementToHtml(jsx))
   const [node] = htmlDOM.window.document.body.childNodes   

   const style = getModularCSS(router.now)
      .filter(css => node.matches(css.selector))
      .reduce(applyCSS, { } as object)

   return { ...jsx, props: { ...jsx.props, style }}
}

