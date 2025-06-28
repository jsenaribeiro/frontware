import { children, syblings, parent } from './relatives'

export function getHandlers(type: MatchMode): JsxHandler[] {
   return global.own.handlers
      .filter(x => x.mode == "match")
      .filter(x => x.type == type)
      .map(x => x as JsxHandler)
}

export const flow: Renderer = { children, syblings, parent }

/** client-side is the fallback server render 
 * turn it a fallback handler */
export function client(jsx: JSX, url: string, ex: any) {
   const error = global.own.handlers.catch.find(f => f(ex))

   if (!error) throw ex

   const child = error(ex)
   const jsons = stringifyObjectFieldValues(child.props)

   /** make error invisible and start retry fallback routing */
   const props = { ...jsons, retry: url, hidden: true, ...child?.props }

   // route crash is a failed render
   // as an special case of exception
   global.own.route[url].crash = jsx

   return { ...error, props }
}

function stringifyObjectFieldValues(obj: record) {
   const strings = (k, v) => [k, JSON.stringify(v)]
   const entries = Object.entries(strings)
   return Object.fromEntries(entries)
}


export const SELF_CLOSE_TAGS = ['area', 'base', 'br', 'col', 'command', 'embed',
   'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr']