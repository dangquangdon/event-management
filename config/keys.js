module.exports = {
  mongoAtlas: `mongodb+srv://${process.env.MONGO_USER}:${
    process.env.MONGO_PASSWORD
  }@cluster0-70a3o.azure.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`
};
