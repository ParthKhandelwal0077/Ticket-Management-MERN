const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['user', 'staff', 'admin'],
    default: 'user',
    required: [true, 'Role is required']
  },
  phoneNumber: {
    type: String,
    required: function() {
      return this.role === 'staff' || this.role === 'admin';
    },
    trim: true
  },
  // Agent specific fields
  department: {
    type: String,
    required: function() {
      return this.role === 'staff';
    }
  },
  specializations: [{
    type: String,
    required: function() {
      return this.role === 'staff';
    }
  }],
  availability: {
    type: String,
    enum: ['available', 'busy', 'offline'],
    default: 'available',
    required: function() {
      return this.role === 'staff';
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  refreshToken: {
    type: String,
    default: null
  }
}, {
  timestamps: true,

});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Helper method to check if user is an agent (staff or admin)
userSchema.methods.isAgent = function() {
  return this.role === 'staff' || this.role === 'admin';
};

// Helper method to check if user is an admin
userSchema.methods.isAdmin = function() {
  return this.role === 'admin';
};

const User = mongoose.model('User', userSchema);
module.exports = User; 