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
