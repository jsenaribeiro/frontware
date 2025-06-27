/**
 * declare new into react module
 * for prop directives and others
 * new framework attributes to 
 * enable correct intelissense
 */

declare module "react" {
   // bindProps + formProps
   interface FormHTMLAttributes<T> extends Data, FormAuth, OnSubmit, OnValidate { }
   interface InputHTMLAttributes<T> extends DataBind { }
   interface SelectHTMLAttributes<T> extends DataBind { }
   interface TextareaHTMLAttributes<T> extends DataBind { }

   // routeProps
   interface HTMLAttributes<T> { link?: string, route?: string }

   // [await] server props
   interface HTMLAttributes<T> { await?: (props, feeds) => Promise<RFE> }

   // css props
   interface HTMLAttributes<T> {
      grid?: boolean
      cols?: number | string
      gaps?: number | string
      range?: [number, number]
      theme?: "dark" | "light"
      media?: string
   }
}

export {}