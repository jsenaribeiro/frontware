/** @module Own reflection type */

import { Loader } from "bun"
import { RenderFlow } from "pipeline/render"

declare global {
   type JsxType = "component" | "fragment" | "element"
   type HandleMode = 'catch' | 'fetch' | 'match'
   type MatchMode = 'jsx' | 'make' | 'props' | 'import'

   interface Handler { }

   interface CatchHandler<T extends Error, U> extends Handler {
      (error: T): U
   }

   interface FetchHandler extends Handler {
      (request: Request): Request | Response
   }

   interface MatchHandler extends Handler { }

   /** server-side and client-side component render */
   interface JsxHandler extends MatchHandler {
      (side: 'client', args: RenderArgs, flow: RenderFlow): JSX<string> 
      (side: 'server', args: RenderArgs, flow: RenderFlow): Promise<JSX<string>>
   }
   /** fullstack props handler */
   interface PropsHandler extends MatchHandler {
      (props: Props, params: Params): Props & { [k:string]: any }
   }

   /** building time transformer  */
   interface MakeHandler extends MatchHandler {
      (file: File): Promise<void>
   }

   /** server side bun plugin */
   interface ImportHandler extends MatchHandler {
      (path: string, code: string): Promise<{ type: Loader, code: string }> | undefined
   }

   interface Directories {
      builds: `/${string}`
      routes: `/${string}`
      assets: `/${string}`
   }

   interface Options {
      path: Directories
      root: `#${string}`
      html: `${string}.html`
      mini: boolean
      zlib: boolean
   }

   interface Context {
      options: Options
      packers: { extension: string, handler: PackerHandler }[]
      loaders: { extension: string, handler: LoaderHandler }[]
      renders: { type: JsxType, handler: JsxHandler }[]
      routers: { route: string, handler: RouterHandler }[]
      propers: { tags: string, handler: ProperHandler }[]
   }
}

export { }