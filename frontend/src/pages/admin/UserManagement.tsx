import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { Button } from '../../components/ui/button';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { User } from '../../types/user';
import { api } from '../../api/axios';
import {
  Trash2, Users, UserPlus, Mail, Lock, Building2, Shield,
  Search, X, AlertCircle, RefreshCw, Eye, EyeOff, User as UserIcon, ChevronDown
} from 'lucide-react';

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'teacher',
    campus: 'paete',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.get('/users/');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    try {
      await api.post('/auth/register', newUser);
      setIsAddingUser(false);
      setNewUser({ email: '', password: '', full_name: '', role: 'teacher', campus: 'paete' });
      loadUsers();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setUserIdToDelete(userId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteUser = async () => {
    if (!userIdToDelete) return;
    try {
      await api.delete(`/users/${userIdToDelete}`);
      loadUsers();
    } catch (error) {
      console.error('Failed to delete user:', error);
    } finally {
      setShowDeleteConfirm(false);
      setUserIdToDelete(null);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.campus?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const roleColors: Record<string, string> = {
    principal: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    admin: 'text-primary-400 bg-primary-500/10 border-primary-500/20',
    teacher: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    staff: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
  };

  const roleIcons: Record<string, React.ReactNode> = {
    principal: <Shield size={10} />,
    admin: <Shield size={10} />,
    teacher: <UserIcon size={10} />,
    staff: <UserIcon size={10} />,
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/15 border border-primary-500/20 flex items-center justify-center">
              <Users size={20} className="text-primary-400" />
            </div>
            <div>
              <h1 className="font-orbitron text-2xl font-bold text-white">User Management</h1>
              <p className="text-gray-500 text-sm">{users.length} registered user(s)</p>
            </div>
          </div>
          <Button onClick={() => { setIsAddingUser(true); setError(''); }} className="inline-flex items-center whitespace-nowrap bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-500 hover:to-cyan-500 shadow-lg shadow-primary-500/20">
            <UserPlus size={16} className="mr-2" />
            Add User
          </Button>
        </div>

        {/* Add User Form */}
        {isAddingUser && (
          <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-800/60 overflow-hidden animate-fade-in-up">
            <div className="p-4 border-b border-gray-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary-500/15 border border-primary-500/20 flex items-center justify-center">
                  <UserPlus size={14} className="text-primary-400" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-white">Create New User</span>
                  <p className="text-[10px] text-gray-500">Fill in the details below</p>
                </div>
              </div>
              <button onClick={() => { setIsAddingUser(false); setError(''); }} className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-all">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="p-5">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm mb-4">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              {/* Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
                  <div className="relative">
                    <UserIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
                    <input
                      value={newUser.full_name}
                      onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                      placeholder="Juan Dela Cruz"
                      required
                      className="w-full bg-gray-800/80 border border-gray-700/50 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/40 focus:outline-none transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="user@psbc.edu.ph"
                      required
                      className="w-full bg-gray-800/80 border border-gray-700/50 rounded-xl pl-9 pr-4 py-2.5 text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/40 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Minimum 6 characters"
                    required
                    className="w-full bg-gray-800/80 border border-gray-700/50 rounded-xl pl-9 pr-10 py-2.5 text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/40 focus:outline-none transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Role & Campus */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Role</label>
                  <div className="relative">
                    <Shield size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400 z-10" />
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      className="w-full bg-gray-800/80 border border-gray-700/50 rounded-xl pl-9 pr-9 py-2.5 text-white text-sm focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/40 focus:outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="teacher">Teacher</option>
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                      <option value="principal">Principal</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Campus</label>
                  <div className="relative">
                    <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400 z-10" />
                    <select
                      value={newUser.campus}
                      onChange={(e) => setNewUser({ ...newUser, campus: e.target.value })}
                      className="w-full bg-gray-800/80 border border-gray-700/50 rounded-xl pl-9 pr-9 py-2.5 text-white text-sm focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/40 focus:outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="paete">PSBC Paete</option>
                      <option value="pagsanjan">PSBC Pagsanjan</option>
                      <option value="control_room">Control Room</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t border-gray-800/60">
                <Button type="button" variant="secondary" size="sm" onClick={() => { setIsAddingUser(false); setError(''); }} className="inline-flex items-center whitespace-nowrap">
                  <X size={12} className="mr-1.5" />
                  Cancel
                </Button>
                <Button type="submit" size="sm" disabled={creating} className="inline-flex items-center whitespace-nowrap bg-gradient-to-r from-primary-600 to-cyan-600 hover:from-primary-500 hover:to-cyan-500 shadow-lg shadow-primary-500/20">
                  {creating ? <RefreshCw size={12} className="mr-1.5 animate-spin" /> : <UserPlus size={12} className="mr-1.5" />}
                  {creating ? 'Creating...' : 'Create User'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name, email, role, or campus..."
            className="w-full bg-gray-900/80 backdrop-blur-xl border border-gray-800/60 rounded-xl pl-9 pr-10 py-2.5 text-white text-sm placeholder-gray-500 focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/40 focus:outline-none transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Users Table */}
        <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-gray-800/60 overflow-hidden">
          <div className="p-4 border-b border-gray-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-gray-500" />
              <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">All Users</span>
            </div>
            <span className="text-xs text-gray-600 bg-gray-800 px-2 py-1 rounded-md">{filteredUsers.length} result(s)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800/60">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Campus</th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/60">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-gray-800/60 border border-gray-700/40 flex items-center justify-center mx-auto mb-3">
                        <Users size={20} className="text-gray-600" />
                      </div>
                      <p className="text-gray-500 text-sm font-medium">No users found</p>
                      <p className="text-gray-600 text-xs mt-1">{searchQuery ? 'Try a different search' : 'Create your first user'}</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-800/30 transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500/20 to-cyan-500/20 border border-gray-700/50 flex items-center justify-center overflow-hidden">
                            {user.avatar_url ? (
                              <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-sm font-bold text-primary-400">{user.full_name?.charAt(0)?.toUpperCase() || '?'}</span>
                            )}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{user.full_name}</p>
                            <p className="text-gray-500 text-xs">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${roleColors[user.role] || roleColors.staff}`}>
                          {roleIcons[user.role]}
                          {user.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-400 text-sm capitalize">{user.campus?.replace('_', ' ')}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${user.is_active ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-gray-500 bg-gray-800 border-gray-700/50'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.is_active ? 'bg-green-400' : 'bg-gray-600'}`} />
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                          title="Deactivate user"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Deactivate User?"
        message="This user will no longer be able to sign in. You can reactivate them later from the user management panel."
        confirmLabel="Deactivate"
        cancelLabel="Cancel"
        variant="danger"
        icon="trash"
        onConfirm={confirmDeleteUser}
        onCancel={() => { setShowDeleteConfirm(false); setUserIdToDelete(null); }}
      />
    </DashboardLayout>
  );
}
