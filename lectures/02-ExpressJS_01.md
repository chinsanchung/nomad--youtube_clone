## Youtube Clone

### 2장. ExpressJS 01

#### 2.0 What is a Server?

-   서버는 인터넷에 연결된 컴퓨터. 물리적인 서버, 소프트웨어적인 서버로 구분됩니다.
-   소프트웨어 서버: 인터넷으로 접속이 가능한, 어떠한 접속을 listen 하고, 접속 요청에 응답하는 컴퓨터입니다.

#### 2.1 What is Express?

-   node 프레임워크입니다. 프레임워크란 몇 천 줄 이상의 코드로 이뤄진 프로그램으로, 덕분에 단 몇 줄만으로 서버를 만들도록 도와줍니다.

#### 2.2 Install Express

`npm init`으로 package.json 을 설치한 후, 이 파일이 있는 곳에 `npm install express`를 실행합니다.

#### 2.3 Your First Express Server

-   우선 package.json 에 script 로 `node index.js`를 실행하도록 만듭니다.

```javascript
const express = require("express");
const app = express();
const PORT = 4000;
function handleListening() {
    console.log(`Listening on http://localhost:${PORT}`);
}

app.listen(PORT, handleListening);
```

-   require: node_modules 에서 express 를 가져옵니다.(import)
-   app: express 를 실행합니다.
-   app.listen: 특정 포트를 listen 합니다.

#### 2.4 Handling Routes with Express

-   인터넷 메소드
    -   POST request 로 로그인 요청을 합니다. (GET request 로는 정보를 전달할 수 없습니다.)
    -   전달한 후, 서버를 실행해 작업을 수행합니다.
    -   `app.get`으로 요청할 때, 응답으로 웹사이트 서버를 보내려면 HTML, CSS 파일을 send 해야 합니다.

```javascript
// GET 에 대한 응답(res)가 없으면 무한 로딩이 일어납니다.
function handleHome(req, res) {
    res.send("Hello from Home");
}
function handleProfile(req, res) {
    res.send("You are on my profile");
}
// GET 으로 라우트 생성
app.get("/", handleHome);
// GET 02
app.get("/profile", handleProfile);
```

#### 2.5 ES6 on Node using Babel

-   Babel: 최신 js 코드를 예전 js 파일로 변환해줍니다. 이번에는 node 의 babel 을 설치합니다. `npm install @babel/node` 실험성이 덜한 babel/preset-env 를 사용합니다. `npm install @babel/preset-env`, `npm install @babel/core`
-   .babelrc 파일에 설정을 삽입합니다.

```
{
    "presets": ["@babel/preset-env"]
}
```

-   그 다음, package.json 의 scripts 를 `babel-node index.js`으로 바꿔 node 대신 babel 이 실행해서 코드를 변환한 후 node 를 실행하도록 바꾸겠습니다. (그 전에 index.js 를 ES6으로 바꿨습니다.)
-   다만 nodemon 을 설치해서 자동으로 변경이 적용되도록 만듭니다. dependency(프로젝트 실행에 필요한 것) 와 별개로 설치하려면, `npm install nodemon --save-dev` 으로 입력합니다.
    -   그 다음 package.json 을 `nodemon --exec babel-node index.js --delay 2`로 수정합니다. babel 이 수정할 때까지 기다렸다가 서버를 시작하게 해줍니다.
-   nodemon 은 저장할 때마다 서버를 재시작, 새로고침을 알아서 해줍니다.

#### 2.6 Express Core: Middlewares

-   middleware: express 에서의 미들웨어는 유저와 마지막 응답 사이(beginning--middelware--start)에 존재하며, 작업이 끝날 때까지 연결되어 있는 함수입니다.
    -   웹사이트에 접속하려고 할 때, 미들웨어를 시작합니다. index.html 을 실행하고, app 실행, route 가 존재하는지 확인합니다. '/'가 존재하므로, handleHome 으로 응답을 전송합니다.
-   express 의 모든 라우트는 connection 에 req, res, next 를 가지고 있습니다. (다만 handle~~함수는 마지막 함수이기에 next 를 넣지 않았습니다.)
    -   next() 는 다음 미들웨어를 호출합니다.
-   next() 로 계속 다음을 호출하는 express 는 양파와 비슷하다고 할 수 있습니다. 계속 층(미들웨어)를 벗기다가 마지막에는 유저에거 무언가를 리턴합니다.
    -   미들웨어를 계속 추가할 수 있습니다. 예시: 유저의 로그인 여부를 체크하거나, 파일을 전송할 때 중간에 가로채서 upload하거나, 로그를 남기는 등.
-   `app.get('/', betweenHome, handleHome)`으로 / 라우트에서만 betweenHome 미들웨어를 쓰게 했지만, 만약 `app.use(betweenHome)`을 한다면 모든 웹페이지에서 사용하게 됩니다.
    -   참고로, express 에서는 **순서가 매우 중요합니다.** connection 을 주로 위에서 아래로 실행하는데, `app.get()` 사이에 미들웨어를 넣어야 그 다음에 라우트를 반환하면서 미들웨어를 사용할 수 있게 됩니다.
    -   앞으로 라우트 실행 전에 많은 미들웨어를 넣을 것입니다.

```javascript
// 미들웨어 직접 만들어 이해하기
const betweenHome = (req, res, next) => {
    console.log("I'm between");
    next(); // 다음 미들웨어(여기선 handleHome)을 호출합니다.
};
app.use(betweenHome);
// "/" 라우트와 응답 handleHome 사이에 넣어봅니다.
// app.get("/", betweenHome, handleHome);
app.get("/", handleHome); // app.use 가 있으니 넣을 필요가 없습니다.
app.get("profile", handleProfile);
// 모든 페이지마다 실행하도록 만듭니다.
```

#### 2.7 Express Core: Middleware part Two

-   Morgan: logging(무슨 일이 어디서 일어났는지 기록하는 것) 에 도움을 주는 미들웨어입니다.
    -   morgan 에는 여러 옵션이 있습니다. 접속한 브라우저, 요청, 시간을 확인할 수도 있습니다.
-   Helmet: node 의 보안과 관련이 있습니다.
-   Cookie Parser: 세션을 다루기 위해서 쿠키에 유저 정보를 저장할건데, 그럴 때 이것을 사용합니다.
-   Body Parser: 서버가 form 을 보내면, 받은 정보를 처리해야 합니다. 이것은 body 로부터 정보를 얻기 위해, 우리가 무엇을 전송하는지를 서버가 알도록 해줍니다.

    -   json: json을 전송할 때, 서버가 json 을 이해하도록 해줍니다.
    -   urlencoded: 일반적인 HTML form 을 전송한다면, 서버가 HTML form 을 이해하도록 해줍니다.

```javascript
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());
```

-   참고로, 미들웨어로 연결을 끊을 수도 있습니다. next 를 쓰지 않고 res.send()만 보내면 됩니다.

```javascript
const middleware = (req, res, next) => {
    res.send("not happening");
};
app.get("/", middleware, handleHome);
```

#### 2.8 Express Core: Routing

##### 코드 수정, 새 파일 생성

-   새로운 파일 init.js 을 생성합니다. 기존의 index.js도 app.js로 바꿉니다. app.js 에서 불필요한 부분(listening)을 지웠습니다.
    -   그리고 package.json 의 scripts 도 수정합니다. (index.js -> init.js)
-   init.js 에서 앱을 호출(시작)하겠습니다. 모듈을 사용할 것입니다. (모듈: 다른 파일의 코드를 가져다 사용하는 ES6 의 개념입니다.) app.js 의 코드를 init.js 에서 사용합니다.

```javascript
// app.js 에서 export default app; 을 우선 해야합니다.
import app from "./app";

const PORT = 4000;
const handleListening = () =>
    console.log(`Listening on: http://localhost:${PORT}`);
app.listen(PORT, handleListening);
```

##### Router

-   라우터는 라우트들의 복잡함을 쪼개는데 사용합니다. router.js 파일을 만들어 작성합니다.

```javascript
import express from "express";

export const userRouter = express.Router();

userRouter.get("/", (req, res) => res.send("user index"));
userRouter.get("/edit", (req, res) => res.send("user edit"));
userRouter.get("/password", (req, res) => res.send("user password"));
```

-   이것을 app.js 에 가져와서 사용합니다. (참고: `export default`가 아닌 `export`를 쓰면 {이름} 이렇게 불러와야합니다.)
    -   get()이 아닌 use()를 쓰는 이유는, 누군가 "/user" 경로에 접속하면 userRouter 전체를 사용하겠다는 뜻입니다.

```javascript
import { userRouter } from "./router";

app.get("/", handleHome);
app.get("/profile", handleProfile);
app.use("/user", userRouter);
```
