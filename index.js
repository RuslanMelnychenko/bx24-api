import scriptLoader from './loadscript'

const URL_SCRIPT = "//api.bitrix24.com/api/v1/"

let initialized = false

export const isInit = () => initialized;

window.BX24 = {}

function load() {
    return scriptLoader(URL_SCRIPT)
}

/**
 * Initializing
 * @returns {Promise<{}>}
 * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/system/init.php}
 */
export async function init() {
    await load()
    initialized = true
    await new Promise(resolve => window.BX24.init(resolve))
}

/**
 * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/system/installFinish.php}
 */
function installFinish() {
    window.BX24.installFinish()
}
/**
 *
 * @returns {Promise<installFinish>}
 * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/system/install.php}
 * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/system/installFinish.php}
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
 * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/system/getAuth.php}
 */
export async function getAuth() {
    await init()
    return window.BX24.getAuth()
}

/**
 * @returns {Promise<Boolean|Object>}
 * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/system/refreshAuth.php}
 */
export async function refreshAuth() {
    await init()
    return await new Promise(resolve => window.BX24.refreshAuth(resolve))
}

/**
 * @param {String} method
 * @param {Object} params
 * @returns {Promise<Object>}
 * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/rest/callMethod.php}
 */
export async function callMethod(method, params) {
    await init()
    return await new Promise(resolve => window.BX24.callMethod(method, params, resolve))
}

/**
 * @param {Array|Object} calls
 * @param {Boolean} [bHaltOnError=false]
 * @returns {Promise<Array|Object>}
 * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/rest/callBatch.php}
 */
export async function callBatch(calls, bHaltOnError) {
    await init()
    return await new Promise(resolve => window.BX24.callBatch(calls, resolve, bHaltOnError))
}

/**
 * @param {String} event
 * @param {String} handler
 * @param {Number} [auth_type]
 * @returns {Promise<Object>}
 * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/rest/bx24.callbind.php}
 */
export async function callBind(event, handler, auth_type) {
    await init()
    return await new Promise(resolve => window.BX24.callBind(event, handler, auth_type, resolve))
}

/**
 * @param {String} event
 * @param {String} handler
 * @param {Number} [auth_type]
 * @returns {Promise<Object>}
 * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/rest/bx24_callunbind.php}
 */
export async function callUnbind(event, handler, auth_type) {
    await init()
    return await new Promise(resolve => window.BX24.callUnbind(event, handler, auth_type, resolve))
}

export const userOptions = {
    /**
     * @param {String} name
     * @param {String} value
     * @returns {Promise<void>}
     * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/settings/userOption.php}
     */
    async set(name, value) {
        await init()
        window.BX24.userOption.set(name, value)
    },
    /**
     * @param {String} name
     * @returns {Promise<void>}
     * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/settings/userOption.php}
     */
    async get(name) {
        await init()
        window.BX24.userOption.get(name)
    }
}

export const appOption = {
    /**
     * @param {String} name
     * @param {String} value
     * @returns {Promise<void>}
     * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/settings/appOption.php}
     */
    async set(name, value) {
        await init()
        window.BX24.appOption.set(name, value)
    },
    /**
     * @param {String} name
     * @returns {Promise<void>}
     * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/settings/appOption.php}
     */
    async get(name) {
        await init()
        window.BX24.appOption.get(name)
    }
}

/**
 * @typedef {Object} Entity
 * @property {Number} id - ID
 * @property {String} name - Name
 */

/**
 * @returns {Promise<Entity>} User
 * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/dialog/selectUser.php}
 */
export async function selectUser() {
    await init()
    return await new Promise(resolve => window.BX24.selectUser(resolve))
}

/**
 * @returns {Promise<[Entity]>} Users
 * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/dialog/selectUsers.php}
 */
export async function selectUsers() {
    await init()
    return await new Promise(resolve => window.BX24.selectUsers(resolve))
}

/**
 * @param {Array} [value=[]]
 * @returns {Promise<[Entity]>} Accesses
 * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/dialog/selectAccess.php}
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
 * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/dialog/selectCRM.php}
 */
export async function selectCRM(params) {
    await init()
    return await new Promise(resolve => window.BX24.selectCRM(params, resolve))
}

/**
 * @returns {Promise<Boolean>}
 * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/isAdmin.php}
 */
export async function isAdmin() {
    await init()
    return window.BX24.isAdmin()
}

/**
 * @returns {Promise<String>}
 * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/getLang.php}
 */
export async function getLang() {
    await init()
    return window.BX24.getLang()
}

/**
 * @param {Number} width
 * @param {Number} height
 * @returns {Promise<*>}
 * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/resizeWindow.php}
 */
export async function resizeWindow(width, height) {
    await init()
    return await new Promise(resolve => window.BX24.resizeWindow(width, height, resolve))
}

/**
 * @returns {Promise<*>}
 * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/fitWindow.php}
 */
export async function fitWindow() {
    await init()
    return await new Promise(resolve => window.BX24.fitWindow(resolve))
}

/**
 * @returns {Promise<*>}
 * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/reloadWindow.php}
 */
export async function reloadWindow() {
    await init()
    return await new Promise(resolve => window.BX24.reloadWindow(resolve))
}

/**
 * @param {String} title
 * @returns {Promise<*>}
 * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/setTitle.php}
 */
export async function setTitle(title) {
    await init()
    return await new Promise(resolve => window.BX24.setTitle(title, resolve))
}

/**
 * @returns {Promise<void>}
 * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/ready.php}
 */
export async function ready() {
    await init()
    await new Promise(resolve => window.BX24.ready(resolve))
}

/**
 * @returns {Promise<Boolean>}
 * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/isReady.php}
 */
export async function isReady() {
    await init()
    return window.BX24.isReady()
}

/**
 * @param {Function} func
 * @param {Object} thisObject
 * @returns {Promise<Function>}
 * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/proxy.php}
 */
export async function proxy(func, thisObject) {
    await init()
    return window.BX24.proxy(func, thisObject)
}

/**
 * @returns {Promise<*>}
 * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/closeapplication.php}
 */
export async function closeApplication() {
    await init()
    await new Promise(resolve => window.BX24.closeApplication(resolve))
}

/**
 * @returns {Promise<*>}
 * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/getDomain.php}
 */
export async function getDomain() {
    await init()
    return window.BX24.getDomain()
}

/**
 * @param {Object} [parameters={}]
 * @returns {Promise<*>} resolve when app will be closed
 * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/openApplication.php}
 */
export async function openApplication(parameters) {
    await init()
    await new Promise(resolve => window.BX24.openApplication(parameters || {}, resolve))
}

/**
 * @returns {Promise<Object>}
 * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/proxyContext.php}
 */
export async function proxyContext() {
    await init()
    return window.BX24.proxyContext()
}

/**
 * @param {Number} scroll
 * @returns {Promise<*>} resolve when app will be closed
 * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/scrollparentwindow.php}
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
 * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/bind.php}
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
 * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/unbind.php}
 */
export async function unbind(element, eventName, func) {
    await init()
    return window.BX24.unbind(element, eventName, func)
}

/**
 * @returns {Promise<Object>}
 * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/getScrollSize.php}
 */
export async function getScrollSize() {
    await init()
    return window.BX24.getScrollSize()
}

/**
 * @param {Array|String} script
 * @returns {Promise<*>} resolve when app will be closed
 * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/loadScript.php}
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
     * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/im_callTo.php}
     */
    async callTo(userId, video) {
        await init()
        return window.BX24.im.callTo(userId, video)
    },
    /**
     * @param {String} number
     * @returns {Promise<void>}
     * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/im_phoneTo.php}
     */
    async phoneTo(number) {
        await init()
        return window.BX24.im.phoneTo(number)
    },
    /**
     * @param {String} dialogId
     * @returns {Promise<void>}
     * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/im_openMessenger.php}
     */
    async openMessenger(dialogId) {
        await init()
        return window.BX24.im.openMessenger(dialogId)
    },
    /**
     * @param {String} dialogId
     * @returns {Promise<void>}
     * @see {@link https://dev.1c-bitrix.ru/rest_help/js_library/additional/im_openHistory.php}
     */
    async openHistory(dialogId) {
        await init()
        return window.BX24.im.openHistory(dialogId)
    }
}

export const placement = {
    /**
     * @returns {Promise<Object>}
     * @see {@link https://dev.1c-bitrix.ru/rest_help/application_embedding/application_embedding/placement_info.php}
     * @see {@link https://dev.1c-bitrix.ru/rest_help/application_embedding/application_embedding/index.php}
     */
    async info() {
        await init()
        return window.BX24.placement.info()
    },
    /**
     * @returns {Promise<*>}
     * @see {@link https://dev.1c-bitrix.ru/rest_help/application_embedding/application_embedding/index.php}
     */
    async getInterface() {
        await init()
        await new Promise(resolve => window.BX24.placement.getInterface(resolve))
    },
    /**
     * @param {String} command
     * @param {Object} [parameters={}]
     * @returns {Promise<*>}
     * @see {@link https://dev.1c-bitrix.ru/rest_help/application_embedding/application_embedding/index.php}
     */
    async call(command, parameters) {
        await init()
        await new Promise(resolve => window.BX24.placement.call(command, parameters || {}, resolve))
    },
    /**
     * @param {String} event
     * @returns {Promise<*>}
     * @see {@link https://dev.1c-bitrix.ru/rest_help/application_embedding/application_embedding/index.php}
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
    getAuth,
    refreshAuth,
    callMethod,
    callBatch,
    callBind,
    callUnbind,
    userOptions,
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
