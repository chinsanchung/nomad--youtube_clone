## Youtube Clone

### 2장. ExpressJS 02

#### 2.9 MVC Pattern part One

-   Model, View, Controller: Model(data) + View(how does the data look) + Controller(function that looks for the data) 패턴입니다.

##### 작업: URL 과 함수 분리

-   app.js: 불필요한 url, 함수를 삭제합니다.
-   routers 폴더를 만들고, userRouter(기존 router.js), videoRouter, globalRouter 파일을 만듭니다.
-   app.js
    -   userRouter, videoRouter, globalRouter 를 연결합니다.
    -   globalRouter 는 루트 "/" 로 접속할 때 보여줄 라우터입니다.

```javascript
// import userRouter, videoRouter, globalRouter
app.use("/", globalRouter);
app.use("/user", userRouter);
app.use("/video", videoRouter);
```

#### 2.10 MVC Pattern part Two

-   URL 을 전부 모은 routes.js 파일을 생성합니다. routes 폴더 바깥에 위치합니다.
    -   이렇게 하는 이유는 나중에 특정 페이지로 redirect 해야할 때 전체 URL 구조를 외울 필요 없이 routes.home 이런 식으로 작성하면 되기 떄문입니다.
    -   `:/id`라고 하는 이유는, express 가 : 이 있는 문자열을 변하는 값이라고 인식하기 때문입니다.
    -   routes 객체를 생성해 변수들을 하나로 묶어 export 합니다.
-   app.js 에 routes 객체를 가져와 app.use() 안의 URL 을 수정합니다.

```javascript
app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);
```

-   userRouter, videoRouter, globalRouter 에 routes 객체를 넣고, 아래와 같은 형태로 라우트들을 생성합니다.

```javascript
globalRouter.get(routes.home, (req, res));
```

#### 2.11 MVC Pattern part Three

##### Controller 만들기

-   컨트롤러는 어떤 일이 어떻게 발생하는지에 관한 로직입니다. 라우트를 생성할 때의 `(req, res) => res.send('Home')`을 전부 컨트롤러에 담겠습니다.
-   각 컨트롤러에 아래처럼 코드를 작성합니다.

```javascript
export const join = (req, res) => res.send("Join");
```

-   이제 userRouter, videoRouter, globalRouter 의 라우트에 넣습니다. (vscode 의 기능으로, export 한 것들을 자동으로 import 해서 넣을 수 있습니다.)

```javascript
globalRouter.get(routes.home, home);
```

#### 2.12 Recap

-   init.js: app.js 에서 가져온 app 이 있습니다.
-   app.js: express 를 가져오고, 실행한 결과를 app 상수로 만들었습니다. 그리고 각종 미들웨어를 추가했습니다.
-   routers: 3개의 라우터를 사용합니다. (global, user, video) 주소들은 모두 routes.js 에 넣었습니다.
-   controllers: 모든 라우터의 로직을 담은 함수들입니다.

#### 2.13 Installing Pug.js

-   pug: view 엔진입니다. HTML 파일을 더 아름답게 보이도록 만듭니다.
-   `npm install pug` app.js 에 app.set()으로 뷰의 설정값을 pug 로 바꿉니다.

```javascript
app.set("view engine", "pug");
```

-   pug 의 탬플릿 위치 기본값은 '/views' 이니, views 폴더를 만듭니다. (위치는 임의로 바꿀 수 있습니다.)
-   home.pug 파일을 생성합니다. pug 는 고유의 작성법이 있습니다. (예: p Hello!)
-   controller 들의 함수들을 아래와 같이 변경합니다. `render`함수는 views 폴더에서 인수의 이름이 적인 pug 파일을 찾아 보여줍니다.

```javascript
export const home = (req, res) => res.render("Home");
```

#### 2.14 Layouts with Pug

-   폴더 views/layouts를 만듭니다. 그리고 main.pug 를 만들었습니다. 모든 페이지의 토대가 되는 파일입니다. (block 으로 내용을 컴포넌트 형태로 사용합니다.)
-   그 다음, home.pug 에 `extends layouts/main.pug`를 추가해서 main.pug 레이아웃을 확장해서 사용하겠다는 뜻입니다.
-   views 폴더 안에 나머지 pug 파일들을 만듭니다.

```pug
//- main.pug
doctype html
html
    link(rel="stylesheet", href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU", crossorigin="anonymous")
    head
        title Youtube
    body
        main
            block content
        footer
            span &copy;Youtube
```

```pug
//- home.pug
extends layouts/main

block content
    p Hello Home
```

#### 2.15 Partials with Pug

-   partials: 페이지의 일부분입니다. (예: footer.pug) 웹사이트에서 분라할 영역(컴포넌트)를 분리할 수 있습니다.
-   partials 폴더를 만들고 그 안에 header.pug, footer.pug 를 작성합니다.
-   main.pug 의 footer 태그 대신 `include ../partials/footer`를 적으면 partial 을 사용할 수 있습니다.

```pug
//- footer
footer.footer
    .footer__icon
        i.fab.fa-youtube
    span.footer__text Youtubute #{new Date().getFullYear()} &copy;
```

#### 2.16 Local Variables in Pug

-   pug 탬플릿에서 라우트 객체를 쓰려면 어떻게 해야할까요?
    -   미들웨어를 사용합니다. 로컬 변수를 글로벌 변수로 사용하도록 만드는 local 미들웨어입니다. 여기선 locals 에 로컬 변수를 저장하고, 그것을 템플릿에서 사용했습니다.
-   res.locals 하위들은 탬플릿에 변수명으로 존재합니다. #{이름} 이런 식으로 사용합니다.
-   next(): localsMiddleware 는 라우터 전에 있기에 next 를 써야만 넘어갈 수 있습니다.

```javascript
import routes from "./routes";

export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = "Youtube";
    res.locals.routes = routes;
    next();
};
```

#### 2.17 Template Variables in Pug

-   전부가 아닌, 한 템플릿에서만 변수를 쓰게 하려면 어떻게 할까요?
    -   controller 의 render 함수에 두 번째 인자(객체)로 제공하면 됩니다.
-   모든 컨트롤러의 pageTitle 변수를 각각 입력합니다.

```javascript
// videoController
export const home = (req, res) =>
    res.render("Home", {
        pageTitle: "Home",
    });
```
