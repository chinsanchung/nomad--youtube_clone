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

#### 2.21 Home Controller

-   changePassword, editVideo, upload, home.pug 를 수정합니다. [링크](https://github.com/nomadcoders/wetube/commit/1eab310c03c2fa44a7abf916ef5a85e39942a189)
-   가짜 DB 를 만들어 연습삼아 연결해봅니다.
