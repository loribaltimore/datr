import { MongoClient } from "mongodb";

//THIS EDIT MADE BY SYDNEY ON GITHUB
//let uri = 'mongodb://localhost:27017/test'
let uri = process.env.NODE_ENV === "development" ? 'mongodb://localhost:27017/datr' : 'mongodb+srv://dmksoc:v7TjmD4FzSk9UAV9@portfolio.s3wva9j.mongodb.net/';
const options = {};
console.log(process.env.NODE_ENV);
let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
