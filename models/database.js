const mongoose = require('mongoose');

module.exports = async () => {
  let client;
  //Connecting to DB with Mongoose, because it is more straightforward than MongoClient
  if (!mongoose.connections[0].readyState) {
 await mongoose.connect('mongodb://localhost:27017/datr', { useNewUrlParser: true, useUnifiedTopology: true })
   .then(data => { client = data.connections[0];}).catch(err => console.log(err))
  } else {
    client = mongoose.connections[0];
  };
  return client;
}
