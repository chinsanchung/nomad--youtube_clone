## Youtube Clone

### 2장. ExpressJS 02

#### 2.18 Search Controller

-   우선 search controller 를 아래와 같이 수정합니다.

```javascript
// videoController
export const search = (req, res) => {
    const {
        query: { term: searchingBy },
    } = req; // const searchingBy = req.query.params.term 와 동일
    res.render("search", { pageTitle: "Search", searchingBy });
};
```

-   header.pue 에 Search form 을 만듭니다.
    -   req.query.term 의 값을 "searchingBy"라는 이름으로 저장해서, search URL 에 지역 변수로 보냈습니다.
    -   컨트롤러가 쿼리에 접근할 수 있도록 method 를 get 으로 잡았습니다. (get method 가 URL 에 정보를 전달해줍니다.)

```pue
.header__column
        form(action=routes.search method="get")
        input(type="text", placeholder="Search" name="term")
```

#### 2.19 Join: Log in HTML

-   join, login.pue 의 서식을 수정합니다.

```pug
//- join
.form__container
    form(action='/login', method="post")
        input(type='text', name='name', placeholder='Full name')
        input(type="email", name='email', placeholder='Email')
        input(type="password", name='password', placeholder='Password')
        input(type="password", name='password2', placeholder='Verify Password')
        input(type='submit', value='Join now')
    include partials/socialLogin
//- login
.form__container
    form(action='/login', method="post")
        input(type="email", name='email', placeholder='Email')
        input(type="password", name='password', placeholder='Password')
        input(type='submit', value='Log In')
    include partials/socialLogin
```

-   socialLogin.pug 에 페이스북, 깃허브 로그인 기능을 추가합니다. "|"은 pug 가 Continue 를 요소로 취급하지 않도록 해줍니다.

```pug
.social-login
    button
        span
            i.fab.fa-github
        |Continue with Github
    button
        span
            i.fab.fa-facebook
        |Continue with Facebook
```

#### 2.20 Change Profile HTML

-   editProfile.pue 를 수정합니다.

```pug
extends layouts/main

block content
    .form-container
        form(action=routes.editProfile, method="post")
            label(for="avatar") Avatar
            input(type="file" id="avatar", name="avatar")
            input(type="text", placeholder='Name', name='name')
            input(type='email', placeholder='Email', name='email')
            input(type='submit', value='Update Profile')
        a.form-container__link(href=routes.changePassword) Change Password
```

#### 2.21 Home Controller part One

-   changePassword, editVideo, upload, home.pug 를 수정합니다. [링크](https://github.com/nomadcoders/wetube/commit/1eab310c03c2fa44a7abf916ef5a85e39942a189)
-   가짜 DB 를 만들어 연습삼아 연결해봅니다. db.js 에 videos 배열을 작성했습니다.
-   videoController 에 videos 를 가져와 home.pug 에 넣었습니다.

```javascript
export const home = (req, res) => {
    res.render("home", { pageTitle: "Home", videos });
};
```

-   home.pug 에 해당 데이터를 반복해 템플릿에 적용합니다.

```pug
block content
    each item in videos
        h1= item.title
        p= item.description
```

#### 2.22 Home Controller part Two

-   비디오를 보여주는 블록 코드 views/mixins/videoBlock.pug 를 만듭니다. 반복되는 코드를 재활용하는 이 방법을 **믹스인**이라 부릅니다.
    -   믹스인은 웹사이트에서 자주 반복되는 HTML 코드를 가지고 있습니다.

```pug
mixin videoBlock(video = {})
    .videoBlock
        video.videoBlock__thum(src=video.videoFile, controls=true)
        h4.videoBlock__title=video.title
        h6.videoBlock__views=video.views
```

-   믹스인에 맞춰 home.pug 도 수정했습니다.

```pug
//- ...
each item in videos
    +videoBlock({
        title: item.title,
        views: item.views,
        videoFile: item.videoFile
    })
```

#### 2.23 Join Controller

##### Search

-   search.pug 에 비디오 믹스인 videoBlock.pug 를 넣고, 반복문 코드를 추가했습니다.

##### Join

-   누군가 회원가입을 하면 자동으로 로그인한 후 home 화면으로 이동시키고자 합니다.
-   우선 컨트롤러에 getJoin, postJoin 함수를 생성합니다. 그 다음 globalRouter 를 수정합니다.
-   postJoin 에 req.body 의 정보를 가져온 후, 비밀번호와 재입력 칸이 맞는지 확인합니다. 만약 아니라면 상태 코드 400을 전달하니다.
    -   postJoin 의 req.body 를 보면 입력했던 정보가 객체로 나옵니다. 이것을 도와주는 미들웨어가 bodyParser 입니다. bodyParser 가 없으면 req.body 를 출력할 수 없습니다.

```javascript
export const getJoin = (req, res) => {
    res.render("join", { pageTitle: "Join" });
};
export const postJoin = (req, res) => {
    const { name, email, password, password2 } = req.body;
    if (password !== password2) {
        res.status(400);
        res.render("join", { pageTitle: "Join" });
    } else {
        res.redirect(routes.home);
    }
};
// globalRouter
globalRouter.get(routes.join, getJoin);
globalRouter.post(routes.join, postJoin);
```

#### 2.24 Log In and User Profile Controller

-   login 도 join 과 비슷합니다. userController.js 에 getLogin, postLogin 을 작성합니다. 그 후 globalRouter 도 수정합니다.

```javascript
export const getLogin = (req, res) =>
    res.render("login", { pageTitle: "Log In" });
export const postLogin = (req, res) => {
    res.redirect(routes.home);
};
// globalRouter
globalRouter.get(routes.login, getLogin);
globalRouter.post(routes.login, postLogin);
```

-   그 다음 header.pug 를 로그인 여부에 따라 다른 화면을 보여주도록 설정합니다.

```pug
.header__column
    ul
        if user.isAuthenticated
            li
                a(href=routes.join) Join
            li
                a(href=routes.join) Log In
        else
            if
                a(routes.upload) Upload
            if
                a(href=routes.userDetail(user.id)) Profile
            li
                a(href=routes.logout) Log Out
```

-   middlewares.js 의 localMiddleware 에 isAuthenticated: true 객체를 입력합니다.

-   URL 에 값이 담기도록 routes.js 의 userDetail 을 함수로 작성합니다.
