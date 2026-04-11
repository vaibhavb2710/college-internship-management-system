import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Building2, Loader, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '@/services/auth';

type UserRole = 'student' | 'admin' | 'coordinator' | 'employer';

export function Login() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const roles: { value: UserRole; label: string }[] = [
    { value: 'student', label: 'Student' },
    { value: 'admin', label: 'Institute Admin' },
    { value: 'coordinator', label: 'Department Coordinator' },
    { value: 'employer', label: 'Employer' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    
    if (!formData.email || !formData.password) {
      const message = 'Please enter email and password';
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    // Validate student email domain
    if (selectedRole === 'student' && !formData.email.toLowerCase().endsWith('@vit.edu.in')) {
      const message = 'Students must login with a valid @vit.edu.in email address';
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    setIsLoading(true);
    try {
      await authService.login(formData.email, formData.password, selectedRole);
      toast.success('Login successful');
      
      // Navigate to role-specific dashboard
      if (selectedRole === 'student') {
        navigate('/student/dashboard');
      } else if (selectedRole === 'admin') {
        navigate('/admin/dashboard');
      } else if (selectedRole === 'coordinator') {
        navigate('/coordinator/dashboard');
      } else if (selectedRole === 'employer') {
        navigate('/employer/dashboard');
      }
    } catch (error: any) {
      const message = error.response?.data?.error || 'Login failed';
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isStudent = selectedRole === 'student';
  const emailLabel = isStudent ? 'Email' : 'Official ID / Email';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-900 rounded-2xl mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Internship Management
          </h1>
          <p className="text-slate-600">Vidyalankar Institute of Technology</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Role Selector */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
              {roles.map((role) => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => setSelectedRole(role.value)}
                  className={`px-3 py-2.5 text-sm font-medium rounded-md transition-all ${
                    selectedRole === role.value
                      ? 'bg-blue-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email/ID Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                {emailLabel}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {isStudent ? (
                    <Mail className="h-5 w-5 text-slate-400" />
                  ) : (
                    <User className="h-5 w-5 text-slate-400" />
                  )}
                </div>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition"
                  placeholder={isStudent ? 'your.email@vit.edu.in' : 'Enter your ID or email'}
                  required
                />
              </div>
              {isStudent && (
                <p className="text-xs text-slate-500 mt-1">Please use your VIT college email address (@vit.edu.in)</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-900 hover:text-blue-700 font-medium transition"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Error Message Display */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-3">
                <div className="flex-shrink-0 pt-0.5">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-red-700 font-medium">{errorMessage}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-900 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 transition shadow-lg shadow-blue-900/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <Loader className="w-5 h-5 animate-spin" />}
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Register Link - Only for Students */}
          {isStudent && (
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                New Student?{' '}
                <Link
                  to="/register"
                  className="text-blue-900 hover:text-blue-700 font-semibold transition"
                >
                  Create Account
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500 mt-6">
          © 2026 Vidyalankar Institute of Technology
        </p>
      </div>
    </div>
  );
}