import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Shell from './components/Shell';
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Plan = lazy(() => import('./pages/Plan'));
const Calendar = lazy(() => import('./pages/Calendar'));
const Pulse = lazy(() => import('./pages/Pulse'));
const Channel = lazy(() => import('./pages/Channel'));
export default function App() {
  return (
    <Shell>
      <Suspense fallback={<div className="skeleton" aria-label="Loading workspace" />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/plan/:tab" element={<Plan />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/pulse" element={<Pulse />} />
          <Route path="/pulse/:channelId" element={<Channel />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Shell>
  );
}
