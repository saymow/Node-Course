import mongoose from "mongoose";

mongoose
  .connect(process.env.MONGO_CONNECT as string, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(JSON.stringify(error)));

export default mongoose;
