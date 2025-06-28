import { launch as internalLaunch } from "pipelines"
import { bindProps, formProps, routeProps, styleProps } from "properties"
import { cssImportPlugin, moduleMetadataPlugin, functionDecoratorPlugin } from "importers"
import { assetsRequest, restfulRequest } from "requests"
import {
   awaitPropsRender,
   reactivePropsRender,
   serverComponentRender,
   lazySuspenseRender,
   cssImportStyler
} from "renderers"


export async function launch() {
   
   internalLaunch(true)
      .fetch(assetsRequest)
      .fetch(restfulRequest)
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
      .match("jsx", "element", cssImportStyler)
   
   // request handler
   // decorators
}