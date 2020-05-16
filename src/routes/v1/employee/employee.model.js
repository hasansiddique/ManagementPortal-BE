import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'please add a name'],
    maxlength: [20, 'Name cannot be longer than 20 characters'],
    trim: true,
  },
  age: {
    type: String,
    required: [true, 'please add a name'],
    maxlength: [3, 'Age cannot be longer than 2 characters'],
  },
  gender: {
    type: String,
    required: [true, 'please add gender'],
    enum: ['male', 'female', 'other'],
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'please add a email'],
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'please add a valid email',
    ],
  },
  address: {
    type: String,
    required: [true, 'please add an address'],
  },
  department: {
    type: String,
    required: [true, 'please add a department'],
    maxlength: [20, 'Department name cannot be longer than 20 characters'],
    trim: true,
  },
  designation: {
    type: String,
    required: [true, 'please add a designation'],
    maxlength: [25, 'Designation name cannot be longer than 20 characters'],
    trim: true,
  },
  photo: {
    type: String,
    default: 'no-photo.jpg',
  },
  joinDate: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
    required: 'true',
  },
});

// Cascade delete employee account when a employee record is deleted
// eslint-disable-next-line func-names
employeeSchema.pre('remove', async function(next) {
  await this.model('user').findByIdAndDelete(this.user);
  next();
});

const employeeModel = mongoose.model('employee', employeeSchema);

export default employeeModel;
