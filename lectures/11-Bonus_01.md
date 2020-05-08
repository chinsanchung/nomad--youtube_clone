## Youtube Clone

### 11장. Bonus

#### 11.0 Introduction to AWS S3

- 설치할 패키지: yarn add aws-sdk multer-s3

#### 11.1 Multer Uploads to AWS S3

```javascript
// middlewares.js
import multerS3 from "multer-s3";
import aws from "aws-sdk";

// 01. s3 유저 관련 초기화
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: "ap-northeast-2",
});

const multerVideo = multer({
  storage: multerS3({
    s3,
    acl: "public-read",
    bucket: "wetube/video",
  }),
});
```

```javascript
// videoController.js
export const postUpload = async (req, res) => {
  const {
    body: { title, description },
    file: { location },
  } = req;
  const newVideo = await Video.create({
    fileUrl: location,
    title,
    description,
    creator: req.user.id,
  });
};
```
