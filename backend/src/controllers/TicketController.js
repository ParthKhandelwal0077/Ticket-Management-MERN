const Ticket = require('../models/Ticket');
const User = require('../models/User');
const { createCustomError } = require('../utils/errors');

// Get all tickets (for agents)
const getAllTickets = async (req, res, next) => {
  try {
    // Check if user is an agent
    if (req.user.role !== 'agent' || req.user.role !== 'admin') {
      return next(createCustomError('Not authorized to view all tickets', 403));
    }

    const tickets = await Ticket.find({})
      .populate('assignedTo', 'name email')
      .populate('creator', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    next(error);
  }
};

// Get tickets assigned to agent
const getAssignedTickets = async (req, res, next) => {
  try {
    // Check if user is an agent
    if (req.user.role !== 'agent') {
      return next(createCustomError('Not authorized to view assigned tickets', 403));
    }

    const tickets = await Ticket.find({ assignedTo: req.user.id })
      .populate('assignedTo', 'name email')
      .populate('creator', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    next(error);
  }
};

// Get all open tickets
const getOpenTickets = async (req, res, next) => {
  try {
    // Check if user is an agent
    if (req.user.role !== 'agent'|| req.user.role !== 'admin') {
      return next(createCustomError('Not authorized to view open tickets', 403));
    }

    const tickets = await Ticket.find({ status: 'open' })
      .populate('assignedTo', 'name email')
      .populate('creator', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    next(error);
  }
};

// Get user's tickets
const getUserTickets = async (req, res, next) => {
  try {
    let query = { creator: req.user.id };
    
    // If user is an agent, they can see their assigned tickets too
    if (req.user.role === 'agent') {
      query = {
        $or: [
          { creator: req.user.id },
          { assignedTo: req.user.id }
        ]
      };
    }

    const tickets = await Ticket.find(query)
      .populate('assignedTo', 'name email')
      .populate('creator', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    next(error);
  }
};

// Create new ticket
const createTicket = async (req, res, next) => {
  try {
    let ticketData;

    // Check if the request contains files (FormData)
    if (req.files) {
      // Parse the ticketData from FormData
      ticketData = JSON.parse(req.body.ticketData);
      
      // Add file information if present
      if (req.files.attachments) {
        const files = Array.isArray(req.files.attachments) 
          ? req.files.attachments 
          : [req.files.attachments];

        ticketData.attachments = files.map(file => ({
          filename: file.name,
          path: file.path,
          mimetype: file.mimetype
        }));
      }
    } else {
      // If no files, use the request body directly
      ticketData = req.body;
    }

    // Add creator to ticket data
    ticketData.creator = req.user.id;
    
    console.log('Creating ticket with data:', ticketData);
    const ticket = await Ticket.create(ticketData);
    
    res.status(201).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    next(error);
  }
};

// Add comment to ticket
const addTicketComment = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId);
    
    if (!ticket) {
      return next(createCustomError(`No ticket found with id: ${req.params.ticketId}`, 404));
    }

    // Check if user owns the ticket
    if (ticket.creator.toString() !== req.user.id) {
      return next(createCustomError('Not authorized to comment on this ticket', 403));
    }

    const comment = {
      user: req.user.id,
      content: req.body.content,
      isInternal: false
    };

    ticket.comments.push(comment);
    await ticket.save();

    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    next(error);
  }
};

// Escalate ticket
const escalateTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId);
    
    if (!ticket) {
      return next(createCustomError(`No ticket found with id: ${req.params.ticketId}`, 404));
    }

    // Check if user owns the ticket
    if (ticket.creator.toString() !== req.user.id) {
      return next(createCustomError('Not authorized to escalate this ticket', 403));
    }

    ticket.status = 'escalated';
    ticket.escalation = {
      isEscalated: true,
      reason: req.body.reason,
      escalatedAt: Date.now(),
      escalatedBy: req.user.id
    };

    await ticket.save();

    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    next(error);
  }
};

// Get user profile


// Get ticket by ID
const getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId).populate('assignedTo', 'name email').populate('creator', 'name email').populate('comments.user', 'name email');
    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};
const updateTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.ticketId);
    
    if (!ticket) {
      return next(createCustomError(`No ticket found with id: ${req.params.ticketId}`, 404));
    }

    // Check if user is authorized to update the ticket
    // Allow ticket creator, assigned agent, or admin to update
    const isAuthorized = 
      ticket.creator.toString() === req.user.id ||
      (ticket.assignedTo && ticket.assignedTo.toString() === req.user.id) ||
      req.user.role === 'admin';

    if (!isAuthorized) {
      return next(createCustomError('Not authorized to update this ticket', 403));
    }

    // Update the ticket
    const updatedTicket = await Ticket.findByIdAndUpdate(
      req.params.ticketId,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('assignedTo', 'name email')
      .populate('creator', 'name email');

    res.status(200).json({
      success: true,
      data: updatedTicket
    });
  } catch (error) {
    next(error);
  }
};


// Logout user


module.exports = {
  getUserTickets,
  createTicket,
  addTicketComment,
  escalateTicket,
  getAllTickets,
  getAssignedTickets,
  getOpenTickets,
  getTicketById,
  updateTicket
}; 