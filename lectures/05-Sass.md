## Youtube Clone

### 5장. Sass

#### 5.0 SCSS and Making the Header

- scss 특징
  - 자식 선택자를 `.부모클래스명.자식클래스명` 이런 식으로 적지 않고, 부모 클래스 선택자 안에 `.자식클래스명` 형태로 넣을 수 있습니다.
  - `.클래스명:last-child` -> `&:last-child` 이런 형태로 적을 수 있습니다.
- 파일 구성

  - /main.scss: footer 의 문제를 막기 위해 min-height 를 잡았습니다.
  - /config/reset.scss
  - /config/_variables.scss: sass 파일만 _ 을 붙입니다. 사용자가 쓰지 않을 파일입니다.
  - /styles.scss: config 폴더 안 파일들, main.scss 를 불러옵니다.
  - /partials/header.scss
  - /pages/home.scss

- [header.scss](https://github.com/nomadcoders/wetube/blob/92f0912aa257b3f0c2b5b64dfebc02753bb5b56d/assets/scss/partials/header.scss)
  - scss 파일 작성 후 header.pug 둘째 줄에 `.header__wrapper`를 넣고 아래 코드들을 안에 감싸줘야합니다.

#### 5.1 Footer and Login / Join

- 참고: middlewares.js 에 임시로 넣은 사용자 인증 isAuthenticated 를 false 로 바꿉니다. 인증은 scss 작성 후에 진행합니다.
- 참고: nodemon 으로 인해 scss 를 저장할 때마다 서버를 다시 시작하고 있습니다. package.json script 를 바꿔 scss 파일을 무시하게 해봅니다
  > "dev:server": "nodemon --exec babel-node init.js --delay 2 --ignore 'scss'"
- [footer.scss](https://github.com/nomadcoders/wetube/blob/92f0912aa257b3f0c2b5b64dfebc02753bb5b56d/assets/scss/partials/footer.scss)
- [form.scss](https://github.com/nomadcoders/wetube/blob/92f0912aa257b3f0c2b5b64dfebc02753bb5b56d/assets/scss/partials/form.scss)
- [socialLogin.scss](https://github.com/nomadcoders/wetube/blob/92f0912aa257b3f0c2b5b64dfebc02753bb5b56d/assets/scss/partials/socialLogin.scss)
- [main.scss]()
- [home.scss]()
- [videoDetail.scss]()
