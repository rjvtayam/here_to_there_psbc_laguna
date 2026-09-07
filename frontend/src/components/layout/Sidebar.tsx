import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { Home, Settings, Users, LogOut, ChevronsLeft, ChevronsRight } from 'lucide-react';

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  const showUsers = user?.role === 'admin' || user?.role === 'principal';

  return (
    <aside
      className={`${isSidebarOpen ? 'w-56' : 'w-16'} bg-gray-900 border-r border-gray-800 flex flex-col transition-all duration-300 ease-in-out relative`}
    >
      {/* Logo area */}
      <div className={`h-14 flex items-center ${isSidebarOpen ? 'px-4' : 'justify-center'} border-b border-gray-800`}>
        {isSidebarOpen ? (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12 L10 7 L10 17 Z" fill="currentColor" />
                <path d="M19 12 L14 7 L14 17 Z" fill="currentColor" opacity="0.5" />
                <circle cx="12" cy="12" r="1.5" />
              </svg>
            </div>
            <span className="text-sm font-bold text-white truncate">Here to There</span>
          </div>
        ) : (
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-cyan-500 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12 L10 7 L10 17 Z" fill="currentColor" />
              <path d="M19 12 L14 7 L14 17 Z" fill="currentColor" opacity="0.5" />
              <circle cx="12" cy="12" r="1.5" />
            </svg>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 flex flex-col gap-0.5 py-3">
        <SidebarLink
          to={showUsers ? '/control-room' : `/campus/${user?.campus}`}
          icon={<Home size={18} />}
          label="Home"
          isOpen={isSidebarOpen}
        />

        {showUsers && (
          <>
            <SidebarLink to="/admin/users" icon={<Users size={18} />} label="Users" isOpen={isSidebarOpen} />
          </>
        )}

        {user?.role === 'admin' && (
          <SidebarLink to="/control-room/settings" icon={<Settings size={18} />} label="Settings" isOpen={isSidebarOpen} />
        )}

        {(user?.role === 'teacher' || user?.role === 'staff' || user?.role === 'principal') && (
          <SidebarLink to="/control-room/settings" icon={<Settings size={18} />} label="Settings" isOpen={isSidebarOpen} />
        )}
      </nav>

      {/* Divider with collapse toggle */}
      <div className="relative mx-3 my-1">
        <div className="border-t border-gray-800" />
        <button
          onClick={toggleSidebar}
          className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-gray-900 border border-gray-700 rounded flex items-center justify-center text-gray-500 hover:text-white hover:border-gray-500 transition-colors"
          title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isSidebarOpen ? <ChevronsLeft size={12} /> : <ChevronsRight size={12} />}
        </button>
      </div>

      {/* Logout */}
      <div className="px-2 pb-3 pt-1">
        <button
          onClick={logout}
          className={`flex items-center gap-3 ${isSidebarOpen ? 'px-3 w-full' : 'justify-center w-full'} py-2 rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors`}
          title={!isSidebarOpen ? 'Logout' : undefined}
        >
          <LogOut size={17} />
          {isSidebarOpen && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
}

function SidebarLink({ to, icon, label, isOpen }: { to: string; icon: React.ReactNode; label: string; isOpen: boolean }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 ${isOpen ? 'px-3 mx-2' : 'justify-center mx-2'} py-2 rounded-lg transition-all duration-200 ${
          isActive
            ? 'bg-primary-600/15 text-primary-400'
            : 'text-gray-400 hover:bg-gray-800/60 hover:text-white'
        }`
      }
      title={!isOpen ? label : undefined}
    >
      {icon}
      {isOpen && <span className="text-sm">{label}</span>}
    </NavLink>
  );
}
