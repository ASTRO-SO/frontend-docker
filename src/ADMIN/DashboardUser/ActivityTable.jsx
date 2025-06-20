import React, { useState, useEffect } from "react";

function ActivityTable({ onUserCountUpdate }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingRoles, setUpdatingRoles] = useState(new Set());
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

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
      // Reset to first page when data is refreshed
      setCurrentPage(1);
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
        const newUsers = users.filter(user => user.idaccount !== userId);
        setUsers(newUsers);
        
        // Adjust current page if necessary
        const totalPages = Math.ceil(newUsers.length / usersPerPage);
        if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(totalPages);
        }
        
        alert('User deleted successfully');
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  const handleRoleToggle = async (userId, currentRole) => {
    // Find the user to get their current data
    const user = users.find(u => u.idaccount === userId);
    if (!user) return;

    // Determine new role: if current is 'admin', make it null (user), otherwise make it 'admin'
    const newRole = currentRole === 'admin' ? null : 'admin';
    const roleText = newRole === 'admin' ? 'admin' : 'user';
    
    if (!window.confirm(`Are you sure you want to change this user's role to ${roleText}?`)) {
      return;
    }

    // Add user ID to updating set to show loading state
    setUpdatingRoles(prev => new Set(prev).add(userId));

    try {
      const response = await fetch(`https://backend-docker-production-c584.up.railway.app/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: user.phone,
          fullname: user.fullname,
          email: user.email,
          role: newRole
        }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Update user role in local state
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.idaccount === userId 
            ? { ...u, role: newRole }
            : u
        )
      );
      
      alert(`User role updated to ${roleText} successfully`);
    } catch (err) {
      console.error('Error updating user role:', err);
      alert('Failed to update user role. Please try again.');
    } finally {
      // Remove user ID from updating set
      setUpdatingRoles(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  // Pagination calculations
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Pagination component
  const Pagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-700">
        <div className="text-sm text-gray-400">
          Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, users.length)} of {users.length} users
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              currentPage === 1
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-600 hover:bg-gray-500 text-white'
            }`}
          >
            Previous
          </button>
          
          {startPage > 1 && (
            <>
              <button
                onClick={() => handlePageChange(1)}
                className="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors"
              >
                1
              </button>
              {startPage > 2 && <span className="text-gray-400">...</span>}
            </>
          )}
          
          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                currentPage === number
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-600 hover:bg-gray-500 text-white'
              }`}
            >
              {number}
            </button>
          ))}
          
          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="text-gray-400">...</span>}
              <button
                onClick={() => handlePageChange(totalPages)}
                className="px-3 py-1 text-xs bg-gray-600 hover:bg-gray-500 text-white rounded-md transition-colors"
              >
                {totalPages}
              </button>
            </>
          )}
          
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              currentPage === totalPages
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-600 hover:bg-gray-500 text-white'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    );
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
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-400">
                  No users found
                </td>
              </tr>
            ) : (
              currentUsers.map((user) => (
                <tr key={user.idaccount} className="border-b border-zinc-700">
                  <td className="p-4 text-sm text-white">{user.idaccount}</td>
                  <td className="p-4 text-sm text-white">{user.phone || 'N/A'}</td>
                  <td className="p-4 text-sm text-white">{user.fullname || 'N/A'}</td>
                  <td className="p-4 text-sm text-white">{user.email || 'N/A'}</td>
                  <td className="p-4 text-sm text-white">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-600 text-white'
                    }`}>
                      {user.role === 'admin' ? 'admin' : 'user'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleRoleToggle(user.idaccount, user.role)}
                        disabled={updatingRoles.has(user.idaccount)}
                        className={`px-3 py-1 text-xs rounded-md transition-colors ${
                          user.role === 'admin'
                            ? 'bg-orange-600 hover:bg-orange-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        } ${
                          updatingRoles.has(user.idaccount) 
                            ? 'opacity-50 cursor-not-allowed' 
                            : ''
                        }`}
                      >
                        {updatingRoles.has(user.idaccount) 
                          ? 'Updating...' 
                          : user.role === 'admin' 
                            ? 'Demote' 
                            : 'Promote'
                        }
                      </button>
                      <button 
                        onClick={() => handleDelete(user.idaccount)}
                        className="px-3 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <Pagination />
    </section>
  );
}

export default ActivityTable;