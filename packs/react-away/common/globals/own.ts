import './own'
import './own.route'
import '../../handlers/f-decorator/module'
import './own.handler'
import '../../handlers/f-decorator/function'

import { BrowserOwn } from "./own.dom"

/** @module Own reflection default */

export const own: Own = new BrowserOwn()