import { expect, test } from "bun:test"
import { refocus } from "./refocus"
import { delay } from "standard"
import { JSDOM } from 'jsdom'

globalThis.document ||= {} as any
globalThis.window ||= { document: globalThis.document } as any

test('refocus: refocus element uid', async function () {
   const htmlString = `<html><body><h1>title</h1><input /></body></html>`
   document = new JSDOM(htmlString).window.document
   
   const body = document.body as HTMLBodyElement
   const input = body.querySelector('input')
   const active = () => document.activeElement as HTMLElement

   input.id = 'txtFocus'
   input.setAttribute('uid', '0')
   input.focus(); // apply focus
   active().blur() // remove focus   `
   
   refocus(333)

   await delay(111)
   expect(active().id).toBe('')

   
   await delay(222)
   expect(active().id).toBe('txtFocus')   

   delete globalThis.document
   delete globalThis.window
})