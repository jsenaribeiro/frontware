"use client"

interface Props<T extends object = object> { type: string, data?: T, bind?: string } 

/**
 * Two-way data binding props
 * @param {object} props current props
 * @param {Params} params directive args */
export const bindProps: PropsHandler = function (props: Props, params: Params) {
   if (Object.keys(props).includes('data')) return props
   if (Object.keys(props).includes('bind')) return props
   if (!props.data || !props.bind) return props

   const fieldOf = b => b ? 'checked' : 'value'
   const valueOf = e => props?.data.valueOf(true, props.bind, e)
   const eventOf = (e,b?) => ({ ...props, [fieldOf(b)]: props[fieldOf(b)], [e]: valueOf })
   const inputOf = x => params.jsx.type == "input" && props.type == x
   const noInput = !params?.jsx.type?.match(/input|select|textarea/i) 
   const noRefer = Object.isEmpty(props?.data)
   
   if (noInput || noRefer || !props.bind) return props
   
   const value = props.data.valueOf(true, props.bind)
   const child = inputOf("radio") ? eventOf('onChange', true)
               : inputOf("button") ? eventOf('onClick', true)
               : inputOf("checkbox") ? eventOf('onChange', true)      
               : params.jsx.type == "input" ? eventOf('onChange')
               : params.jsx.type == "select" ? eventOf('onSelect')
               : params.jsx.type == "textarea" ? eventOf('onChange')
               : props

   return { ...child, value: value || "\r" }
} 

