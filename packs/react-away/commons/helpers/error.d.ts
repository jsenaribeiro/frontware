import { global } from 'commons'

declare global {
   interface ProblemDetails {
      type?: string
      title?: string
      status?: number
      detail?: string
      instance?: string
      traceId?: string
      errors?: { fieldName: string, message: string }[]
   }

   type Invalid<T = any> = { error: string, field: string, value: T }   

   interface ErrorComponent<E extends Error = Error> {
      errorTypeName?: string
      (error: E): JSX
   }   

   interface ErrorConstructor {
      getHandler(): ErrorComponent | undefined
      getHandler<E extends Error>(errorClass: E): ErrorComponent<E> | undefined
   }
}

Error.getHandler = function (errorClass?) {
   const _catch = global.own.handlers.catch
   const _label = errorClass?.name || Error.name
   const _error = _catch.find(x => x.name == _label) as ErrorComponent

   _error.errorTypeName = _label

   return _error
}

export { }