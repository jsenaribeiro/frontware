import React from 'react'
import { fixKey, getTagName, REACTIVE } from 'standard'
import { refocus } from './refocus'
import { global } from "standard"

const match = global.own.handlers.match

export function ClientComponentHandler(type: "component", args: RenderArgs, flow: RenderFlow) {
   return refocus(9) && ({ ...args.jsx, type: retype })

   function retype(props: Props, feeds: Feeds) {
      const child = match.jsx.component("client", args, flow)     
      const params = flow.params({ ...args, jsx: child })
      const reducer = (props, handler) => handler(props, params)

      props = match.props.reduce(reducer, props)

      return { ...child, props, key: fixKey(child) }
   }
}