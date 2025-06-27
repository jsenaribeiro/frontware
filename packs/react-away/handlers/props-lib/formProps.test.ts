import { expect, test } from "bun:test";
import { formProps } from "./formProps";

function pretest(props, params, isClientSide = true) {
   global['document'] = isClientSide as any // emulate client-side
   return formProps(props, params)
}

test('form[data]: ignore when server side', function () {
   const props = pretest({ data:{} }, { tag: 'form' }, false)
   expect(props).toEqual({ data: {} })
   expect(props.onSubmit).toBeUndefined()
   delete global['document']
})

test('form[data]: ignore when there is no [data]', function () {
   const props = pretest({}, { tag: 'form' })
   expect(props).toEqual({})
   expect(props.onSubmit).toBeUndefined()
   delete global['document']
})

test('form[data]: ignore when it does not <form>', function () {
   const props = pretest({ data:{} }, { tag: 'h1' })
   expect(props).toEqual({ data: {} })
   expect(props.onSubmit).toBeUndefined()
   delete global['document']
})

test('form[data]: append onSubmit event', function () {
   const props = pretest({ data: {} }, { tag: 'form' })
   expect(props.onSubmit).not.toBeUndefined()
   delete global['document']
})

