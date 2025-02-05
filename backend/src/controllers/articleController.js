const Article = require('../models/Article');
const { createCustomError } = require('../utils/errors');

// Get all articles
const getAllArticles = async (req, res, next) => {
  try {
    const articles = await Article.find()
      .populate('author', 'name email')
      .populate('comments.user', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: articles.length,
      data: articles
    });
  } catch (error) {
    next(error);
  }
};


// Get single article
const getArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id)
      .populate('author', 'name email')
      .populate('comments.user', 'name email')
      .populate('likedBy', 'name email');

    if (!article) {
      return next(createCustomError(`No article found with id: ${req.params.id}`, 404));
    }

    res.status(200).json({
      success: true,
      data: article
    });
  } catch (error) {
    next(error);
  }
};

// Create article (agents and admins only)
const createArticle = async (req, res, next) => {
  try {
    if (req.user.role !== 'agent' && req.user.role !== 'admin') {
      return next(createCustomError('Not authorized to create articles', 403));
    }

    req.body.author = req.user.id;
    const article = await Article.create(req.body);

    res.status(201).json({
      success: true,
      data: article
    });
  } catch (error) {
    next(error);
  }
};

// Update article (agents and admins only)
const updateArticle = async (req, res, next) => {
  try {
    if (req.user.role !== 'agent' && req.user.role !== 'admin') {
      return next(createCustomError('Not authorized to update articles', 403));
    }

    const article = await Article.findById(req.params.id);

    if (!article) {
      return next(createCustomError(`No article found with id: ${req.params.id}`, 404));
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
    .populate('author', 'name email')
    .populate('comments.user', 'name email')
    .populate('likedBy', 'name email');

    res.status(200).json({
      success: true,
      data: updatedArticle
    });
  } catch (error) {
    next(error);
  }
};

// Delete article (agents and admins only)
const deleteArticle = async (req, res, next) => {
  try {
    if (req.user.role !== 'agent' && req.user.role !== 'admin') {
      return next(createCustomError('Not authorized to delete articles', 403));
    }

    const article = await Article.findById(req.params.id);

    if (!article) {
      return next(createCustomError(`No article found with id: ${req.params.id}`, 404));
    }

    await article.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// Like/Unlike article
const toggleLikeArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return next(createCustomError(`No article found with id: ${req.params.id}`, 404));
    }

    const likedIndex = article.likedBy.indexOf(req.user.id);
    
    if (likedIndex === -1) {
      // Like article
      article.likes += 1;
      article.likedBy.push(req.user.id);
    } else {
      // Unlike article
      article.likes -= 1;
      article.likedBy.splice(likedIndex, 1);
    }

    await article.save();

    res.status(200).json({
      success: true,
      data: article
    });
  } catch (error) {
    next(error);
  }
};

// Add comment to article
const addComment = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return next(createCustomError(`No article found with id: ${req.params.id}`, 404));
    }

    const comment = {
      user: req.user.id,
      content: req.body.content
    };

    article.comments.push(comment);
    await article.save();

    const updatedArticle = await Article.findById(req.params.id)
      .populate('author', 'name email')
      .populate('comments.user', 'name email')
      .populate('likedBy', 'name email');

    res.status(200).json({
      success: true,
      data: updatedArticle
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllArticles,

  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  toggleLikeArticle,
  addComment
}; 