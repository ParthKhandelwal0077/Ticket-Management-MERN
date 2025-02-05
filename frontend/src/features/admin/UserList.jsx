import { useGetAllUsersQuery, useDeleteUserMutation, useUpdateUserMutation } from '../user/userApiSlice';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const UserList = () => {
  const navigate = useNavigate();
  const { data: users, isLoading, isError, error } = useGetAllUsersQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [updateUser] = useUpdateUserMutation();

  // Ensure users is an array before mapping
  const userList = Array.isArray(users?.data) ? users.data : [];

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <ErrorMessage message={error?.data?.message || 'Error loading users'} />;

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId).unwrap();
        alert('User deleted successfully');
      } catch (err) {
        console.error('Failed to delete user:', err);
      }
    }
  };

  const handleToggleActiveStatus = async (user) => {
    try {
      await updateUser({ id: user._id, isActive: !user.isActive }).unwrap();
      alert(`User ${user.isActive ? 'deactivated' : 'activated'} successfully`);
    } catch (err) {
      console.error('Failed to update user status:', err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-6">User Management</h3>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {userList.map((user) => (
            <tr key={user._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{user.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{user.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                >
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => navigate(`/admin/users/${user._id}`)}
                  className="text-blue-600 hover:text-blue-900 mr-4"
                >
                  View
                </button>
                <button
                  onClick={() => handleToggleActiveStatus(user)}
                  className="text-yellow-600 hover:text-yellow-900 mr-4"
                >
                  {user.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList; 