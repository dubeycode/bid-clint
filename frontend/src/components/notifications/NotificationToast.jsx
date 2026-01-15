import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import socketService from '../../services/socket';

export default function NotificationToast() {
  const [notification, setNotification] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      //  hire notifications
      socketService.on('hired', (data) => {
        setNotification(data);
        
        // Auto dismiss after 5 seconds
        setTimeout(() => {
          setNotification(null);
        }, 5000);
      });

      return () => {
        socketService.off('hired');
      };
    }
  }, [user]);

  if (!notification) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4 animate-slide-in">
      <div className="pointer-events-auto flex max-w-md flex-1 items-start gap-3 rounded-2xl border border-emerald-500/40 bg-slate-950/95 px-4 py-3 text-xs text-slate-100 shadow-[0_24px_60px_rgba(16,185,129,0.7)] backdrop-blur-xl">
        <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">
            You&apos;ve been hired
          </h3>
          <p className="mt-1 text-[13px] leading-relaxed text-slate-100">
            {notification.message}
          </p>
        </div>
        <button
          onClick={() => setNotification(null)}
          className="ml-1 mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}