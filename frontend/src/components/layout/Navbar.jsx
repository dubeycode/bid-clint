import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="relative z-20 pt-5">
      <div className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-950/70 px-4 py-3 shadow-[0_18px_45px_rgba(15,23,42,0.85)] backdrop-blur-xl sm:px-6 lg:px-8">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-slate-50"
        >
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-indigo-500 to-fuchsia-500 text-slate-950 shadow-[0_10px_30px_rgba(56,189,248,0.55)]">
            GF
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-400">
              GigFlow
            </span>
            <span className="text-xs text-slate-500">
              Smart marketplace for modern work
            </span>
          </div>
        </Link>

        <div className="hidden items-center gap-2 text-sm md:flex">
          {isAuthenticated ? (
            <>
              <Link
                to="/gigs"
                className="rounded-full px-3 py-1.5 text-slate-300 transition hover:bg-slate-800/70 hover:text-slate-50"
              >
                Browse
              </Link>
              <Link
                to="/create-gig"
                className="rounded-full px-3 py-1.5 text-slate-300 transition hover:bg-slate-800/70 hover:text-slate-50"
              >
                Post a Gig
              </Link>
              <Link
                to="/my-gigs"
                className="rounded-full px-3 py-1.5 text-slate-300 transition hover:bg-slate-800/70 hover:text-slate-50"
              >
                My Gigs
              </Link>
              <Link
                to="/my-bids"
                className="rounded-full px-3 py-1.5 text-slate-300 transition hover:bg-slate-800/70 hover:text-slate-50"
              >
                My Bids
              </Link>

              <div className="ml-2 flex items-center gap-3 pl-3">
                <div className="flex flex-col items-end leading-tight">
                  <span className="text-xs font-medium text-slate-400">
                    Signed in as
                  </span>
                  <span className="text-sm font-semibold text-slate-50">
                    {user?.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-full bg-gradient-to-r from-sky-400 via-indigo-500 to-fuchsia-500 px-4 py-1.5 text-sm font-semibold text-slate-950 shadow-[0_12px_30px_rgba(56,189,248,0.55)] transition hover:brightness-110"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full px-3 py-1.5 text-slate-300 transition hover:bg-slate-800/70 hover:text-slate-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-gradient-to-r from-sky-400 via-indigo-500 to-fuchsia-500 px-4 py-1.5 text-sm font-semibold text-slate-950 shadow-[0_12px_30px_rgba(56,189,248,0.55)] transition hover:brightness-110"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}