import './error.d'

export class RenderError extends Error {
   constructor(side: Side, public args: Params, public inner: Error) {
      super(`JSX render error in ${side}-side`)
   }
}

export class RequestError extends Error {
   constructor(public details: ProblemDetails) {  
      super('Request error')
   }
}

export class DecoratorError extends Error {
   constructor(message: string) {
      super(message)
   }
}
