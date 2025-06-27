import { test } from "bun:test";

test('testing...', function () {
   const handler = (path: string, code) => Promise.resolve({ code, type: 'js'})
   const functionDecoratorPlugin = handler as ImportHandler
   console.log(handler.toString())

})