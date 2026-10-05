import React, { useState } from 'react';
import { Search, Plus, Trash2, Mail } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'Administrator' | 'Instructor' | 'Student';
  status: 'Active' | 'Suspended';
  enrolledCourses: number;
  completionRate: number;
}

const MockUsers: User[] = [
  { id: 1, name: 'Sainikhil Ghanta', email: 'sainikhil@xebia.com', role: 'Administrator', status: 'Active', enrolledCourses: 5, completionRate: 85 },
  { id: 2, name: 'Nikhil Sai', email: 'nikhil@xebia.com', role: 'Instructor', status: 'Active', enrolledCourses: 12, completionRate: 92 },
  { id: 3, name: 'John Doe', email: 'john.doe@example.com', role: 'Student', status: 'Active', enrolledCourses: 3, completionRate: 60 },
  { id: 4, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Student', status: 'Active', enrolledCourses: 2, completionRate: 100 },
  { id: 5, name: 'Robert Johnson', email: 'robert@example.com', role: 'Student', status: 'Suspended', enrolledCourses: 1, completionRate: 10 },
  { id: 6, name: 'Emily Davis', email: 'emily@example.com', role: 'Student', status: 'Active', enrolledCourses: 4, completionRate: 75 },
];

export const UsersPage: React.FC = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState<User[]>(MockUsers);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleToggleStatus = (id: number) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'Active' ? 'Suspended' : 'Active';
        showToast(`User "${u.name}" status updated to ${nextStatus}`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleDeleteUser = (id: number, name: string) => {
    if (window.confirm(`Delete user "${name}"?`)) {
      setUsers(users.filter(u => u.id !== id));
      showToast(`User "${name}" has been deleted.`);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="flex-grow flex flex-col gap-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between border border-white/60 shadow-glass">
          <div>
            <span className="block text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-1.5">Total Users</span>
            <span className="text-3xl font-extrabold text-brand-primaryDark tracking-normal">{users.length}</span>
          </div>
          <span className="text-[10px] text-brand-muted font-bold mt-2.5">registered users</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between border border-white/60 shadow-glass">
          <div>
            <span className="block text-[10px] font-bold text-brand-success uppercase tracking-widest mb-1.5">Active Students</span>
            <span className="text-3xl font-extrabold text-brand-success tracking-normal">{users.filter(u => u.status === 'Active' && u.role === 'Student').length}</span>
          </div>
          <span className="text-[10px] text-brand-success/70 font-bold mt-2.5">active enrollment</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between border border-white/60 shadow-glass">
          <div>
            <span className="block text-[10px] font-bold text-brand-accent uppercase tracking-widest mb-1.5">Administrators</span>
            <span className="text-3xl font-extrabold text-brand-accent tracking-normal">{users.filter(u => u.role === 'Administrator').length}</span>
          </div>
          <span className="text-[10px] text-brand-accent/70 font-bold mt-2.5">system permissions</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl flex flex-col justify-between border border-white/60 shadow-glass">
          <div>
            <span className="block text-[10px] font-bold text-brand-cta uppercase tracking-widest mb-1.5">Suspended Account</span>
            <span className="text-3xl font-extrabold text-brand-cta tracking-normal">{users.filter(u => u.status === 'Suspended').length}</span>
          </div>
          <span className="text-[10px] text-brand-cta/70 font-bold mt-2.5">restricted accounts</span>
        </div>
      </div>

      {/* Action filters bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-white/60 shadow-glass">
        <div className="flex flex-wrap items-center gap-3 flex-grow">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search user name or email..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs font-semibold glass-input outline-none tracking-wide"
            />
            <Search className="w-4 h-4 text-brand-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/65 border border-[#E2E4F0] outline-none text-brand-primaryDark tracking-wide"
          >
            <option value="all">All Roles</option>
            <option value="Administrator">Administrators</option>
            <option value="Instructor">Instructors</option>
            <option value="Student">Students</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white/65 border border-[#E2E4F0] outline-none text-brand-primaryDark tracking-wide"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
        
        <button
          onClick={() => showToast('Invite User feature coming soon!')}
          className="bg-brand-success hover:bg-brand-success/90 text-white font-extrabold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Invite User
        </button>
      </div>

      {/* Users table */}
      <div className="glass-panel rounded-2xl border border-white/60 overflow-hidden shadow-glass">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs md:text-sm">
            <thead>
              <tr className="bg-[#E2E4F0]/25 text-brand-primaryDark border-b border-[#E2E4F0]/40">
                <th className="px-6 py-4 font-bold tracking-wider">User Details</th>
                <th className="px-6 py-4 font-bold tracking-wider">Role</th>
                <th className="px-6 py-4 font-bold tracking-wider">Courses</th>
                <th className="px-6 py-4 font-bold tracking-wider">Completion</th>
                <th className="px-6 py-4 font-bold text-center tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold text-center w-24 tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E4F0]/20">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-brand-muted font-bold">
                    No users found matching query filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => {
                  const roleColors = user.role === 'Administrator' 
                    ? 'bg-red-100 text-red-700' 
                    : user.role === 'Instructor' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-teal-100 text-teal-700';

                  return (
                    <tr key={user.id} className="hover:bg-white/40 transition-all duration-200">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-brand-primary/10 flex items-center justify-center font-extrabold text-xs text-brand-primary border border-brand-primary/15">
                            {user.name.charAt(0)}
                          </div>
                          <div className="flex flex-col text-left">
                            <span className="font-extrabold text-brand-primaryDark tracking-wide">{user.name}</span>
                            <span className="text-[10px] text-brand-muted font-medium flex items-center gap-1 mt-1"><Mail className="w-3 h-3" /> {user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${roleColors}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-xs text-brand-muted tracking-wide">{user.enrolledCourses} Enrolled</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-2 bg-brand-primary/5 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-success rounded-full" style={{ width: `${user.completionRate}%` }}></div>
                          </div>
                          <span className="text-xs font-bold text-brand-primaryDark">{user.completionRate}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <label className="relative inline-flex items-center cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={user.status === 'Active'}
                              onChange={() => handleToggleStatus(user.id)}
                              className="sr-only switch-input"
                            />
                            <div className="w-9 h-5 bg-[#E2E4F0] border border-[#E2E4F0] rounded-full switch-bg transition-colors duration-200"></div>
                            <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full switch-dot transition-transform duration-200 shadow-sm"></div>
                          </label>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            className="p-2 rounded-lg bg-white/70 hover:bg-red-500 hover:text-white border border-[#E2E4F0] text-brand-muted transition-all duration-200"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
      </div>
    </div>
  );
};
