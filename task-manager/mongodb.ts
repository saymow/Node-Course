import { MongoClient, ObjectID } from "mongodb";

const connectionUrl = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

const id = new ObjectID();

MongoClient.connect(
  connectionUrl,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
  (err, client) => {
    if (err) return console.log("Unable to connect to database.");

    console.log("Connected correctly.");

    const db = client.db(databaseName);

    // db.collection("users")
    //   .deleteMany({
    //     name: "Gustavo",
    //   })
    //   .then((response) => console.log(response))
    //   .catch((error) => console.log(error));
  }
);
