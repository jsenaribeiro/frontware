"use server"

import { context } from 'context'
import { generateSiteMap } from './sitemap'
import { File, Path, global } from 'common'
import { buildClientSideScript } from "./client";
import { generateRobotTxt } from "./robot";
import { createBundle } from "./bundle";

var paths: Directories, start: Options

/** build the application using bun 
 * @param {boolean} indexOnly only seeks to build the index pages */
export async function bundler(indexOnly: boolean): Promise<true> {
   start = context.options
   paths = start.path

   const buildPath = Path.from(paths.builds)
   const indexHTML = await File.load(start.html).then(x => x.text())

   global.own.is.build = true // disable import handler (bun.plugin)

   await buildPath.clear()
   await parseHandlers(indexHTML, indexOnly)   
   await generateSiteMap()
   await generateRobotTxt()
   await buildClientSideScript()
   await createBundle(indexHTML)

   global.own.is.build = false

   return true
}

/** recursive route folders for builder handlers */
async function parseHandlers(indexHTML: string, indexOnly: boolean) {
   const routePath = Path.from(paths.routes)

   for (const item of await routePath.directory())
   for (const pack of context.packers) {
      if (item.isDirectory) parseHandlers(indexHTML, indexOnly)
      if (!item.filename.endsWith(pack.extension)) continue
      if (indexOnly && !item.filename.startsWith('index.')) continue
      
      const file = await File.load(item.path)

      await pack.handler(indexHTML, file)
   }
}
