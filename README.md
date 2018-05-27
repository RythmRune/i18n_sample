# i18n_sample
A demo project use NodeJs + Express + EJS + i18n

## Prolog
相信對前端網站開發者來說 i18n ( internationalization and localization ) 應該都略有所聞。  
Ruby聽說有直接的內建功能可以使用，但很遺憾的在下開發網站的框架是使用 NodeJs + Express 的架構。  
這邊就要來介紹一下一個 i18n 的套件以達到在 NodeJs + Express 的架構下也可以達到多國語言網站的實作方式。 
 
同時這也是在下第一次寫文章，還請多加指教。

## Environment 
* NodeJs + Express + EJS

* 使用的套件是 NPM 上面的 [i18n](https://www.npmjs.com/package/i18n)
```
npm install i18n --save
```

* 為了演示方便專案是使用[Express generator](http://expressjs.com/en/starter/generator.html)產生後再加以修改。
```
express i18n_sample --ejs
```

## Implement

基本上NPM頁面上其實本身就有很完整的範例。

1. 在安裝完 i18n 之後，以 express 框架為例，必須要先設定i18n的預設參數。

```JS
//app.js
let path = require('path');
let i18n = require('i18n');
i18n.configure({
        // set local list
        locales:['en', 'zh'],
        // set default local
        defaultLocale: 'zh',
        // set the directory which store language file
        directory: path.resolve(__dirname, 'locales'),
});
```

如果想要知道詳細 locales 代碼，可以參閱 [i18n-locales](https://www.npmjs.com/package/i18n-locales)

2. 設定完之後必須要做初始化的動作。  
這個動作會去取得使用者的地域設定 ( ex : cookie ) ，然後根據不同的框架會把地域的資訊加到 request 和 response 物件上。

```JS
//app.js
app.use(i18n.init);
``` 

3. 將要顯示的文字透過 i18n 的函式進行轉換。   
程式跑起來的時候， i18n 套件會將設置地域的JSON語言檔案建立好。舉個例字來說，因為已經設定en以及zh，所以就可以在專案的 locales 裡面找到 en.json 跟 zh.json 兩個檔案。  
除此之外，也會將第一次在程式中使用的文字也加入到 JSON 語言檔案內。第一次使用的文字則會根據 request 中 header 的 accepts-language 來決定新增到哪個檔案。舉例來說，環境中的 accepts-language 如果事 zh ，就可以在 zh.json 裡面找到新增的文字。  

了解上面的規則以後，如果要在主頁上面加上“您好”，然後可以根據不同的地域切換語言的話，先修改原始產出專案的 routes/index.js 、 views/index.ejs ，並且加上一個 controller/index_controller.js 。(實作上，個人習慣上會將 route 跟 controller 拆開，相關請研讀[這一篇](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes))

這邊先實做一個簡單的詞句確認 i18n 有正確在運作。 每一個要經過 i18n 轉換的詞句，可以透過 **__()** 來實作。 

```HTML
<!-- view/index.ejs -->
<!DOCTYPE html>
<html>
  <head>
    <title>i18n Demo</title>
    <link rel='stylesheet' href='/stylesheets/style.css' />
  </head>
  <body>
    <h1>Here is the demo page for i18n:</h1>
    <lu>
      <li>
          <span>simple phrase:<span>
          <p><%= simple_phrase %></p>
      </li>
    </lu>
  </body>
</html>
```

```JS
//routes/index.js
let express = require('express');
let router = express.Router();

let index_controller = require("../controller/index_controller")
router.get('/', index_controller.index_init);

module.exports = router;
```
```JS
//controller/index_controller.js
module.exports.index_init = (req, res) => {
    let simple_phrase = res.__('Hello');
    res.render('index', { simple_phrase: simple_phrase, });
}
```

接著，如果有啟動程式。如果是使用本地環境以及 express generator 產生的專案，造訪 [http://localhost:3000](http://localhost:3000) 就可以看到實際跑出來的結果。
```
node bin/www
```

## Validation
有關驗證的方式，因為 i18n 套件會使用在 header 裡面的 accept-language 去推測使用者的語言，所以可以直接在更改瀏覽器的設定來進行測試。
以 Chrome 為例，可以在[偏好設定]>[進階]>語言]進行設定。

以上為止是i18n的基礎設定。

## Plurals
如果只是單純設定單詞並不能解決多國語言網站的問題。 
現在試著考慮複雜一點的情況-單數/複數。在中文裡面一個蘋果、兩個頻果，蘋果不論單數或是複數都是蘋果。但是英文的情況下 Apple 的單複數是不同的表示法。

為了解決這個問題 i18n 套件也考慮得很周詳，可以使用 **__n()** 來解決這個問題。修改 controller/index_controller.js 、 views/index.ejs 。
```JS
//controller/index_controller.js 
module.exports.index_init = (req, res) => {
    let simple_phrase = res.__('Hello');

    let zero_apple =  res.__n('%s apple', 0);
    let single_apple =  res.__n('%s apple', 1);
    let plurals_apple =  res.__n('%s apple', 5);

    res.render('index', { 
        simple_phrase: simple_phrase,
        zero_apple: zero_apple,
        single_apple: single_apple,
        plurals_apple: plurals_apple,
    });
}
```
```HTML
<!-- view/index.ejs -->
<!DOCTYPE html>
<html>
  <head>
    <title>i18n Demo</title>
    <link rel='stylesheet' href='/stylesheets/style.css' />
  </head>
  <body>
    <h1>Here is the demo page for i18n:</h1>
    <lu>
      <li>
          <span>simple phrase:<span>
          <p><%= simple_phrase %></p>
      </li>
      <li>
        <span>plurals phrase:<span>
        <p><%= zero_apple %></p>
        <p><%= single_apple %></p>
        <p><%= plurals_apple %></p>
      </li>
    </lu>
  </body>
</html>
```

執行程式後， i18n 會在 accepts-language 的 JSON 裡面產出下面程式碼：
```JSON
//en.js
"%s apple": {
		"one": "%s apple",
		"other": "%s apple"
	}
```

自動產出的 JSON 需要對單複數微調，並且將其他語言新增單複數的設定如下。
```JSON
//en.json
{
	"Hello": "Hello",
	"%s apple": {
		"one": "%s apple",
		"other": "%s apples"
	}
}
```
```JSON
//zh.json
{
	"Hello": "您好",
	"%s apple": {
		"one": "%s 頻果",
		"other": "%s 頻果"
	}
}
```

結果產出後可以發現到，單數的確會用 apple 來顯示，複數的確會用 apples 來顯示，但是0就會是個問題， i18n 套件會用 other 那條規則來處理 0 的情況。

為了處理掉 0 的問題，這邊改用 ranged interval support 的寫法來處理。改寫 en.json 如下，就可以處理掉 0 的問題。
```JSON
//en.json
{
	"Hello": "Hello",
	"%s apple": {
		"one": "%s apple",
		"other": "[0] no apple | [2,] %s apples"
	}
}
```

## Formatting The Message
上面都僅演示了簡單的詞句，如果要做有使用參數的複雜句子，可以使用 **__mf()** 來實作。 
假設要用一套規則跑出"您好，名字"，改寫程式 controller/index_controller.js 、 views/index.ejs 、 en.json 、 zh.json 如下。
```JS
//controller/index_controller.js 
module.exports.index_init = (req, res) => {
    let simple_phrase = res.__('Hello');

    let zero_apple =  res.__n('%s apple', 0);
    let single_apple =  res.__n('%s apple', 1);
    let plurals_apple =  res.__n('%s apple', 5);

    let names = ["John", "Joe"];
    let sentance1 = res.__mf('Hello, {name}', { name: names[0] },);
    let sentance2 = res.__mf('Hello, {name}', { name: names[1] },);

    res.render('index', { 
        simple_phrase: simple_phrase,
        zero_apple: zero_apple,
        single_apple: single_apple,
        plurals_apple: plurals_apple,
        sentance1: sentance1,
        sentance2: sentance2,
    });
}
```
```HTML
<!DOCTYPE html>
<html>
  <head>
    <title>i18n Demo</title>
    <link rel='stylesheet' href='/stylesheets/style.css' />
  </head>
  <body>
    <h1>Here is the demo page for i18n:</h1>
    <lu>
      <li>
          <span>simple phrase:<span>
          <p><%= simple_phrase %></p>
      </li>
      <li>
        <span>plurals phrase:<span>
        <p><%= zero_apple %></p>
        <p><%= single_apple %></p>
        <p><%= plurals_apple %></p>
      </li>
      <li>
        <span> sentances:<span>
        <p><%= sentance1 %></p>
        <p><%= sentance2 %></p>
      </li>
    </lu>
  </body>
</html>

```
```JSON
//en.json
{
	"Hello": "Hello",
	"%s apple": {
		"one": "%s apple",
		"other": "[0] no apple | [2,] %s apples"
	},
	"Hello, {name}": "Hello, {name}"
}
```
```JSON
//zh.json
{
	"Hello": "您好",
	"%s apple": {
		"one": "%s 頻果",
		"other": "%s 頻果"
	},
	"Hello, {name}": "您好, {name}"
}
```

以上實作就可以做出套版句子。

## Reference
https://www.drzon.net/posts/i18n-for-node-express/  
https://cnodejs.org/topic/51f885ea44e76d216a513ea1
