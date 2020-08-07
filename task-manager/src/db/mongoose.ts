import mongoose from "mongoose";

mongoose
  .connect(String(process.env.MONGO_CONNECT), {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(JSON.stringify(error)));

export default mongoose;
