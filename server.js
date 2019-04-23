const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

// Config keys
const keys = require('./config/keys');

// GraphQL schema and resolvers
const graphqlSchema = require('./graphql/schema');
const grapqlResolvers = require('./graphql/resolvers');

const app = express();
// Body parser middleware
app.use(bodyParser.json());

app.use(
  '/___graphql',
  graphqlHttp({
    schema: graphqlSchema,
    rootValue: grapqlResolvers,
    graphiql: true
  })
);

const port = process.env.PORT || 3000;

/**
 * Connect to Atlas MongoDB and only run app
 * when connection is made successfully
 */
mongoose
  .connect(keys.mongoAtlas, { useNewUrlParser: true })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server started at TCP ${port}`);
      console.log('Mongodb Atlas is connected!');
    });
  })
  .catch(err => {
    console.log(err);
  });
