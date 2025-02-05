const express = require('express');
const router = express.Router();
const {
  getAllArticles,

  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  toggleLikeArticle,
  addComment
} = require('../controllers/articleController');

const { protect, authorize } = require('../middleware/authMiddleware');

// Protected routes - all routes require authentication
router.use(protect);

// Routes available to all authenticated users
router.get('/', getAllArticles);
router.get('/:id', getArticle);
router.post('/:id/like', toggleLikeArticle);
router.post('/:id/comments', addComment);

// Agent and admin routes
router.use(authorize(['agent', 'admin']));

// CRUD operations for agents and admins
router.post('/', createArticle);
router.route('/:id')
  .put(updateArticle)
  .delete(deleteArticle);

module.exports = router; 