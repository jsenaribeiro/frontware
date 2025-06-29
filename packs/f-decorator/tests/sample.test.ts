import { expect, test } from 'bun:test'
import '../types'

interface SampleDecorator { value: number }

const original = { ...console }
const contexts = { logs:[] as string[] }

class log extends FunctionDecorator<SampleDecorator, { message: string }> {
   constructor(args) { super(args) }
   public annotation() {
      console.log(this.call.name)
      console.log(this.call.path)
      console.log(this.args.message)
      return { value: 1 }
   }
}

//@ts-ignore
@log({ message: 'it works!' })
function Example() { }

test('sample', function () {
   console.log = function (args) { contexts.logs.push(args) }
   const decorator = Example.decorators[0]

   expect(decorator.name).toBe('log')
   expect(decorator.args).toEqual({ message: 'it works!' })
   expect(decorator.call.name).toBe(Example.name)
   expect(decorator.data).toEqual({ value: 1 })

   expect(contexts.logs).toContain(Example.name)
   expect(contexts.logs).toContain(Example.path)
   expect(contexts.logs).toContain('it works!')

   console = original
})

