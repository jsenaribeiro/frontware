export interface ErrorDecorator { throw: ErrorComponent }

const errorDecorator: Decorator<ErrorDecorator> = (component: ErrorComponent) => (meta, call) => {
   errorDecorator.parameters.throw = component
   return call
}

/** error component for exception handler and not found route */
export function error(component: ErrorComponent): ReturnType<typeof errorDecorator> {
   return errorDecorator(component)
}
