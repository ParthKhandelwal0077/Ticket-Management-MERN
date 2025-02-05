import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { useToggleLikeArticleMutation, useDeleteArticleMutation } from '../../features/articles/articlesApiSlice';
import { Link } from 'react-router-dom';

const ArticleList = ({ 
  articles, 
  showControls = false, 
  showAuthor = false, 
  showInteractions = false,
  showStats = false 
}) => {
  const [toggleLike] = useToggleLikeArticleMutation();
  const [deleteArticle] = useDeleteArticleMutation();

  if (!articles?.length) {
    return (
      <div className="text-center py-4 text-gray-500">
        No articles found.
      </div>
    );
  }

  const handleLike = async (id) => {
    try {
      await toggleLike(id).unwrap();
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await deleteArticle(id).unwrap();
      } catch (err) {
        console.error('Failed to delete article:', err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {articles.map((article) => (
        <div key={article._id} className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{article.title}</h3>
              {showAuthor && (
                <p className="text-sm text-gray-500 mt-1">
                  By {article.author.name} • {format(new Date(article.createdAt), 'MMM d, yyyy')}
                </p>
              )}
            </div>
            {showControls && (
              <div className="flex space-x-2">
                <Link
                  to={`/articles/edit/${article._id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(article._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            )}
          </div>

          <p className="mt-4 text-gray-600">{article.content}</p>

          {showStats && (
            <div className="mt-4 flex space-x-4 text-sm text-gray-500">
              <span>{article.views || 0} views</span>
              <span>{article.likes || 0} likes</span>
              <span>{article.comments?.length || 0} comments</span>
            </div>
          )}

          {showInteractions && (
            <div className="mt-4 flex space-x-4">
              <button
                onClick={() => handleLike(article._id)}
                className={`flex items-center space-x-1 ${
                  article.isLiked ? 'text-blue-600' : 'text-gray-500'
                } hover:text-blue-600`}
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                <span>{article.likes || 0}</span>
              </button>
              <Link
                to={`/articles/${article._id}`}
                className="text-gray-500 hover:text-blue-600"
              >
                Read More
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// ArticleList.propTypes = {
//   articles: PropTypes.arrayOf(PropTypes.shape({
//     _id: PropTypes.string.isRequired,
//     title: PropTypes.string.isRequired,
//     content: PropTypes.string.isRequired,
//     author: PropTypes.shape({
//       name: PropTypes.string.isRequired
//     }),
//     createdAt: PropTypes.string.isRequired,
//     likes: PropTypes.number,
//     views: PropTypes.number,
//     comments: PropTypes.array,
//     isLiked: PropTypes.bool
//   })).isRequired,
//   showControls: PropTypes.bool,
//   showAuthor: PropTypes.bool,
//   showInteractions: PropTypes.bool,
//   showStats: PropTypes.bool
// };

export default ArticleList; 