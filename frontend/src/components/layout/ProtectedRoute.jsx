import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-96px)] items-center justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 px-5 py-3 text-sm text-slate-300 shadow-[0_20px_55px_rgba(15,23,42,0.95)]">
          <span className="h-2 w-2 animate-ping rounded-full bg-sky-400" />
          <span>Loading your workspace...</span>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
}