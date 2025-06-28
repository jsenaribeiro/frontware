import '../commons'

declare global {
   type OnValidateEvent = (invalids: Invalid[]) => Promise<void>
   type OnSubmitEvent = (value: any, feeds: IoC) => void
   type OnFetchEvent = (response: Response) => void
   type Validate = (value: string) => string | ''

   interface Bind { bind?: string }
   interface Data<T extends Object = object> { data?: T }
   interface FormAuth { bearer?: string }
   interface DataBind extends Data, Bind { validate?: Validate }
   interface OnValidate { onValidate?: OnValidateEvent }
   interface OnSubmit { onSubmit?: OnSubmitEvent }
}

export { }