const { buildSchema } = require('graphql');

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
type EventUser {
    _id: ID!
    email: String!
    first_name: String!
    last_name: String!
    password: String
    joinedEvents: [Event!]
}

input EventUserInput {
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

type Booking {
    _id: ID!
    event: Event!
    user: EventUser!
    createdAt: String!
    updatedAt: String!
}


type RootQuery {
    events: [Event!]!
    eventUsers: [EventUser!]!
    admins: [Administrator!]!
    bookings: [Booking!]!
}

type RootMutation {
    createEvent(eventInput: EventInput): Event
    createAdmin(adminInput: AdminInput): Administrator
    createEventUser(eventUserInput: EventUserInput): EventUser
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
