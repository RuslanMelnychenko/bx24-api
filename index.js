import scriptLoader from './loadscript'

const URL_SCRIPT = "//api.bitrix24.com/api/v1/"

let initialized = false
let throwEnable = true

/**
 * Throw mode: Throw an exception when function return result with error
 * @param {Boolean} enable
 * @returns {boolean}
 */
export const throwOn = (enable) => throwEnable = !!enable;

/**
 * @param {ajaxResult} result
 * @returns {ajaxResult}
 * @throws ajaxError
 */
const handlerResult = (mainResult) => {
  const results =
            Array.isArray(mainResult) && mainResult
            || mainResult.constructor.name === 'ajaxResult' && [mainResult]
            || Object.values(mainResult)
  for(const result of results) {
    const next = result.next
    result.next = async function() {
      if (this.more())
        return handlerResult(await new Promise(resolve => next.call(this, resolve)))
      else
        return false
    }

    if(throwEnable && !!result.error()) {
      console.error(result.error(), result)
      throw result.error()
    }
  }
  return mainResult
}

export const isInit = () => initialized;

if (!window.BX24)
  window.BX24 = {}

function load() {
  return scriptLoader(URL_SCRIPT)
}

/**
 * Initializing script
 * @returns {Promise<{}>}
 * @see EN {@link https://training.bitrix24.com/rest_help/js_library/system/init.php}
 * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/system/init.php}
 */
export async function init() {
  await load()
  initialized = true
  await new Promise(resolve => window.BX24.init(resolve))
}

/**
 * ! Use this function after init() or install()
 * @see EN {@link https://training.bitrix24.com/rest_help/js_library/system/installFinish.php}
 * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/system/installFinish.php}
 * @see init
 * @see install
 * @example With init()
 * init().then(() => {
 *     // ...
 *     installFinish();
 * })
 * @example With install()
 * install().then(() => {
 *     // ...
 *     installFinish();
 * })
 */
export function installFinish() {
  window.BX24.installFinish()
}

/**
 * @returns {Promise<installFinish>}
 * @see installFinish
 * @see EN {@link https://training.bitrix24.com/rest_help/js_library/system/install.php}
 * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/system/install.php}
 * @see EN {@link https://training.bitrix24.com/rest_help/js_library/system/installFinish.php}
 * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/system/installFinish.php}
 * @example
 * install().then((done) => {
 *     // Some actions
 *     done();
 * })
 */
export async function install() {
  await load()
  await new Promise(resolve => window.BX24.install(resolve))
  return installFinish
}

/**
 * @returns {Promise<Boolean|Object>}
 * @see EN {@link https://training.bitrix24.com/rest_help/js_library/system/getAuth.php}
 * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/system/getAuth.php}
 */
export async function getAuth() {
  await init()
  return window.BX24.getAuth()
}

/**
 * @returns {Promise<Boolean|Object>}
 * @see EN {@link https://training.bitrix24.com/rest_help/js_library/system/refreshAuth.php}
 * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/system/refreshAuth.php}
 */
export async function refreshAuth() {
  await init()
  return await new Promise(resolve => window.BX24.refreshAuth(resolve))
}

/**
 * @typedef {Object} ajaxResult
 * @property {Function<*>} data the function returning the REST method response as an array, an object or a scalar. Refer to the method descriptions for further information.
 * @property {Function<ajaxError?>} error returns the error description if an error occurred, or false otherwise.
 * @property {Function<Boolean>} more returns true if there is still data to fetch. Applicable to methods that return data.
 * @property {Function<Number>} total returns the total number of data records. Applicable to methods that return data.
 * @property {Function<Promise<ajaxResult|Boolean>>} next requests and returns the next data chunk.
 */

/**
 * @typedef {Object} ajaxError
 * @property {Function} getError
 * @property {Function} getStatus
 * @property {Function<String>} toString
 */

/**
 * @param {String} method
 * @param {Object} [params={}]
 * @returns {Promise<ajaxResult>}
 * @see EN {@link https://training.bitrix24.com/rest_help/js_library/rest/callMethod.php}
 * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/rest/callMethod.php}
 * @throws {ajaxError}
 */
export async function callMethod(method, params) {
  await init()
  return handlerResult(await new Promise(resolve => window.BX24.callMethod(method, params, resolve)))
}

/**
 * @param {Array|Object} calls
 * @param {Boolean} [bHaltOnError=false]
 * @returns {Promise<Array<ajaxResult>|Object<ajaxResult>>}
 * @see EN {@link https://training.bitrix24.com/rest_help/js_library/rest/callBatch.php}
 * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/rest/callBatch.php}
 * @throws {ajaxError}
 */
export async function callBatch(calls, bHaltOnError) {
  await init()
  return handlerResult(await new Promise(resolve => window.BX24.callBatch(calls, resolve, bHaltOnError)))
}

/**
 * Import Large Data Batches
 * ! Support only methods that have entity "ID", support "filter", "order" and "select"
 * @param {String} method
 * @param {Object} [params={}]
 * @returns {Promise<[Object]>}
 * @see EN Taken on the basis of {@link https://training.bitrix24.com/rest_help/rest_sum/start.php}
 * @see RU Taken on the basis of {@link https://dev.1c-bitrix.ru/rest_help/rest_sum/start.php}
 * @throws {ajaxError}
 */
export async function callMethodAll(method, params) {
  await init()
  const callParams = {}
  for (const key in (params || {}))
    callParams[key.toLowerCase()] = params[key]

  callParams.filter = callParams.filter || {}

  if (Array.isArray(callParams.select) && !(callParams.select.includes('ID') || callParams.select().includes('*')))
    callParams.select.push('ID')

  callParams.order = callParams.order || {}
  callParams.order.ID = 'ASC'
  callParams.start = -1
  let ID = 0;
  const globalResult = []
  while (true) {
    callParams.filter['>ID'] = ID
    const result = (await callMethod(method, callParams)).data()
    if (!result.length) break;
    for (const rest of result) {
      ID = rest.ID
      globalResult.push(rest)
    }
  }
  return globalResult
}

/**
 * Load all items from list by ajaxResult.next()
 * @param {String} method
 * @param {Object} [params={}]
 * @returns {Promise<Array<Object>>}
 * @throws {ajaxError}
 */
export async function callMethodAllChunks(method, params= {}) {
  let result = await callMethod(method, params)
  const data = result.data()
  while (result.more()) {
    result = await result.next()
    data.push(...result.data())
  }
  return data
}

/**
 * @param {String} event
 * @param {String} handler
 * @param {Number} [auth_type]
 * @returns {Promise<ajaxResult>}
 * @see EN {@link https://training.bitrix24.com/rest_help/js_library/rest/bx24.callbind.php}
 * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/rest/bx24.callbind.php}
 * @throws {ajaxError}
 */
export async function callBind(event, handler, auth_type) {
  await init()
  return handlerResult(await new Promise(resolve => window.BX24.callBind(event, handler, auth_type, resolve)))
}

/**
 * @param {String} event
 * @param {String} handler
 * @param {Number} [auth_type]
 * @returns {Promise<ajaxResult>}
 * @see EN {@link https://training.bitrix24.com/rest_help/js_library/rest/bx24_callunbind.php}
 * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/rest/bx24_callunbind.php}
 * @throws {ajaxError}
 */
export async function callUnbind(event, handler, auth_type) {
  await init()
  return handlerResult(await new Promise(resolve => window.BX24.callUnbind(event, handler, auth_type, resolve)))
}

export const userOption = {
  /**
   * @param {String} name
   * @param {String} value
   * @returns {Promise<void>}
   * @see EN {@link https://training.bitrix24.com/rest_help/js_library/settings/userOption.php}
   * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/settings/userOption.php}
   */
  async set(name, value) {
    await init()
    return window.BX24.userOption.set(name, value)
  },
  /**
   * @param {String} name
   * @returns {Promise<void>}
   * @see EN {@link https://training.bitrix24.com/rest_help/js_library/settings/userOption.php}
   * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/settings/userOption.php}
   */
  async get(name) {
    await init()
    return window.BX24.userOption.get(name)
  }
}

export const appOption = {
  /**
   * @param {String} name
   * @param {String} value
   * @returns {Promise<void>}
   * @see EN {@link https://training.bitrix24.com/rest_help/js_library/settings/appOption.php}
   * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/settings/appOption.php}
   */
  async set(name, value) {
    if (!(await isAdmin())) throw "User is not admin"
    return await new Promise(resolve => window.BX24.appOption.set(name, value, resolve))
  },
  /**
   * @param {String} name
   * @returns {Promise<void>}
   * @see EN {@link https://training.bitrix24.com/rest_help/js_library/settings/appOption.php}
   * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/settings/appOption.php}
   */
  async get(name) {
    await init()
    return window.BX24.appOption.get(name)
  }
}

/**
 * @typedef {Object} Entity
 * @property {Number} id - ID
 * @property {String} name - Name
 */

/**
 * @returns {Promise<Entity>} User
 * @see EN {@link https://training.bitrix24.com/rest_help/js_library/dialog/selectUser.php}
 * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/dialog/selectUser.php}
 */
export async function selectUser() {
  await init()
  return await new Promise(resolve => window.BX24.selectUser(resolve))
}

/**
 * @returns {Promise<[Entity]>} Users
 * @see EN {@link https://training.bitrix24.com/rest_help/js_library/dialog/selectUsers.php}
 * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/dialog/selectUsers.php}
 */
export async function selectUsers() {
  await init()
  return await new Promise(resolve => window.BX24.selectUsers(resolve))
}

/**
 * @param {Array} [value=[]]
 * @returns {Promise<[Entity]>} Accesses
 * @see EN {@link https://training.bitrix24.com/rest_help/js_library/dialog/selectAccess.php}
 * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/dialog/selectAccess.php}
 */
export async function selectAccess(value) {
  await init()
  return await new Promise(resolve => window.BX24.selectAccess(value || [], resolve))
}

/**
 * @param {Object} params
 * @param {Array<String>} params.entityType
 * @param {Boolean} params.multiple
 * @param {Array|Object} params.value
 * @see EN {@link https://training.bitrix24.com/rest_help/js_library/dialog/selectCRM.php}
 * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/dialog/selectCRM.php}
 */
export async function selectCRM(params) {
  await init()
  return await new Promise(resolve => window.BX24.selectCRM(params, resolve))
}

/**
 * @returns {Promise<Boolean>}
 * @see EN {@link https://training.bitrix24.com/rest_help/js_library/additional/isAdmin.php}
 * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/isAdmin.php}
 */
export async function isAdmin() {
  await init()
  return window.BX24.isAdmin()
}

/**
 * @returns {Promise<String>}
 * @see EN {@link https://training.bitrix24.com/rest_help/js_library/additional/getLang.php}
 * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/getLang.php}
 */
export async function getLang() {
  await init()
  return window.BX24.getLang()
}

/**
 * @param {Number} width
 * @param {Number} height
 * @returns {Promise<*>}
 * @see EN {@link https://training.bitrix24.com/rest_help/js_library/additional/resizeWindow.php}
 * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/resizeWindow.php}
 */
export async function resizeWindow(width, height) {
  await init()
  return await new Promise(resolve => window.BX24.resizeWindow(width, height, resolve))
}

/**
 * @returns {Promise<*>}
 * @see EN {@link https://training.bitrix24.com/rest_help/js_library/additional/fitWindow.php}
 * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/fitWindow.php}
 */
export async function fitWindow() {
  await init()
  return await new Promise(resolve => window.BX24.fitWindow(resolve))
}

/**
 * @returns {Promise<*>}
 * @see EN {@link https://training.bitrix24.com/rest_help/js_library/additional/reloadWindow.php}
 * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/reloadWindow.php}
 */
export async function reloadWindow() {
  await init()
  return await new Promise(resolve => window.BX24.reloadWindow(resolve))
}

/**
 * @param {String} title
 * @returns {Promise<*>}
 * @see EN {@link https://training.bitrix24.com/rest_help/js_library/additional/setTitle.php}
 * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/setTitle.php}
 */
export async function setTitle(title) {
  await init()
  return await new Promise(resolve => window.BX24.setTitle(title, resolve))
}

/**
 * @returns {Promise<void>}
 * @see EN {@link https://training.bitrix24.com/rest_help/js_library/additional/ready.php}
 * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/ready.php}
 */
export async function ready() {
  await init()
  await new Promise(resolve => window.BX24.ready(resolve))
}

/**
 * @returns {Promise<Boolean>}
 * @see EN {@link https://training.bitrix24.com/rest_help/js_library/additional/isReady.php}
 * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/isReady.php}
 */
export async function isReady() {
  await init()
  return window.BX24.isReady()
}

/**
 * @param {Function} func
 * @param {Object} thisObject
 * @returns {Promise<Function>}
 * @see EN {@link https://training.bitrix24.com/rest_help/js_library/additional/proxy.php}
 * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/proxy.php}
 */
export async function proxy(func, thisObject) {
  await init()
  return window.BX24.proxy(func, thisObject)
}

/**
 * @returns {Promise<*>}
 * @see EN {@link https://training.bitrix24.com/rest_help/js_library/additional/closeapplication.php}
 * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/closeapplication.php}
 */
export async function closeApplication() {
  await init()
  await new Promise(resolve => window.BX24.closeApplication(resolve))
}

/**
 * @returns {Promise<*>}
 * @see EN {@link https://training.bitrix24.com/rest_help/js_library/additional/getDomain.php}
 * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/getDomain.php}
 */
export async function getDomain() {
  await init()
  return window.BX24.getDomain()
}

/**
 * @param {Object} [parameters={}]
 * @returns {Promise<*>} resolve when app will be closed
 * @see EN {@link https://training.bitrix24.com/rest_help/js_library/additional/openApplication.php}
 * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/openApplication.php}
 */
export async function openApplication(parameters) {
  await init()
  await new Promise(resolve => window.BX24.openApplication(parameters || {}, resolve))
}

/**
 * @returns {Promise<Object>}
 * @see EN {@link https://training.bitrix24.com/rest_help/js_library/additional/proxyContext.php}
 * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/proxyContext.php}
 */
export async function proxyContext() {
  await init()
  return window.BX24.proxyContext()
}

/**
 * @param {Number} scroll
 * @returns {Promise<*>} resolve when app will be closed
 * @see EN {@link https://training.bitrix24.com/rest_help/js_library/additional/scrollparentwindow.php}
 * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/scrollparentwindow.php}
 */
export async function scrollParentWindow(scroll) {
  await init()
  await new Promise(resolve => window.BX24.scrollParentWindow(scroll, resolve))
}

/**
 * @param {DOMNode} element
 * @param {String} eventName
 * @param {Function} func
 * @returns {Promise<Object>}
 * @see EN {@link https://training.bitrix24.com/rest_help/js_library/additional/bind.php}
 * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/bind.php}
 */
export async function bind(element, eventName, func) {
  await init()
  return window.BX24.bind(element, eventName, func)
}

/**
 * @param {DOMNode} element
 * @param {String} eventName
 * @param {Function} func
 * @returns {Promise<Object>}
 * @see EN {@link https://training.bitrix24.com/rest_help/js_library/additional/unbind.php}
 * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/unbind.php}
 */
export async function unbind(element, eventName, func) {
  await init()
  return window.BX24.unbind(element, eventName, func)
}

/**
 * @returns {Promise<Object>}
 * @see EN {@link https://training.bitrix24.com/rest_help/js_library/additional/getScrollSize.php}
 * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/getScrollSize.php}
 */
export async function getScrollSize() {
  await init()
  return window.BX24.getScrollSize()
}

/**
 * @param {Array|String} script
 * @returns {Promise<*>} resolve when app will be closed
 * @see EN {@link https://training.bitrix24.com/rest_help/js_library/additional/loadScript.php}
 * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/loadScript.php}
 */
export async function loadScript(script) {
  await init()
  await new Promise(resolve => window.BX24.loadScript(script, resolve))
}

export const im = {
  /**
   * @param userId
   * @param {Boolean} [video=true]
   * @returns {Promise<void>}
   * @see EN {@link https://training.bitrix24.com/rest_help/js_library/additional/im_callTo.php}
   * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/im_callTo.php}
   */
  async callTo(userId, video) {
    await init()
    return window.BX24.im.callTo(userId, video)
  },
  /**
   * @param {String} number
   * @returns {Promise<void>}
   * @see EN {@link https://training.bitrix24.com/rest_help/js_library/additional/im_phoneTo.php}
   * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/im_phoneTo.php}
   */
  async phoneTo(number) {
    await init()
    return window.BX24.im.phoneTo(number)
  },
  /**
   * @param {String} dialogId
   * @returns {Promise<void>}
   * @see EN {@link https://training.bitrix24.com/rest_help/js_library/additional/im_openMessenger.php}
   * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/im_openMessenger.php}
   */
  async openMessenger(dialogId) {
    await init()
    return window.BX24.im.openMessenger(dialogId)
  },
  /**
   * @param {String} dialogId
   * @returns {Promise<void>}
   * @see EN {@link https://training.bitrix24.com/rest_help/js_library/additional/im_openHistory.php}
   * @see RU {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/im_openHistory.php}
   */
  async openHistory(dialogId) {
    await init()
    return window.BX24.im.openHistory(dialogId)
  }
}

export const placement = {
  /**
   * @returns {Promise<Object>}
   * @see EN {@link https://training.bitrix24.com/rest_help/application_embedding/application_embedding/placement_info.php}
   * @see RU {@link https://dev.1c-bitrix.ru/rest_help/application_embedding/application_embedding/placement_info.php}
   * @see EN {@link https://training.bitrix24.com/rest_help/application_embedding/application_embedding/index.php}
   * @see RU {@link https://dev.1c-bitrix.ru/rest_help/application_embedding/application_embedding/index.php}
   */
  async info() {
    await init()
    return window.BX24.placement.info()
  },
  /**
   * @returns {Promise<*>}
   * @see EN {@link https://training.bitrix24.com/rest_help/application_embedding/application_embedding/index.php}
   * @see RU {@link https://dev.1c-bitrix.ru/rest_help/application_embedding/application_embedding/index.php}
   */
  async getInterface() {
    await init()
    await new Promise(resolve => window.BX24.placement.getInterface(resolve))
  },
  /**
   * @param {String} command
   * @param {Object} [parameters={}]
   * @returns {Promise<*>}
   * @see EN {@link https://training.bitrix24.com/rest_help/application_embedding/application_embedding/index.php}
   * @see RU {@link https://dev.1c-bitrix.ru/rest_help/application_embedding/application_embedding/index.php}
   */
  async call(command, parameters) {
    await init()
    await new Promise(resolve => window.BX24.placement.call(command, parameters || {}, resolve))
  },
  /**
   * @param {String} event
   * @returns {Promise<*>}
   * @see EN {@link https://training.bitrix24.com/rest_help/application_embedding/application_embedding/index.php}
   * @see RU {@link https://dev.1c-bitrix.ru/rest_help/application_embedding/application_embedding/index.php}
   */
  async bindEvent(event) {
    await init()
    await new Promise(resolve => window.BX24.placement.bindEvent(event, resolve))
  }
}

export default {
  isInit,
  init,
  install,
  installFinish,
  getAuth,
  refreshAuth,
  callMethod,
  callBatch,
  callMethodAll,
  callBind,
  callUnbind,
  userOption,
  appOption,
  selectUser,
  selectUsers,
  selectAccess,
  selectCRM,
  isAdmin,
  getLang,
  resizeWindow,
  fitWindow,
  reloadWindow,
  setTitle,
  ready,
  isReady,
  proxy,
  closeApplication,
  getDomain,
  openApplication,
  proxyContext,
  scrollParentWindow,
  bind,
  unbind,
  getScrollSize,
  loadScript,
  im,
  placement
}
