// fullstack

import { StyleRule } from 'handlers'
import { global, router } from 'common'

interface SubProps { cols: string, gaps: string, grid: string, css: string }
interface Props extends SubProps { style: SubProps & { display: string }, className: string  }

export const styleProps: PropsHandler = function (props: Props, params: Params) {
   const relatedProps = ['cols', 'gaps', 'grid', 'css']
   const contentProps = Object.keys(props)

   if (!contentProps.some(key => relatedProps.includes(key))) return props

   const classNameTag = globalTag(props, params)
   const newGridProps = gridProps(classNameTag, params)

   return newGridProps 
} 

/** layout style props with [grid], [cols] and [gaps] 
 * @param {string} [grid] 'display: grid'
 * @param {string} [cols] 'grid-template-columns: ?'
 * @param {string} [gaps] 'gaps: ?' */
function gridProps(props: Props, params: Params) {
   if (!props) return props

   const cssProps = ['cols', 'grid', 'gaps']
   const memberProps = Object.keys(props)
   const hasStyleProps = memberProps.some(x => cssProps.includes(x))

   if (!hasStyleProps) return props
   if (!props.style) props.style = {} as any

   if (props.cols && props.style)   
      stylingCols(props as any)

   if (props.gaps) props.style.gaps 
      = typeof props.gaps == 'number'
      ? `${props.gaps}px`
      : props.gaps
         
   if (memberProps.includes('grid'))
      props.style.display = 'grid'

   cssProps.forEach(k => delete props[k])

   return props
}

/** transformation [cols] for style.grid-template-layout
 * cols='1fr' -> grid-template-layout='1fr'
 * cols={2} -> grid-template-layout='1fr 1fr'
 * cols='1:2:0' -> grid-template-layout='1fr 2fr auto'
 * cols='1:200px:0' -> grid-template-layout='1fr 200px auto' */
function stylingCols(props: { cols: string, style: React.CSSProperties }) {
   if (!props.cols) return 

   else if (typeof props.cols == 'number')
      props.style.gridTemplateColumns = Array
         .range(props.cols).map(x => `1fr`).join(' ')

   else if (props.cols.includes(':'))
      props.style.gridTemplateColumns = props.cols.split(':')
         .map(x => x.match(/\D/g) ? `${x}` : (x == '0' ? 'auto' : `${x}fr`)).join(' ')

   else props.style.gridTemplateColumns = props.cols
}

/** It allows [class] attibute for [className] */
function globalTag(props: Props, params: Params) {
   if (props?.className?.includes(params.parent) || false) return props
   if (!params.parent && !params.jsx.type) return props

   const css = `${props.css || ''} ${props.className || ''}`
   const classNameTag = `${css} ${params.parent || params.jsx.type}`
   const className = classNameTag.trim().replace(/\d+$/, '')

   return { ...props, className }
}