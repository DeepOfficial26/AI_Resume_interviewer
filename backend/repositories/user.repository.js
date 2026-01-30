const User = require('../models/User.model');

class UserRepository {
  async findByEmail(email) {
    return await User.findOne({ email });
  }

  async findById(id) {
    return await User.findById(id).select('-password');
  }

  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  async update(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
  }
}

module.exports = new UserRepository();
