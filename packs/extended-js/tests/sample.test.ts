import { expect, test } from 'bun:test'
import '../types'

interface SampleDecorator { value: number }

class log extends Decorator<SampleDecorator, { text: string }> {
   constructor(args) { super(args) }
   public annotation() {
      console.log(this.call.name)
      console.log(this.call.path)
      console.log(this.args.text)
      return { value: 1 }
   }
}

//@ts-ignore
@log({ message: 'it works!' })
function Example() { }

test('sample', function () {
   const decorator = Example.decorators[0]

   expect(decorator.name).toBe('log')
   expect(decorator.args).toEqual({ message: 'it works!' })
   expect(decorator.call.name).toBe(Example.name)
   expect(decorator.data).toEqual({ value: 1 })
})

