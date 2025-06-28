import { test, expect } from 'bun:test'
import { auth } from './@auth'
import React from 'react'
import '../helpers/tests'

const SampleComponent = props =>
   React.createElement('h1', {}, 'title...')

function setSessionStorageLogonJSON(value) {
   const json = JSON.stringify(value)
   sessionStorage.setItem('logon', json)
}

test.skip('@auth: authorized', function () {
   globalThis.IS_SERVER_SIDE_TEST = true
   setSessionStorageLogonJSON({ name:'test' })

   const result = auth()(import.meta, SampleComponent) as Function
   const element = result() as any

   expect(element.type).toBe('h1')
   expect(element.props.children).toBe('title...')
})

test.skip('@auth: unauthorized', function () {
   globalThis.IS_SERVER_SIDE_TEST = true

   setSessionStorageLogonJSON(undefined)

   const result = auth()(import.meta, SampleComponent) as Function
   const failure = 'requires a logged user'

   expect(result()).toInclude(failure)

})

test.skip('@auth: unauthorized role', function () {
   globalThis.IS_SERVER_SIDE_TEST = true

   setSessionStorageLogonJSON({ name: 'test', role: 'admin' })

   const error = 'requires user.role=user for authorization'
   const result = auth({ role: 'user' })(import.meta, SampleComponent) as Function
   
   expect(result()).toInclude(error)
})

test.skip('@auth: authorized role', function () {
   globalThis.IS_SERVER_SIDE_TEST = true

   setSessionStorageLogonJSON({ name: 'test', role: 'admin' })

   const result = auth({ role: 'admin' })(import.meta, SampleComponent) as Function
   const element = result() as any

   expect(element.type).toBe('h1')
   expect(element.props.children).toBe('title...')
})

