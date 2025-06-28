"use client"

import React from 'react'
import { global } from "common";
import { useProxy } from './shared'
import { REACTIVE, STATELESS } from 'common'

export const reactivePropsRender: JsxHandler<'client'> = (args: Params) =>
   global.own.is.serve ? args.jsx : args.jsx.type(createReactiveProps(args), global.ioc) 

function createReactiveProps(args: Params) {
   const component = args.jsx.type as Writable<Component>

   if (args.jsx.props[REACTIVE] || args.jsx[STATELESS])
      return [args.jsx.props, args.feeds]

   // preverving originals
   const originalSecondArgument = { ...args.feeds }
   const originalChildrenProps = { ...args.jsx.props?.children }

   // preserve original 2nd arg from react in feeds.refer
   args.jsx.props.children ||= args.jsx.props.children

   // creating a refrensh render in current component
   component.refresh = () => React.useState(0)[1](Number.newUID())

   // create a reactive props (local props state)
   const props = useProxy({ data: args.jsx.props, sync: component.refresh })

   // restoring originals 
   args.feeds.refer ||= originalSecondArgument
   args.jsx.props.children = originalChildrenProps

   return props
}