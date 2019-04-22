const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdministratorSchema = new Schema({
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
  createdEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: "events"
    }
  ]
});

module.exports = mongoose.model("administrators", AdministratorSchema);
