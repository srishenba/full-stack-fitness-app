import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import GlobalLoadingOverlay from './components/ui/GlobalLoadingOverlay';
import PageLoader from './components/ui/PageLoader';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const AICoach = lazy(() => import('./pages/AICoach'));
const AIAnalysis = lazy(() => import('./pages/AIAnalysis'));
const AddMeal = lazy(() => import('./pages/AddMeal'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const ProgressReport = lazy(() => import('./pages/ProgressReport'));

const App = () => {
  return (
    <>
      <GlobalLoadingOverlay />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="login" element={<Login />} />
                  <Route path="signup" element={<Signup />} />
                  
                  <Route
                    path="dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="ai-analysis"
                    element={
                      <ProtectedRoute>
                        <AIAnalysis />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="add-meal"
                    element={
                      <ProtectedRoute>
                        <AddMeal />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="ai-coach"
                    element={
                      <ProtectedRoute>
                        <AICoach />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="progress-report"
                    element={
                      <ProtectedRoute>
                        <ProgressReport />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="forgot-password" element={<ForgotPassword />} />
                  <Route path="reset-password/:token" element={<ResetPassword />} />

                  <Route path="ai" element={<Navigate to="/ai-coach" replace />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;