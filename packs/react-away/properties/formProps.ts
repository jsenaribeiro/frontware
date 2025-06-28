"use client"

import { SubmitEvent } from "./formProps.type";
import { action } from "./formProps.action"
import { validate } from "./formProps.bind"
import { global } from 'commons'

/** react-away forms as form[data] and children[bind] 
 * with RESTful actions and validation api */
export const formProps:PropsHandler = (props: Props, params: Params) => {
   if (global.own.is.serve) return props
   if (params.jsx.type !== "form") return props
   if (!Object.keys(props).includes("data")) return props
   
   // applying onSubmit binding from form[bind].ts
   return { ...clearProps(props), onSubmit: onSubmit(props, params) }
}

export function clearProps(props: any) {
   const newProps = { ...props }
   delete newProps['onAwait']
   delete newProps['onValidate']
   return newProps
}

export const onSubmit = (props, params) => function (e: SubmitEvent) {
   e.nativeEvent.submitter.onclick = "return false"
   e.preventDefault()
   e.stopPropagation()

   const { errors, inputs } = validate(props, e)
   
   if (errors.length > 0) return 

   for (const input of inputs) {
      const field = input.getAttribute('bind')
      const value = inputValueOf(input)
      field && props.data.valueOf(true, field, value)
   }

   if (props['action']) action({ props, params, inputs })

   global.ioc.react()
}

function inputValueOf(input: any) {
   const checkedTypes = ['checkbox', 'radiobutton']
   const isChecked = checkedTypes.includes(input.type)
   return isChecked ? input.checked : input.value
}