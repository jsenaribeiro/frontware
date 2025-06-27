import { test, expect } from 'bun:test'
import { testParams } from './test'
import { bindProps } from './bindProps'

const value = { hello: 'world' }
const props = { data: value, bind: 'hello' }

test.skip('[bind]: invalid bind syntax', async function () {
   throw 'todo: [bind] invalid bind syntax'
})


const scenarioOf = (p, tag, type = '', keys = ['value', 'onChange']) =>
   [{ ...p, type }, { ...testParams, tag }, 'world', keys]

const emptiesValues: any[] = [
   scenarioOf({ bind: '', data: value }, 'input'),
   scenarioOf({ bind: null, data: value }, 'input'),
   scenarioOf({ bind: undefined, data: value }, 'input'),
   scenarioOf({ bind: 'ok', data: {} }, 'input'),
   scenarioOf({ bind: 'ok', data: null }, 'input'),
   scenarioOf({ bind: 'ok', data: undefined }, 'input'),
]

emptiesValues.forEach(function (scenario) {
   const [p] = scenario
   const refer = Object.isEmpty(p.data) ? 'data' : 'bind'
   const value = Object.isEmpty(p.data)
      ? JSON.stringify(p.data)
      : JSON.stringify(p.bind)

   test(`[${refer}]: ignore when [${refer}] is ${value}`, function () {
      globalThis.IS_SERVER_SIDE_TEST = true
      const outputProps = bindProps(p, testParams)
      expect(outputProps).toEqual(p)
   })   
})

const invalidTagNames: any[] = [
   scenarioOf(props, 'h1'),
   scenarioOf(props, 'label'),
   scenarioOf(props, 'frameset')   
]

invalidTagNames.forEach(function (scenario) {
   const [props, params] = scenario
   test(`[data|bind]: ignore no input-like, as ${params.tag}`, function() {
      globalThis.IS_SERVER_SIDE_TEST = true
      const outputProps = bindProps({}, params)
      expect(outputProps).toEqual({})
   })
})

const scenariosOk: any[] = [
   scenarioOf(props, 'input'),
   scenarioOf(props, 'input', 'text'),
   scenarioOf(props, 'input', 'text', ['value', 'onChange']),
   scenarioOf(props, 'input', 'radio', ['checked', 'onChange']),
   scenarioOf(props, 'input', 'button', ['checked', 'onClick']),
   scenarioOf(props, 'input', 'checkbox', ['checked', 'onChange']),
   scenarioOf(props, 'select', '', ['value', 'onSelect']),
   scenarioOf(props, 'textarea', '', ['value', 'onChange'])
]

scenariosOk.forEach(function(scenario){   
   const [oldProps, params, tag, fields] = scenario
   const type = oldProps.type ? `[${oldProps.type}]` : ''
   const description = `${params.tag}${type}`

   test(`[data|bind]: ${description} dual binding succeed`, function() {
      globalThis.IS_SERVER_SIDE_TEST = true

      const newProps = bindProps(oldProps, params) 
      const detailed = field => ({ tag, props: newProps, field, fields })

      for (const field of fields) {
         if (!Object.keys(newProps).includes(field))
            console.error('field not found', detailed(field))

         expect(newProps).toHaveProperty(field) 
      }
   })
})