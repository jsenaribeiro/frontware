declare global {
   abstract class Decorator<R extends object = any, P extends object = any, F extends Function = Function> implements IDecorator {
      public name: string
      private _call: F
      public args: P
      public data: R

      constructor(params: P) {
         this.args = params
         this.name = this.constructor.name
      }

      public decorate(fn: F) {
         this._call = fn
         return this
      }

      public get call() {
         const func = (...args: any[]) => {
            this.annotation(import.meta)
            this._call(...args)
         }

         func.name = this._call.name
         return func
      }

      abstract annotation(): R
   }
}

export { }