const express = require('express');     
const router = express.Router();
const {
  getAllUsers,
  getUser,
  getUserProfile,
  updateUserProfile,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');               

const { 
  getUserTickets,
  createTicket,
  addTicketComment,
  escalateTicket,
  updateTicket,
  getAllTickets,
  getAssignedTickets,
  getOpenTickets,
  getTicketById
} = require('../controllers/TicketController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Protected routes - all routes below this require authentication
router.use(protect);

// User profile routes - accessible by authenticated user
router.route('/profile')
  .get(getUserProfile)
  .put(updateUserProfile);

// User ticket routes - accessible by authenticated user
router.route('/tickets')
  .get(getUserTickets)
  .post(createTicket);
  
router.route('/tickets/:ticketId')
  .get(getTicketById)
  .patch(updateTicket);

router.route('/tickets/:ticketId/comments')
  .post(addTicketComment);

router.route('/tickets/:ticketId/escalate')
  .post(escalateTicket);

// Agent ticket routes - requires agent role
router.use('/agent', authorize('agent'));

router.route('/agent/tickets/all')
  .get(getAllTickets);

router.route('/agent/tickets/assigned')
  .get(getAssignedTickets);

router.route('/agent/tickets/open')
  .get(getOpenTickets);

// Admin only routes - requires admin role
router.use(authorize('admin'));

router.route('/')
  .get(getAllUsers)
  .post(createUser);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;