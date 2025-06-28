import { DecoratorError, getMillisecondsFrom, global } from "commons"

export interface ServerDecorator { route: string; time: number; mode: ServerRender }

const serverDecorator: Decorator<ServerDecorator> = (mode: ServerRender, args?: Time | number) => (meta, call) => {
   if (!global.own.is.serve) return call

   setTimeout(() => global.own.is.fails = true, 3) /// ???
   global.own.is.fails = false // ???

   const time = typeof args == "number" ? args
      : getMillisecondsFrom(args as Time) || 0

   if (global.env.SIDE == "client") return call

   const routed = meta.url.replace('file://', '') 
   const routes = global.own.directories.routes;
   const failed = `$@server is only for default route component directory`

   if (!routed.includes(routes)) throw new DecoratorError(failed)
   
   serverDecorator.parameters = { mode, time, route: new URL(meta.url).pathname }

   return call
}

/** server rendering for SSG (static) and SSR (dynamic) */
export function server(mode: "static" | "dynamic"): ReturnType<typeof serverDecorator>

/** periodic server rendering for ISR by miliseconds */
export function server(mode: "periodic", ms: number): ReturnType<typeof serverDecorator>

/** periodic server rendering for ISR by time string format*/
export function server(mode: "periodic", time: Time): ReturnType<typeof serverDecorator>

export function server(mode: ServerRender, args?: Time | number) { return serverDecorator(mode, args) }

