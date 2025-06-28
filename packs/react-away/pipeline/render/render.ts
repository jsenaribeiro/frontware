import React from "react"
import { flow } from "./shared"
import { global } from "common"
import { getComponentName } from "common"
import './types'

export function render(root: JSX)
export function render(root: JSX, id: number)
export function render(root: Component)
export function render(root: Component, id: number)
export function render(root: JSX | Component, id = 0) {
   if (typeof root == 'function') return render(React.createElement(root, {}) as any, id)
   
   const jsx = root
   const feeds = global.ioc
   const rootTag = getComponentName(root)
   
   return flow.parent({ id, jsx, root: rootTag, feeds, earlier: {}, parent: rootTag })
}