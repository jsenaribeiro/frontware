import { test, expect } from "bun:test"
import { Decorator } from "../types"
import '../types'

test('class test', function () {
   var counter = 0

   class ok extends Decorator {
      constructor(is: boolean) { super({ is }) }
      public annotation() { return this.call }
   }

   class log extends Decorator {
      constructor(msg: string) { super({ msg }) }
      public annotation() { return ++counter }
   }

   const fnc = new ok(true).decorate(
      new log('done').decorate((value) => { return value }).call).call;
   
   const logDecorator = fnc.decorators[0]
   const okDecorator = fnc.decorators[1]

   expect(okDecorator.name).toBe('ok')
   expect(logDecorator.name).toBe('log')
   expect(logDecorator.data).toBe(undefined)   
   fnc(true)
   expect(logDecorator.data).toBe(1)
   fnc(true)
   expect(logDecorator.data).toBe(2)


})