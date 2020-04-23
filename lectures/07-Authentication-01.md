## Youtube Clone

### 6장. User Authentication

#### 6.0 Introduction to PassportJS

##### 6.1 참고할 내용들

- 인증: 브라우저 상에 쿠키를 설정하면, 그 쿠키를 통해 사용자 아이디 등을 알 수 있습니다. Passport 는 그 쿠키를 자동으로 가져와서 인증이 완료된 사용자 객체를 컨트롤러에 넘겨줍니다.
- 쿠키: 브라우저에 저장할 수 있는 데이터로, 모든 요청에 대해 백엔드로 전송할 정보들을 담고 있습니다. 예를 들어 로그인을 요청하면, 클라이언트 쿠키에 있는 관련 정보를 서버로 자동 전송하게 됩니다.

##### 6.2 Passport

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

- passport-local-mongoose 를 추가합니다. 사용자 기능(User functionality)를 자동으로 만들어줍니다.
