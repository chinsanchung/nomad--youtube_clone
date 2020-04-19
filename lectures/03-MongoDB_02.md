## Youtube Clone

### 3장. MongoDB 7 ~ 12

#### 3.7 Uploading and Creating a Video part Two

- URL 경로를 수정하기 위해 middlewares.js 의 multer 경로를 `uploads/videos/`로 수정합니다.
  - `/uploads/videos/`로 쓰지 말아야 합니다. "/"을 앞에 넣으면 프로젝트 폴더 root 에 videos 폴더를 지정하는 것이기 때문입니다.

##### Mongo 커맨드로 데이터베이스 수정하기

- 우선사항: 시스템 환경 변수에 "C:\Program Files\MongoDB\Server\4.2\bin"을 새로 추가해서 "mongo" 커멘드를 쓸 수 있게 만듭니다.
- mongo -> use youtube -> show collections (collection: model 비슷한 것) -> db.videos.remove({})

##### 다시 업로드하기

- 기존 경로가 있던 것을 삭제했으니, 이제 새로운 경로에 비디오를 업로드해봅니다.
- 새로운 경로에 대한 라우트가 필요합니다.
  - express.static(): 디렉토리에서 파일을 전달하는 미들웨어 함수입니다. 인자에 디렉토리명을 적습니다.

```javascript
// app.js
app.use("/uploads", express.static("uploads"));
```

- 지금의 방식은 오직 테스트를 위해서입니다. 한 서버에 데이터를 전부 저장하는 것은 좋지 않습니다.
  - 지역에 따라 다른 서버가 필요할 수도 있습니다. 또한 한 사람이 대용량의 파일을 올려 서버가 멈추면 다른 유저가 사용할 수 없게 됩니다.
  - 나중에 업로드 방식을 파일을 아마존 클라우드에 올리고, URL 을 클라우드로부터 받도록 바꿀 것입니다.

#### 3.8 Getting Video by ID

- 이제 비디오를 클릭해서 나오는 videoDetail 페이지에 id 를 전달해봅니다.
  - 참고: 컨드롤러에 어떤 데이터가 있는지 표현하기 위해선, routes.js 의 링크를 ":id" 처럼 ":" 을 넣어야합니다. 이 방식이 URL 로부터 정보를 가져오는 유일한 방법입니다.
- videoController.js 안의 videoDetail 을 수정합니다.
  - mongoose 의 다양한 문법 중 id 를 통해 찾는 `findById`를 이용합니다.
  - async, await 로 모델에서 찾은 데이터에 대한 정보를 가져오도록 합니다.
  - render 함수에 비디오 변수를 템플릿에 전달합니다.

```javascript
export const videoDetail = async (req, res) => {
  // id = req.params.id 와 동일합니다.
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    res.render("videoDetail", { pageTitle: "Video Detail", video });
  } catch (error) {
    res.redirect(routes.home);
  }
};
```

- 전달받은 video 변수를 활용해 출력해봅니다.

```pug
//- videoDetail.pug
block content
  .video__player
    video(src=`/${video.fileUrl}`)
  .video__info
    a(href=routes.editVideo) Edit Video
    h5.video__title=video.title
    span.video__views=video.views
    p.video__description=video.description
```

#### 3.9 Editing a Video

- 우선 routes.js 의 editVideo 를 함수에 id 값이 포함된 url 을 리턴하도록 바꿉니다.
  - videoDetail.pug 의 routes.editVideo 을 `routes.editVideo(id)` 으로 변경합니다.
  - videoRouter.js 을 `routes.editVideo()` 으로 변경합니다.

```javascript
// const EDIT_VIDEO = "EDI/:id/edit";
{
  editVideo: (id) => {
    if (id) {
      return `/videos/${id}/edit`;
    } else {
      return EDIT_VIDEO;
    }
  };
}
```

- 이제 videoController.js 에 eidtVideo 를 getEditVideo 로 고치고, `postEditVideo`를 작성합니다.
  - getEditVideo 는 데이터를 채워넣는 작업이고, postEditVideo 는 업데이트 후 페이지를 redirect 하는 작업입니다.

```javascript
export const getEditVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const video = await Video.findById(id);
    res.render("editVideo", { pageTitle: `Edit ${video.title}`, video });
  } catch (error) {
    res.redirect(routes.home);
  }
};
export const postEditVideo = async (req, res) => {
  const {
    params: { id },
    body: { title, description },
  } = req;
  try {
    await Video.findOneAndUpdate({ _id: id }, { title, description });
    res.redirect(routes.videoDetail(id));
  } catch (error) {
    res.redirect(routes.home);
  }
};
```

- videoRouter 에도 변경한 사실을 반영합니다.

```javascript
// 불필요해진 import 함수를 삭제하고, 새로 만든 것을 추가, 변경합니다.
videoRouter.get(routes.editVideo(), getEditVideo);
videoRouter.post(routes.editVideo(), postEditVideo);
```

#### 3.10 Deleting a Video

- delete 는 오직 GET 만 필요합니다. routes.js, videoController, videoRouter.js 에서 deleteVideo 를 작업합니다.

```javascript
// routes.js
{
  deleteVideo: (id) => {
    if (id) {
      return `/videos/${id}/delete`;
    } else {
      return DELETE_VIDEO;
    }
  };
}
// videoControllerjs
export const deleteVideo = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    await Video.findOneAndRemove({ _id: id });
  } catch (error) {}
  res.redirect(routes.home);
};
// videoRouter.js
videoRouter.get(routes.deleteVideo(), deleteVideo);
```

- editVideo.pug 의 비디오 삭제 버튼도 수정합니다.

```pug
a.form-container__link.form-container__link--delete(href=routes.deleteVideo(video.id)) Delete Video
```

#### 3.11 Installing ESLint

- `npm install eslint -D`, `npm install eslint-config-airbnb-base -D`, `npm install eslint-plugin-import -D` 로 설치합니다.
- `eslint --init`로 실행합니다.
-
- prettier 와 같이 사용한다면 `npm install eslint-config-prettier -D`, `npm install eslint-plugin-prettier -D`

```javascript
// eslintrc.js
module.exports = {
  extends: ["airbnb-base", "plugin:prettier/recommended"],
  rules: {
    "no-console": "off",
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
  },
};
```

#### 3.12 Searching Videos

- 우선 비디오 리스트를 새로운 것부터 순차적으로 나오도록 만듭니다.
  - {\_id: -1}: 위, 아래 순서를 바꿔 정렬한다는 약속입니다.

```javascript
// videoController.js
export const home = async (req, res) => {
  // ...
  const videos = await Video.find({}).sort({ _id: -1 });
};
```

- videoController.js 의 search 함수를 수정합니다.
  - 정확한 단어를 검색하는 것이 아닌, 찾는 단어가 **포함**된 모든 것들을 원합니다.
  - mongoose 에서 지원하는 regex expression 을 사용합니다. (참고: \$options: "i" 는 대소문자를 구분하지 않는, 덜 민감하게 검색합니다.)

```javascript
export const search = async (req, res) => {
  const {
    query: { term: searchingBy },
  } = req;
  let videos = [];
  try {
    videos = await Video.find({
      title: { $regex: searchingBy, $options: "i" },
    });
  } catch (error) {
    console.log(error);
  }
  res.render("search", { pageTitle: "Search", searchingBy, videos });
};
```

- search.pug 에 검색 결과가 없다는 말, videoBlock 에 id 를 추가합니다.

```pug
.search__videos
  if videos.length === 0
    h5 No Videos Found
    //- ...
      videoBlock({
        //- ...
        id: item.id
      })
```

- videoDetail.pug 에 comment 영역을 추가합니다. 지금은 댓글의 수만을 보여주도록 합니다.
