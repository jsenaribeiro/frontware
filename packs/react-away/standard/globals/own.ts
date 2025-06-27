import './own.d'
import './own.route.d'
import '../../handlers/f-decorator/module'
import './own.handler.d'
import '../../handlers/f-decorator/function'

import { BrowserOwn } from "./own.dom"

/** @module Own reflection default */

export const own: Own = new BrowserOwn()