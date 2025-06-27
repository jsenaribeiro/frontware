import { launch as internalLaunch } from "pipeline/launch"

import {
   cssImportPlugin,
   moduleMetadataPlugin,
   functionDecoratorPlugin,
   bindProps,
   formProps,
   routeProps,
   styleProps,
}
from "handlers"

export async function launch() {
   
   await internalLaunch(true)
      .match(bindProps)
      .match(formProps)
      .match(routeProps)
      .match(styleProps)
      .match(cssImportPlugin)
      .match(moduleMetadataPlugin)
      .match(functionDecoratorPlugin)
      .match("client", clientRender)
      .match("server", serverRender)
}