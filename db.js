import mongoose from "mongoose";

mongoose.connect("", {
  // Configuration 을 보낼 수 있습니다.
  useNewUrlParser: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
const handleOpen = () => console.log("Connected to DB");
const handleError = (error) => console.log(`Error on DB: ${error}`);

db.once("open", handleOpen);
db.on("error", handleError);
