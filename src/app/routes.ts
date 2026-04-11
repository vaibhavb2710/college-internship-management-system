import { createBrowserRouter } from 'react-router-dom';
import { Login } from '@/app/components/login';
import { ForgotPassword } from '@/app/components/forgot-password';
import { NotFound } from '@/app/components/not-found';
import { StudentDashboard } from '@/app/components/student-dashboard';
import { StudentEditProfile } from '@/app/components/student-edit-profile';
import { AdminDashboard } from '@/app/components/admin-dashboard';
import CoordinatorDashboard from '@/app/components/coordinator-dashboard';
import EmployerDashboard from '@/app/components/employer-dashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Login,
  },
  {
    path: '/register',
    lazy: () => import('@/app/components/register').then(module => ({ Component: module.Register })),
  },
  {
    path: '/student/dashboard',
    Component: StudentDashboard,
  },
  {
    path: '/student/edit-profile',
    Component: StudentEditProfile,
  },
  {
    path: '/admin/dashboard',
    Component: AdminDashboard,
  },
  {
    path: '/coordinator/dashboard',
    Component: CoordinatorDashboard,
  },
  {
    path: '/employer/dashboard',
    Component: EmployerDashboard,
  },
  {
    path: '/forgot-password',
    Component: ForgotPassword,
  },
  {
    path: '*',
    Component: NotFound,
  },
]);