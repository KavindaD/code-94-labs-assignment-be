import app from "./server.js";
import mongodb from "mongodb";
import dotenv from "dotenv";
dotenv.config();
const MongoClient = mongodb.MongoClient;

const port = process.env.PORT;

MongoClient.connect(
    process.env.PRODUCTS_DB_URI,
    {
        maxPoolSize: 500,
        wtimeoutMS: 2500
    }
)
.catch(err => {
    console.log(err.stack);
    process.exit(1);
})
.then(async client => {
    app.listen(port, () => {
        console.log(`listening to port ${port}`)
    });
});