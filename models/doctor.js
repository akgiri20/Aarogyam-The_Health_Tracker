const mongoose = require('mongoose');

// Save a reference to the Schema constructor
const Schema = mongoose.Schema;

// more about RegEx Patterns here https://www.regexbuddy.com/regex.html

// in order to create a doctor we will require the following: first and last name
// clinic associated with - as dropdown
// nurse name for further contact
// specialty
// new DoctorSchema object for login purposes
const DoctorSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: 'First name is required',
  },

 
  phone: {
    type: String,
    trim: true,
    required: 'Speciality is Required',
  },
  clinic: {
    type: String,
    trim: true,
  },
  author:{
    type: Schema.Types.ObjectId,
    ref:'User'
  }
  
});

// This creates our model from the above schema, using mongoose's model method
const Doctor = mongoose.model('Doctor', DoctorSchema);

// Export the Doctor model
module.exports = Doctor;