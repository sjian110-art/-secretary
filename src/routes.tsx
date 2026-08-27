import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import EmptyLayout from './layouts/EmptyLayout';

// Import Pages
import SplashPage from './pages/SplashPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import ExpenseWritePage from './pages/ExpenseWritePage';
import ExpenseHistoryPage from './pages/ExpenseHistoryPage';
import ExpensePlanPage from './pages/ExpensePlanPage';
import ChallengePage from './pages/ChallengePage';
import MyPage from './pages/MyPage';
import NotificationPage from './pages/NotificationPage';
import StatisticsPage from './pages/StatisticsPage';
import DailyLogPage from './pages/DailyLogPage';
import BudgetEditPage from './pages/BudgetEditPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import AssistantSettingsPage from './pages/AssistantSettingsPage';
import RoomDecoratePage from './pages/RoomDecoratePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/splash" replace />,
  },
  {
    element: <EmptyLayout />,
    children: [
      { path: 'splash', element: <SplashPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'expense/write', element: <ExpenseWritePage /> },
      { path: 'notification', element: <NotificationPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'mypage/assistant-settings', element: <AssistantSettingsPage /> },
      { path: 'mypage/room', element: <RoomDecoratePage /> },
    ],
  },
  {
    element: <MainLayout />,
    children: [
      { path: 'home', element: <HomePage /> },
      { path: 'expense/history', element: <ExpenseHistoryPage /> },
      { path: 'expense/plan', element: <ExpensePlanPage /> },
      { path: 'challenge', element: <ChallengePage /> },
      { path: 'mypage', element: <MyPage /> },
      { path: 'statistics', element: <StatisticsPage /> },
      { path: 'daily-log', element: <DailyLogPage /> },
      { path: 'expense/plan/edit', element: <BudgetEditPage /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/home" replace />,
  },
]);
export default router;
