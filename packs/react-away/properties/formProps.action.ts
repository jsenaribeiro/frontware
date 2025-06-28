import { authenticate, authorize } from './formProps.auth'
import { UpdateArgs } from './formProps.type'

/** Action binding sets [action] as RESTful request */
export async function action(args: UpdateArgs) {
   const { props, fetch: caller } = args
   const config = authenticate(props)     
   const feeds = global.ioc

   feeds.await = true   
   global.ioc.react()
   
   try {
      const result = await fetch(props.action!, config)      
      if (!result.ok) feeds.fails = await getErrors(result)      
      await authorize(result, props)      
      caller && caller(result)
   } 
   catch (ex: any) {
      const error = ex?.message || ex?.toString()
      feeds.fails.push({ error, field: '', value: '' }) 
   }
   finally {
      clean(feeds.fails)
      feeds.await = false
      global.ioc.react()
   }
}  

function clean(errors: Invalid[]) {
   const isDuplicatedError = e => errors.filter(x => e.error == x.error).length
   errors.filter(e => !e.error).forEach((e, i) => delete errors[i])
   errors.filter(isDuplicatedError).forEach((e, i) => delete errors[i])
}

async function getErrors(response: Response): Promise<Invalid[]>  {
   const text = await response.text()
   const json = parseOrElseJSON(text)

   return extractErrors(response, json, text)
}

function parseOrElseJSON(str) {
   try { return JSON.parse(str) }
   catch (e) { return undefined }
}

export const getDefaultError = (code: number) =>
       code <= 400 ? "Invalid request"
     : code == 404 ? "URL not found"
     : code >= 400 && code < 500 ? "Error"
     : "Internal serve error..."
 
const isProblemDetailObject = (data: any): data is ProblemDetails =>
   data.type && data.title && data.status && data.detail   

function extractErrors(response: Response, json: any, text?: string): Invalid[] {
   const defaultError = [{ field: '', error: json.title, value: '' }]
   const itemError = x => ({ field: x.fieldName, error: x.message, value: '' })
   const loopError = x => extractErrors(response, json, text)

   if (json && Array.isArray(json)) return json.flatMap(loopError)   

   if (json && isProblemDetailObject(json)) 
      return json.errors?.map(itemError) || defaultError

   const fail = json?.message?.trim() || text?.trim()
      || response.statusText || getDefaultError(response.status)

   return [{ error:fail, field:'', value:'' }]
}
