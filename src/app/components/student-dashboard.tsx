import { useState, useEffect } from 'react'; 
import { 
  Bell, 
  User, 
  Home, 
  Search, 
  FileText, 
  Upload, 
  Award, 
  ChevronRight, 
  Briefcase,
  MapPin,
  Calendar,
  DollarSign,
  X,
  Linkedin,
  Code,
  TrendingUp,
  ExternalLink,
  Clock,
  Target,
  Zap,
  BookOpen,
  CheckCircle2,
  Download,
  Eye
} from 'lucide-react';
import { AICareerRoadmap } from './ai-career-roadmap';
import { studentService } from '@/services/student';
import { authService } from '@/services/auth';
import { announcementService } from '@/services/announcement';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

// Type definitions
interface StudentProfile {
  name?: string;
  branch?: string;
  year?: string;
  skills?: string[];
  linkedin?: string;
  avatar?: string;
  first_name?: string;
  last_name?: string;
  roll_number?: string;
  email?: string;
  linkedin_url?: string;
  phone?: string;
  address?: string;
  education?: string;
  internship_experience?: string;
  professional_experience?: string;
  resume?: string;
  certifications?: string[];
  internship_report?: {
    file_name?: string;
    file_type?: string;
    file_size?: number;
    data_url?: string;
    uploaded_at?: string;
  } | null;
  employer_feedback?: {
    evaluator_name?: string;
    evaluator_designation?: string;
    technical_skills?: number;
    punctuality?: number;
    teamwork?: number;
    communication?: number;
    problem_solving?: number;
    overall_rating?: number;
    performance?: string;
    remarks?: string;
    submitted_at?: string;
  } | null;
  internship_certificate?: {
    file_name?: string;
    file_type?: string;
    file_size?: number;
    data_url?: string;
    uploaded_at?: string;
    issued_by?: string;
  } | null;
  coordinator_evaluation?: {
    coordinator_name?: string;
    department?: string;
    total_score?: number;
    percentage?: number;
    remarks?: string;
    status?: string;
    evaluated_at?: string;
  } | null;
}

export function StudentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Function to fetch profile
  const fetchStudentProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Force fresh profile so employer/coordinator updates reflect immediately.
      const profile = await studentService.getCurrentProfile(false);
      
      console.log('Profile data from API:', profile);
      console.log('Roll number from API:', profile?.roll_number);
      
      if (profile) {
        // Map API response to component format
        const formattedProfile: StudentProfile = {
          name: profile.user_data ? `${profile.user_data.first_name} ${profile.user_data.last_name}` : 'Student',
          branch: profile.branch || 'Not specified',
          year: profile.year || 'First Year',
          skills: profile.skills || [],
          linkedin: profile.linkedin_url || '',
          avatar: profile.user_data?.first_name ? profile.user_data.first_name.charAt(0) + (profile.user_data.last_name?.charAt(0) || '') : 'ST',
          first_name: profile.user_data?.first_name,
          last_name: profile.user_data?.last_name,
          roll_number: profile.roll_number,
          email: profile.user_data?.email,
          linkedin_url: profile.linkedin_url,
          phone: profile.phone || '',
          address: profile.address || '',
          education: profile.education || '',
          internship_experience: profile.internship_experience || '',
          professional_experience: profile.professional_experience || '',
          resume: profile.resume || '',
          certifications: profile.certifications || [],
          internship_report: profile.internship_report || null,
          employer_feedback: profile.employer_feedback || null,
          internship_certificate: profile.internship_certificate || null,
          coordinator_evaluation: profile.coordinator_evaluation || null
        };
        
        console.log('Formatted profile:', formattedProfile);
        console.log('Roll number in formatted profile:', formattedProfile.roll_number);
        
        setStudentProfile(formattedProfile);
      }
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile');
      // Clear stored auth data and redirect to login if unauthorized
      if (err.response?.status === 401) {
        authService.logout();
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to open profile modal - just opens modal, doesn't refetch
  const handleOpenProfileModal = () => {
    setShowProfileModal(true);
  };

  useEffect(() => {
    fetchStudentProfile();
  }, [navigate]);

  // Refresh profile when returning from edit page
  useEffect(() => {
    if (location.state?.refreshProfile) {
      fetchStudentProfile();
    }
  }, [location]);

  // Fetch announcements
  const fetchAnnouncements = async () => {
    try {
      setAnnouncementsLoading(true);
      const response = await announcementService.getAll();
      
      console.log('[ANNOUNCEMENTS FETCH]');
      console.log('  Student branch:', studentProfile?.branch);
      console.log('  Response:', response);
      
      if (response.announcements) {
        console.log('  Total announcements from API:', response.announcements.length);
        response.announcements.forEach((ann: any, i: number) => {
          console.log(`  [${i+1}] ${ann.title}`);
          console.log(`       target_type: ${ann.target_type}`);
          console.log(`       target_departments: ${JSON.stringify(ann.target_departments)}`);
        });
        
        // Transform API announcements to display format
        const transformedAnnouncements = response.announcements.map((ann: any) => ({
          id: ann._id,
          title: ann.title || ann.internship_details?.company_name || 'Announcement',
          content: ann.content,
          date: ann.created_at ? new Date(ann.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          sender: ann.sender_name,
          priority: ann.priority || 'medium',
          isInternshipPosting: ann.is_internship_posting || false,
          // Internship specific fields
          companyName: ann.internship_details?.company_name,
          role: ann.internship_details?.role,
          duration: ann.internship_details?.duration,
          stipendStatus: ann.internship_details?.is_paid ? 'Paid' : 'Unpaid',
          stipend: ann.internship_details?.stipend,
          location: ann.internship_details?.location,
          mode: ann.internship_details?.mode || 'On-site',
          description: ann.internship_details?.description,
          roleDescription: ann.internship_details?.description ? [ann.internship_details.description] : [],
          eligibility: [],
          applyUrl: '#'
        }));
        
        setFetchedAnnouncements(transformedAnnouncements);
        console.log('  Transformed announcements:', transformedAnnouncements);
      } else {
        setFetchedAnnouncements([]);
      }
    } catch (error) {
      console.error('[ANNOUNCEMENTS FETCH ERROR]:', error);
      // Show empty state if fetch fails
      setFetchedAnnouncements([]);
    } finally {
      setAnnouncementsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

const recommendedInternships = [
  {
    id: 1,
    title: 'Full Stack Developer Intern',
    company: 'TechCorp Solutions',
    companyLogo: 'TC',
    location: 'Mumbai, Maharashtra',
    locationType: 'On-site',
    duration: '3 months',
    stipend: '₹15,000/month',
    stipendType: 'Paid',
    skillMatch: 92,
    aiMatch: 88,
    compatibilityScore: 90,
    skills: ['React', 'Node.js', 'MongoDB'],
    postedDate: '2 days ago',
    deadline: '5 days left',
    description: 'Join our dynamic team to build cutting-edge web applications using modern tech stack. You\'ll work on real-world projects that impact thousands of users.',
    requirements: [
      'Strong foundation in React.js and Node.js',
      'Understanding of RESTful APIs and database design',
      'Good problem-solving skills',
      'Ability to work in an Agile environment'
    ],
    applyUrl: 'https://techcorp.com/careers/intern-fullstack'
  },
  {
    id: 2,
    title: 'ML Engineer Intern',
    company: 'DataVision AI',
    companyLogo: 'DV',
    location: 'Pune, Maharashtra',
    locationType: 'Hybrid',
    duration: '6 months',
    stipend: '₹20,000/month',
    stipendType: 'Paid',
    skillMatch: 85,
    aiMatch: 90,
    compatibilityScore: 88,
    skills: ['Python', 'Machine Learning', 'TensorFlow'],
    postedDate: '1 week ago',
    deadline: '10 days left',
    description: 'Work with our AI research team to develop and deploy machine learning models for computer vision and natural language processing applications.',
    requirements: [
      'Proficiency in Python and ML libraries (Scikit-learn, TensorFlow/PyTorch)',
      'Understanding of neural networks and deep learning concepts',
      'Experience with data preprocessing and model evaluation',
      'Strong mathematical foundation'
    ],
    applyUrl: 'https://datavision.ai/careers/ml-intern'
  },
  {
    id: 3,
    title: 'Backend Developer Intern',
    company: 'CloudBase Systems',
    companyLogo: 'CB',
    location: 'Remote',
    locationType: 'Remote',
    duration: '4 months',
    stipend: '₹18,000/month',
    stipendType: 'Paid',
    skillMatch: 88,
    aiMatch: 82,
    compatibilityScore: 85,
    skills: ['Node.js', 'MySQL', 'AWS'],
    postedDate: '3 days ago',
    deadline: '1 week left',
    description: 'Design and develop scalable backend systems and APIs for cloud-based applications. Learn AWS cloud infrastructure and microservices architecture.',
    requirements: [
      'Experience with Node.js and Express.js',
      'Knowledge of SQL databases and query optimization',
      'Familiarity with cloud platforms (preferably AWS)',
      'Understanding of API design principles'
    ],
    applyUrl: 'https://cloudbase.io/careers/backend-intern'
  }
];

const reminders = [
  {
    id: 1,
    message: 'TechCorp Solutions application closes in 5 days',
    dueDate: '2026-01-29'
  },
  {
    id: 2,
    message: 'Submit Winter Internship Report',
    dueDate: '2026-01-31'
  }
];

const [showProfileModal, setShowProfileModal] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{type: 'resume' | 'certificate', data: string, index?: number} | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'applications'>('home');
  const [uploadedReport, setUploadedReport] = useState<{ file_name: string; uploaded_at?: string } | null>(null);
  const [isUploadingReport, setIsUploadingReport] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState<typeof recommendedInternships[0] | null>(null);
  const [fetchedAnnouncements, setFetchedAnnouncements] = useState<any[]>([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any | null>(null);

  useEffect(() => {
    const existingReport = studentProfile?.internship_report;
    if (existingReport?.file_name) {
      setUploadedReport({
        file_name: existingReport.file_name,
        uploaded_at: existingReport.uploaded_at
      });
    }
  }, [studentProfile?.internship_report]);

  const fileToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File too large. Maximum allowed size is 10MB.');
        return;
      }

      try {
        setIsUploadingReport(true);
        const dataUrl = await fileToDataUrl(file);
        const uploadedAt = new Date().toISOString();

        await studentService.updateProfile({
          internship_report: {
            file_name: file.name,
            file_type: file.type || 'application/octet-stream',
            file_size: file.size,
            data_url: dataUrl,
            uploaded_at: uploadedAt
          }
        });

        setUploadedReport({
          file_name: file.name,
          uploaded_at: uploadedAt
        });

        setStudentProfile((prev) =>
          prev
            ? {
                ...prev,
                internship_report: {
                  file_name: file.name,
                  file_type: file.type || 'application/octet-stream',
                  file_size: file.size,
                  data_url: dataUrl,
                  uploaded_at: uploadedAt
                }
              }
            : prev
        );

        toast.success('Internship report uploaded successfully');
      } catch (error) {
        console.error('Error uploading report:', error);
        toast.error('Failed to upload internship report');
      } finally {
        setIsUploadingReport(false);
      }
    }
  };

  const downloadDocument = (fileData: string, fileName: string) => {
    try {
      const link = document.createElement('a');
      link.href = fileData;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading document:', error);
      // Fallback: open in new tab
      window.open(fileData, '_blank');
    }
  };

  const handleViewDocument = (documentData: string, documentType: 'resume' | 'certificate', index?: number) => {
    setSelectedDocument({ type: documentType, data: documentData, index });
    setShowDocumentViewer(true);
  };

  const getMatchColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-blue-600 bg-blue-50';
    return 'text-orange-600 bg-orange-50';
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return 'border-l-red-500 bg-red-50';
    if (priority === 'medium') return 'border-l-yellow-500 bg-yellow-50';
    return 'border-l-blue-500 bg-blue-50';
  };

  const internshipCertificate = studentProfile?.internship_certificate;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Loading State */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mb-4"></div>
            <p className="text-slate-700 font-medium">Loading your profile...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
          <p className="text-red-800 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Content - Only render if profile is loaded */}
      {!isLoading && !error && studentProfile && (
      <>
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          {/* Profile Avatar - Left */}
          <button
            onClick={handleOpenProfileModal}
            className="flex items-center gap-3 hover:bg-blue-800 rounded-lg p-2 transition-colors flex-shrink-0"
          >
            <div className="w-10 h-10 bg-white text-blue-900 rounded-full flex items-center justify-center font-bold">
              {studentProfile.avatar}
            </div>
            <div className="text-left hidden sm:block">
              <p className="font-semibold text-sm">{studentProfile.name}</p>
              <p className="text-xs text-blue-200">{studentProfile.branch}</p>
            </div>
          </button>

          {/* Title - Center (takes remaining space and centers) */}
          <h1 className="text-lg font-bold text-center flex-1">Student Dashboard</h1>

          {/* Right Section - Bell and Logout */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Reminder Bell */}
            <button
              onClick={() => setShowReminders(!showReminders)}
              className="relative p-2 hover:bg-blue-800 rounded-lg transition-colors"
            >
              <Bell className="w-6 h-6" />
              {reminders.length > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {reminders.length}
                </span>
              )}
            </button>

            {/* Logout Button */}
            <button
              onClick={() => {
                authService.logout();
                window.location.href = '/';
              }}
              className="p-2 hover:bg-red-700 rounded-lg transition-colors font-medium text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Reminders Dropdown */}
        {showReminders && (
          <div className="absolute right-4 top-16 w-80 bg-white text-slate-900 rounded-lg shadow-2xl border border-slate-200 z-50">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold">Reminders</h3>
              <button onClick={() => setShowReminders(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {reminders.map(reminder => (
                <div key={reminder.id} className="p-4 border-b border-slate-100 hover:bg-slate-50">
                  <p className="text-sm font-medium">{reminder.message}</p>
                  <p className="text-xs text-slate-500 mt-1">Due: {new Date(reminder.dueDate).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 pb-24">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-blue-900 to-slate-700 text-white rounded-2xl p-6 mb-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-2">Welcome back, {studentProfile.name?.split(' ')[0]}! 👋</h2>
          <p className="text-blue-100">Discover personalized internship opportunities matched to your skills</p>
        </div>

        {studentProfile.coordinator_evaluation && (
          <section className="mb-8">
            <div className="bg-white rounded-xl p-5 shadow-md border border-emerald-200">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-slate-900">Coordinator Evaluation Result</h2>
                <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                  {studentProfile.coordinator_evaluation.status || 'completed'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <p className="text-xs text-slate-500 mb-1">Score</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {studentProfile.coordinator_evaluation.total_score ?? 0}
                    <span className="text-sm text-slate-500"> / 150</span>
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <p className="text-xs text-slate-500 mb-1">Percentage</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {studentProfile.coordinator_evaluation.percentage ?? 0}%
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <p className="text-xs text-slate-500 mb-1">Evaluated By</p>
                  <p className="text-base font-semibold text-slate-900">
                    {studentProfile.coordinator_evaluation.coordinator_name || 'Department Coordinator'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {studentProfile.coordinator_evaluation.department || studentProfile.branch}
                  </p>
                </div>
              </div>
              {studentProfile.coordinator_evaluation.remarks && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-xs text-blue-700 font-semibold mb-1">Coordinator Remarks</p>
                  <p className="text-sm text-slate-700">{studentProfile.coordinator_evaluation.remarks}</p>
                </div>
              )}
            </div>
          </section>
        )}
        {/* Official Announcements */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900">Official Announcements</h2>
            <button className="text-blue-900 text-sm font-medium hover:underline">View All</button>
          </div>
          <div className="space-y-3">
            {announcementsLoading ? (
              <div className="text-center py-8 text-slate-500">Loading announcements...</div>
            ) : fetchedAnnouncements.length > 0 ? (
              fetchedAnnouncements.map(announcement => (
                <div
                  key={announcement.id}
                  onClick={() => announcement.isInternshipPosting && setSelectedAnnouncement(announcement)}
                  className={`bg-white rounded-xl p-4 shadow-md border-l-4 ${getPriorityColor(announcement.priority)} hover:shadow-lg transition-all ${
                    announcement.isInternshipPosting ? 'cursor-pointer' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 mb-1">{announcement.title}</h3>
                      <p className="text-sm text-slate-600 mb-2">{announcement.content}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>📢 {announcement.sender}</span>
                        <span>📅 {new Date(announcement.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 flex-shrink-0 ${
                    announcement.isInternshipPosting ? 'text-blue-900' : 'text-slate-400'
                  }`} />
                </div>
              </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500">
                No announcements available yet
              </div>
            )}
          </div>
        </section>

        {/* Hybrid Recommendation Section */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-6 h-6 text-blue-900" />
            <h2 className="text-xl font-bold text-slate-900">Personalized For You</h2>
            <span className="text-xs bg-blue-900 text-white px-2 py-1 rounded-full font-medium">AI Powered</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedInternships.map(internship => (
              <div
                key={internship.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-slate-200 overflow-hidden"
              >
                {/* Compatibility Score Badge */}
                <div className="bg-gradient-to-r from-blue-900 to-slate-700 p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium">YOUR MATCH</span>
                    <span className={`text-2xl font-bold`}>{internship.compatibilityScore}%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white/20 rounded px-2 py-1">
                      <div className="font-medium">Skill Match</div>
                      <div className="font-bold">{internship.skillMatch}%</div>
                    </div>
                    <div className="bg-white/20 rounded px-2 py-1">
                      <div className="font-medium">AI Match</div>
                      <div className="font-bold">{internship.aiMatch}%</div>
                    </div>
                  </div>
                </div>

                {/* Internship Details */}
                <div className="p-4">
                  <h3 className="font-bold text-slate-900 mb-1">{internship.title}</h3>
                  <p className="text-sm text-slate-600 font-medium mb-3">{internship.company}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <MapPin className="w-4 h-4" />
                      <span>{internship.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <Calendar className="w-4 h-4" />
                      <span>{internship.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                      <DollarSign className="w-4 h-4" />
                      <span>{internship.stipend}</span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {internship.skills.map((skill, idx) => (
                      <span key={idx} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-500">{internship.postedDate}</span>
                    <span className="text-xs font-medium text-red-600">{internship.deadline}</span>
                  </div>

                  <button 
                    onClick={() => setSelectedInternship(internship)}
                    className="w-full mt-3 bg-blue-900 text-white py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI Career Roadmap - Integrated */}
        <AICareerRoadmap />

        {/* Post-Internship & Documentation */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Certificate Gallery */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-6 h-6 text-blue-900" />
              <h3 className="text-lg font-bold text-slate-900">Completion Certificates</h3>
            </div>

            {internshipCertificate?.data_url ? (
              <div className="space-y-3">
                <div className="border border-slate-200 rounded-lg p-4 hover:border-blue-900 transition-colors relative">
                  <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    New
                  </span>
                  <h4 className="font-bold text-slate-900 mb-1">Internship Completion Certificate</h4>
                  <p className="text-sm text-slate-600 mb-2">{internshipCertificate.issued_by || 'Employer'}</p>
                  <p className="text-xs text-slate-500 mb-3">
                    Uploaded: {internshipCertificate.uploaded_at ? new Date(internshipCertificate.uploaded_at).toLocaleString() : 'N/A'}
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleViewDocument(internshipCertificate.data_url!, 'certificate', 0)}
                      className="text-blue-900 text-sm font-medium hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      View Certificate
                    </button>
                    <button
                      onClick={() => downloadDocument(internshipCertificate.data_url!, internshipCertificate.file_name || 'internship_certificate')}
                      className="text-blue-900 text-sm font-medium hover:underline flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Award className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No certificates yet</p>
              </div>
            )}
          </div>

          {/* Report Upload */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 mb-4">
              <Upload className="w-6 h-6 text-blue-900" />
              <h3 className="text-lg font-bold text-slate-900">Internship Report</h3>
            </div>

            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-900 transition-colors">
              <Upload className="w-12 h-12 mx-auto mb-3 text-slate-400" />
              <h4 className="font-medium text-slate-900 mb-2">Upload Final Internship Report</h4>
              <p className="text-xs text-slate-500 mb-4">
                PDF, DOC, DOCX (Max 10MB)
                <br />
                Will be reflected on Coordinator's dashboard
              </p>

              <input
                type="file"
                id="report-upload"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                disabled={isUploadingReport}
                className="hidden"
              />
              <label
                htmlFor="report-upload"
                className="inline-block bg-blue-900 text-white px-6 py-2 rounded-lg font-medium cursor-pointer hover:bg-blue-800 transition-colors"
              >{isUploadingReport ? 'Uploading...' : 'Choose File'}</label>

              {uploadedReport && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">
                    [OK] {uploadedReport.file_name} uploaded successfully
                  </p>
                  {uploadedReport.uploaded_at && (
                    <p className="text-xs text-green-700 mt-1">
                      Uploaded: {new Date(uploadedReport.uploaded_at).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-xs text-slate-600">
                <strong>Note:</strong> Your report will be automatically sent to your Department Coordinator for evaluation.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'home' ? 'text-blue-900 bg-blue-50' : 'text-slate-600 hover:text-blue-900'
              }`}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Home</span>
            </button>

            <button
              onClick={() => setActiveTab('search')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'search' ? 'text-blue-900 bg-blue-50' : 'text-slate-600 hover:text-blue-900'
              }`}
            >
              <Search className="w-6 h-6" />
              <span className="text-xs font-medium">Search</span>
            </button>

            <button
              onClick={() => setActiveTab('applications')}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'applications' ? 'text-blue-900 bg-blue-50' : 'text-slate-600 hover:text-blue-900'
              }`}
            >
              <Briefcase className="w-6 h-6" />
              <span className="text-xs font-medium">Applications</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900 to-slate-700 text-white p-6 rounded-t-2xl flex-shrink-0">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white text-blue-900 rounded-full flex items-center justify-center font-bold text-2xl">
                    {studentProfile.avatar}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{studentProfile.name}</h3>
                    <p className="text-blue-100 text-sm">{studentProfile.branch} • {studentProfile.year}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowProfileModal(false)}
                  className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors flex-shrink-0"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Body - Scrollable */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Basic Information */}
              <div className="space-y-5">
                <div className="grid grid-cols-3 gap-5">
                  {/* Branch */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Branch</label>
                    <p className="text-slate-900 font-bold text-lg mt-2">{studentProfile.branch}</p>
                  </div>

                  {/* Year */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Year</label>
                    <p className="text-slate-900 font-bold text-lg mt-2">{studentProfile.year || 'N/A'}</p>
                  </div>

                  {/* Roll Number */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Roll Number</label>
                    <p className="text-slate-900 font-bold text-lg mt-2">{studentProfile.roll_number || 'N/A'}</p>
                  </div>

                  {/* Email */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Email</label>
                    <p className="text-slate-900 font-bold text-sm mt-2 break-all">{studentProfile.email || 'N/A'}</p>
                  </div>

                  {/* Phone */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wide">Phone</label>
                    <p className="text-slate-900 font-bold text-lg mt-2">{studentProfile.phone || 'N/A'}</p>
                  </div>
                </div>

                {/* Address */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2 block">Address</label>
                  <p className="text-slate-900 font-medium">{studentProfile.address || 'Not provided'}</p>
                </div>

                {/* Education */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2 block">Education Qualification</label>
                  <p className="text-slate-900 font-medium">{studentProfile.education || 'Not provided'}</p>
                </div>
              </div>

              {/* Skills */}
              <div className="border-t border-slate-200 pt-5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-3 block">Technical Skills</label>
                <div className="flex flex-wrap gap-2">
                  {studentProfile.skills && studentProfile.skills.length > 0 ? (
                    studentProfile.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-900 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2"
                      >
                        <Code className="w-4 h-4" />
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-slate-500 text-sm italic">No skills added</p>
                  )}
                </div>
              </div>

              {/* Internship Experience */}
              <div className="border-t border-slate-200 pt-5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2 block">Internship Experience</label>
                <p className="text-slate-900 font-medium bg-slate-50 p-4 rounded-lg border border-slate-200">{studentProfile.internship_experience || 'No internship experience provided'}</p>
              </div>

              {/* Professional Experience */}
              <div className="border-t border-slate-200 pt-5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2 block">Professional Experience</label>
                <p className="text-slate-900 font-medium bg-slate-50 p-4 rounded-lg border border-slate-200">{studentProfile.professional_experience || 'No professional experience provided'}</p>
              </div>

              {/* LinkedIn */}
              <div className="border-t border-slate-200 pt-5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-2 block">LinkedIn Profile</label>
                {studentProfile.linkedin_url ? (
                  <a
                    href={studentProfile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white bg-blue-900 hover:bg-blue-800 font-bold px-4 py-2 rounded-lg flex items-center gap-2 w-fit transition"
                  >
                    <Linkedin className="w-5 h-5" />
                    View Profile
                  </a>
                ) : (
                  <p className="text-slate-500 text-sm italic bg-slate-50 p-4 rounded-lg border border-slate-200">No LinkedIn profile added</p>
                )}
              </div>

              {/* Documents Section */}
              <div className="border-t border-slate-200 pt-5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wide mb-3 block">Uploaded Documents</label>
                <div className="space-y-3">
                  {/* Resume */}
                  <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:border-blue-400 transition cursor-pointer">
                    <FileText className="w-6 h-6 text-blue-900 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900">Resume</p>
                      <p className="text-xs text-slate-600">{studentProfile.resume ? '✓ Uploaded' : '✗ Not uploaded'}</p>
                    </div>
                    {studentProfile.resume && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDocument(studentProfile.resume!, 'resume')}
                          className="text-blue-900 hover:text-blue-700 font-bold transition p-1"
                          title="View Resume"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => downloadDocument(studentProfile.resume!, 'resume.pdf')}
                          className="text-blue-900 hover:text-blue-700 font-bold transition p-1"
                          title="Download Resume"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Certifications */}
                  {studentProfile.certifications && studentProfile.certifications.length > 0 && (
                    <div>
                      <p className="text-sm font-bold text-slate-900 mb-3">Certifications ({studentProfile.certifications.length})</p>
                      <div className="space-y-2">
                        {studentProfile.certifications.map((cert, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg hover:border-green-400 transition cursor-pointer">
                            <Award className="w-6 h-6 text-green-700 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm font-bold text-slate-900">Certificate {idx + 1}</p>
                              <p className="text-xs text-slate-600">✓ Uploaded</p>
                            </div>
                            {cert && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleViewDocument(cert, 'certificate', idx)}
                                  className="text-green-700 hover:text-green-900 font-bold transition p-1"
                                  title="View Certificate"
                                >
                                  <Eye className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => downloadDocument(cert, `certificate_${idx + 1}.pdf`)}
                                  className="text-green-700 hover:text-green-900 font-bold transition p-1"
                                  title="Download Certificate"
                                >
                                  <Download className="w-5 h-5" />
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {studentProfile.internship_certificate?.data_url && (
                    <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg hover:border-emerald-400 transition cursor-pointer">
                      <Award className="w-6 h-6 text-emerald-700 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900">Internship Completion Certificate</p>
                        <p className="text-xs text-slate-600">
                          Uploaded by: {studentProfile.internship_certificate.issued_by || 'Employer'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDocument(studentProfile.internship_certificate!.data_url!, 'certificate', 0)}
                          className="text-emerald-700 hover:text-emerald-900 font-bold transition p-1"
                          title="View Certificate"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() =>
                            downloadDocument(
                              studentProfile.internship_certificate!.data_url!,
                              studentProfile.internship_certificate?.file_name || 'internship_certificate'
                            )
                          }
                          className="text-emerald-700 hover:text-emerald-900 font-bold transition p-1"
                          title="Download Certificate"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {!studentProfile.resume &&
                    (!studentProfile.certifications || studentProfile.certifications.length === 0) &&
                    !studentProfile.internship_certificate?.data_url && (
                    <p className="text-slate-500 text-sm italic bg-slate-50 p-4 rounded-lg border border-slate-200">No documents uploaded</p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions - Sticky Footer */}
            <div className="border-t border-slate-200 p-6 flex gap-3 flex-shrink-0 bg-white rounded-b-2xl">
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  navigate('/student/edit-profile');
                }}
                className="flex-1 bg-blue-900 text-white py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors"
              >
                Edit Profile
              </button>
              <button
                onClick={() => setShowProfileModal(false)}
                className="flex-1 bg-slate-100 text-slate-700 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Internship Detail Modal */}
      {selectedInternship && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl my-8">
            {/* Header with Company Logo and Title */}
            <div className="bg-gradient-to-r from-blue-900 to-slate-700 p-6 rounded-t-2xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center font-bold text-blue-900 text-xl shadow-md">
                    {selectedInternship.companyLogo}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedInternship.company}</h2>
                    <p className="text-blue-100">{selectedInternship.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedInternship(null)}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Match Score */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center justify-between text-white">
                  <span className="text-sm font-medium">Your Match Score</span>
                  <span className="text-2xl font-bold">{selectedInternship.compatibilityScore}%</span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-900 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-medium">Duration</p>
                    <p className="text-sm font-bold text-slate-900">{selectedInternship.duration}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-medium">Stipend</p>
                    <p className="text-sm font-bold text-slate-900">{selectedInternship.stipendType}</p>
                    <p className="text-xs text-slate-600">{selectedInternship.stipend}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-medium">Location</p>
                    <p className="text-sm font-bold text-slate-900">{selectedInternship.locationType}</p>
                    <p className="text-xs text-slate-600">{selectedInternship.location}</p>
                  </div>
                </div>
              </div>

              {/* About the Role */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-900" />
                  About the Role
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">{selectedInternship.description}</p>
              </div>

              {/* Requirements */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-900" />
                  Requirements
                </h3>
                <ul className="space-y-2">
                  {selectedInternship.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="w-1.5 h-1.5 bg-blue-900 rounded-full mt-1.5 flex-shrink-0"></span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Required Skills */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-500 uppercase mb-2">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedInternship.skills.map((skill, idx) => (
                    <span key={idx} className="bg-blue-50 text-blue-900 px-3 py-1.5 rounded-lg text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Application Deadline */}
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                <div className="flex items-center gap-2 text-red-700">
                  <Clock className="w-5 h-5" />
                  <div>
                    <p className="font-medium text-sm">Application Deadline</p>
                    <p className="text-xs">{selectedInternship.deadline}</p>
                  </div>
                </div>
              </div>

              {/* Apply Now Button */}
              <div className="border-t border-slate-200 pt-6">
                <a
                  href={selectedInternship.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-blue-900 text-white py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <span>Apply Now</span>
                  <ExternalLink className="w-5 h-5" />
                </a>
                <p className="text-xs text-slate-500 text-center mt-3">
                  <strong>Note:</strong> Clicking will redirect you to the Company's Official Portal.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Announcement Detail Modal */}
      {selectedAnnouncement && selectedAnnouncement.isInternshipPosting && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl my-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900 to-slate-700 p-6 rounded-t-2xl">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                      📢 Official Announcement
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-1">{selectedAnnouncement.companyName}</h2>
                  <p className="text-lg text-blue-100">{selectedAnnouncement.role}</p>
                </div>
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Sender Info */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white text-sm">
                  <User className="w-4 h-4" />
                  <span className="font-medium">Posted by: {selectedAnnouncement.sender}</span>
                </div>
                <span className="text-xs text-blue-100">
                  {new Date(selectedAnnouncement.date).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 max-h-[65vh] overflow-y-auto">
              {/* Basic Information Grid */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-500 uppercase mb-3 tracking-wide">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="w-10 h-10 bg-blue-900 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-medium">Duration</p>
                      <p className="text-sm font-bold text-slate-900">{selectedAnnouncement.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="w-10 h-10 bg-green-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-medium">Stipend Status</p>
                      <p className="text-sm font-bold text-slate-900">{selectedAnnouncement.stipendStatus}</p>
                      <p className="text-xs text-slate-600">{selectedAnnouncement.stipend}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="w-10 h-10 bg-purple-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-medium">Mode</p>
                      <p className="text-sm font-bold text-slate-900">{selectedAnnouncement.mode}</p>
                      <p className="text-xs text-slate-600">{selectedAnnouncement.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Role Description */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-900" />
                  Role Description
                </h3>
                <ul className="space-y-2.5">
                  {selectedAnnouncement.roleDescription?.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                      <span className="w-6 h-6 bg-blue-900 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="pt-0.5">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Eligibility Criteria */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-900" />
                  Eligibility Criteria
                </h3>
                <ul className="space-y-2.5">
                  {selectedAnnouncement.eligibility?.map((criterion, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                      <div className="w-5 h-5 bg-green-100 text-green-700 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="pt-0.5">{criterion}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Apply Now Section */}
              <div className="border-t border-slate-200 pt-6">
                <a
                  href={selectedAnnouncement.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-blue-900 text-white py-3.5 rounded-lg font-bold hover:bg-blue-800 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl text-base"
                >
                  <span>Apply Now</span>
                  <ExternalLink className="w-5 h-5" />
                </a>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-slate-700 text-center">
                    <strong className="text-blue-900">Important:</strong> Clicking "Apply" will redirect you to the official company portal for the time being.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {showDocumentViewer && selectedDocument && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900 to-slate-700 text-white p-6 rounded-t-2xl flex-shrink-0 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">
                  {selectedDocument.type === 'resume' ? 'Resume' : `Certificate ${(selectedDocument.index || 0) + 1}`}
                </h3>
                <p className="text-blue-100 text-sm">Document Viewer</p>
              </div>
              <button
                onClick={() => setShowDocumentViewer(false)}
                className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1">
              {selectedDocument.data.startsWith('data:') ? (
                // For Base64 encoded files, show viewer or message
                <div className="flex flex-col items-center justify-center h-full">
                  <FileText className="w-16 h-16 text-slate-400 mb-4" />
                  <p className="text-slate-700 font-medium mb-4 text-center">
                    {selectedDocument.type === 'resume' ? 'Your Resume' : `Certificate ${(selectedDocument.index || 0) + 1}`}
                  </p>
                  <p className="text-slate-500 text-sm text-center mb-6">
                    The document is being displayed. You can download it to view the full details.
                  </p>
                  <button
                    onClick={() => {
                      downloadDocument(
                        selectedDocument.data,
                        selectedDocument.type === 'resume' ? 'resume.pdf' : `certificate_${(selectedDocument.index || 0) + 1}.pdf`
                      );
                    }}
                    className="bg-blue-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download {selectedDocument.type === 'resume' ? 'Resume' : 'Certificate'}
                  </button>
                </div>
              ) : null}
            </div>

            {/* Footer Actions */}
            <div className="border-t border-slate-200 p-6 flex gap-3 flex-shrink-0 bg-white rounded-b-2xl">
              <button
                onClick={() => {
                  downloadDocument(
                    selectedDocument.data,
                    selectedDocument.type === 'resume' ? 'resume.pdf' : `certificate_${(selectedDocument.index || 0) + 1}.pdf`
                  );
                }}
                className="flex-1 bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download
              </button>
              <button
                onClick={() => setShowDocumentViewer(false)}
                className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
}



