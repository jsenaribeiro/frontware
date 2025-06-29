import { expect, test } from "bun:test"
import { modulePlugin } from "."
import { AUTOGEN_COMMENTS } from "../../../kernel"

const code = `import React, { Suspense, Test: { SubTest } } from 'react'
import { server, seo, client } from 'react-away/web'
import '@react-away/extensions'

export const whatever = 1

const loading = <h3>Loading content...</h3>
const address = "https://timeapi.io/api/Time/current/zone?timeZone=Europe/Amsterdam"

//@ts-ignore
@server("dynamic") 
@seo('Time Zone', 'Time zone clock...')
export default function(props: any) {
   return <Suspense fallback={loading}>      
         <TimeZone />
      </Suspense>
}

export async function TimeZone() {   
   const response = await fetch(address)
   const { year, month, day, hour, minute, seconds } = await response.json()
   const time = "{hour}:{minute}:{seconds}"
   const date = "{year}-{month}-{day}"

   return <React.Fragment>
      <h1>World Clock</h1>
      <h2>Europe/Amistedan timezone</h2>
      <h3 style={{color:'yellow'}}> {date} {time} </h3>
      <h4 await={InnerAsyncComponent}>loading...</h4>
   </React.Fragment>
}

export export async function InnerAsyncComponent(props, feeds) {
   await new Promise(promise => setTimeout(promise, 1000))
   return <>
      <code><mark>async inner subcomponent !!!</mark></code>
   </>
}`

const expected = `
const ports = {
   imports: { React, Suspense, server, seo, client },
   exports: { TimeZone, InnerAsyncComponent, whatever }
}

global.own ||= {}
global.modules ||= {}
global.modules['file://'] = {
   use: '',
   path: 'file://',
   ports,
   styles: []
}`


test('modular: injected module objects in global.own', function () {
   const resulted = modulePlugin({ code, path: 'file://' })
   
   expect(resulted).toInclude(AUTOGEN_COMMENTS)
   expect(resulted).toInclude(expected)
})