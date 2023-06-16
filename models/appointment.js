const { required } = require('joi');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const AppointmentSchema = new Schema({
  date: {
    type: Date,
    trim: true,
    required: 'Date name is required',
  },
  time: {
    type: String,
    trim: true,
    required: 'Address is required',
  },
  doctor: {
    type: String,
    trim: true,
    required: 'Address is required',
  },

  appointmentName: {
    type: String,
    trim: true,
  },

  userCreated: {
    type: Date,
    default: Date.now
  },
  author:{
    type: Schema.Types.ObjectId,
    ref:'User'
  }
});

module.exports  = mongoose.model('Appointment', AppointmentSchema);
