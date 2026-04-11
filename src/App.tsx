import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { ToastProvider } from '@/components/ui/Toast'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import { SkeletonCard } from '@/components/ui/Skeleton'

// Lazy-load all pages
const Welcome = lazy(() => import('@/pages/Welcome').then(m => ({ default: m.Welcome })))
const Login = lazy(() => import('@/pages/Login').then(m => ({ default: m.Login })))
const Signup = lazy(() => import('@/pages/Signup').then(m => ({ default: m.Signup })))
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword').then(m => ({ default: m.ForgotPassword })))
const Home = lazy(() => import('@/pages/Home').then(m => ({ default: m.Home })))
const Scan = lazy(() => import('@/pages/Scan').then(m => ({ default: m.Scan })))
const Result = lazy(() => import('@/pages/Result').then(m => ({ default: m.Result })))
const History = lazy(() => import('@/pages/History').then(m => ({ default: m.History })))
const Garden = lazy(() => import('@/pages/Garden').then(m => ({ default: m.Garden })))
const Settings = lazy(() => import('@/pages/Settings').then(m => ({ default: m.Settings })))

function PageSuspense({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream p-4 space-y-3 pt-14">
        {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
      </div>
    }>
      {children}
    </Suspense>
  )
}

function AuthRedirect() {
  const { session, isLoading } = useAuth()
  if (isLoading) return null
  return session ? <Navigate to="/home" replace /> : <Navigate to="/welcome" replace />
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AuthRedirect />} />
        <Route path="/welcome" element={<PageSuspense><Welcome /></PageSuspense>} />
        <Route path="/login" element={<PageSuspense><Login /></PageSuspense>} />
        <Route path="/signup" element={<PageSuspense><Signup /></PageSuspense>} />
        <Route path="/forgot-password" element={<PageSuspense><ForgotPassword /></PageSuspense>} />

        {/* Protected Routes */}
        <Route path="/home" element={
          <ProtectedRoute>
            <PageSuspense><Home /></PageSuspense>
          </ProtectedRoute>
        } />
        <Route path="/scan" element={
          <ProtectedRoute>
            <PageSuspense><Scan /></PageSuspense>
          </ProtectedRoute>
        } />
        <Route path="/result/:id" element={
          <ProtectedRoute>
            <ErrorBoundary>
              <PageSuspense><Result /></PageSuspense>
            </ErrorBoundary>
          </ProtectedRoute>
        } />
        <Route path="/history" element={
          <ProtectedRoute>
            <PageSuspense><History /></PageSuspense>
          </ProtectedRoute>
        } />
        <Route path="/garden" element={
          <ProtectedRoute>
            <PageSuspense><Garden /></PageSuspense>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <PageSuspense><Settings /></PageSuspense>
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <ErrorBoundary>
            <AnimatedRoutes />
          </ErrorBoundary>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
