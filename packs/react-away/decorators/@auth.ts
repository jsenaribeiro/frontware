import 'common'
import { RequestError, STATUS_CODE, global } from 'common'

const UNHANDLED_UNAUTHORIZED = 'Unhandled authorization error...'
const DETAIL_ERROR = 'Try to access a component that requires '
   + 'an authorization from logon.role'

export interface AuthDecorator { jsx: JSX, rule?: any }

const authDecorator: Decorator<AuthDecorator> = (rule?: any) => (meta, call) => {
   const user = global.ioc.logon
   const none = !user || Object.keys(user).length == 0
   const args = JSON.stringify(rule).replace(/["\{\}]/g, "").replaceAll(':', '=')
   const fail = Error.getHandler(RequestError.prototype) || Error.getHandler()
   const base = `Unauthorized role by @auth for ${user}`
   const rest = `for authorization defined by @auth(${args})`
   const kind = `The component ${call.name} requires`
   const errs = none ? [`${kind} a logged user`]
      : Object.entries(rule).flatMap(validateOf)
         .flatMap(x => x ? [x] : [])

   if (errs.length == 0) return call
   if (errs.length && !fail) throw new Error(UNHANDLED_UNAUTHORIZED)

   if (fail.errorTypeName == Error.name) {
      const errorComponent = fail as ErrorComponent<Error>
      const errorJSX = errorComponent(new Error(base))
      authDecorator.parameters = {  jsx: errorJSX, rule }
   }

   else {
      const requestError = new RequestError({
         title: `The component ${call.name} requires authorization rule`,
         status: STATUS_CODE.UNAUTHORIZED,
         detail: DETAIL_ERROR,
         instance: global.own.url,
         errors: rule
      })

      authDecorator.parameters = { jsx: fail(requestError), rule }
   }

   return call

   function validateOf(entry: [string, any]) {
      const [field, value] = entry
      const noLoggedUsers = !user
      const isNestingRule = typeof value == 'object'
      const notIncludeKey = !Object.keys(user).includes(field)

      const contentDiffer = value !== undefined
         && !user[field].match(new RegExp(value))

      // console.log(0, { noLoggedUsers, isNestingRule, notIncludeKey, contentDiffer })
      // console.log(1, { rule, field, value, user, userValue: user[field], regex:new RegExp(value) })

      if (noLoggedUsers) return [`Requires a logged user`]
      if (isNestingRule) return Object.entries(value).map(validateOf)
      if (notIncludeKey) return [`${kind} field user.${field} ${rest}`]
      if (contentDiffer) return [`${kind} user.${field}=${value} ${rest}`]
   }
}

/** check if logon.role has any value */
export function auth(): ReturnType<typeof authDecorator>

/** check if logon.role has the object map value, like { role:'admin' } */
export function auth<T extends object = any>(constraints: T): ReturnType<typeof authDecorator>

export function auth(rule?: any) { rule ||= {}; return authDecorator(rule) }