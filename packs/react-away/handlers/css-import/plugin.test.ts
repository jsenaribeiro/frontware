import { expect, test } from "bun:test";
import { cssImportPlugin } from "./plugin";
import "./plugin.mocks";

const code = `
/* * { color:red } */
body table tr {
   border-bottom: solid 1px grey;
}
h1 { color: blue; background-color: yellow }
`

const expected = [
   {
      selector: "body table tr",
      stylings: {
         borderBottom: "solid 1px grey",
      },
   }, {
      selector: "h1",
      stylings: {
         color: "blue",
         backgroundColor: "yellow",
      },
   }
 ]

test('CSS plugin: server-side parser', async function () {
   global.own = { is: { serve: true } } as any
   global.own.modules = [{} as any]

   await cssImportPlugin({ code, path: 'file:///fake.ts' })   
   const resulted = global.own.modules[0].styles   
   expect(resulted).toEqual(expected)
})

test('CSS plugin: client-side parser', async function () {
   global.own = { is: { serve: false } } as any
   global.own.modules = [{} as any]

   await cssImportPlugin({ code, path: 'file:///fake.ts' })
   const resulted = global.own.modules[0].styles
   expect(resulted).toEqual(expected)
})

