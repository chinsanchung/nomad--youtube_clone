## Youtube Clone

### 4장. Webpack

웹팩의 작동 원리를 전부 완벽하게 이해할 필요는 없습니다. 그저 지금 어떤 기능을 쓰고 있는지 등 돌아가는 상황을 파악하면 됩니다.

#### 4.1 Introduction to Webpack

- webpack: 다양한 기반의 파일들(js, css, sass, png, jpg 등)을 호환성이 있는(오래된) 형태로 변환해서 하나의 js, css, jpg 파일로 변환해줍니다.
- 설치: `npm install webpack webpack-cli` 후 webpack.config.js 를 생성합니다. (참고: webpack, webpack-cli 는 모두 dependencies 에 설치해야합니다.)
  - package.json 명령어를 변경합니다.
    - npm start => npm dev:server
    - dev:assets: "webpack"
  - "dev:assets"는 자동으로 webpack.config.js 를 찾습니다.
- 우선 웹팩에서 사용할 assets/js/main.js, assets/scss/styles.scss 를 생성합니다.

```javascript
import "../scss/styles.scss";
```

```scss
body {
  background-color: blue;
}
```

- 기본 규칙
  - webpack 은 exported configuration object(webpack.config.js) 를 찾습니다. 이 파일에는 서버 코드와 연관시키면 안되는, 100% 클라리언트 코드입니다.
  - 예전의 자바스크립트 코드를 써야합니다. (모던 자바스크립트 파일이 아닙니다.)
  - webpack 의 기본 구성: entry(파일들이 어디에서 왔는지) + output(그 파일들을 어디에 넣을 것인지)
    - path.join(): 여러 인자를 하나의 경로로 합쳐줍니다. 상대경로와 절대경로도 알아서 처리해줍니다.
    - path.resolve(): join 과 비슷하지만, resolve 는 "/"을 만다면 절대 경로로 인식해 앞 경로를 무시하고, join 은 상대경로로 처리합니다.
      - 예: path.join('/a', '/b', 'c') -> /a/b/c/ ||| path.resolve('/a', '/b', 'c') -> /b/c

```javascript
const path = require("path");
// dirname: 현재 프로젝트 디렉토리 이름. 어디서든 접근가능한 node.js 전역 변수입니다.
const ENTRY_FILE = path.resolve(__dirname, "assets", "js", "main.js");
const OUTPUT_DIR = path.join(__dirname, "static");

const config = {
  entry: ENTRY_FILE,
  output: {
    path: OUTPUT_DIR,
    filename: "[name].[format]",
  },
};
module.export = config;
```

- 현재로서는 scss 파일을 인식하지 못해 에러가 뜰 것입니다. 웹팩에게 css, js, scss 등 파일이 무엇이고 어떻게 바꿔야할지를 설정해줘야 합니다.

#### 4.2 Styles with Webpack part one

- env 를 활용해 package.json scripts 를 바꿔봅니다. `"dev:assets": "WEBPACK_ENV=development webpack"`, 코드를 서버에 올려줄 `"build:assets": "WEBPACK_ENV=production webpack"`을 작성합니다.
- 파일들을 텍스트로 변환할 `npm install extract-text-webpack-plugin@next`를 설치합니다.
- webpack 설정
  - webpack.config.js 파일에 ENV 파일을 받도록 합니다. `const MODE = process.env.WEBPACK_ENV` 이 변수를 config 안에 `mode:mode`로 넣습니다.
- 웹팩이 파일들을 이해하도록 rules 를 넣습니다. (rules: 웹팩이 module 을 만났을 때 따를 규칙)
  - 1. scss 파일을 만날 떄마다, sass 파일을 가져오고(sass-loader) -> 그 파일 확장자가 scss 인지 알아보라(test) -> scss 를 css로 변환한 후, 전체 텍스트 중에 css 텍스트만 추출(ExtractCSS)해서 하나의 css 파일로 만들어라
  - **참고**: 웹팩의 loader 는 아래에서 위로 실행합니다. 따라서 use 를 설정할 때 extract 하는 작업(웹팩이 css 를 이해하도록 만들기), css 파일을 이해시키는 작업(여러 브라우저와 호환되도록 만들기 등), 그리고 sass 파일을 다루는 작업 순으로 작성합니다.
  - 2. css-loader, scss-loader, postcss-loader, node-sass 를 설치합니다. 그리고 postcss-loader 의 변환 기능을 더 잘 사용하기 위해 autoprefixer 를 설치합니다.

#### 4.3 Styles with Webpack part two

- scss 를 변환하는 작업을 이어서 진행합니다.
  - postcss-loader 의 option 에 어떤 기능을 사용할지 배열 형태로 작성합니다. 여기서는 browserslist 로 99.5% 의 브라우저를 호환하도록 설정했습니다.
  - 정의한 플러그인 ExtractCSS 를 사용하려면 바깥에서도 똑같이 plugins 로 웹팩에 설치해야합니다. `new ExtraCSS('styles.css')`로 변환을 끝낸 파일을 styles.css 라는 이름으로 저장하게 만들었습니다.
- 참고: 윈도우 사용자는 `mode: MODE.replace(/\s/g, "")`을 입력하거나, `"dev:assets": "set WEBPACK_ENV=development&&webpack"`, `"build:assets:set WEBPACK_ENV=production&&webpack"`으로 set 과 빈칸을 && 으로 바꿔야합니다.

```javascript
const ExtractCSS = require("extract-text-webpack-plugin");
const autoprefixer = require("autoprefixer");
const MODE = process.env.WEBPACK_ENV;

const config = {
  entry: ENTRY_FILE,
  mode: MODE.replace,
  module: {
    rules: [
      {
        test: /\(.scss)$/,
        use: ExtractCSS.extract([
          {
            loader: "css-loader",
          },
          {
            loader: "postcss-loader",
            options: {
              plugin() {
                return [autoprefixer({ browsers: "cover 99.5%" })];
              },
            },
          },
          {
            loader: "sass-loader",
          },
        ]),
      },
    ],
  },
  output: { path: OUTPUT_DIR, filename: "[name].js" },
  plugins: [new ExtractCSS("styles.css")],
};
```

- 제대로 작동하는지 확인하기 위해 sass 파일을 작성해봅니다.
  - scss/config/\_variables.scss 에 변수를 저장합니다. `$bgColor: blue;`
  - styles.scss 에 변수들을 불러와 사용합니다.

```scss
@import "config/_variables.scss";
body {
  background-color: $bgColor;
}
```

#### 4.4 ES6 with Webpack

- ES6 자바스크립트를 옛날 자바스크립트로 바꾸는 작업을 해봅니다. config.module 에 새로운 규칙을 만듭니다.
  - babel-loader 를 설치합니다.

```javascript
const config = {
  entry: ENTRY_FILE,
  mode: MODE,
  module: {
    rules: [{ test: /\.(js)$/, use: [{ loader: "babel-loader" }] }],
  },
};
```

- package.json

  - dev:assets 에 watch 를 추가합니다. 지켜본다는 것은, 파일의 변화를 자동으로 감지해 웹팩을 다시 실행시켜서, 내용을 바꿀 때마다 웹팩을 끄고 키는 번거로움을 줄입니다. `set WEBPACK_ENV=development&&webpack -w`

- views/layouts/main.pug 에 웹팩으로 바꾼 css 파일, js 파일을 링크로 연결합니다.

```pug
//- head 첫째줄
link(rel="stylesheet", href="/static/styles.css")
//- body 끝줄
script(src="/static/main.js")
```

- 이 변화를 서버에 알리기 위해 app.js 에 static 라우트를 추가합니다. /static 으로 갈 일이 있으면, static 폴더로 가보라고(`express.static('static')`) 입력합니다.

```javascript
app.use("/static", express.static("static"));
```

- 터미널1에 yarn run dev:server, 터미널2에 yarn run dev:assets 를 실행합니다. \_variables.scss 에 새로운 변수를 넣어 배경을 바꿔도, 웹팩을 다시 실행할 필요없이 새로고침만 하면 반영됩니다.
- 지금은 고쳤지만, 예전에는 async 를 인식하질 못했습니다. 그래서 babel-polyfill 을 설치했습니다. `npm install @babel/polyfill`
  - webpack.config.js 의 entry 에 babel/polyfill 을 추가합니다. `entry: ["@babel/polyfill", ENTRY_FILE]`
  - dev:server 명령을 다시 실행합니다.
