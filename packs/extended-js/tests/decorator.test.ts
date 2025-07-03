import { expect, test } from "bun:test";
import { functionDecoratorPlugin } from "decorator";

const input = `
function ignoreMe(ok) {
   return \`whatever \${ok}\`
}

@log function parenthelessDecorator() { return 1 }
@log(true) function decoratorWithBoolean() { return 2}
@log({ ok: true }) function decoratorWithObject() { return 3 }
@ok(true) @log('done') function multipleDecorators() { return 4}

@log const parenthelessDecoratorArrow = () => { return 5 }
@log(true) const decoratorWithBooleanArrow = () => { return 6}
@log({ ok: true }) const decoratorWithObjectArrow = () => { return 7 }
@ok(true) @log('done') export const multipleDecoratorsArrow = () => { return 8 }
`

test('case', async function () {
   // console.log(0, line)
   const result = await functionDecoratorPlugin('/fake.ts', input)
   console.log(result.code)
})

// input.trim().split('\n').forEach(function (line) {
//    const name = line.includes('function')
//       ? line.split('function')[1].split('(')[0].trim()
//       : line.split('=')[0].split('const ')[1]?.trim() || '?'
   
//    test('case: ' + name, async function () {
//       // console.log(0, line)
//       const result = await functionDecoratorPlugin('/fake.ts', line)
//       console.log(result.code)
//    })
// })