import { launch as internalLaunch } from "pipeline/launch"

import {
   bindProps,
   formProps,
   routeProps,
   styleProps,
   awaitPropsRender,
   cssImportPlugin,
   moduleMetadataPlugin,
   functionDecoratorPlugin,
   serverComponentRender,
   reactivePropsRender,
   lazySuspenseRender,
   clientStyler,
   serverStyler,
}
from "handlers"

export async function launch() {
   
   await internalLaunch(true)
      .match("props", bindProps)
      .match("props", formProps)
      .match("props", routeProps)
      .match("props", styleProps)
      .match("import", cssImportPlugin)
      .match("import", moduleMetadataPlugin)
      .match("import", functionDecoratorPlugin)
      .match("jsx", "component", awaitPropsRender)
      .match("jsx", "component", reactivePropsRender)
      .match("jsx", "component", serverComponentRender)
      .match("jsx", "fragment", lazySuspenseRender)
      .match("jsx", "element", clientStyler)
      .match("jsx", "element", serverStyler)
   
   // request handler
   // decorators
}