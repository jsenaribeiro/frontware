"use client"

import { global, router } from 'commons'

type Props = record & { route: string, link: string }

const context = { route: {} }

export const routeProps: PropsHandler = function(props: Props, params: Params) {
   if (!props?.link && !props?.route) return props

   const routed = props.link ? router.match(props.link) : false
   const hidden = props.route ? !router.match(props.route) : false
   
   if (props.route) props = hidden 
      ? { ...props, hidden } 
      : { ...props }

   if (props.link) props = routed 
      ? { ...props, onClick, className: `${props.className} routed` }   
      : { ...props, onClick }   

   const route = context.route[props.link]
      ||= router.now.replace(/\/$/, '')

   function onClick() {
      if (!props.link) return
      const link = props.link.replace(/^\./, route)
      router.goto(link)
      global.ioc.react()
   }      

   return props
} 

