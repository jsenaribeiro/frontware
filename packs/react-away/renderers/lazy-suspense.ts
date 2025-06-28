"user server"

import { JSXON, router } from "commons"

/** all symbol type is treated as fragment */
export function lazySuspenseRender(args: Params) {
   const fall = args.jsx.props.fallback // fallback HTML during loading...
   const lazy = args.jsx.type === Symbol.for("react.suspense")
   const html = fall ? JSXON.htmlfy(fall) : ''

   if (lazy && fall && html) global.own.route[router.now].await = html
   
   return args.jsx
}