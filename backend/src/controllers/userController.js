const User = require('../models/User');
const { createCustomError } = require('../utils/errors');

// Get all users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({})
      .select('-password -refreshToken')
      .sort('name');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// Get single user
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -refreshToken');

    if (!user) {
      return next(createCustomError(`No user found with id: ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password -refreshToken');
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
const updateUserProfile = async (req, res, next) => {
  try {
    // Prevent role update through this route
    delete req.body.role;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select('-password -refreshToken');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Create user (admin only)
const createUser = async (req, res, next) => {
  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return next(createCustomError('Email already registered', 400));
    }

    // Create user
    req.body.role = 'agent'
    const user = await User.create(req.body);

    // Remove sensitive data from response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    res.status(201).json({
      success: true,
      data: userResponse
    });
  } catch (error) {
    next(error);
  }
};

// Update user
const updateUser = async (req, res, next) => {
  try {
    // Prevent password update through this route
    if (req.body.password) {
      delete req.body.password;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select('-password -refreshToken');

    if (!user) {
      return next(createCustomError(`No user found with id: ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Delete user
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(createCustomError(`No user found with id: ${req.params.id}`, 404));
    }

    // Prevent deleting the last admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount === 1) {
        return next(createCustomError('Cannot delete the last admin user', 400));
      }
    }

    await user.remove();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get all agents
const getAllAgents = async (req, res, next) => {
  try {
    const agents = await User.find({ role: 'agent' })
      .select('-password -refreshToken')
      .sort('name');

    res.status(200).json({
      success: true,
      count: agents.length,
      data: agents
    });
  } catch (error) {
    next(error);
  }
};

// Create agent
const createAgent = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return next(createCustomError('Email already registered', 400));
    }

    req.body.role = 'agent';
    const agent = await User.create(req.body);

    const agentResponse = agent.toObject();
    delete agentResponse.password;
    delete agentResponse.refreshToken;

    res.status(201).json({
      success: true,
      data: agentResponse
    });
  } catch (error) {
    next(error);
  }
};

// Get single agent
const getAgent = async (req, res, next) => {
  try {
    const agent = await User.findById(req.params.id)
      .select('-password -refreshToken');

    if (!agent || agent.role !== 'agent') {
      return next(createCustomError(`No agent found with id: ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: agent
    });
  } catch (error) {
    next(error);
  }
};

// Update agent
const updateAgent = async (req, res, next) => {
  try {
    if (req.body.password) {
      delete req.body.password;
    }

    const agent = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select('-password -refreshToken');

    if (!agent || agent.role !== 'agent') {
      return next(createCustomError(`No agent found with id: ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: agent
    });
  } catch (error) {
    next(error);
  }
};

// Delete agent
const deleteAgent = async (req, res, next) => {
  try {
    const agent = await User.findById(req.params.id);

    if (!agent || agent.role !== 'agent') {
      return next(createCustomError(`No agent found with id: ${req.params.id}`, 404));
    }

    await agent.remove();

    res.status(200).json({
      success: true,
      message: 'Agent deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUser,
  getUserProfile,
  updateUserProfile,
  createUser,
  updateUser,
  deleteUser,
  getAllAgents,
  createAgent,
  getAgent,
  updateAgent,
  deleteAgent
};
