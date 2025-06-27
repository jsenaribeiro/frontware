import { context } from 'context'
import { global } from 'standard'

interface TemplateArgs {
   agent: string
   allows: string[]
   disallows: string[]
}

const template = (args: TemplateArgs) => `
   User-agent: ${args.agent}
   ${args.allows.map(x => `Allow: ${x}`).join('\n')}
   ${args.disallows.map(x => `Disallow: ${x}`).join('\n')}`

export async function generateRobotTxt() {   
   const list = [] as string[]
   const port = global.env.PORT || 3000
   const host = global.env.HOSTNAME || `http://localhost:${port}`

   if (!port || !host || !global.env.ROBOT?.length) return
   
   const primarySiteMap = `\n\nSitemap: ${host}/sitemap.xml`
   const allSiteMaps = primarySiteMap + global.env.SITEMAPS.join('\n')

   for (const item of global.env.ROBOT) {
      const agent = item.agent || '*'
      const allows = item.allow || ['/']
      const disallows = item.disallow || []
      const robotItem = template({ agent, allows, disallows })
      
      list.push(robotItem)
   }

   const text = list.join('\n\n').concat(allSiteMaps)

   await Bun.write(`${context.options.path.builds}/robot.txt`, text)
}