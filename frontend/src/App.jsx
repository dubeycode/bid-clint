import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from './features/auth/authSlice';

// Components
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';
import NotificationToast from './components/notifications/NotificationToast';

// Pages
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import GigList from './components/gigs/GigList';
import CreateGig from './components/gigs/CreateGig';
import BidList from './components/bids/BidList';
import MyGigs from './pages/MyGigs';
import MyBids from './pages/MyBids';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, isLoading, hasCheckedAuth } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check if user is authenticated on app mount (only once)
    // This validates that the httpOnly cookie is properly set and sent
    if (!hasCheckedAuth) {
      dispatch(getMe());
    }
  }, [dispatch, hasCheckedAuth]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#0f172a_0,_#020617_55%,_#000_100%)] text-slate-100">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="pointer-events-none fixed inset-x-0 top-0 z-0 flex justify-center overflow-hidden">
            <div className="pointer-events-none h-[300px] w-[900px] bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.25),_transparent_65%)] blur-3xl" />
          </div>

          <Navbar />
          <NotificationToast />
          
          <main className="relative z-10 pb-10 pt-6 sm:pt-8">
            <Routes>
              <Route path="/" element={<Navigate to="/gigs" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/gigs" element={<GigList />} />
              
              <Route
                path="/create-gig"
                element={
                  <ProtectedRoute>
                    <CreateGig />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/gig/:gigId/bids"
                element={
                  <ProtectedRoute>
                    <BidList />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/my-gigs"
                element={
                  <ProtectedRoute>
                    <MyGigs />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/my-bids"
                element={
                  <ProtectedRoute>
                    <MyBids />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
