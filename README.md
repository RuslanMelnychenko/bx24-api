# bx24-api
This library loading script `https://api.bitrix24.com/api/v1/` and instead of callback use Promise.

# Use

```javascript
    import BX24 from 'bx24-api'
    
    BX24.init().then(() => {
        console.log('init')
        BX24.callMethod()
    })
```

And you can use all function from [Documentation](https://dev.1c-bitrix.ru/rest_help/js_library/index.php) 

P.S: At the beginning of each function, the `BX24.init()` function is executed, except `BX.install()`.
