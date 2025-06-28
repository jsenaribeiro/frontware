import { server } from "./@server"
import { expect, test } from "bun:test"
import { getMillisecondsFrom, SampleComponent } from "../helpers"
import { IS_ONLY_FOR_ROUTE } from "../constants"

test.skip('@server: default component is allowed', async function () {
   try { server("static")(import.meta, SampleComponent) }
   catch (error) {
      console.warn(error)
      expect(error).toInclude(IS_ONLY_FOR_ROUTE)
   }
})

function pretest(mode: ServerRender, span?: Time) {
   const call = SampleComponent
   const path = '/example/routes/sample'
   const args = { url: 'file:///example/routes/sample' } as any
   const time = span ? getMillisecondsFrom(span) : 0
   
   server(mode as any, time)(args, call)

   return  {
      call,
      path,
      time,
      mode,
      href: path,
      name: call.name
   }
}

test.skip('@server: static server is defined', async function () {
   globalThis.IS_SERVER_SIDE_TEST = true   
   const expected = pretest("static")   
   expect(global.env.meta.calls).toContainValue(expected)
})

test.skip('@server: dynamic server is defined', async function () {
   globalThis.IS_SERVER_SIDE_TEST = true
   const expected = pretest("dynamic")
   expect(global.env.meta.calls).toContainValue(expected)
})

test.skip('@server: dynamic server is defined', async function () {
   globalThis.IS_SERVER_SIDE_TEST = true
   const expected = pretest("periodic", "1s")
   expect(global.env.meta.calls).toContainValue(expected)
})
