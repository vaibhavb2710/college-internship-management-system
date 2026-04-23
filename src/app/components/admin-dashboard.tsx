import { useState, useEffect, useRef } from 'react';
import {
  Bell,
  Home,
  Users,
  Building2,
  Megaphone,
  LogOut,
  ChevronDown,
  TrendingUp,
  Briefcase,
  DollarSign,
  GraduationCap,
  BarChart3,
  PlusCircle,
  FileDown,
  Award,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Switch } from '@/app/components/ui/switch';
import { Checkbox } from '@/app/components/ui/checkbox';
import { toast } from 'sonner';
import { adminService } from '@/services/admin';
import { announcementService } from '@/services/announcement';

// Admin Profile Data

const adminProfile = {
  name: 'Amit Alyani',
  role: 'Institute Internship Coordinator',
  email: 'amit.alyani@vit.edu.in',
  avatar: 'AA',
};

// Mock Statistics Data
const instituteStats = {
  'Entire Institute': {
    totalStudents: {
      total: 2450,
      breakdown: [
        { branch: 'CMPN', count: 680, percentage: 28 },
        { branch: 'INFT', count: 520, percentage: 21 },
        { branch: 'EXTC', count: 480, percentage: 20 },
        { branch: 'EXCS', count: 420, percentage: 17 },
        { branch: 'BIOMED', count: 350, percentage: 14 },
      ],
    },
    totalRegistered: {
      total: 1876,
      breakdown: [
        {
          skill: 'Web Development',
          count: 645,
          percentage: 34,
        },
        { skill: 'Data Science', count: 432, percentage: 23 },
        {
          skill: 'Mobile Development',
          count: 378,
          percentage: 20,
        },
        {
          skill: 'Cloud Computing',
          count: 289,
          percentage: 15,
        },
        { skill: 'IoT', count: 132, percentage: 7 },
      ],
    },
    internshipsAvailable: {
      total: 142,
      breakdown: [
        { company: 'TCS', count: 28, percentage: 20 },
        { company: 'Infosys', count: 24, percentage: 17 },
        { company: 'Wipro', count: 20, percentage: 14 },
        { company: 'Tech Mahindra', count: 18, percentage: 13 },
        { company: 'Others', count: 52, percentage: 37 },
      ],
    },
    paymentStatus: {
      paid: 98,
      unpaid: 44,
      paidPercentage: 69,
      unpaidPercentage: 31,
    },
  },
  CMPN: {
    totalStudents: {
      total: 680,
      breakdown: [{ branch: 'CMPN', count: 680, percentage: 100 }],
    },
    totalRegistered: {
      total: 542,
      breakdown: [
        {
          skill: 'Web Development',
          count: 215,
          percentage: 40,
        },
        { skill: 'Data Science', count: 162, percentage: 30 },
        {
          skill: 'Mobile Development',
          count: 108,
          percentage: 20,
        },
        { skill: 'Cloud Computing', count: 43, percentage: 8 },
        { skill: 'IoT', count: 14, percentage: 3 },
      ],
    },
    internshipsAvailable: {
      total: 45,
      breakdown: [
        { company: 'TCS', count: 10, percentage: 22 },
        { company: 'Infosys', count: 8, percentage: 18 },
        { company: 'Wipro', count: 7, percentage: 16 },
        { company: 'Tech Mahindra', count: 6, percentage: 13 },
        { company: 'Others', count: 14, percentage: 31 },
      ],
    },
    paymentStatus: {
      paid: 32,
      unpaid: 13,
      paidPercentage: 71,
      unpaidPercentage: 29,
    },
  },
  INFT: {
    totalStudents: {
      total: 520,
      breakdown: [{ branch: 'INFT', count: 520, percentage: 100 }],
    },
    totalRegistered: {
      total: 432,
      breakdown: [
        {
          skill: 'Web Development',
          count: 173,
          percentage: 40,
        },
        { skill: 'Data Science', count: 130, percentage: 30 },
        {
          skill: 'Mobile Development',
          count: 86,
          percentage: 20,
        },
        { skill: 'Cloud Computing', count: 34, percentage: 8 },
        { skill: 'IoT', count: 9, percentage: 2 },
      ],
    },
    internshipsAvailable: {
      total: 38,
      breakdown: [
        { company: 'TCS', count: 8, percentage: 21 },
        { company: 'Infosys', count: 7, percentage: 18 },
        { company: 'Wipro', count: 6, percentage: 16 },
        { company: 'Tech Mahindra', count: 5, percentage: 13 },
        { company: 'Others', count: 12, percentage: 32 },
      ],
    },
    paymentStatus: {
      paid: 27,
      unpaid: 11,
      paidPercentage: 71,
      unpaidPercentage: 29,
    },
  },
  EXTC: {
    totalStudents: {
      total: 480,
      breakdown: [{ branch: 'EXTC', count: 480, percentage: 100 }],
    },
    totalRegistered: {
      total: 368,
      breakdown: [
        { skill: 'IoT', count: 110, percentage: 30 },
        {
          skill: 'Embedded Systems',
          count: 92,
          percentage: 25,
        },
        { skill: 'Web Development', count: 88, percentage: 24 },
        {
          skill: 'Signal Processing',
          count: 51,
          percentage: 14,
        },
        { skill: 'Cloud Computing', count: 27, percentage: 7 },
      ],
    },
    internshipsAvailable: {
      total: 28,
      breakdown: [
        { company: 'TCS', count: 6, percentage: 21 },
        { company: 'Infosys', count: 5, percentage: 18 },
        { company: 'L&T', count: 5, percentage: 18 },
        { company: 'Siemens', count: 4, percentage: 14 },
        { company: 'Others', count: 8, percentage: 29 },
      ],
    },
    paymentStatus: {
      paid: 19,
      unpaid: 9,
      paidPercentage: 68,
      unpaidPercentage: 32,
    },
  },
  EXCS: {
    totalStudents: {
      total: 420,
      breakdown: [{ branch: 'EXCS', count: 420, percentage: 100 }],
    },
    totalRegistered: {
      total: 312,
      breakdown: [
        { skill: 'Web Development', count: 94, percentage: 30 },
        { skill: 'Data Science', count: 78, percentage: 25 },
        { skill: 'Cybersecurity', count: 69, percentage: 22 },
        { skill: 'Cloud Computing', count: 47, percentage: 15 },
        {
          skill: 'Mobile Development',
          count: 24,
          percentage: 8,
        },
      ],
    },
    internshipsAvailable: {
      total: 20,
      breakdown: [
        { company: 'Infosys', count: 4, percentage: 20 },
        { company: 'TCS', count: 4, percentage: 20 },
        { company: 'Wipro', count: 3, percentage: 15 },
        { company: 'Accenture', count: 3, percentage: 15 },
        { company: 'Others', count: 6, percentage: 30 },
      ],
    },
    paymentStatus: {
      paid: 13,
      unpaid: 7,
      paidPercentage: 65,
      unpaidPercentage: 35,
    },
  },
  BIOMED: {
    totalStudents: {
      total: 350,
      breakdown: [{ branch: 'BIOMED', count: 350, percentage: 100 }],
    },
    totalRegistered: {
      total: 222,
      breakdown: [
        { skill: 'Medical Devices', count: 67, percentage: 30 },
        { skill: 'Healthcare IT', count: 56, percentage: 25 },
        {
          skill: 'Biomedical Research',
          count: 44,
          percentage: 20,
        },
        {
          skill: 'Signal Processing',
          count: 33,
          percentage: 15,
        },
        { skill: 'Data Analytics', count: 22, percentage: 10 },
      ],
    },
    internshipsAvailable: {
      total: 11,
      breakdown: [
        {
          company: 'Siemens Healthineers',
          count: 3,
          percentage: 27,
        },
        {
          company: 'Philips Healthcare',
          count: 2,
          percentage: 18,
        },
        { company: 'GE Healthcare', count: 2, percentage: 18 },
        { company: 'Medtronic', count: 1, percentage: 9 },
        { company: 'Others', count: 3, percentage: 27 },
      ],
    },
    paymentStatus: {
      paid: 7,
      unpaid: 4,
      paidPercentage: 64,
      unpaidPercentage: 36,
    },
  },
};

// Department-wise Report Data
const departmentReportData = [
  {
    department: 'CMPN',
    totalStudents: 680,
    placed: 542,
    unplaced: 138,
  },
  {
    department: 'INFT',
    totalStudents: 520,
    placed: 398,
    unplaced: 122,
  },
  {
    department: 'EXTC',
    totalStudents: 480,
    placed: 365,
    unplaced: 115,
  },
  {
    department: 'EXCS',
    totalStudents: 420,
    placed: 312,
    unplaced: 108,
  },
  {
    department: 'BIOMED',
    totalStudents: 350,
    placed: 259,
    unplaced: 91,
  },
];

const departmentStudentList = [
  {
    id: 1,
    name: 'Rahul Sharma',
    branch: 'CMPN',
    year: 'Third Year',
    status: 'Placed',
    company: 'TCS',
  },
  {
    id: 2,
    name: 'Priya Desai',
    branch: 'INFT',
    year: 'Final Year',
    status: 'Placed',
    company: 'Infosys',
  },
  {
    id: 3,
    name: 'Amit Patel',
    branch: 'EXTC',
    year: 'Third Year',
    status: 'Unplaced',
    company: '-',
  },
  {
    id: 4,
    name: 'Sneha Kulkarni',
    branch: 'CMPN',
    year: 'Final Year',
    status: 'Placed',
    company: 'Wipro',
  },
  {
    id: 5,
    name: 'Rohan Joshi',
    branch: 'EXCS',
    year: 'Third Year',
    status: 'Placed',
    company: 'Tech Mahindra',
  },
  {
    id: 6,
    name: 'Neha Singh',
    branch: 'BIOMED',
    year: 'Final Year',
    status: 'Unplaced',
    company: '-',
  },
  {
    id: 7,
    name: 'Karthik Rao',
    branch: 'INFT',
    year: 'Third Year',
    status: 'Placed',
    company: 'Accenture',
  },
  {
    id: 8,
    name: 'Divya Menon',
    branch: 'CMPN',
    year: 'Final Year',
    status: 'Placed',
    company: 'Google',
  },
];

// Year-wise Report Data
const yearwiseData = [
  {
    year: '2023',
    registrations: 1245,
    placements: 876,
    placementRate: 70,
  },
  {
    year: '2024',
    registrations: 1432,
    placements: 1018,
    placementRate: 71,
  },
  {
    year: '2025',
    registrations: 1654,
    placements: 1243,
    placementRate: 75,
  },
  {
    year: '2026',
    registrations: 1876,
    placements: 1426,
    placementRate: 76,
  },
];

// Company-wise Report Data
const topRecruiters = [
  {
    id: 1,
    company: 'TCS',
    logo: 'TCS',
    studentsHired: 245,
    feedbackAverage: 4.5,
    avgStipend: '₹21,000',
    activePosts: 28,
  },
  {
    id: 2,
    company: 'Infosys',
    logo: 'INF',
    studentsHired: 198,
    feedbackAverage: 4.3,
    avgStipend: '₹25,000',
    activePosts: 24,
  },
  {
    id: 3,
    company: 'Wipro',
    logo: 'WIP',
    studentsHired: 167,
    feedbackAverage: 4.2,
    avgStipend: '₹18,000',
    activePosts: 20,
  },
  {
    id: 4,
    company: 'Tech Mahindra',
    logo: 'TM',
    studentsHired: 142,
    feedbackAverage: 4.1,
    avgStipend: '₹20,000',
    activePosts: 18,
  },
  {
    id: 5,
    company: 'Accenture',
    logo: 'ACC',
    studentsHired: 128,
    feedbackAverage: 4.4,
    avgStipend: '₹22,000',
    activePosts: 15,
  },
];

export function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'analysis'
    | 'companies'
    | 'announcements'
    | 'intercollegeAnnouncements'
  >('dashboard');
  const [selectedDepartment, setSelectedDepartment] =
    useState<string>('Entire Institute');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationCount] = useState(3);
  const [analysisReportType, setAnalysisReportType] = useState<
    'department' | 'year' | 'company'
  >('department');
  const [fetchedStudents, setFetchedStudents] = useState<any[]>([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);

  const departmentSectionRef = useRef(null);
  const departmentSectionRefIntercollege = useRef(null);

  // Announcement Form State
  const [announcementForm, setAnnouncementForm] = useState({
    companyName: '',
    role: '',
    isPaid: true,
    stipend: '',
    duration: '',
    location: '',
    skills: '',
    description: '',
    deadline: '',
    targetType: 'institute',
    selectedDepartments: [] as string[],
  });

  const [intercollegeForm, setIntercollegeForm] = useState({
    targetType: 'institute',
    selectedColleges: [],
    companyName: '',
    role: '',
    location: '',
    duration: '',
    skills: '',
    description: '',
    deadline: '',
  });

  const departments = ['CMPN', 'INFT', 'EXTC', 'EXCS', 'BIOMED'];

  const [colleges, setColleges] = useState([
    'IIT Bombay',
    'VJTI Mumbai',
    'SPIT Mumbai',
    'DJ Sanghvi',
    'Thadomal Shahani',
  ]);

  const [collegeInput, setCollegeInput] = useState('');

  // Fetch students from API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoadingStudents(true);
        const data = await adminService.getAllStudents();
        if (data && data.students) {
          // Transform API response to match table format
          const transformedStudents = data.students.map((student: any) => ({
            id: student._id,
            name: student.name,
            branch: student.branch,
            year: student.year,
            email: student.email,
            roll_number: student.roll_number,
            status: 'Unknown', // This would need to be fetched from internships data
            company: '-', // This would need to be fetched from internships data
          }));
          setFetchedStudents(transformedStudents);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
        toast.error('Failed to load students data');
      } finally {
        setIsLoadingStudents(false);
      }
    };

    fetchStudents();
  }, []);

  // Get current stats based on selected department
  const currentStats =
    instituteStats[selectedDepartment as keyof typeof instituteStats];

  const handleLogout = () => {
    toast.success('Logged out successfully');
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  const handlePublishIntercollegeAnnouncement = () => {
    if (!intercollegeForm.companyName.trim()) {
      alert('Please enter company name');
      return;
    }
    if (!intercollegeForm.role.trim()) {
      alert('Please enter internship role');
      return;
    }
    if (
      intercollegeForm.targetType === 'department' &&
      intercollegeForm.selectedColleges.length === 0
    ) {
      alert('Please select at least one college');
      return;
    }

    console.log('Publishing intercollege announcement:', intercollegeForm);

    // Reset form
    setIntercollegeForm({
      targetType: 'institute',
      selectedColleges: [],
      companyName: '',
      role: '',
      location: '',
      duration: '',
      skills: '',
      description: '',
      deadline: '',
    });
  };

  const handleAddCollege = () => {
    const trimmedCollege = collegeInput.trim(); // ✓ Trim the INPUT string

    if (!trimmedCollege) {
      toast.error('Please enter a college name');
      return;
    }

    if (colleges.includes(trimmedCollege)) {
      toast.error('College already exists');
      return;
    }

    // Add trimmed value to the ARRAY
    setColleges([...colleges, trimmedCollege]);

    // Clear the INPUT field
    setCollegeInput('');
  };

  const handlePublishAnnouncement = async () => {
    if (!announcementForm.companyName || !announcementForm.role) {
      toast.error('Please fill in required fields');
      return;
    }

    if (
      announcementForm.targetType === 'department' &&
      announcementForm.selectedDepartments.length === 0
    ) {
      toast.error(
        'Please select at least one department for department-specific announcement',
      );
      return;
    }

    try {
      // IMPORTANT DEBUG LOGS
      console.log('');
      console.log('========== ANNOUNCING PUBLISH ==========');
      console.log('Form targetType:', announcementForm.targetType);
      console.log(
        'Form selectedDepartments:',
        announcementForm.selectedDepartments,
      );
      console.log('Form state json:', JSON.stringify(announcementForm));

      if (announcementForm.targetType === 'department') {
        console.log(
          'DEPARTMENT MODE - Departments array:',
          announcementForm.selectedDepartments,
        );
        if (announcementForm.selectedDepartments.length === 0) {
          console.error(
            'WARNING: DEPARTMENT MODE SELECTED BUT NO DEPARTMENTS SELECTED!',
          );
        }
      } else {
        console.log('INSTITUTE MODE - Going to all students');
      }

      // Prepare announcement data
      const announcementData = {
        title: announcementForm.companyName,
        content:
          announcementForm.description ||
          `${announcementForm.role} at ${announcementForm.companyName}`,
        target_type: announcementForm.targetType,
        target_departments:
          announcementForm.targetType === 'department'
            ? announcementForm.selectedDepartments
            : [],
        target_role: ['student'],
        priority: 'high',
        internship_data: {
          company_name: announcementForm.companyName,
          role: announcementForm.role,
          location: announcementForm.location,
          duration: announcementForm.duration,
          is_paid: announcementForm.isPaid,
          stipend: announcementForm.stipend,
          skills: announcementForm.skills
            .split(',')
            .map((s: string) => s.trim())
            .filter((s: string) => s),
          description: announcementForm.description,
          deadline: announcementForm.deadline,
          mode: 'On-site',
        },
      };

      console.log('Publishing announcement:', announcementData);
      console.log(
        'target_departments being sent:',
        announcementData.target_departments,
      );

      // Call API to create announcement
      const response = await announcementService.create(announcementData);

      console.log('Announcement response:', response);

      // Calculate visibility message correctly
      let visibilityMessage = '';
      if (announcementForm.targetType === 'institute') {
        visibilityMessage = '✅ All Students (CMPN, INFT, EXTC, EXCS, BIOMED)';
      } else if (
        announcementForm.targetType === 'department' &&
        announcementForm.selectedDepartments.length > 0
      ) {
        const deptCount = announcementForm.selectedDepartments.length;
        const deptList = announcementForm.selectedDepartments.join(', ');
        visibilityMessage = `✅ ${deptCount} Department(s): ${deptList}`;
      }

      console.log('Visibility message:', visibilityMessage);

      toast.success('Announcement published successfully!');
      toast.success(`Published to: ${visibilityMessage}`);

      // Reset form
      setAnnouncementForm({
        companyName: '',
        role: '',
        isPaid: true,
        stipend: '',
        duration: '',
        location: '',
        skills: '',
        description: '',
        deadline: '',
        targetType: 'institute',
        selectedDepartments: [],
      });
    } catch (error: any) {
      console.error('Error publishing announcement:', error);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        'Failed to publish announcement';
      toast.error(errorMessage);
    }
  };

  const handleExportReport = (format: 'pdf' | 'excel') => {
    const reportName =
      analysisReportType === 'department'
        ? 'Department-wise'
        : analysisReportType === 'year'
          ? 'Year-wise'
          : 'Company-wise';

    toast.success(`${reportName} Report exported as ${format.toUpperCase()}`);
    toast.info('Download will begin shortly...');
  };

  const handleRefreshStudents = async () => {
    try {
      setIsLoadingStudents(true);
      const data = await adminService.getAllStudents();
      if (data && data.students) {
        // Transform API response to match table format
        const transformedStudents = data.students.map((student: any) => ({
          id: student._id,
          name: student.name,
          branch: student.branch,
          year: student.year,
          email: student.email,
          roll_number: student.roll_number,
          status: 'Unknown', // This would need to be fetched from internships data
          company: '-', // This would need to be fetched from internships data
        }));
        setFetchedStudents(transformedStudents);
        toast.success('Student data refreshed successfully!');
      }
    } catch (error) {
      console.error('Error refreshing students:', error);
      toast.error('Failed to refresh student data');
    } finally {
      setIsLoadingStudents(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 shadow-lg z-20">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-900 to-slate-700 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-slate-900">VIT Admin</h2>
              <p className="text-xs text-slate-600">Institute Portal</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-blue-900 to-slate-700 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('analysis')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'analysis'
                ? 'bg-gradient-to-r from-blue-900 to-slate-700 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            <span>Student Analysis</span>
          </button>

          <button
            onClick={() => setActiveTab('companies')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'companies'
                ? 'bg-gradient-to-r from-blue-900 to-slate-700 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span>Company Directory</span>
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'announcements'
                ? 'bg-gradient-to-r from-blue-900 to-slate-700 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Megaphone className="w-5 h-5" />
            <span>Add Announcement</span>
          </button>

          <button
            onClick={() => setActiveTab('intercollegeAnnouncements')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'intercollegeAnnouncements'
                ? 'bg-gradient-to-r from-blue-900 to-slate-700 text-white shadow-md'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            {/* Icon */}
            <Megaphone className="w-5 h-5 flex-shrink-0 self-start mt-1" />

            {/* Text */}
            <div className="flex flex-col leading-tight text-left">
              <span className="text-base font-medium">Intercollege</span>
              <span className="text-base font-medium">Announcements</span>
            </div>
          </button>
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-slate-50 border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-600">System Status</span>
            </div>
            <p className="text-xs text-slate-700">All systems operational</p>
          </Card>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-slate-900">Institute Admin Dashboard</h1>
                <p className="text-sm text-slate-600">
                  Welcome back, {adminProfile.name}
                </p>
              </div>

              {/* Department Filter */}
              <div className="flex items-center gap-3">
                <Label className="text-slate-700 text-sm">Department:</Label>
                <Select
                  value={selectedDepartment}
                  onValueChange={setSelectedDepartment}
                >
                  <SelectTrigger className="w-48 bg-white border-slate-300 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entire Institute">
                      Entire Institute
                    </SelectItem>
                    <SelectItem value="CMPN">CMPN</SelectItem>
                    <SelectItem value="INFT">INFT</SelectItem>
                    <SelectItem value="EXTC">EXTC</SelectItem>
                    <SelectItem value="EXCS">EXCS</SelectItem>
                    <SelectItem value="BIOMED">BIOMED</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Profile Section */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5 text-slate-700" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 py-2">
                    <div className="px-4 py-2 border-b border-slate-200">
                      <p className="text-slate-900">Notifications</p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100">
                        <p className="text-sm text-slate-800">
                          New internship application from CMPN
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          2 hours ago
                        </p>
                      </div>
                      <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100">
                        <p className="text-sm text-slate-800">
                          Department coordinator updated student records
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          5 hours ago
                        </p>
                      </div>
                      <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer">
                        <p className="text-sm text-slate-800">
                          New company registered: DataVision AI
                        </p>
                        <p className="text-xs text-slate-600 mt-1">1 day ago</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-900 to-slate-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">
                      {adminProfile.avatar}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-slate-900">
                      {adminProfile.name}
                    </p>
                    <p className="text-xs text-slate-600">
                      {adminProfile.role}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-600" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-2">
                    <div className="px-4 py-3 border-b border-slate-200">
                      <p className="text-slate-900">{adminProfile.name}</p>
                      <p className="text-xs text-slate-600">
                        {adminProfile.email}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 hover:bg-slate-100 text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Students Card */}
                <Card className="p-6 bg-white border border-slate-200 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">
                        Total Students
                      </p>
                      <h3 className="text-slate-900">
                        {currentStats.totalStudents.total.toLocaleString()}
                      </h3>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-700" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-slate-600 mb-2">
                      Branch-wise Breakdown:
                    </p>
                    {currentStats.totalStudents.breakdown.map((item) => (
                      <div
                        key={item.branch}
                        className="flex items-center justify-between"
                      >
                        <span className="text-xs text-slate-700">
                          {item.branch}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
                              style={{
                                width: `${item.percentage}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-slate-600 w-12 text-right">
                            {item.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Total Registered Card */}
                <Card className="p-6 bg-white border border-slate-200 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">
                        Registered Students
                      </p>
                      <h3 className="text-slate-900">
                        {currentStats.totalRegistered.total.toLocaleString()}
                      </h3>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-50 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-green-700" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-slate-600 mb-2">
                      Skill-wise Breakdown:
                    </p>
                    {currentStats.totalRegistered.breakdown.map((item) => (
                      <div
                        key={item.skill}
                        className="flex items-center justify-between"
                      >
                        <span className="text-xs text-slate-700">
                          {item.skill}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full"
                              style={{
                                width: `${item.percentage}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-slate-600 w-12 text-right">
                            {item.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Internships Available Card */}
                <Card className="p-6 bg-white border border-slate-200 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">
                        Internships Available
                      </p>
                      <h3 className="text-slate-900">
                        {currentStats.internshipsAvailable.total}
                      </h3>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-purple-700" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs text-slate-600 mb-2">
                      Company-wise Breakdown:
                    </p>
                    {currentStats.internshipsAvailable.breakdown.map((item) => (
                      <div
                        key={item.company}
                        className="flex items-center justify-between"
                      >
                        <span className="text-xs text-slate-700">
                          {item.company}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
                              style={{
                                width: `${item.percentage}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-slate-600 w-12 text-right">
                            {item.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Payment Status Card */}
                <Card className="p-6 bg-white border border-slate-200 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">
                        Payment Status
                      </p>
                      <h3 className="text-slate-900">
                        {currentStats.internshipsAvailable.total} Total
                      </h3>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-orange-700" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-700">
                          Paid Internships
                        </span>
                        <span className="text-xs text-slate-900">
                          {currentStats.paymentStatus.paid}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-600 to-green-400 rounded-full"
                          style={{
                            width: `${currentStats.paymentStatus.paidPercentage}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        {currentStats.paymentStatus.paidPercentage}% of total
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-slate-700">
                          Unpaid Internships
                        </span>
                        <span className="text-xs text-slate-900">
                          {currentStats.paymentStatus.unpaid}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full"
                          style={{
                            width: `${currentStats.paymentStatus.unpaidPercentage}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        {currentStats.paymentStatus.unpaidPercentage}% of total
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Quick Stats Info */}
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-slate-50 border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-slate-900">
                      Viewing: {selectedDepartment}
                    </p>
                    <p className="text-sm text-slate-600">
                      Use the department filter above to view specific branch
                      statistics
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
          {activeTab === 'analysis' && (
            <div className="space-y-6">
              {/* Header with Export Button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-8 h-8 text-blue-900" />
                  <div>
                    <h2 className="text-2xl text-slate-900">
                      Student Analysis & Reporting
                    </h2>
                    <p className="text-sm text-slate-600">
                      Comprehensive insights and data-driven reports
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleRefreshStudents}
                    disabled={isLoadingStudents}
                    className="bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`w-4 h-4 mr-2 ${isLoadingStudents ? 'animate-spin' : ''}`}
                    />
                    {isLoadingStudents ? 'Refreshing...' : 'Refresh Data'}
                  </Button>
                  <Button
                    onClick={() => handleExportReport('pdf')}
                    className="bg-blue-900 hover:bg-blue-800 text-white rounded-lg shadow-md"
                  >
                    <FileDown className="w-4 h-4 mr-2" />
                    Export PDF
                  </Button>
                  <Button
                    onClick={() => handleExportReport('excel')}
                    variant="outline"
                    className="border-blue-900 text-blue-900 hover:bg-blue-50 rounded-lg"
                  >
                    <FileDown className="w-4 h-4 mr-2" />
                    Export Excel
                  </Button>
                </div>
              </div>

              {/* Sub-Navigation Filter Bar */}
              <Card className="p-2 bg-white border border-slate-200">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAnalysisReportType('department')}
                    className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                      analysisReportType === 'department'
                        ? 'bg-gradient-to-r from-blue-900 to-slate-700 text-white shadow-md'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Department-wise Report
                  </button>
                  <button
                    onClick={() => setAnalysisReportType('year')}
                    className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                      analysisReportType === 'year'
                        ? 'bg-gradient-to-r from-blue-900 to-slate-700 text-white shadow-md'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Year-wise Report
                  </button>
                  <button
                    onClick={() => setAnalysisReportType('company')}
                    className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                      analysisReportType === 'company'
                        ? 'bg-gradient-to-r from-blue-900 to-slate-700 text-white shadow-md'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Company-wise Report
                  </button>
                </div>
              </Card>

              {/* Department-wise View */}
              {analysisReportType === 'department' && (
                <div className="space-y-6">
                  {/* Bar Chart */}
                  <Card className="p-6 bg-white border border-slate-200">
                    <h3 className="text-lg text-slate-900 mb-4">
                      Internship Status by Department
                    </h3>
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={departmentReportData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="department" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                          }}
                        />
                        <Legend />
                        <Bar
                          dataKey="placed"
                          fill="#1e3a8a"
                          name="Total Placed"
                          radius={[8, 8, 0, 0]}
                        />
                        <Bar
                          dataKey="unplaced"
                          fill="#64748b"
                          name="Total Unplaced"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>

                  {/* Student List Table */}
                  <Card className="p-6 bg-white border border-slate-200">
                    <h3 className="text-lg text-slate-900 mb-4">
                      Student Placement Details
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-left py-3 px-4 text-sm text-slate-600 uppercase">
                              Student Name
                            </th>
                            <th className="text-left py-3 px-4 text-sm text-slate-600 uppercase">
                              Email
                            </th>
                            <th className="text-left py-3 px-4 text-sm text-slate-600 uppercase">
                              Branch
                            </th>
                            <th className="text-left py-3 px-4 text-sm text-slate-600 uppercase">
                              Year
                            </th>
                            <th className="text-left py-3 px-4 text-sm text-slate-600 uppercase">
                              Status
                            </th>
                            <th className="text-left py-3 px-4 text-sm text-slate-600 uppercase">
                              Company
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {(fetchedStudents.length > 0
                            ? fetchedStudents
                            : departmentStudentList
                          ).map((student) => (
                            <tr
                              key={student.id}
                              className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                            >
                              <td className="py-3 px-4 text-slate-900">
                                {student.name}
                              </td>
                              <td className="py-3 px-4 text-slate-600 text-sm">
                                {student.email || '-'}
                              </td>
                              <td className="py-3 px-4">
                                <span className="px-3 py-1 bg-blue-50 text-blue-900 rounded-full text-sm font-medium">
                                  {student.branch}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-700">
                                {student.year}
                              </td>
                              <td className="py-3 px-4">
                                {student.status === 'Placed' ? (
                                  <div className="flex items-center gap-2 text-green-700">
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span className="font-medium">Placed</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 text-slate-500">
                                    <XCircle className="w-4 h-4" />
                                    <span className="font-medium">
                                      Unplaced
                                    </span>
                                  </div>
                                )}
                              </td>
                              <td className="py-3 px-4 text-slate-900">
                                {student.company}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}

              {/* Year-wise View */}
              {analysisReportType === 'year' && (
                <div className="space-y-6">
                  {/* YoY Growth Metric */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-6 bg-gradient-to-br from-blue-50 to-slate-50 border border-blue-200">
                      <div className="flex items-center gap-3 mb-2">
                        <TrendingUp className="w-5 h-5 text-blue-900" />
                        <p className="text-sm text-slate-600 uppercase">
                          YoY Growth (2025-2026)
                        </p>
                      </div>
                      <p className="text-3xl text-blue-900 mb-1">+14.7%</p>
                      <p className="text-xs text-slate-600">
                        In student Internship
                      </p>
                    </Card>
                    <Card className="p-6 bg-gradient-to-br from-green-50 to-slate-50 border border-green-200">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="w-5 h-5 text-green-700" />
                        <p className="text-sm text-slate-600 uppercase">
                          Total Internship 2026
                        </p>
                      </div>
                      <p className="text-3xl text-green-700 mb-1">1,426</p>
                      <p className="text-xs text-slate-600">
                        Students Internship successfully
                      </p>
                    </Card>
                    <Card className="p-6 bg-gradient-to-br from-purple-50 to-slate-50 border border-purple-200">
                      <div className="flex items-center gap-3 mb-2">
                        <BarChart3 className="w-5 h-5 text-purple-700" />
                        <p className="text-sm text-slate-600 uppercase">
                          Internship Rate 2026
                        </p>
                      </div>
                      <p className="text-3xl text-purple-700 mb-1">76%</p>
                      <p className="text-xs text-slate-600">Best in 4 years</p>
                    </Card>
                  </div>

                  {/* Line Graph */}
                  <Card className="p-6 bg-white border border-slate-200">
                    <h3 className="text-lg text-slate-900 mb-4">
                      Internship Registration & Internship Trends (2023-2026)
                    </h3>
                    <ResponsiveContainer width="100%" height={350}>
                      <LineChart data={yearwiseData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="year" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#ffffff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                          }}
                        />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="registrations"
                          stroke="#1e3a8a"
                          strokeWidth={3}
                          name="Registrations"
                          dot={{ fill: '#1e3a8a', r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="placements"
                          stroke="#16a34a"
                          strokeWidth={3}
                          name="Internships"
                          dot={{ fill: '#16a34a', r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>

                  {/* Year Details Table */}
                  <Card className="p-6 bg-white border border-slate-200">
                    <h3 className="text-lg text-slate-900 mb-4">
                      Year-over-Year Breakdown
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-left py-3 px-4 text-sm text-slate-600 uppercase">
                              Academic Year
                            </th>
                            <th className="text-right py-3 px-4 text-sm text-slate-600 uppercase">
                              Registrations
                            </th>
                            <th className="text-right py-3 px-4 text-sm text-slate-600 uppercase">
                              Internships
                            </th>
                            <th className="text-right py-3 px-4 text-sm text-slate-600 uppercase">
                              Internship Rate
                            </th>
                            <th className="text-right py-3 px-4 text-sm text-slate-600 uppercase">
                              Growth
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {yearwiseData.map((yearData, index) => {
                            const growth =
                              index > 0
                                ? (
                                    ((yearData.placements -
                                      yearwiseData[index - 1].placements) /
                                      yearwiseData[index - 1].placements) *
                                    100
                                  ).toFixed(1)
                                : '-';

                            return (
                              <tr
                                key={yearData.year}
                                className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                              >
                                <td className="py-3 px-4 text-slate-900">
                                  {yearData.year}
                                </td>
                                <td className="py-3 px-4 text-right text-slate-700">
                                  {yearData.registrations.toLocaleString()}
                                </td>
                                <td className="py-3 px-4 text-right text-slate-900">
                                  {yearData.placements.toLocaleString()}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                                    {yearData.placementRate}%
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  {growth !== '-' ? (
                                    <span
                                      className={`font-medium ${parseFloat(growth) > 0 ? 'text-green-700' : 'text-red-600'}`}
                                    >
                                      {parseFloat(growth) > 0 ? '+' : ''}
                                      {growth}%
                                    </span>
                                  ) : (
                                    <span className="text-slate-400">-</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </div>
              )}

              {/* Company-wise View */}
              {analysisReportType === 'company' && (
                <div className="space-y-6">
                  <Card className="p-6 bg-white border border-slate-200">
                    <h3 className="text-lg text-slate-900 mb-6">
                      Top Recruiters Leaderboard
                    </h3>
                    <div className="space-y-4">
                      {topRecruiters.map((recruiter, index) => (
                        <div
                          key={recruiter.id}
                          className="p-5 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all"
                        >
                          <div className="flex items-center gap-6">
                            {/* Rank Badge */}
                            <div
                              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                                index === 0
                                  ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white'
                                  : index === 1
                                    ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white'
                                    : index === 2
                                      ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
                                      : 'bg-gradient-to-br from-slate-300 to-slate-500 text-white'
                              }`}
                            >
                              {index + 1}
                            </div>

                            {/* Company Logo */}
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-900 to-slate-700 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
                              {recruiter.logo}
                            </div>

                            {/* Company Details */}
                            <div className="flex-1">
                              <h4 className="text-lg text-slate-900 mb-1">
                                {recruiter.company}
                              </h4>
                              <div className="flex items-center gap-4 text-sm text-slate-600">
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  <span>
                                    {recruiter.studentsHired} students hired
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Briefcase className="w-4 h-4" />
                                  <span>
                                    {recruiter.activePosts} active posts
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="w-4 h-4" />
                                  <span>{recruiter.avgStipend} avg</span>
                                </div>
                              </div>
                            </div>

                            {/* Feedback Score */}
                            <div className="text-right">
                              <div className="flex items-center gap-2 mb-1">
                                <Award className="w-5 h-5 text-yellow-600" />
                                <span className="text-sm text-slate-600 uppercase">
                                  Feedback
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-2xl text-blue-900">
                                  {recruiter.feedbackAverage}
                                </span>
                                <span className="text-sm text-slate-500">
                                  /5.0
                                </span>
                              </div>
                              <div className="flex gap-0.5 mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-4 h-4 ${i < Math.floor(recruiter.feedbackAverage) ? 'text-yellow-500' : 'text-slate-300'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Company Statistics Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-6 bg-gradient-to-br from-blue-50 to-slate-50 border border-blue-200">
                      <div className="flex items-center gap-3 mb-2">
                        <Building2 className="w-5 h-5 text-blue-900" />
                        <p className="text-sm text-slate-600 uppercase">
                          Total Partner Companies
                        </p>
                      </div>
                      <p className="text-3xl text-blue-900 mb-1">142</p>
                      <p className="text-xs text-slate-600">
                        Active recruiters
                      </p>
                    </Card>
                    <Card className="p-6 bg-gradient-to-br from-green-50 to-slate-50 border border-green-200">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="w-5 h-5 text-green-700" />
                        <p className="text-sm text-slate-600 uppercase">
                          Students Placed via Top 5
                        </p>
                      </div>
                      <p className="text-3xl text-green-700 mb-1">880</p>
                      <p className="text-xs text-slate-600">
                        61.7% of total placements
                      </p>
                    </Card>
                    <Card className="p-6 bg-gradient-to-br from-purple-50 to-slate-50 border border-purple-200">
                      <div className="flex items-center gap-3 mb-2">
                        <Award className="w-5 h-5 text-purple-700" />
                        <p className="text-sm text-slate-600 uppercase">
                          Average Company Rating
                        </p>
                      </div>
                      <p className="text-3xl text-purple-700 mb-1">4.3</p>
                      <p className="text-xs text-slate-600">
                        Based on student feedback
                      </p>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === 'companies' && (
            <div className="space-y-6">
              <Card className="p-8 bg-white border border-slate-200">
                <div className="flex items-center gap-3 mb-6">
                  <Building2 className="w-6 h-6 text-blue-700" />
                  <h2 className="text-slate-900">Company Directory</h2>
                </div>
                <p className="text-slate-600 mb-6">
                  List of registered companies and their internship postings.
                </p>
                <div className="space-y-4">
                  {[
                    'TCS',
                    'Infosys',
                    'Wipro',
                    'Tech Mahindra',
                    'Accenture',
                  ].map((company) => (
                    <div
                      key={company}
                      className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-900 to-slate-700 rounded-lg flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-slate-900">{company}</p>
                            <p className="text-sm text-slate-600">
                              {Math.floor(Math.random() * 20) + 5} Active
                              Postings
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary">Active</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
          {activeTab === 'announcements' && (
            <div className="space-y-6">
              <Card className="p-8 bg-white border border-slate-200 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Megaphone className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-slate-900">Add New Announcement</h2>
                    <p className="text-sm text-slate-600">
                      Publish internship opportunities for students
                    </p>
                  </div>
                </div>

                {/* Target audience selection */}
                <div className="mb-8 p-5 bg-slate-50 border border-slate-200 rounded-lg">
                  <h3 className="text-slate-900 mb-1">
                    Announcement Visibility
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Choose who can view this internship announcement.
                  </p>
                  <div className="space-y-3">
                    <div
                      className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        announcementForm.targetType === 'institute'
                          ? 'border-blue-500 bg-white'
                          : 'border-slate-300 bg-white hover:border-slate-400'
                      }`}
                      onClick={() =>
                        setAnnouncementForm({
                          ...announcementForm,
                          targetType: 'institute',
                          selectedDepartments: [],
                        })
                      }
                    >
                      <input
                        type="radio"
                        id="targetInstitute"
                        name="targetType"
                        checked={announcementForm.targetType === 'institute'}
                        onChange={() =>
                          setAnnouncementForm({
                            ...announcementForm,
                            targetType: 'institute',
                            selectedDepartments: [],
                          })
                        }
                        className="w-4 h-4 mt-1 accent-blue-600"
                      />
                      <label
                        htmlFor="targetInstitute"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-semibold text-slate-900">
                          All Students (Institute-wide)
                        </div>
                        <div className="text-sm text-slate-600 mt-1">
                          Visible to students in all departments (CMPN, INFT,
                          EXTC, EXCS, BIOMED)
                        </div>
                      </label>
                    </div>

                    <div
                      className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        announcementForm.targetType === 'department'
                          ? 'border-blue-500 bg-white'
                          : 'border-slate-300 bg-white hover:border-slate-400'
                      }`}
                      onClick={() => {
                        setAnnouncementForm({
                          ...announcementForm,
                          targetType: 'department',
                        });
                        setTimeout(() => {
                          departmentSectionRef.current?.scrollIntoView({
                            behavior: 'smooth',
                          });
                        }, 100);
                      }}
                    >
                      <input
                        type="radio"
                        id="targetDepartment"
                        name="targetType"
                        checked={announcementForm.targetType === 'department'}
                        onChange={() => {
                          setAnnouncementForm({
                            ...announcementForm,
                            targetType: 'department',
                          });
                          setTimeout(() => {
                            departmentSectionRef.current?.scrollIntoView({
                              behavior: 'smooth',
                            });
                          }, 100);
                        }}
                        className="w-4 h-4 mt-1 accent-blue-600"
                      />
                      <label
                        htmlFor="targetDepartment"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-semibold text-slate-900">
                          Specific Departments Only
                        </div>
                        <div className="text-sm text-slate-600 mt-1">
                          Choose one or more departments to target
                          {announcementForm.targetType === 'department' &&
                            announcementForm.selectedDepartments.length > 0 &&
                            ` (${announcementForm.selectedDepartments.length} selected)`}
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="companyName" className="text-slate-700">
                        Company Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="companyName"
                        value={announcementForm.companyName}
                        onChange={(e) =>
                          setAnnouncementForm({
                            ...announcementForm,
                            companyName: e.target.value,
                          })
                        }
                        placeholder="e.g., TechCorp Solutions"
                        className="rounded-lg border-slate-300 bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-slate-700">
                        Internship Role <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="role"
                        value={announcementForm.role}
                        onChange={(e) =>
                          setAnnouncementForm({
                            ...announcementForm,
                            role: e.target.value,
                          })
                        }
                        placeholder="e.g., Full Stack Developer Intern"
                        className="rounded-lg border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-slate-700">
                        Location
                      </Label>
                      <Input
                        id="location"
                        value={announcementForm.location}
                        onChange={(e) =>
                          setAnnouncementForm({
                            ...announcementForm,
                            location: e.target.value,
                          })
                        }
                        placeholder="e.g., Mumbai, Maharashtra"
                        className="rounded-lg border-slate-300 bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration" className="text-slate-700">
                        Duration
                      </Label>
                      <Input
                        id="duration"
                        value={announcementForm.duration}
                        onChange={(e) =>
                          setAnnouncementForm({
                            ...announcementForm,
                            duration: e.target.value,
                          })
                        }
                        placeholder="e.g., 3 months"
                        className="rounded-lg border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                      <Label htmlFor="isPaid" className="text-slate-900">
                        Payment Status
                      </Label>
                      <p className="text-sm text-slate-600">
                        Toggle for paid or unpaid internship
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-sm ${!announcementForm.isPaid ? 'text-slate-900' : 'text-slate-500'}`}
                      >
                        Unpaid
                      </span>
                      <Switch
                        id="isPaid"
                        checked={announcementForm.isPaid}
                        onCheckedChange={(checked) =>
                          setAnnouncementForm({
                            ...announcementForm,
                            isPaid: checked,
                          })
                        }
                      />
                      <span
                        className={`text-sm ${announcementForm.isPaid ? 'text-slate-900' : 'text-slate-500'}`}
                      >
                        Paid
                      </span>
                    </div>
                  </div>

                  {announcementForm.isPaid && (
                    <div className="space-y-2">
                      <Label htmlFor="stipend" className="text-slate-700">
                        Stipend Amount
                      </Label>
                      <Input
                        id="stipend"
                        value={announcementForm.stipend}
                        onChange={(e) =>
                          setAnnouncementForm({
                            ...announcementForm,
                            stipend: e.target.value,
                          })
                        }
                        placeholder="e.g., ₹15,000/month"
                        className="rounded-lg border-slate-300 bg-white"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="skills" className="text-slate-700">
                      Required Skills
                    </Label>
                    <Input
                      id="skills"
                      value={announcementForm.skills}
                      onChange={(e) =>
                        setAnnouncementForm({
                          ...announcementForm,
                          skills: e.target.value,
                        })
                      }
                      placeholder="e.g., React, Node.js, MongoDB"
                      className="rounded-lg border-slate-300 bg-white"
                    />
                    <p className="text-xs text-slate-500">
                      Separate skills with commas
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-slate-700">
                      Description
                    </Label>
                    <textarea
                      id="description"
                      value={announcementForm.description}
                      onChange={(e) =>
                        setAnnouncementForm({
                          ...announcementForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Detailed description of the internship role and responsibilities..."
                      className="w-full min-h-32 p-3 rounded-lg border border-slate-300 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="border-t border-slate-200 pt-6 pb-6 space-y-4">
                    {announcementForm.targetType === 'department' && (
                      <div
                        ref={departmentSectionRef}
                        className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <Label className="text-slate-900 font-medium text-sm block">
                              Select Departments
                            </Label>
                            <p className="text-xs text-slate-600 mt-1">
                              Only students from selected departments will see
                              this internship.
                            </p>
                          </div>
                          {announcementForm.selectedDepartments.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {announcementForm.selectedDepartments.length}{' '}
                              selected
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {departments.map((dept) => {
                            const isSelected =
                              announcementForm.selectedDepartments.includes(
                                dept,
                              );
                            return (
                              <div
                                key={dept}
                                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                                  isSelected
                                    ? 'border-blue-500 bg-white'
                                    : 'border-slate-300 bg-white hover:border-slate-400'
                                }`}
                                onClick={() => {
                                  if (isSelected) {
                                    setAnnouncementForm({
                                      ...announcementForm,
                                      selectedDepartments:
                                        announcementForm.selectedDepartments.filter(
                                          (d) => d !== dept,
                                        ),
                                    });
                                  } else {
                                    setAnnouncementForm({
                                      ...announcementForm,
                                      selectedDepartments: [
                                        ...announcementForm.selectedDepartments,
                                        dept,
                                      ],
                                    });
                                  }
                                }}
                              >
                                <Checkbox
                                  id={`dept-${dept}`}
                                  checked={isSelected}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setAnnouncementForm({
                                        ...announcementForm,
                                        selectedDepartments: [
                                          ...announcementForm.selectedDepartments,
                                          dept,
                                        ],
                                      });
                                    } else {
                                      setAnnouncementForm({
                                        ...announcementForm,
                                        selectedDepartments:
                                          announcementForm.selectedDepartments.filter(
                                            (d) => d !== dept,
                                          ),
                                      });
                                    }
                                  }}
                                />
                                <label
                                  htmlFor={`dept-${dept}`}
                                  className="cursor-pointer font-bold text-slate-900 text-sm flex-1 flex items-center gap-2"
                                >
                                  <span>{dept}</span>
                                  {isSelected && (
                                    <span className="ml-auto text-blue-600 text-xs font-medium">
                                      Selected
                                    </span>
                                  )}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                        {announcementForm.selectedDepartments.length > 0 && (
                          <div className="text-sm text-slate-700 px-3 py-2 bg-white rounded-md border border-slate-200 mt-2">
                            <strong>Selected Departments:</strong>{' '}
                            <span className="font-semibold">
                              {announcementForm.selectedDepartments.join(', ')}
                            </span>
                          </div>
                        )}
                        {announcementForm.selectedDepartments.length === 0 &&
                          announcementForm.targetType === 'department' && (
                            <div className="text-sm text-red-700 px-3 py-2 bg-red-50 rounded-md border border-red-200 mt-2">
                              Select at least one department to continue.
                            </div>
                          )}
                      </div>
                    )}

                    {announcementForm.targetType === 'institute' && (
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        <p className="text-sm text-slate-700">
                          <strong>This announcement will reach:</strong> All
                          students in CMPN, INFT, EXTC, EXCS, and BIOMED
                          departments.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline" className="text-slate-700">
                      Application Deadline
                    </Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={announcementForm.deadline}
                      onChange={(e) =>
                        setAnnouncementForm({
                          ...announcementForm,
                          deadline: e.target.value,
                        })
                      }
                      className="rounded-lg border-slate-300 bg-white"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <div
                      className={`flex items-start gap-3 mb-4 p-4 rounded-lg border ${
                        announcementForm.targetType === 'department' &&
                        announcementForm.selectedDepartments.length === 0
                          ? 'bg-amber-50 border-amber-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <Megaphone className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-slate-700 flex-1">
                        {announcementForm.targetType === 'institute' ? (
                          <>
                            <strong>Institute-wide:</strong> This internship
                            will be visible to all students across all 5
                            departments.
                            <br />
                            <span className="text-xs text-slate-500">
                              CMPN, INFT, EXTC, EXCS, BIOMED
                            </span>
                          </>
                        ) : announcementForm.selectedDepartments.length > 0 ? (
                          <>
                            <strong>Department-specific:</strong> This
                            internship will be visible only to students in{' '}
                            <span className="font-semibold">
                              {announcementForm.selectedDepartments.join(', ')}
                            </span>
                            .
                          </>
                        ) : (
                          <>
                            <strong className="text-amber-800">
                              Department-specific:
                            </strong>{' '}
                            Select at least one department before publishing.
                          </>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={handlePublishAnnouncement}
                      disabled={
                        announcementForm.targetType === 'department' &&
                        announcementForm.selectedDepartments.length === 0
                      }
                      className="w-full bg-gradient-to-r from-blue-900 to-slate-700 hover:from-blue-800 hover:to-slate-600 text-white py-6 rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
                    >
                      <Megaphone className="w-5 h-5 mr-2" />
                      Publish Announcement
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
          {activeTab === 'intercollegeAnnouncements' && (
            <div className="space-y-6">
              <Card className="p-8 bg-white border border-slate-200 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Megaphone className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-slate-900">
                      Add Intercollege Announcement
                    </h2>
                    <p className="text-sm text-slate-600">
                      Publish internship opportunities for students from
                      multiple colleges
                    </p>
                  </div>
                </div>

                <div className="mb-8 p-5 bg-slate-50 border border-slate-200 rounded-lg">
                  <h3 className="text-slate-900 mb-1">
                    Announcement Visibility
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Choose who can view this internship announcement.
                  </p>

                  <div className="space-y-3">
                    <div
                      className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        intercollegeForm.targetType === 'institute'
                          ? 'border-blue-500 bg-white'
                          : 'border-slate-300 bg-white hover:border-slate-400'
                      }`}
                      onClick={() =>
                        setIntercollegeForm({
                          ...intercollegeForm,
                          targetType: 'institute',
                          selectedColleges: [],
                        })
                      }
                    >
                      <input
                        type="radio"
                        id="targetInstituteIntercollege"
                        name="targetTypeIntercollege"
                        checked={intercollegeForm.targetType === 'institute'}
                        onChange={() =>
                          setIntercollegeForm({
                            ...intercollegeForm,
                            targetType: 'institute',
                            selectedColleges: [],
                          })
                        }
                        className="w-4 h-4 mt-1 accent-blue-600"
                      />
                      <label
                        htmlFor="targetInstituteIntercollege"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-semibold text-slate-900">
                          All Students
                        </div>
                        <div className="text-sm text-slate-600 mt-1">
                          Visible to students in all colleges
                        </div>
                      </label>
                    </div>

                    <div
                      className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        intercollegeForm.targetType === 'college'
                          ? 'border-blue-500 bg-white'
                          : 'border-slate-300 bg-white hover:border-slate-400'
                      }`}
                      onClick={() =>
                        setIntercollegeForm({
                          ...intercollegeForm,
                          targetType: 'college',
                        })
                      }
                    >
                      <input
                        type="radio"
                        id="targetCollegeIntercollege"
                        name="targetTypeIntercollege"
                        checked={intercollegeForm.targetType === 'college'}
                        onChange={() =>
                          setIntercollegeForm({
                            ...intercollegeForm,
                            targetType: 'college',
                          })
                        }
                        className="w-4 h-4 mt-1 accent-blue-600"
                      />
                      <label
                        htmlFor="targetCollegeIntercollege"
                        className="flex-1 cursor-pointer"
                      >
                        <div className="font-semibold text-slate-900">
                          Specific Colleges Only
                        </div>
                        <div className="text-sm text-slate-600 mt-1">
                          Choose one or more college(s) to target
                          {intercollegeForm.targetType === 'college' &&
                            intercollegeForm.selectedColleges.length > 0 &&
                            ` (${intercollegeForm.selectedColleges.length} selected)`}
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="companyNameIntercollege"
                      className="text-slate-700"
                    >
                      Company Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="companyNameIntercollege"
                      placeholder="Company Name"
                      value={intercollegeForm.companyName}
                      onChange={(e) =>
                        setIntercollegeForm({
                          ...intercollegeForm,
                          companyName: e.target.value,
                        })
                      }
                      className="rounded-lg border-slate-300 bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="roleIntercollege"
                      className="text-slate-700"
                    >
                      Internship Role <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="roleIntercollege"
                      placeholder="Internship Role"
                      value={intercollegeForm.role}
                      onChange={(e) =>
                        setIntercollegeForm({
                          ...intercollegeForm,
                          role: e.target.value,
                        })
                      }
                      className="rounded-lg border-slate-300 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="locationIntercollege"
                      className="text-slate-700"
                    >
                      Location
                    </Label>
                    <Input
                      id="locationIntercollege"
                      placeholder="Location"
                      value={intercollegeForm.location}
                      onChange={(e) =>
                        setIntercollegeForm({
                          ...intercollegeForm,
                          location: e.target.value,
                        })
                      }
                      className="rounded-lg border-slate-300 bg-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="durationIntercollege"
                      className="text-slate-700"
                    >
                      Duration
                    </Label>
                    <Input
                      id="durationIntercollege"
                      placeholder="Duration"
                      value={intercollegeForm.duration}
                      onChange={(e) =>
                        setIntercollegeForm({
                          ...intercollegeForm,
                          duration: e.target.value,
                        })
                      }
                      className="rounded-lg border-slate-300 bg-white"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <Label
                    htmlFor="skillsIntercollege"
                    className="text-slate-700"
                  >
                    Required Skills
                  </Label>
                  <Input
                    id="skillsIntercollege"
                    placeholder="Skills (comma separated)"
                    value={intercollegeForm.skills}
                    onChange={(e) =>
                      setIntercollegeForm({
                        ...intercollegeForm,
                        skills: e.target.value,
                      })
                    }
                    className="rounded-lg border-slate-300 bg-white"
                  />
                </div>

                <div className="mt-4">
                  <Label
                    htmlFor="descriptionIntercollege"
                    className="text-slate-700"
                  >
                    Description
                  </Label>
                  <textarea
                    id="descriptionIntercollege"
                    placeholder="Description"
                    className="w-full p-3 border border-slate-300 rounded-lg bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={intercollegeForm.description}
                    onChange={(e) =>
                      setIntercollegeForm({
                        ...intercollegeForm,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mt-4">
                  <Label
                    htmlFor="deadlineIntercollege"
                    className="text-slate-700"
                  >
                    Application Deadline
                  </Label>
                  <Input
                    id="deadlineIntercollege"
                    type="date"
                    value={intercollegeForm.deadline}
                    onChange={(e) =>
                      setIntercollegeForm({
                        ...intercollegeForm,
                        deadline: e.target.value,
                      })
                    }
                    className="rounded-lg border-slate-300 bg-white"
                  />
                </div>

                {intercollegeForm.targetType === 'college' && (
                  <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <Label className="text-slate-900 font-medium text-sm block">
                          Select College
                        </Label>
                        <p className="text-xs text-slate-600 mt-1">
                          Only students from selected colleges will see this
                          internship.
                        </p>
                      </div>
                      {intercollegeForm.selectedColleges.length > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {intercollegeForm.selectedColleges.length} selected
                        </Badge>
                      )}
                    </div>

                    {/* ADD THIS HERE */}
                    <div className="flex gap-2 mb-4">
                      <Input
                        value={collegeInput}
                        onChange={(e) => setCollegeInput(e.target.value)}
                        placeholder="Enter new college name"
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddCollege();
                        }}
                      />
                      <Button onClick={handleAddCollege}>Add College</Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {colleges.map((college) => {
                        const isSelected =
                          intercollegeForm.selectedColleges.includes(college);

                        return (
                          <div
                            key={college}
                            className={`flex items-center justify-between gap-3 p-3 border rounded-lg transition-colors ${
                              isSelected
                                ? 'border-blue-500 bg-white'
                                : 'border-slate-300 bg-white hover:border-slate-400'
                            }`}
                          >
                            {/* LEFT SIDE (selection) */}
                            <div
                              className="flex items-center gap-3 flex-1 cursor-pointer"
                              onClick={() => {
                                setIntercollegeForm((prev) => ({
                                  ...prev,
                                  selectedColleges: isSelected
                                    ? prev.selectedColleges.filter(
                                        (d) => d !== college,
                                      )
                                    : [...prev.selectedColleges, college],
                                }));
                              }}
                            >
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={(checked) => {
                                  setIntercollegeForm((prev) => ({
                                    ...prev,
                                    selectedColleges: checked
                                      ? [...prev.selectedColleges, college]
                                      : prev.selectedColleges.filter(
                                          (d) => d !== college,
                                        ),
                                  }));
                                }}
                              />
                              <span className="font-bold text-slate-900 text-sm flex-1">
                                {college}
                              </span>
                            </div>

                            {/* RIGHT SIDE (delete) */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // 🔥 prevents select trigger
                                setColleges((prev) =>
                                  prev.filter((c) => c !== college),
                                );

                                setIntercollegeForm((prev) => ({
                                  ...prev,
                                  selectedColleges:
                                    prev.selectedColleges.filter(
                                      (c) => c !== college,
                                    ),
                                }));
                              }}
                              className="text-red-500 hover:text-red-700 text-sm font-bold px-2"
                            >
                              ✕
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {intercollegeForm.selectedColleges.length > 0 && (
                      <div className="text-sm text-slate-700 px-3 py-2 bg-white rounded-md border border-slate-200 mt-4">
                        <strong>Selected Colleges:</strong>{' '}
                        <span className="font-semibold">
                          {intercollegeForm.selectedColleges.join(', ')}
                        </span>
                      </div>
                    )}

                    {intercollegeForm.selectedColleges.length === 0 && (
                      <div className="text-sm text-red-700 px-3 py-2 bg-red-50 rounded-md border border-red-200 mt-4">
                        Select at least one college to continue.
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-6">
                  <Button
                    onClick={handlePublishIntercollegeAnnouncement}
                    disabled={
                      intercollegeForm.targetType === 'college' &&
                      intercollegeForm.selectedColleges.length === 0
                    }
                    className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    <Megaphone className="w-5 h-5 mr-2" />
                    Publish Intercollege Announcement
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
