/// <reference path="shared.d.ts" />

import 'commons'
import { global } from 'commons'
import { bundler } from '../builder'

export function launch(settings: Partial<Settings>): Fluent
export function launch(hasEnvFile: boolean): Fluent
export function launch(hasEnvFile: boolean, root: `#${string}`): Fluent
export function launch(hasEnvFile: boolean, root: `#${string}`, index: `${string}.html`): Fluent
export function launch(args: boolean | Partial<Settings>, root?: `#${string}`, index?: `${string}.html`): Fluent {
   global.own.url = index || global.own.url
   global.own.root = root || global.own.root

   if (typeof args == 'object') {
      const settings = args as Settings
      global.own.url = settings.index || global.own.url
      global.own.root = settings.query || global.own.root
      Object.merge(global.own.directories, settings)
   }

   const fluent: Fluent = { catch: _catch, match, fetch, serve }

   function _catch<E extends Error>(handler: CatchHandler<E>) {
      global.own.handlers['catch'].push(handler)
      return fluent
   }

   function fetch(handler: FetchHandler) {
      global.own.handlers['fetch'].push(handler)
      return fluent
   }

   function match( type:JsxType, handler: MatchHandler) {
      global.own.handlers.match[type] = handler
      return fluent
   }

   async function serve() {
      const hasEnv = typeof args == 'boolean' ? args : args.isEnv
      const loadEnv = global.env.load

      await loadEnv(hasEnv)
      await bundler(false)

      const port = global.env.PORT || 3000

      console.log(`Serving at ${global.env.PORT}`, "FG_GREEN")
      
      return Bun.serve({
         port: process.env.PORT || port,
         development: global.env.FLAGS.debug,
         async fetch(request: Request) {
            for (const handler of global.own.handlers.fetch) {
               const result = await handler(request)
               if (result instanceof Response) return result
               else if (result instanceof Request) request = result
               else throw new Error(`Invalid handler ${handler.name}`)
            }

            throw new Error('Not found request handler response...')
         }
      })
   }

   return fluent
}