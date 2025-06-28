"use server"

export async function serverComponentRender(args: Params<Component>) {
   const component = await args.jsx.type(args.jsx.props, global.ioc) 
   const attributes = await serialize(component)
   
   return { ...component, props: attributes } as JSX<any>
}

/** props is serialized element attributes 
 * for client-side recovery in hydration (TODO: try discard?) */
export async function serialize(child: any) {
   const newChild = () => ({ ...child, props: { ...child.props, events: {} } })

   if (Array.isArray(child.props)) return child.props
   if (!child.props.dangerouslySetInnerHTML) return child.props

   for (const [label, value] of Object.entries(child.props)) {
      if (label == 'dangerouslySetInnerHTML') continue
      if (typeof value != 'function') continue
      if (!child.props?.events) child = newChild()
      child.props.events[label] = value.toString()
      delete child.props[label]
   }

   for (const [label, value] of Object.entries(child.props)) {
      if (label == 'dangerouslySetInnerHTML') continue
      if (typeof value != 'object') continue
      child.props[label] = JSON.stringify(value)
   }

   return child.props
}