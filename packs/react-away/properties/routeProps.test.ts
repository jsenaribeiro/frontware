import { expect, test } from "bun:test";
import { routeProps } from "./routeProps";
import { testParams } from "./test";

test.skip('[route|link]: ignore when [link] and [route] are empties', function() {
   const oldProps = { link: '', route: '' }
   const newProps = routeProps(oldProps, testParams)

   expect(oldProps).toBe(newProps as any)
})

const scenariosRoute = [
   { elementRoute: '/sample', currentRoute: '/test', hidden: true },
   { elementRoute: '/test', currentRoute: '/', hidden: true },
   { elementRoute: '/', currentRoute: '/test', hidden: false },
   { elementRoute: '/', currentRoute: '/', hidden: false }
]

test.skip('[route]: routing hidden succeed', function () {
   scenariosRoute.forEach(function (scenario) {   
      globalThis.window = { location: { pathname: scenario.currentRoute } as any } as any
      globalThis.location = globalThis.window.location
   
      const oldProps = { route: scenario.elementRoute }
      const newProps = routeProps(oldProps, testParams)

      if (scenario.hidden) expect(newProps.hidden).toBe(scenario.hidden)
      else expect(newProps.hidden).toBe(undefined)
      
      delete globalThis['window']
      delete globalThis['location']
   })
})

test.skip('[link]: link binding succeed ', function () {
   globalThis['window'] = { location: { pathname: '/' } } as any
   globalThis['location'] = globalThis['window'].location
   globalThis.history = <any> {
      state: [],
      pushState(a, b, route) {
         this.state.push(route)
      }
   }

   const oldProps = { link: '/test' }
   const newProps = routeProps(oldProps, testParams)

   expect(globalThis.history.state.length).toBe(0)
   newProps.onClick()
   expect(globalThis.history.state[0]).toBe('/test')

   delete globalThis['window']
   delete globalThis['history']
   delete globalThis['location']
})