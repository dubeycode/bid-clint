import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyBids } from '../features/bids/bidSlice';

export default function MyBids() {
  const dispatch = useDispatch();
  const { myBids, isLoading } = useSelector((state) => state.bids);

  useEffect(() => {
    dispatch(fetchMyBids());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-sky-300 via-indigo-200 to-fuchsia-300 bg-clip-text text-2xl font-semibold tracking-tight text-transparent sm:text-3xl">
            Your bids
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Keep an eye on where you&apos;ve pitched and how each opportunity is progressing.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center rounded-3xl border border-slate-800 bg-slate-950/70 py-16 text-slate-400">
          <div className="flex items-center gap-3 text-sm">
            <span className="h-3 w-3 animate-ping rounded-full bg-indigo-400" />
            Loading your bids...
          </div>
        </div>
      ) : myBids.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-700 bg-slate-950/60 py-16 text-center">
          <p className="text-sm font-medium text-slate-300">
            You haven&apos;t submitted any bids yet.
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Start exploring gigs and send a few targeted proposals to get hired faster.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {myBids.map((bid) => (
            <div
              key={bid._id}
              className="glass-card flex flex-col rounded-2xl p-5 text-xs text-slate-100"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold tracking-tight text-slate-50">
                    {bid.gigId?.title}
                  </h3>
                  <p className="mt-1 text-[11px] text-slate-400">
                    Budget:{' '}
                    <span className="font-medium text-sky-300">
                      ${bid.gigId?.budget}
                    </span>
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

              <p className="text-xs leading-relaxed text-slate-200">
                {bid.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}