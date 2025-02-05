import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { useUpdateUserMutation, useDeleteUserMutation } from '../user/userApiSlice';

const UserList = ({ users, showControls = false }) => {
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  if (!users?.length) {
    return (
      <div className="text-center py-4 text-gray-500">
        No users found.
      </div>
    );
  }

  const handleRoleChange = async (id, newRole) => {
    try {
      await updateUser({ id, role: newRole }).unwrap();
    } catch (err) {
      console.error('Failed to update user role:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id).unwrap();
      } catch (err) {
        console.error('Failed to delete user:', err);
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Joined
            </th>
            {showControls && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{user.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{user.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {showControls ? (
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="text-sm text-gray-900 border rounded p-1"
                  >
                    <option value="user">User</option>
                    <option value="agent">Agent</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${user.role === 'admin' ? 'bg-red-100 text-red-800' : ''}
                    ${user.role === 'agent' ? 'bg-blue-100 text-blue-800' : ''}
                    ${user.role === 'user' ? 'bg-green-100 text-green-800' : ''}
                  `}>
                    {user.role}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(user.createdAt), 'MMM d, yyyy')}
              </td>
              {showControls && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

UserList.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired
  })).isRequired,
  showControls: PropTypes.bool
};

export default UserList; 