# bx24-api

This library is an improved interface for working with the [official Bitrix JavaScript library](https://training.bitrix24.com/rest_help/js_library/index.php). 

> The library cannot be used for external applications and webhooks.

Advantage:
- [x] Promise is used instead of callback in functions.
- [x] Auto loading and initialize the official Bitrix library when calling any function.

---

Это библиотека представляет собой улучшений интерфейс для работы с [официальной JavaScript библитекой Bitrix](https://dev.1c-bitrix.ru/rest_help/js_library/index.php).

> Для внешних приложений и вебхуков библиотека использоваться не может.

Плюсы:
- [x] Использование Promise вместо callback в функциях.
- [x] Автоматическая загрузка и инициализация официальной библиотеки Bitrix при вызове любой функции

## Installation / Установка

```
npm install bx24-api
```

## Use / Использование

```javascript
import BX24 from 'bx24-api'

let leads = [];
BX24.callMethod('crm.lead.get').then(data => {
    leads = data.answer.result
})
```

You don't need to call `init()` before using any functions, because `init()` is always called at the beginning of these functions, except `install()`

All function from [official library](https://training.bitrix24.com/rest_help/js_library/index.php) duplicate for this library interface.

---

Вам не нужно постоянно вызывать функцию `init()` перед использованием любой функции, так как `init()` вызывается автоматически при вызове функции, исключение функция `install()`.

Все функции [официальной библиотеки](https://dev.1c-bitrix.ru/rest_help/js_library/index.php) дублированы под интерфейс данной библиотеки.

## Additions / Дополнения

### Request next data chunk / Запрос следующей страницы данных

`ajaxResult.next()` will return Promise like `callMethod`

---

`ajaxResult.next()` будет возращать Promise, как `callMethod`

```javascript
let lastCall = null
let users = []
callMethod('user.get').then(result => {
  lastCall = result.more()? result: null
  users.push(...result.data())
})

function nextPage() {
  if(lastCall) {
    lastCall.next().then(result => {
      lastCall = result.more()? result: null
      users.push(...result.data())
    })
  }
}
```

### Import Large Data Batches / Выгрузка больших объемов данных

Additional function `callMethodAll(method, params)` is designed to import large amounts of data. Based on advice in [the documentation](https://training.bitrix24.com/rest_help/rest_sum/start.php).

> Supports only methods for calling the list of entities that have an `ID` parameter in their structure and support query parameters: `filter`, `order` and `select` 

---

Дополнительная функция `callMethodAll(method, params)` разработана для загрузки больших объемов данных. Основана на примере с [документации](https://dev.1c-bitrix.ru/rest_help/rest_sum/start.php).

> Поддерживает только методы вызова списка сущностей которые имеют в своей структуре параметр `ID` и поддерживают параметры запроса: `filter`, `order`, `select`

```javascript
BX24.callMethodAll('crm.lead.get').then(result => {
  // ...
})
```

### Throw exception mode / Режим генерации ошибок

You can turn on to throw an exception and errors will be thrown when `callMethod`, `callBatch`, `callBind` and `callUnBind` return result with error.

---

Вы можете включить режим генерацию ошибок и тогда ошибки будут вызываться когда результаты `callMethod`, `callBatch`, `callBind` и `callUnBind` будут возвращать с ошибками.

```javascript
BX24.throwOn(true)

BX24.callMethod('crm.lead.get').then(result => {
    leads = result.data()
}).catch(data => {
    // ...
})
```
