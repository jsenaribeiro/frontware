/** @module Own reflection type */

import { Loader } from "bun"
import { RenderFlow } from "pipeline/render"

declare global {
   type HandleMode = 'catch' | 'fetch' | 'match'
   type JsxType = "component" | "fragment" | "element"
   type MatchMode = 'jsx' | 'make' | 'props' | 'import'

   interface Handler { }

   interface CatchHandler<T extends Error = Error> extends Handler {
      (error: T): JSX | undefined
   }

   interface FetchHandler extends Handler {
      (request: Request): Promise<Request | Response>
   }

   interface MatchHandler extends Handler { }

   /** server-side and client-side component render */
   interface JsxHandler<S extends Side = Side, T extends JsxType = JsxType> extends MatchHandler {
      (args: Params): S extends 'server' ? Promise<JSX<string>> : JSX<string>
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