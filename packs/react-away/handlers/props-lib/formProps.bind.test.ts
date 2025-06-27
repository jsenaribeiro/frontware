import { expect, test } from "bun:test";
import { formProps } from "./formProps";
import { JSDOM } from 'jsdom';

const person = { name: '', info: { status: false }, a: { b: { c: '' } } }

async function pretest(inner, props?, params?) {
   const outer = `<html><body><form>${ inner }</form></body></html>`

   global['document'] = new JSDOM(outer).window.document

   params ||= { tag: 'form' }
   props ||= { data: person, children: [] }
   props = formProps(props, params)

   const event: Partial<SubmitEvent> | any = {
      preventDefault() { },
      stopPropagation() { },
      nativeEvent: { submitter: { onclick: '' } },
      target: document.querySelector('form')
   }
   
   const result = () => ({
      event,
      invalids: document
         .querySelector('form')
         .querySelectorAll(":invalid")
   })

   const submit = () => props.onSubmit(event) || result()

   return { props, submit }
}

test('form[submit]: data binding after submit', async function () {
   const html = `
      <input bind='name' />
      <textarea bind='a.b.c'></textarea>
      <input type='checkbox' bind='info.status' />`

   const { props, submit } = await pretest(html)
   const input = document.querySelector('input')
   const textarea = document.querySelector('textarea')
   const checkbox = document.querySelector<HTMLInputElement>('[type=checkbox]')

   input.value = 'john'
   checkbox.checked = true
   textarea.value = 'hello world!'

   expect(props.data.name).toBe('')
   expect(props.data.a.b.c).toBe('')
   expect(props.data.info.status).toBe(false)

   await submit()

   expect(props.data.name).toBe(input.value)
   expect(props.data.a.b.c).toBe(textarea.value)
   expect(props.data.info.status).toBe(checkbox.checked)

   delete global['document']
})

const invalidScenarios = [
   { props: 'required', value: '' },
   { props: 'min="2"', value: '0', type: 'number' },
   { props: 'max="2"', value: '3', type: 'number' },
   { props: 'maxlength=2', value: 'abc' },
   { props: 'minlength=4', value: 'abc' },
   { props: 'pattern="\\d+"', valude: 'abc' }]

invalidScenarios.forEach(async function (testCase) {
   await test(`form[bind]: validation ${testCase.props}`, async function () {
      const htmlString = `<input bind='name' ${testCase.props}>`
      const { props, submit } = await pretest(htmlString)
      const input = document.querySelector('input')

      if (testCase.props.includes('length'))
         patchMinMaxLengthValidation(input)

      input.value = testCase.value
      input.type = testCase.type || 'text'

      const { invalids } = submit()

      expect(invalids.length).toBe(1)

      // JSDOM has not full support to Validation API
      // so, even with patch, it does not work
      // well with pattern and x-length
      // expect(props.data.name).toBe('john') 
   })
})


export function patchMinMaxLengthValidation(input: HTMLInputElement) {
   const originalValidity = input.validity;

   const validate = () => ({
      ...originalValidity,
      tooShort: input.minLength > -1 && input.value.length < input.minLength,
      tooLong: input.maxLength > -1 && input.value.length > input.maxLength,
      valid:
         (!input.required || input.value.length > 0) &&
         (input.minLength < 0 || input.value.length >= input.minLength) &&
         (input.maxLength < 0 || input.value.length <= input.maxLength)
   })

   Object.defineProperty(input, 'validity', {
      get: () => ({ ...input.validity, ...validate() }),
      configurable: true
   });

   input.checkValidity = () => validate().valid
 }