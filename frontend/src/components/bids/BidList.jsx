import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchBidsForGig, hireBid, clearMessages } from '../../features/bids/bidSlice';

export default function BidList() {
  const { gigId } = useParams();
  const dispatch = useDispatch();
  const { bids, isLoading, error, success } = useSelector((state) => state.bids);

  useEffect(() => {
    dispatch(fetchBidsForGig(gigId));
  }, [dispatch, gigId]);

  const handleHire = async (bidId) => {
    if (window.confirm('Are you sure you want to hire this freelancer?')) {
      const result = await dispatch(hireBid(bidId));
      // Refresh bids list to show updated statuses
      if (result.type === 'bids/hireBid/fulfilled') {
        dispatch(fetchBidsForGig(gigId));
      }
      setTimeout(() => dispatch(clearMessages()), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-emerald-300 via-sky-200 to-indigo-300 bg-clip-text text-2xl font-semibold tracking-tight text-transparent sm:text-3xl">
            Bids for this gig
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Review proposals and hire the freelancer that best matches your needs.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {success}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center rounded-3xl border border-slate-800 bg-slate-950/70 py-16 text-slate-400">
          <div className="flex items-center gap-3 text-sm">
            <span className="h-3 w-3 animate-ping rounded-full bg-emerald-400" />
            Loading bids...
          </div>
        </div>
      ) : bids.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-slate-950/60 py-16 text-center">
          <p className="text-sm font-medium text-slate-300">
            No bids for this gig yet.
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Share your gig to attract qualified freelancers faster.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bids.map((bid) => (
            <div
              key={bid._id}
              className="glass-card flex flex-col rounded-2xl p-5 text-xs text-slate-100"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold tracking-tight text-slate-50">
                    {bid.freelancerId?.name}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {bid.freelancerId?.email}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-emerald-300">
                    ${bid.price}
                  </div>
                  <span
                    className={`mt-1 inline-flex items-center justify-center rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                      bid.status === 'hired'
                        ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/40'
                        : bid.status === 'rejected'
                        ? 'bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/40'
                        : 'bg-amber-500/10 text-amber-200 ring-1 ring-amber-400/40'
                    }`}
                  >
                    {bid.status}
                  </span>
                </div>
              </div>

              <p className="mb-4 text-xs leading-relaxed text-slate-200">
                {bid.message}
              </p>

              {bid.status === 'pending' && (
                <button
                  onClick={() => handleHire(bid._id)}
                  disabled={isLoading}
                  className="mt-auto inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-emerald-400 via-sky-400 to-cyan-400 px-4 py-2 text-[11px] font-semibold text-slate-950 shadow-[0_18px_40px_rgba(52,211,153,0.8)] transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Hiring...' : 'Hire this freelancer'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}