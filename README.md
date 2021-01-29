# bx24-api
This library loading script `api.bitrix24.com/api/v1/` and instead of callback use Promise.

## Installation
```
npm install bx24-api
```

## Use

```javascript
import BX24 from 'bx24-api'

let leads = [];
BX24.callMethod('crm.lead.get').then(data => {
    leads = data.answer.result
})
```

You don't need to call `init()` before using other functions, because `init()` is always called at the beginning of these functions, except `install()`

All functions duplicate from [Documentation](https://dev.1c-bitrix.ru/rest_help/js_library/index.php) 

## Generate error

You can turn on generate error when `callMethod`, `callBatch`, `callBind` and `callUnBind` return result with error.

```javascript
BX24.throwOn(true)
```

```javascript
BX24.callMethod('crm.lead.get').then(data => {
    leads = data.answer.result
}).catch(data => {
    // ...
})
```
