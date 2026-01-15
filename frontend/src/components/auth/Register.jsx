import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, clearError } from '../../features/auth/authSlice';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  // Redirect to /gigs if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/gigs');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register(formData));
    if (result.type === 'auth/register/fulfilled') {
      navigate('/gigs');
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-96px)] items-center justify-center py-10">
      <div className="grid w-full max-w-4xl gap-10 rounded-3xl border border-slate-800/80 bg-slate-950/70 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.95)] backdrop-blur-2xl md:grid-cols-[1.1fr,0.9fr] md:p-10">
        <div className="flex flex-col justify-center">
          <h2 className="bg-gradient-to-r from-sky-400 via-indigo-400 to-fuchsia-400 bg-clip-text text-3xl font-semibold tracking-tight text-transparent sm:text-4xl">
            Create your GigFlow profile
            <span className="block text-base font-normal text-slate-400 sm:text-lg">
              One account to manage gigs, bids, and hires.
            </span>
          </h2>

          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-xs text-slate-400">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-300">
              
            </span>
            <p>
              Free to sign up. Only pay when you hire or get hired — keep full control over your work.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            {error && (
              <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-100 outline-none ring-0 transition placeholder:text-slate-500 focus:border-sky-400/70 focus:ring-2 focus:ring-sky-500/40"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-100 outline-none ring-0 transition placeholder:text-slate-500 focus:border-sky-400/70 focus:ring-2 focus:ring-sky-500/40"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-sm text-slate-100 outline-none ring-0 transition placeholder:text-slate-500 focus:border-sky-400/70 focus:ring-2 focus:ring-sky-500/40"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-sky-400 via-indigo-500 to-fuchsia-500 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_18px_45px_rgba(56,189,248,0.7)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:brightness-90"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-4 text-xs text-slate-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-sky-400 hover:text-sky-300"
            >
              Log in
            </Link>
          </p>
        </div>

        <div className="hidden flex-col justify-between rounded-2xl border border-slate-800 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.2),_rgba(15,23,42,1)_55%)] px-5 py-6 text-xs text-slate-300 md:flex">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
              Build your crew
            </p>
            <p className="mt-2 text-base font-medium text-slate-50">
              Run your entire freelance workflow in one place.
            </p>
            <p className="mt-2 text-[13px] leading-relaxed text-slate-400">
              Post roles, review bids, and collaborate with talent without leaving GigFlow.
              Perfect for solo founders and scaling teams.
            </p>
          </div>

          <div className="mt-6 space-y-2 rounded-2xl bg-slate-900/60 p-4">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-500">
              Why teams choose GigFlow
            </p>
            <div className="flex items-center justify-between text-[13px] text-slate-300">
              <span>Verified professionals</span>
              <span className="font-semibold text-emerald-400">Top 10%</span>
            </div>
            <div className="flex items-center justify-between text-[13px] text-slate-300">
              <span>Avg. response time</span>
              <span className="font-semibold text-sky-400">&lt; 30 min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}