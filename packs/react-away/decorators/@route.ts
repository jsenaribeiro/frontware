import { DecoratorError, RequestError } from "commons";

export interface RouteDecorator { exact: boolean; route: string }

const routeDecorator: Decorator<RouteDecorator> = (route: string, exact?: boolean) => (meta, call) => {
   if (!route) throw new DecoratorError(`empty @route(route)`)
   if (!route.match(/^\/[^ "]+$/)) throw `invalid @route(route)`

   routeDecorator.parameters = { route, exact: !!exact }

   return call
}

/** route an specific component to an specific route 
 * @param {string} href route mapping */
export function route(href: string): ReturnType<typeof routeDecorator>

/** route an specific component to an specific route 
 * @param {string} href route mapping 
 * @param {boolean} exact requires exact url, disabling fallback routing */
export function route(href: string, exact: boolean): ReturnType<typeof routeDecorator>
export function route(href: string, exact?: boolean) { return routeDecorator(href, exact) }
