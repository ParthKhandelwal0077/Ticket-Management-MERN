// import { useState } from 'react';
// import { useSelector } from 'react-redux';
// import { useGetAssignedTicketsQuery, useGetAllTicketsQuery } from '../../features/tickets/ticketsApiSlice';
// import { useGetArticlesQuery } from '../../features/articles/articlesApiSlice';
// import TicketList from '../../features/tickets/TicketList';
// import ArticleList from '../../features/articles/ArticleList';
// import CreateArticleForm from '../../features/articles/CreateArticleForm';
// import LoadingSpinner from '../common/LoadingSpinner';
// import ErrorMessage from '../common/ErrorMessage';
// import Tabs from '../common/Tabs';

// const AgentDashboard = () => {
//   const [activeTab, setActiveTab] = useState('assigned');
//   const [showCreateArticle, setShowCreateArticle] = useState(false);
//   const { user } = useSelector((state) => state.auth);

//   const {
//     data: assignedTickets,
//     isLoading: assignedLoading,
//     isError: assignedError,
//     error: assignedErrorMessage
//   } = useGetAssignedTicketsQuery();

//   const {
//     data: allTickets,
//     isLoading: allTicketsLoading,
//     isError: allTicketsError,
//     error: allTicketsErrorMessage
//   } = useGetAllTicketsQuery();

//   const {
//     data: articles,
//     isLoading: articlesLoading,
//     isError: articlesError,
//     error: articlesErrorMessage
//   } = useGetArticlesQuery();

//   if (assignedLoading || allTicketsLoading || articlesLoading) {
//     return <LoadingSpinner />;
//   }

//   if (assignedError || allTicketsError || articlesError) {
//     return <ErrorMessage message={assignedErrorMessage || allTicketsErrorMessage || articlesErrorMessage} />;
//   }

//   const ticketTabs = [
//     { id: 'assigned', label: 'Assigned Tickets' },
//     { id: 'all', label: 'All Tickets' }
//   ];

//   return (
//     <div className="space-y-8">
//       {/* Agent Info Section */}
//       <div className="bg-white p-6 rounded-lg shadow">
//         <h2 className="text-2xl font-semibold mb-4">Welcome, Agent {user.name}!</h2>
//         <p className="text-gray-600">Manage tickets and articles from your dashboard.</p>
//       </div>

//       {/* Tickets Section */}
//       <div className="bg-white p-6 rounded-lg shadow">
//         <h3 className="text-xl font-semibold mb-6">Tickets</h3>
//         <Tabs tabs={ticketTabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        
//         <div className="mt-6">
//           {activeTab === 'assigned' ? (
//             <TicketList 
//               tickets={assignedTickets} 
//               showAssignee={true}
//               showStatus={true}
//             />
//           ) : (
//             <TicketList 
//               tickets={allTickets}
//               showAssignee={true}
//               showStatus={true}
//             />
//           )}
//         </div>
//       </div>

//       {/* Articles Section */}
//       <div className="bg-white p-6 rounded-lg shadow">
//         <div className="flex justify-between items-center mb-6">
//           <h3 className="text-xl font-semibold">Articles</h3>
//           <button
//             onClick={() => setShowCreateArticle(true)}
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//           >
//             Create New Article
//           </button>
//         </div>

//         {showCreateArticle && (
//           <div className="mb-6">
//             <CreateArticleForm onClose={() => setShowCreateArticle(false)} />
//           </div>
//         )}

//         <ArticleList 
//           articles={articles}
//           showControls={true}
//           showAuthor={true}
//           showInteractions={true}
//         />
//       </div>
//     </div>
//   );
// };

// export default AgentDashboard; 