import React from "react"
import { getComponentName } from "standard"

import { handle } from './component';
import { params } from './params';
import { parent } from "./parent";
import { children, syblings } from './relatives';

import './types'

export async function render(root: JSX)
export async function render(root: JSX, id: number)
export async function render(root: Component)
export async function render(root: Component, id: number)
export async function render(root: JSX | Component, id = 0) {
   if (typeof root == 'function') return render(React.createElement(root, {}) as any, id)
   else return await flow.parent({ id, jsx: root, root: getComponentName(root) })
}

const flow: RenderFlow = {
   parent, children, syblings, handle, params,
   client: () => { throw new Error("client component not implemented...") }
}