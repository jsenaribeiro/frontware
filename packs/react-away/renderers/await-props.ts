"use server"

import { global } from "commons"

type Props = record & { await: (props, params) => Promise<JSX<Component>> }

/* transform [await] in componentPath to send to client-side for stream JSX */
export async function awaitPropsRender(args: Params<any, Props>) {
   if (!global.own.is.serve) return args.jsx

   const asyncComponent = args.jsx.props.await
   const isNotFunction = typeof asyncComponent != "function"
   const isNotAsyncJsx = asyncComponent.metadata.async == false
   const clientSideNow = global.env.SIDE == "client"

   const name = (args.jsx.props.await.name || '').replace(/\$$/, '')
   const path = asyncComponent?.metadata.path

   if (clientSideNow || !asyncComponent) return args.jsx
   if (isNotFunction) return warn(INVALID_AWAIT_PROPS) && args.jsx
   if (isNotAsyncJsx) return warn(NO_ASYNC_AWAIT_PROPS) && args.jsx
   if (!path) return warn(LACK_OF_METADATA) && args.jsx

   // path information for async client-side component
   // name as exported Component name for correct import
   args.jsx.props.await = JSON.stringify({ name, path }) as any

   return args.jsx
}

const LACK_OF_METADATA = '[await] props requires an exported component'
const INVALID_AWAIT_PROPS = '[await] props must be functional component'
const NO_ASYNC_AWAIT_PROPS = '[await] props must be a Promise'

function warn(message: string): true { console.warn(message); return true }