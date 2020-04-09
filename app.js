import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { userRouter } from "./router";

const app = express();

// GET 에 대한 응답(res)가 없으면 무한 로딩이 일어납니다.
const handleHome = (req, res) => res.send("Hello from Home.");

const handleProfile = (req, res) => res.send("You are on my profile.");

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());

// GET 으로 라우트 생성
app.get("/", handleHome);
app.get("/profile", handleProfile);
app.use("/user", userRouter);

export default app;
