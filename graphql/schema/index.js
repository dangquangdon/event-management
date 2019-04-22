const { buildSchema } = require("graphql");

module.exports = buildSchema(`
type Administrator {
    _id: ID!
    email: String!
    first_name: String!
    last_name: String!
    password: String
    createdEvents: [Event!]
}

input AdminInput {
    email: String!
    first_name: String!
    last_name: String!
    password: String!
}

type Event {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String!
    createdBy: Administrator!
}

input EventInput {
    title: String!
    description: String!
    price: Float!
    date: String!
}

type RootQuery {
    events: [Event!]!
}

type RootMutation {
    createEvent(eventInput: EventInput): Event
    createAdmin(adminInput: AdminInput): Administrator
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
