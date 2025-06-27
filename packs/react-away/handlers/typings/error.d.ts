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

   export type Invalid<T = any> = { error: string, field: string, value: T }
}

export {}