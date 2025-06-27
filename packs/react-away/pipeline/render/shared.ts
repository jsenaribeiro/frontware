export function getHandlers(type: MatchMode): JsxHandler[] {
   return global.own.handlers
      .filter(x => x.mode == "match")
      .filter(x => x.type == type)
      .map(x => x as JsxHandler)
}