declare global {
   interface Settings {
      isEnv: boolean
      query: string
      index: string
      paths: Partial<Directories>
   }

   interface Fluent {      
      fetch(handler: FetchHandler): Fluent      
      catch<E extends Error = Error, R = JSX>(handler: CatchHandler<E, R>): Fluent          
      match<T extends MatchMode = 'make'>(mode: T, handler: MakeHandler): Fluent
      match<T extends MatchMode = 'props'>(mode: T, handler: PropsHandler): Fluent
      match<T extends MatchMode = 'import'>(mode: T, handler: ImportHandler): Fluent
      match<T extends MatchMode = 'jsx'>(mode: T, type: JsxType, handler: JsxHandler): Fluent
      serve(buildFolder: string, routeFolder: string): Promise<Bun.Server>
   }
}

export { }

/*
- pipeline: launch, bundle, client, plugin, render(client|server), seo(sitemap, robot)
- handlers: parsers, plugins, proxies
   - parsers: component(side, jsx):jsx, fragment(side, jsx):jsx, element(side, jsx):jsx
   - plugins: import(js, css):T | export(css, html):string | report(.*):void
   - proxies: request(req => req|res), attribute(props => props|null)
*/