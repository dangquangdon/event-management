const bcrypt = require("bcryptjs");
const Event = require("../../models/event");
const Administrator = require("../../models/administrator");

const adminHelper = async adminId => {
  try {
    const admin = await Administrator.findById(adminId);
    return {
      ...admin._doc,
      _id: admin.id,
      createdEvents: eventHelper.bind(this, admin._doc.createdEvents)
    };
  } catch (err) {
    throw err;
  }
};

const eventHelper = async eventIds => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map(event => {
      return {
        ...event._doc,
        _id: event.id,
        date: new Date(event._doc.date).toISOString(),
        createdBy: adminHelper.bind(this, event.createdBy)
      };
    });
  } catch (err) {
    throw err;
  }
};

module.exports = {
  // Get all events
  events: async () => {
    try {
      const events = await Event.find();
      return events.map(event => {
        return {
          ...event._doc,
          _id: event.id,
          date: new Date(event._doc.date).toISOString(),
          createdBy: adminHelper.bind(this, event._doc.createdBy)
        };
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  // Create new event
  createEvent: async args => {
    try {
      const event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        createdBy: "5cbe2cd2f10ae313a9d0cb0b"
      });

      const result = await event.save();

      const admin = await Administrator.findById("5cbe2cd2f10ae313a9d0cb0b");
      if (!admin) {
        throw new Error("This user doesn't exist");
      }
      admin.createdEvents.push(event);
      await admin.save();

      return {
        ...result._doc,
        _id: result.id,
        date: new Date(result._doc.date).toISOString(),

        createdBy: adminHelper.bind(this, result._doc.createdBy)
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  createAdmin: async args => {
    try {
      const admin = await Administrator.findOne({
        email: args.adminInput.email
      });

      if (admin) {
        throw new Error("This email is already in used");
      }
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(args.adminInput.password, salt);
      const newAdmin = new Administrator({
        email: args.adminInput.email,
        first_name: args.adminInput.first_name,
        last_name: args.adminInput.last_name,
        password: hash
      });

      const result = await newAdmin.save();
      return {
        ...result._doc,
        _id: result.id,
        password: "You are not supposed to see it"
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};
