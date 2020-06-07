## Youtube Clone

### 6장. User Authentication

#### 6.6 Github Log In part One

- passport-github 를 설치합니다. 그리고 github 에 가서 OAuth application 을 등록해야 합니다.
- 참고: github 인증이 작동하는 방식
  - 사용자를 github 페이지로 보냅니다. 그러면 github 가 앱에게 사용자의 정보를 줘도 좋은지 물어보고, 동의하면 github 가 사용자를 앱으로 돌려보내는데 그와 동시에 사용자의 정보도 같이 제공합니다.
- 이제 github 로그인을 패스포트에 추가합니다.
  - OAuth application 을 등록해서 얻은 clientID, Secret 을 환경변수 env 에 넣습니다.
  - 마지막 callback 은 사용자가 github 에서 돌아왔을 때 실행되는 함수입니다. 이 callback 은 userController 에서 작성했습니다.

```javascript
// passport.js
import GithubStrategy from 'passport-github'
import {githubLoginCallback} from './controllers/userController'

passport.use(new GithubStrategy({
  clientID: process.env.GH_ID,
  clientSecret: process.env.GH_SECRET'
  callbackURL: 'http://localhost:4000/auth/github/callback
}, githubLoginCallback
)
)
```

```javascript
// userController.js
export const githubLoginCallback = (accessToken, refreshToken, profile, cb) => {
  console.log(accessToken, refreshToken, profile, cb);
};
export const logout = (req, res) => {
  req.logout();
  req.redirect(routes.home);
};
```

- github 로 사용자를 보내기, 테스트는 다음 강의에서 진행합니다.

#### 6.7 Github Log In part Two

- 로그인 체크 githubLogin 을 userController 에 작성합니다. 그리고 인증 수락 후에 필요한 작업을 postGithubLogin 에 작성합니다.

```javascript
// userController.js
export const githubLogin = passport.authenticate("github");
export const postGithubLogin = (req, res) => {
  res.redirect(routes.home);
};
```

- githubLogin 을 위한 라우트를 만듭니다. 그리고 위의 callbackURL 을 라우트에서 받아와 쓰도록 바꿉니다.

```javascript
// routes.js
const GITHUB = "/auth/github";
const GITHUB_CALLBACK = "auth/github/callback";

const routes = {
  //...,
  github: GITHUB,
  githubCallback: GITHUB_CALLBACK,
};
```

- 작성한 함수를 라우터에 추가합니다.
  - 누군가 "/auth/github"로 들어가면, githubLogin 으로 인증합니다.
  - githubCallback 으로, 사용자 인증이 완료되어 정보를 전달받을 때

```javascript
// globalRouter.js

globalRouter.get(routes.gitHub, githubLogin);
globalRouter.get(
  routes.githubCallback,
  passport.authenticate("github", { failureRedirect: "/login" }),
  postGithubLogin
);
```

#### 6.8 Github Log In part Three

- githubLoginCallback 의 cb 는 passport 에서 제공된 콜백 함수입니다. 인증이 성공할 때 호출되어야 합니다.
  - 참고: 사용하지 않는 accessToken, refreshToken 을 \_, \_\_ 으로 바꿨습니다. 함수의 순서를 맞추기 위해 삭제는 안됩니다.

```javascript
// userCantroller.js
export const githubLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, avater_url, email, name },
  } = profile;

  try {
    const user = await User.findOne({ email });
    if (user) {
      user.githubId = id;
      user.save();
      // 에러:null, 사용자:user
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      githubId: id,
      avatarUrl: avatar_url,
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};
```

#### 6.9 Recap and User Profile

- 참고: 불러온 값을 특정 이름으로 변경할 수 있습니다. 이제 avatar_url 은 avatarUrl 으로 사용할 수 있습니다.

```javascript
// userController.js
const {
  _json: { id, avatar_url: avatarUrl, name, email },
} = profile;
```

- userDetail 의 url 을 "/:id" 에서 "/me"로 바꾸고, 필요한 함수를 작성합니다. getMe 함수는 userDetail 함수와 같은 일을 합니다. 다만 전달할 user 데이터를 로그인한 사용자 `req.user`로 했습니다.
  - me 페이지에 edit profile 같은 버튼을 만들어줄 것입니다.

```javascript
// userController.js
export const getMe = (req, res) => {
  res.render("userDetail", { pageTitle: "User Detail", user: req.user });
};

// globalRouter.js 에 me 를 추가합니다.
globalRouter.get(routes.me, getMe);
```

- views/userDetail.pug 에 프로필 내용이 나오도록 수정합니다.
- req.user 보다는 명확성을 높이기 위해 loggedUser 로 바꿨습니다. 그에 따라 헤더도 !user 에서 !loggedUser 로 바꿨습니다.

#### 6.10 User Detail + Facebook Login Part One

[링크](https://github.com/nomadcoders/wetube/commit/7bc4686641c69fb3970db1a9939619597aa7e810)

##### userDetail 에러화면 수정

- /users/무작위id 의 에러화면을 수정합니다.

```javascript
export const userDetail = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const user = await User.findById(id);
    res.render("userDetail", { pageTitle: "User Detail", user });
  } catch (error) {
    res.redirect(routes.home);
  }
};
```

##### facebook 인증

- developers.facebook.com 에서 My App 에 등록을 해야 합니다. 시작하기의 새로운 앱을 만들고(WeTube), passport-facebook 을 설치합니다.
  - 앱을 만든 후 아이디와 secret 를 env 에 저장합니다.
  - routes.js 에 페이스북 관련 라우트를 추가합니다.
  - userController 에 페이스북 인증 함수를 추가합니다.
  - passport.js 에 페이스북 인증을 추가합니다.
  - globalRouter.js 에 facebook 관련 라우트를 추가합니다.

```javascript
// userController.js
export const facebookLogin = passport.authenticate("facebook");

export const facebookLoginCallback = (
  accessToken,
  refreshToken,
  profile,
  cb
) => {
  console.log(accessToken, refreshToken, profile, cb);
};

export const postFacebookLogin = (req, res) => {
  res.redirect(routes.home);
};

// globalRouter.js
globalRouter.get(routes.facebook, facebookLogin);
globalRouter.get(
  routes.facebookCallback,
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  postFacebookLogin
);
```

#### 6.11 Facebook Login Part Two

[링크](https://github.com/nomadcoders/wetube/commit/90aa0007cb259429024c45064dd7a10b6814e6b3)

- 기존의 방법으로는 사용자의 이메일 정보를 얻질 못했습니다. facebook for developers 사이트로 가서 개발중을 버튼을 on 으로 바꿔야합니다.
  - 링크를 아무거나 한 다음, on 으로 바꿉니다.
- facebook 은 http 인 로컬호스트의 인증을 막습니다. localtunnel 로 로컬서버에 https 터널을 만들어야합니다.
  - 또한 passport.js 의 callbackURL 을 localtunner 의 URL 로 넣어야합니다.

```javascript
// passport.js
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FB_ID,
      clientSecret: process.env.FB_SECRET,
      callbackURL: `https://afraid-baboon-46.localtunnel.me${routes.facebookCallback}`,
      profileFields: ["id", "displayName", "photos", "email"],
      scope: ["public_profile", "email"],
    },
    facebookLoginCallback
  )
);
```

#### 6.12 Facebook Login part 3

```javascript
// userController.js
export const facebookLoginCallback = async (_, __, profile, cb) => {
  const {
    _json: { id, name, email },
  } = profile;
  try {
    const user = await User.findOne({ email });
    if (user) {
      user.facebookId = id;
      user.avatarUrl = `https://graph.facebook.com/${id}/picture?type=large`;
      user.save();
      return cb(null, user);
    }
    const newUser = await User.create({
      email,
      name,
      facebookId: id,
      avatarUrl: `https://graph.facebook.com/${id}/picture?type=large`,
    });
    return cb(null, newUser);
  } catch (error) {
    return cb(error);
  }
};
```
