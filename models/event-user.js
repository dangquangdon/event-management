const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EventUserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  joinedEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: "events"
    }
  ]
});

module.exports = mongoose.model("event-users", EventUserSchema);
