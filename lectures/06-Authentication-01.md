## Youtube Clone

### 6장. User Authentication

#### 6.0 Introduction to PassportJS

##### 6.0.1 참고할 내용들

- 인증: 브라우저 상에 쿠키를 설정하면, 그 쿠키를 통해 사용자 아이디 등을 알 수 있습니다. Passport 는 그 쿠키를 자동으로 가져와서 인증이 완료된 사용자 객체를 컨트롤러에 넘겨줍니다.
- 쿠키: 브라우저에 저장할 수 있는 데이터로, 모든 요청에 대해 백엔드로 전송할 정보들을 담고 있습니다. 예를 들어 로그인을 요청하면, 클라이언트 쿠키에 있는 관련 정보를 서버로 자동 전송하게 됩니다.

##### 6.0.2 Passport

- 미들웨어 Passport 는 사용자 인증을 구현해줍니다.
- Passport 는 페이스북, 구글, 깃허브, 인스타그램 등 다양한 서비스의 인증을 지원합니다. 또한 다양한 모듈들도 같이 지원합니다.
- Passport 는 쿠키를 생성하고, 브라우저에 저장시켜주고, 유저에게 해당 쿠키를 제공합니다.
- 예시
  - local: 전략을 뜻합니다. 페이스북, 깃허브같은 전략을 입력합니다.
  - Passport 가 생성한 req.user 가 바로 로그인한 사용자입니다.

```javascript
// 예시.
app.post("/login", passport.authenticate("local"), (req, res) => {
  res.redirect("/users/" + req.user.username);
});
```

- Passport 에 이어서 passport-local-mongoose 를 설치합니다. 사용자 기능(User functionality)를 자동으로 만들어줍니다.

#### 6.1 Local Authentication with Passport part One

##### 6.1.1 User model

- 소셜 계정 ID 도 추가합니다. 이메일, 깃허브, 페이스북 등 다양한 계정을 한 사용자로 통합해서 묶어야 중복 가입을 막을 수 있습니다.
- 소셜 계정에는 비밀번호를 넣지 않습니다.
- init.js 에 모델을 import 합니다.
- passport-local-mongoose 를 import 해서 사용합니다
  - passport 를 이용한 사용자 인증을 가능하게 해주는 플러그인입니다.
  - 패스워드 설정, 패스워드 확인 등을 자동을 해줍니다.
  - 여기서는 username(email), password 를 통한 로그인 방식을 위해 `usernameField: 'email'`로 했습니다.
- 사용자계정으로 이메일을 사용하면, 이름을 계정으로 했을 때의 불편함(이름 변경 시 복잡한 절차가 필요)을 줄일 수 있습니다.

```javascript
// User.js
import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  avatarUrl: String,
  facebookId: Number,
  githubId: Number,
});
// passport 에 쓸 username 을 email 로 설정합니다.
UserSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});

const model = mongoose.Model("User", UserSchema);

export default model;
```

##### 6.1.2 passport.js

- 우선 `yarn add passport-local`을 설치합니다.
  - username, password 를 사용하는 사용자 인증 방식입니다.
  - 이외에도 passport-facebook, passport-github 등이 있습니다.
- `passport.use()`로 전략(로그인하는 방식)을 설정합니다.
  - 여기선 passport-local-mongoose 가 지원하는 방식으로 입력합니다. 복잡한 절차를 `User.createStrategy()` 한 줄로 줄일 수 있습니다.

```javascript
// passport.js
import passport from "passport";
import User from "./models/User";

passport.use(User.createStrategy());
```

#### 6.2 Local Authentication with Passport part Two

- serialization : 어떤 정보를 쿠키에게 줄 것인지(=(클라이언트의 사용자가 어떤 정보를 가질 수 있는지)를 정해주고, serialization 이 어떤 필드가 쿠키에 포함될 지를 알려줍니다.
  - 쿠키는 매우 작아야하고, 민감한 정보를 담아선 안됩니다. (누군가가 그 정보에 접근할 위험) 사람들은 일반적으로 쿠키에 id 를 담고, 그 id 를 통해 사용자를 식별합니다.
  - serializeUser: user.id 만 쿠키에 담아 전송하도록 합니다.
- deserialization: serialization 을 통해 받은 쿠키의 정보를 어떻게 사용자로 전환하는지를 다룹니다. (deserializeUser)

```javascript
// passport.js
import passport from "passport";
import User from "./models/User";

passport.use(User.createStrategy());
// 쿠키에 오직 user.id 만 담아 보내주도록 하라고 요청함.
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
```

- 패스워드가 맞는지 체크하는 미들웨어를 추가합니다. 가입 후의 절차는 다음 강의에서 진행합니다.

```javascript
// userController.js
import User from "../models/User";

export const postJoin = async (req, res) => {
  const {
    body: { name, email, password, password2 },
  } = req;
  if (password !== password2) {
    res.status(400);
    res.render("join", { pageTitle: "Join" });
  } else {
    try {
      const user = await User.create({ name, eamil });
      await User.register(user, password);
    } catch (error) {
      console.log(error);
      res.redirect(routes.home);
    }
  }
};
```

#### 6.3 Logging the User In

- 가입 후에 그 정보를 바탕으로 바로 로그인 체크를 해서 메인 페이지로 넘어가도록 바꿉니다.

```javascript
// globalRouter.js
globalRouter.post(routes.join, postJoin, postLogin);
```

- postJoin 이후를 받기 위해 postLogin 내용을 변경합니다.
  - next 를 매개변수로 넣어 next() 으로 다음 기능으로 넘어가도록 만듭니다.
  - passport.authenticate() 는 username(여기선 email)과 password 를 찾도록 설정되어 있습니다.

```javascript
// userController.js
import passport from "passport";

export const postLogin = (req, res) =>
  passport.authenticate("local", {
    failureRedirect: routes.login,
    successRedirect: routes.home,
  });
```

- postJoin 에서 받은 username(이메일), 패스워드 정보를 postLogin 으로 보냅니다. (미들웨어는 정보를 다음 미들웨어로 전달합니다.)

```javascript
globalRouter.post(routes.join, postJoin, postLogin);
```

- middlewares.js 의 localsMiddleware 유저 부분을 변경합니다. `res.locals.user=req.user || {}`
  - passport 가 사용자를 로그인시킬 때 쿠키, serialize, deserialize 기능, 사용자가 담긴 객체를 요청에 올려줍니다.
- app.js 에 passport 를 넣고, 라우터를 쓰기 전에 아래처럼 작성합니다.
  - cookieParser 로부터 가져온 쿠키를 passport 가 감지하고, 쿠키 정보에 해당하는 사용자를 찾아줍니다. 그리고 찾은 사용자를 req.user 라는 객체로 만들어줍니다.
  - yarn add express-session 으로 session 을 관리하게 만들어, passport.session() 이 작동되도록 합니다.

```javascript
import "./passport";
app.use(passport.initialize());
app.use(passport.session());
```

#### 6.4 Sessions on Express

##### app.js

- `yarn add express-session`을 설치합니다. 그리고 `import session from 'express-session'`을 넣습니다.
- session 을 작성 후 옵션을 설정합니다.
  - secret 은 무작위 문자열로, 쿠키에 들어있는 세션 id 를 암호화합니다. 여기에 특정 랜덤 문자열 [사이트](https://randomkeygen.com/)에서 가져와 넣으면, 그 글자를 알기 전까진 비밀을 유지해줍니다. env 파일에 그 문자열을 적어줍니다.
  - resave: 세션을 강제로 저장합니다.
  - saveUninitialized: 초기화되지 않은 세션을 저장소에 넣습니다. 새로운 새션이지만 변경사항이 없다면 세션을 초기화하지 않습니다. 로그인 세션에 쓰려면 false 를 해야합니다.

```javascript
// app.js
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: false,
  })
);
```

```javascript
// middlewares.js
export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "WeTube";
  res.locals.routes = routes;
  res.locals.user = req.user || {};
  res.locals.user = req.user || null;
  console.log(req.user);
  next();
};
```

- 정리
  - 1.express 는 세션을 통해 쿠기를 가지게 됐습니다. 세션이 쿠키를 해석하는 기능이 있기 때문입니다.
  - 2.passport.session() 를 통해, 세션에 있는 쿠키를 이용합니다.
  - 3.passport.deserializeUser() 로 쿠키를 해독합니다.
  - 4.passport 가 쿠키에서 찾은 사용자를 미들웨어나 라우트의 요청 객체에 넣습니다. 이제 어느 라우트에서든 로그인한 사용자를 체크할 수 있습니다.
- 하지만 매번 서버를 새로 실행시킬 때마다 세션 정보가 사라집니다. 현재 세션, 쿠키 정보들을 메모리에 저장하고 있어서입니다.

#### 6.5 MongoStore and Middlewares

##### 몽고와 세션 연결하기

- 이제 몽고DB 를 사용해 세션을 저장할 차례입니다. `yarn add connect-mongo`를 설치합니다.
  - connect-mongo 를 통해 세션에게 데이터를 몽고db 저장소에 넣으라고 명령합니다.
- 쿠키저장소 CookieStore 를 만들고, 세션을 입력합니다.
- 그 후, 세션 설정에 store 를 추가합니다.
  - 이제 쿠키스토어와 몽고를 연결해야 합니다. 몽구스를 불러와 세션 store 에 연결합니다.
- 이제 서버를 재시작하더라도 쿠키를 계속 보존하고, 유저는 여전히 로그인 상태를 유지할 것입니다.

```javascript
// app.js
import MongoStore from "connect-mongo";

const CookieStore = MongoStore(session);
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: false,
    saveUninitialized: false
    saveUninitialized: false,
    store: new CokieStore({ mongooseConnection: mongoose.connection })
  })
);
```

##### routes 출입 제한하기

- 제한이라는 뜻은, 로그인된 사용자는 join 화면으로 접근하지 못하도록 막는 등의 행동을 뜻합니다.
- 새로운 미들웨어 onlyPublic 을 만들어서, 로그인 유저가 있으면 특정 컨트롤러에 접근 못하도록 만들었습니다.
- 그리고 로그인한 유저만 사용가능한 라우트를 설정하는 미들웨어도 만듭니다.
