import { SubmitEvent, SubmitReturn, HTML, ChildProps } from "./formProps.type"

interface Props { children?: any; onValidate?: Function }

/** form[data] for reactive rendering after submit the form  */
export function validate(props: Props, e: SubmitEvent): SubmitReturn {
   global.ioc.fails = []   
   clearCustomValidity()

   const inputs = Array.from<HTML>(e.target.elements)
   const errors = getInvalidInputs(props, inputs)

   if (errors.length) e.target.reportValidity()
   
   return { errors, inputs }
}

/** clear HTML custom validity */
function clearCustomValidity() {
   const result = globalThis.document
      .querySelectorAll<HTML>(":invalid")

   Array.from(result)
      .filter(x => !!x.setCustomValidity)
      .forEach(x => x.setCustomValidity(''))
}

/** get invalidated inputs */
export function getInvalidInputs(props: Props, inputs: HTML[]) {
   if (!props.children?.forEach) return []   
   else inputValidateBindOf(props, inputs)

   const each = x => ({ error: x.validationMessage, value: x.value, field: x.name })
   const invalids = inputs.filter(x => !!x.validationMessage).map(each) || []

   return props.onValidate?.call(invalids) || invalids
}

/** binding with [validate] props to setCustomValidity */
function inputValidateBindOf(props: Props, inputs: HTML[]) {
   const getInputOf = (bind?: string) => inputs.find(x => x.getAttribute('bind') == bind)
   const setErrorOf = (error: string, input: any) => error && input?.setCustomValidity(error) || input
   const clearValidationAfterChanged = input => input.onchange = () => input.setCustomValidity('')

   function getValidatePropsOf(props: ChildProps, bindProps: ChildProps[] = []) {
      if (props?.bind && props?.validate) bindProps.push(props)
      if (Array.isArray(props?.children)) props.children
         .forEach(c => getValidatePropsOf(c.props, bindProps))

      return bindProps
   }

   const setCustomValidityAndGetInput = props => 
      props.map(props => ({ bind: props.bind, test: props.validate }))
           .map(({ bind, test }) => ({ test, data: getInputOf(bind) }))
           .map(({ test, data }) => [test(data?.value), data])
           .map(([fail, data]) => setErrorOf(fail, data))

   getValidatePropsOf(props)
      .map(setCustomValidityAndGetInput)
      .forEach(clearValidationAfterChanged)
}