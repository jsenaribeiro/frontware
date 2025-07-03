import { isFunctionOrConstructorTypeNode } from 'typescript'
import '.'
import { Writable } from '../types'

type WritableFunction = Writable<Function>

export abstract class Decorator<R extends object = any, P extends object = any, F extends Function = Function> implements IDecorator {
   public name: string
   private _call: F
   public args: P
   public data: R

   constructor(params: P) {
      this.args = params
      this.name = this.constructor.name
   }

   public decorate(fn: F) {
      this._call = fn as any
      return this
   }

   public get call() {
      const func = (...args: any[]) => {
         this.data = this.annotation()
         this._call(...args)
      } 

      Object.defineProperty(func, "name", { writable: true });
      
      func.name = this._call.name as any

      Object.defineProperty(func, "name", { writable: false });

      const call = func as WritableFunction
      call.decorators ||= [].concat(this._call.decorators || [])

      const already = call.decorators.some(x => x.name == this.name)
      if (!already) call.decorators.push(this)

      return call
   }

   abstract annotation(): R
}