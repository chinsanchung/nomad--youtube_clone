## Youtube Clone

### 3장. MongoDB

#### 3.0 MongoDB and Mongoose

- MongoDB 는 NoSQL 로, 더 적은 규칙, 더 적은 절차로 작업이 가능한 데이터베이스입니다.
- MongoDB Cummunity Server 를 다운로드합니다.
- 자바스크립트로 코드를 작성하려면 MongoDB로부터 instruction 을 받아야 합니다.
  - 그것을 해결해주는 것이 Mongoose 입니다.

##### Mongoose

- Mongoose 는 NodeJs 를 위한 ORM 입니다. DB 를 다루려면 mongoDB, Mongoose 둘 다 필요합니다.
- npm install mongoose 로 설치가 끝나면, db.js (임시 DB)를 지우고 진짜 MongoDB를 연결해봅니다.

#### 3.1 Connecting to MongoDB

- 우선 `npm install dotenv`를 설치합니다. 숨기고 싶은 부분이 있을 때 사용합니다.
- 어떤 유저든 영상을 보고, 검색하고, 수정하고, 삭제하도록 만듭니다.

##### mongoose 연결하기

```javascript
// db.js
import mongoose from "mongoose";
// string 으로 된 DB 를 넣어야합니다.(어디에 DB가 저장되어있는지 알려줍니다.)
mongoose.connect("mongodb://localhost:28017/youtube", {
  useNewUrlParser: true,
  useFindAndModify: false,
});
const db = mongoose.connection();
const handleOpen = () => console.log("Connected to DB");
const handleError = (error) => console.log(`Error on DB: ${error}`);

db.once("open", handelOpen);
db.on("error", handleError);
```

- videoController 의 "import {videos} from './db" 를 삭제하고, init.js 에 db 를 연결합니다. `import './db'`

#### 3.2 Configuring dotenv

- .env 파일을 생성합니다. 여기에 보여주기 어려운 정보인 mongoDB url, port 를 넣었습니다.

```env

```
