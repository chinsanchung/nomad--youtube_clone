## Youtube Clone

### 3장. MongoDB 0 ~ 6

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

- .env 파일을 생성합니다. 여기에 보여주기 어려운 정보인 mongoDB url, port 를 넣었습니다. .gitignore 로 .env 파일을 숨기는 것도 잊지 말아야 합니다.
- env 안의 내용을 db.js 에 import 로 가져옵니다.
  - ditenv 로 env 파일을 가져와, 모든 변수들을 "process.env.변수명" 에 저장합니다.
- init.js 에도 같은 방식으로 PORT 를 불러옵니다.

```envp
MONGO_URL = "mongodb://localhost:27017/youtube"
PORT = 4000
```

```javascript
// db.js
import dotenv from "dotenv";
dotenv.config();
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useFindAndModify: false,
});

// init.js
const PORT = process.env.PORT || 4000;
```

#### 3.3 Video Model

- models/Video.js 를 생성합니다.
  - 우선 Video 모델(실제 데이터)의 형태(스키마)를 정의합니다. (참고: file 의 url 을 데이터베이스에 저장하고, 아마존에 파일을 저장할 것입니다.)

```javascript
// models/Video.js
import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
  fileUrl: { type: String, required: "File URL is required" },
  title: { type: String, required: "Title is required" },
  description: String,
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

const model = mongoose.model("Video", VideoSchema);
export default model;
```

- 만든 모델을 인식시키기 위해 init.js 에 `import './models/Video'`를 추가합니다.

#### 3.4 Comment Model

- models/Comment.js 에 comment 모델을 작성합니다. 후에 init.js 에 import 로 불러오는 코드도 작성해야 합니다.

```javascript
import mongoose from 'mongoose';

// 연결시키는 방법 2 Comment 모델에 video ID 저장
const CommentSchema = new mongoose.Schema({
  text: {type: String, required: 'Text is required'},
  createdAt: {type: Date, default: Date.now},
  video: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Video'
  }
})
const model  = mongoose.model('Comment' CommentSchema);
export default model;
```

- Comment 모델과 Video 모델을 연결관계가 있습니다. (comment- video id, video- comment id 배열) 둘을 연결시키는 방법은 두 가지입니다.
  - 하나는 비디오 모델이 comment id 를 가지는 방법입니다. comment 를 작성하면 video 안의 배열에 comment id 를 저장합니다.
  - 둘째로는 comment 모델에 연결된 video id 를 주는 것입니다.

```javascript
// 연결시키는 방법 1. models/Video.js
{
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }];
}
```

#### 3.5 Home Controller Finished

- Comment, Video 모델을 사용하려면, videoController 에 모델을 연결해야합니다.
  - videoController 에 video 모델을 추가하고, 라우팅 함수 home 을 변경합니다. async 를 사용하는 이유는, Video 는 데이터가 아닌 데이터를 받는 통로이기 때문입니다. async/await 가 있어야 비디오 모델을 살펴본 후에 render 작업을 수행할 수 있습니다.

```javascript
// controllers/videoController.js
import Video from "../models/Video";

export const home = async (req, res) => {
  // Database 의 모든 Video 를 가져옵니다.
  try {
    const videos = await Video.find({});
    res.render("home", { pageTitle: "Home", videos });
  } catch (error) {
    console.log(error);
    res.render("home", { pageTitle: "Home", videos: [] });
  }
};
```

#### 3.6 Uploading and Creating a Video

- videoController 에서 upload 를 수행할 때 어떤 일이 발생할까요? console.log 로 확인해봅니다.
  - 업로드 시, file 이름, 제목, 설명을 업로드하게 됩니다.
  - 하지만 데이터베이스에서 필요한 것은 파일이 아닌 파일의 위치입니다.
- 우선 비디오 형식이 아닌 파일을 업로드하지 않도록 막아봅니다. upload.pug 를 수정합니다.

```pug
//- ...
input(type='file', id='file', name='file', required=true, accept='video/*')
//- ...
```

- 그 다음, file 을 URL 로 변환하는 미들웨어 multer 를 추가합니다.

```javascript
// middlewares.js
import multer from "multer";
// 변환한 파일을 videos 폴더에 저장합니다.
const multerVideo = multer({ dest: "videos/" });
// ... 생략
// single(''): 파일 하나만 업로드할 수 있도록 제한합니다. input 태그의 이름을 적습니다.
export const uploadVideo = multerVideo.single("videoFile");

// videoRouter.js..uploadVideo 는 미리 import 합니다.
videoRouter.get(routes.upload, uploadVideo, postUpload);
```

- 이제 videoController 의 postUpload 를 비동기로 변경해 파일의 url, title, description 을 넣어봅니다.

```javascript
export const postUpload = async (req, res) => {
  const {body: title, description}, file: {path} = req;
  const newVideo = await Video.create({fileUrl: path, title, description})
  res.redirect(routes.videoDetail(newVideo.id))
}
```

- 위의 upload form 의 enctype 에 `enctype="multipart/form-data`을 추가합니다.

```pug
//- upload.pug
form(action=`/videos${routes.upload}`, method='post', enctype='multipart/form-data')
```
