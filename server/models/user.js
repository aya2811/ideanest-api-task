const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email: {
        type: String,
        validate: {
            validator: function(v) {
              return /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
          },
          required: [true, 'User email required']
        ,
        unique: true
      },
    password: {
      type: String,
      required: true
    },
    access_level: {
        type: String,
        enum: ['user', 'admin', 'moderator'],
        default: 'user'
    }
  });


  module.exports = mongoose.model('User', userSchema);