import React, { useState, useEffect } from "react";

function ActivityTable({ onUserCountUpdate }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users from MySQL database
  useEffect(() => {
    fetchUsers();
  }, []);

  // Update parent component whenever users array changes
  useEffect(() => {
    if (onUserCountUpdate) {
      onUserCountUpdate(users.length);
    }
  }, [users, onUserCountUpdate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://backend-docker-production-c584.up.railway.app/api/users'); 
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`https://backend-docker-production-c584.up.railway.app/api/users/${userId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Remove user from local state
        setUsers(users.filter(user => user.idaccount !== userId));
        alert('User deleted successfully');
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  const handleRoleChange = async (userId, currentRole, newRole) => {
    const action = newRole === 'admin' ? 'promote' : 'demote';
    const confirmMessage = `Are you sure you want to ${action} this user to ${newRole === null ? 'user' : newRole}?`;
    
    if (window.confirm(confirmMessage)) {
      try {
        // Find the user to get their current data
        const user = users.find(u => u.idaccount === userId);
        if (!user) {
          throw new Error('User not found');
        }

        const response = await fetch(`https://backend-docker-production-c584.up.railway.app/api/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone: user.phone,
            fullname: user.fullname,
            email: user.email,
            role: newRole // Will be 'admin' or null (for user)
          }),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Update user role in local state
        setUsers(users.map(u => 
          u.idaccount === userId 
            ? { ...u, role: newRole }
            : u
        ));
        
        const roleDisplay = newRole === null ? 'user' : newRole;
        alert(`User ${action}d to ${roleDisplay} successfully`);
      } catch (err) {
        console.error('Error updating user role:', err);
        alert(`Failed to ${action} user. Please try again.`);
      }
    }
  };

  if (loading) {
    return (
      <section className="rounded-xl border bg-zinc-800 border-zinc-700">
        <div className="p-6 border-b border-zinc-700">
          <h3 className="text-lg font-semibold text-white">User List</h3>
        </div>
        <div className="p-8 text-center">
          <div className="text-white">Loading users...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-xl border bg-zinc-800 border-zinc-700">
        <div className="p-6 border-b border-zinc-700">
          <h3 className="text-lg font-semibold text-white">User List</h3>
        </div>
        <div className="p-8 text-center">
          <div className="text-red-400 mb-4">{error}</div>
          <button 
            onClick={fetchUsers}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border bg-zinc-800 border-zinc-700">
      <div className="p-6 border-b border-zinc-700">
        <h3 className="text-lg font-semibold text-white">User List</h3>
        <button 
          onClick={fetchUsers}
          className="mt-2 px-3 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-zinc-700">
              <th className="p-4 text-sm font-medium text-gray-400">ID</th>
              <th className="p-4 text-sm font-medium text-gray-400">Phone</th>
              <th className="p-4 text-sm font-medium text-gray-400">Full Name</th>
              <th className="p-4 text-sm font-medium text-gray-400">Email</th>
              <th className="p-4 text-sm font-medium text-gray-400">Role</th>
              <th className="p-4 text-sm font-medium text-gray-400">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-400">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const isAdmin = user.role === 'admin';
                const displayRole = user.role || 'user';
                
                return (
                  <tr key={user.idaccount} className="border-b border-zinc-700">
                    <td className="p-4 text-sm text-white">{user.idaccount}</td>
                    <td className="p-4 text-sm text-white">{user.phone || 'N/A'}</td>
                    <td className="p-4 text-sm text-white">{user.fullname || 'N/A'}</td>
                    <td className="p-4 text-sm text-white">{user.email || 'N/A'}</td>
                    <td className="p-4 text-sm text-white">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        isAdmin 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-gray-600 text-white'
                      }`}>
                        {displayRole}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 flex-wrap">
                        {isAdmin ? (
                          <button 
                            onClick={() => handleRoleChange(user.idaccount, user.role, null)}
                            className="px-3 py-1 text-xs bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors"
                            title="Demote to user"
                          >
                            Demote
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleRoleChange(user.idaccount, user.role, 'admin')}
                            className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                            title="Promote to admin"
                          >
                            Promote
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(user.idaccount)}
                          className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default ActivityTable;