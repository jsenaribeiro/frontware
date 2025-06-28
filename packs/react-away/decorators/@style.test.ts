import { expect, test, mock } from "bun:test"
import { style } from "./@style"
import { delay, SampleComponent } from "../helpers"

test.skip('@style: check if style is cached', async function () {
   globalThis.IS_SERVER_SIDE_TEST = true
   
   // simulating  client-side only to test @style
   globalThis.document = true as any 

   const cssURL: any
      = new URL(`file://${process.cwd()}/`).href
      + '/kernel/decorators/@style.test.css'
   
   // path, without file:///, is the CSS key
   const path = import.meta.url.replace('file://', '')

   // executing style function decorator
   style(cssURL)(import.meta, SampleComponent)   

   await delay(33) // awaiting CSS load in background

   // check if CSS is correctly cache to path
   expect(global['meta'].style[path]).toContain("h1 { background: red; }")

   delete global['document']
})
