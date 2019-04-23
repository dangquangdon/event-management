const bcrypt = require('bcryptjs');
const Event = require('../../models/event');
const Administrator = require('../../models/administrator');
const EventUser = require('../../models/event-user');
const Booking = require('../../models/booking');

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

const singleEventHelper = async eventId => {
  try {
    const event = await Event.findById(eventId);
    return {
      ...event._doc,
      _id: event.id,
      createdBy: adminHelper.bind(this, event.createdBy)
    };
  } catch (err) {
    throw err;
  }
};

const eventUserHelper = async userId => {
  try {
    const user = await EventUser.findById(userId);
    return {
      ...user._doc,
      _id: user.id,
      joinedEvents: eventHelper.bind(this, user._doc.joinedEvents)
    };
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
  // Get all event users
  eventUsers: async () => {
    try {
      const eventUsers = await EventUser.find();
      return eventUsers.map(user => {
        return {
          ...user._doc,
          _id: user.id,
          joinedEvents: eventHelper.bind(this, user._doc.joinedEvents)
        };
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  // Get all admin users
  admins: async () => {
    try {
      const admins = await Administrator.find();
      return admins.map(admin => {
        return {
          ...admin._doc,
          _id: admin.id,
          createdEvents: eventHelper.bind(this, admin._doc.createdEvents)
        };
      });
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  // Get all bookings
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => {
        return {
          ...booking._doc,
          _id: booking.id,
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.updatedAt).toISOString(),
          user: eventUserHelper.bind(this, booking._doc.user),
          event: singleEventHelper.bind(this, booking._doc.event)
        };
      });
    } catch (err) {
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
        createdBy: '5cbe2cd2f10ae313a9d0cb0b'
      });

      const result = await event.save();

      const admin = await Administrator.findById('5cbe2cd2f10ae313a9d0cb0b');
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

  // Create new admin user
  createAdmin: async args => {
    try {
      const admin = await Administrator.findOne({
        email: args.adminInput.email
      });

      if (admin) {
        throw new Error('This email is already in used');
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
        password: 'You are not supposed to see it'
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  // Create new event user
  createEventUser: async args => {
    try {
      const eventUser = await EventUser.findOne({
        email: args.eventUserInput.email
      });

      if (eventUser) {
        throw new Error('This user has already registered');
      }

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(args.eventUserInput.password, salt);
      const newUser = new EventUser({
        email: args.eventUserInput.email,
        first_name: args.eventUserInput.first_name,
        last_name: args.eventUserInput.last_name,
        password: hash
      });

      const result = await newUser.save();

      return {
        ...result._doc,
        _id: result.id,
        password: 'You cannot see it'
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  // Book an event
  bookEvent: async args => {
    const event = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: '5cbf1c04b519b583ef3a093a',
      event: event
    });

    const result = await booking.save();
    return {
      ...result._doc,
      _id: result.id,
      createdAt: new Date(result._doc.createdAt).toISOString(),
      updatedAt: new Date(result._doc.updatedAt).toISOString(),
      user: eventUserHelper.bind(this, result._doc.user),
      event: singleEventHelper.bind(this, result._doc.event)
    };
  },

  // Cancel booking
  cancelBooking: async args => {
    try {
      const booking = await Booking.findById(args.bookingId).populate('event');
      const event = {
        ...booking.event._doc,
        _id: booking.event.id,
        createdBy: adminHelper.bind(this, booking.event._doc.createdBy)
      };
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  }
};
