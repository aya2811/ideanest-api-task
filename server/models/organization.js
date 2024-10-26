const mongoose = require('mongoose');
const User = require('./user');

const organizationSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    description: {
        type: String,
        required: true
      },
    organization_members: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      default: undefined
    }
  });
  module.exports = mongoose.model('organization', organizationSchema);