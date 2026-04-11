import { useEffect, useState } from 'react';
import { 
  Bell, 
  User, 
  Home, 
  Users, 
  ClipboardCheck,
  LogOut,
  TrendingUp,
  Briefcase,
  GraduationCap,
  FileText,
  Award,
  MessageSquare,
  X,
  CheckCircle,
  Clock,
  PlusCircle,
  Megaphone,
  Info,
  Save,
  Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Switch } from '@/app/components/ui/switch';
import { toast } from 'sonner';
import { announcementService } from '@/services/announcement';
import { authService } from '@/services/auth';
import { coordinatorService } from '@/services/coordinator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/app/components/ui/tooltip';

const defaultCoordinatorProfile = {
  name: 'Dr. Rajesh Kumar',
  role: 'Department Coordinator',
  department: 'INFT',
  email: 'rajesh.kumar@vit.edu.in',
  avatar: 'RK'
};

// Mock Departments List
const availableDepartments = [
  { code: 'CMPN', name: 'Computer Engineering' },
  { code: 'INFT', name: 'Information Technology' },
  { code: 'EXTC', name: 'Electronics & Telecommunication' },
  { code: 'EXCS', name: 'Computer Science & Engineering' },
  { code: 'BIOMED', name: 'Biomedical Engineering' }
];

// Mock Department Statistics
const departmentStats = {
  totalStudents: 520,
  ongoingInternships: 127,
  pendingEvaluations: 18,
  completedEvaluations: 109
};

// Fallback internship meta for students where company-specific details are not available yet
const fallbackStudentInternshipMeta = [
  {
    company: 'TCS',
    internshipTitle: 'Full Stack Developer Intern',
    startDate: '2024-06-01',
    endDate: '2024-11-30',
    duration: '6 months'
  },
  {
    company: 'Infosys',
    internshipTitle: 'Data Analytics Intern',
    startDate: '2024-05-15',
    endDate: '2024-11-15',
    duration: '6 months'
  },
  {
    company: 'Wipro',
    internshipTitle: 'Cloud Engineer Intern',
    startDate: '2024-06-10',
    endDate: '2024-12-10',
    duration: '6 months'
  }
];

type EmployerFeedback = {
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
};

type InternshipCertificate = {
  file_name?: string;
  file_type?: string;
  file_size?: number;
  data_url?: string;
  uploaded_at?: string;
  issued_by?: string;
};

type EvaluationStudent = {
  id: string;
  name: string;
  rollNo: string;
  company: string;
  internshipTitle: string;
  startDate: string;
  endDate: string;
  duration: string;
  status: 'pending' | 'completed';
  branch?: string;
  internshipReport?: {
    file_name?: string;
    file_type?: string;
    file_size?: number;
    data_url?: string;
    uploaded_at?: string;
  } | null;
  coordinatorEvaluation?: {
    technical_skills?: number;
    task_execution?: number;
    viva_presentation?: number;
    report_quality?: number;
    supervisor_feedback?: number;
    company_grade?: number;
    total_score?: number;
    percentage?: number;
    remarks?: string;
    status?: string;
    evaluated_at?: string;
  } | null;
  employerFeedback?: EmployerFeedback | null;
  internshipCertificate?: InternshipCertificate | null;
};

export default function CoordinatorDashboard() {
  const navigate = useNavigate();
  const [coordinatorProfile, setCoordinatorProfile] = useState(defaultCoordinatorProfile);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [departmentStudents, setDepartmentStudents] = useState<EvaluationStudent[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<EvaluationStudent | null>(null);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [evaluationForm, setEvaluationForm] = useState({
    technicalSkills: '',
    taskExecution: '',
    vivaPresentation: '',
    reportQuality: '',
    supervisorFeedback: '',
    companyGrade: '',
    remarks: '',
    status: 'completed'
  });
  const [announcementForm, setAnnouncementForm] = useState({
    companyName: '',
    role: '',
    location: '',
    duration: '',
    isPaid: false,
    stipend: '',
    skills: '',
    description: '',
    deadline: '',
    targetType: 'institute', // 'institute' or 'department'
    targetDepartments: [] // list of department codes
  });
  const pendingEvaluations = departmentStudents.filter((student) => !student.coordinatorEvaluation).length;

  const loadDepartmentStudents = async () => {
    setStudentsLoading(true);
    try {
      const response = await coordinatorService.getDepartmentStudents();
      const students = response?.students || [];

      const mappedStudents: EvaluationStudent[] = students.map((student: any, index: number) => {
        const template = fallbackStudentInternshipMeta[index % fallbackStudentInternshipMeta.length];
        return {
          id: student._id || `student-${index}`,
          name: student.name || 'Student',
          rollNo: student.roll_number || 'N/A',
          company: template.company,
          internshipTitle: template.internshipTitle,
          startDate: template.startDate,
          endDate: template.endDate,
          duration: template.duration,
          branch: student.branch,
          internshipReport: student.internship_report || null,
          employerFeedback: student.employer_feedback || null,
          internshipCertificate: student.internship_certificate || null,
          status: student.coordinator_evaluation ? 'completed' : 'pending',
          coordinatorEvaluation: student.coordinator_evaluation || null
        };
      });

      setDepartmentStudents(mappedStudents);
    } catch (error) {
      console.error('Error loading department students:', error);
      toast.error('Failed to load department students');
      setDepartmentStudents([]);
    } finally {
      setStudentsLoading(false);
    }
  };

  useEffect(() => {
    const loadCoordinatorProfile = async () => {
      try {
        const [userProfile, dashboardData] = await Promise.all([
          authService.getProfile(),
          coordinatorService.getDashboard()
        ]);

        const firstName = userProfile?.first_name || '';
        const lastName = userProfile?.last_name || '';
        const fullName = `${firstName} ${lastName}`.trim() || 'Department Coordinator';
        const department = dashboardData?.coordinator?.department || defaultCoordinatorProfile.department;
        const designation = dashboardData?.coordinator?.designation || 'Department Coordinator';
        const avatar = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || department.slice(0, 2);

        setCoordinatorProfile({
          name: fullName,
          role: designation,
          department,
          email: userProfile?.email || '',
          avatar
        });
      } catch (error: any) {
        console.error('Error loading coordinator profile:', error);
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          authService.logout();
          navigate('/');
          return;
        }
        toast.error('Failed to load coordinator profile');
      }
    };

    loadCoordinatorProfile();
  }, [navigate]);

  useEffect(() => {
    loadDepartmentStudents();
  }, []);

  const handleLogout = () => {
    authService.logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleOpenEvaluation = (student: EvaluationStudent) => {
    setSelectedStudent(student);
    setShowEvaluationModal(true);
    const existingEvaluation = student.coordinatorEvaluation;
    setEvaluationForm({
      technicalSkills: existingEvaluation?.technical_skills?.toString() || '',
      taskExecution: existingEvaluation?.task_execution?.toString() || '',
      vivaPresentation: existingEvaluation?.viva_presentation?.toString() || '',
      reportQuality: existingEvaluation?.report_quality?.toString() || '',
      supervisorFeedback: existingEvaluation?.supervisor_feedback?.toString() || '',
      companyGrade: existingEvaluation?.company_grade?.toString() || '',
      remarks: existingEvaluation?.remarks || '',
      status: existingEvaluation?.status || 'completed'
    });
  };

  const handleSubmitEvaluation = async () => {
    if (!selectedStudent) {
      toast.error('Please select a student');
      return;
    }

    if (!selectedStudent.internshipReport?.data_url) {
      toast.error('Internship report not uploaded by student yet');
      return;
    }

    const totalScore = calculateTotalScore();
    if (totalScore === 0) {
      toast.error('Please enter scores for all criteria');
      return;
    }

    try {
      await coordinatorService.evaluateStudent(selectedStudent.id, {
        technical_skills: parseFloat(evaluationForm.technicalSkills) || 0,
        task_execution: parseFloat(evaluationForm.taskExecution) || 0,
        viva_presentation: parseFloat(evaluationForm.vivaPresentation) || 0,
        report_quality: parseFloat(evaluationForm.reportQuality) || 0,
        supervisor_feedback: parseFloat(evaluationForm.supervisorFeedback) || 0,
        company_grade: parseFloat(evaluationForm.companyGrade) || 0,
        total_score: totalScore,
        percentage: Math.round((totalScore / 150) * 100),
        remarks: evaluationForm.remarks,
        status: evaluationForm.status
      });

      toast.success(`Evaluation submitted for ${selectedStudent.name} - Total: ${totalScore}/150 marks`);
      setShowEvaluationModal(false);
      setSelectedStudent(null);
      await loadDepartmentStudents();
    } catch (error: any) {
      console.error('Error submitting evaluation:', error);
      const errorMessage = error?.response?.data?.error || 'Failed to submit evaluation';
      toast.error(errorMessage);
    }
  };

  const handleSaveDraft = () => {
    toast.info('Draft saved successfully');
  };

  const calculateTotalScore = () => {
    const scores = [
      parseFloat(evaluationForm.technicalSkills) || 0,
      parseFloat(evaluationForm.taskExecution) || 0,
      parseFloat(evaluationForm.vivaPresentation) || 0,
      parseFloat(evaluationForm.reportQuality) || 0,
      parseFloat(evaluationForm.supervisorFeedback) || 0,
      parseFloat(evaluationForm.companyGrade) || 0
    ];
    return scores.reduce((sum, score) => sum + score, 0);
  };

  const handlePublishAnnouncement = async () => {
    if (!announcementForm.companyName || !announcementForm.role) {
      toast.error('Please fill in at least Company Name and Internship Role');
      return;
    }

    // Check if specific departments are selected when target type is 'department'
    if (announcementForm.targetType === 'department' && announcementForm.targetDepartments.length === 0) {
      toast.error('Please select at least one department');
      return;
    }

    try {
      // Prepare announcement data
      const announcementData = {
        title: announcementForm.companyName,
        content: announcementForm.description,
        target_type: announcementForm.targetType,
        target_departments: announcementForm.targetType === 'department' ? announcementForm.targetDepartments : [],
        target_role: ['student'],
        priority: 'high',
        internship_data: {
          company_name: announcementForm.companyName,
          role: announcementForm.role,
          location: announcementForm.location,
          duration: announcementForm.duration,
          is_paid: announcementForm.isPaid,
          stipend: announcementForm.stipend,
          skills: announcementForm.skills.split(',').map(s => s.trim()).filter(s => s),
          description: announcementForm.description,
          deadline: announcementForm.deadline
        }
      };

      console.log('[FORM DEBUG] Announcement Form State:');
      console.log('  targetType:', announcementForm.targetType);
      console.log('  targetDepartments:', announcementForm.targetDepartments);
      console.log('  targetDepartments length:', announcementForm.targetDepartments.length);
      console.log('[SENDING TO API]:', announcementData);

      // Call API to create announcement using the service
      const response = await announcementService.create(announcementData);
      
      console.log('Announcement response:', response);

      toast.success('Announcement published successfully!');
      
      if (announcementForm.targetType === 'institute') {
        toast.info('Announcement will be visible to all students across the institute');
      } else {
        const deptNames = announcementForm.targetDepartments
          .map(code => availableDepartments.find(d => d.code === code)?.name)
          .filter(Boolean)
          .join(', ');
        toast.info(`Announcement will be visible to students in: ${deptNames}`);
      }
      
      // Reset form
      setAnnouncementForm({
        companyName: '',
        role: '',
        location: '',
        duration: '',
        isPaid: false,
        stipend: '',
        skills: '',
        description: '',
        deadline: '',
        targetType: 'institute',
        targetDepartments: []
      });
    } catch (error: any) {
      console.error('Error publishing announcement:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to publish announcement';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar - Matching Admin Style */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 shadow-sm z-10">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">VIT Internships</h2>
          <p className="text-xs text-slate-600 mt-1">{coordinatorProfile.department} Department</p>
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
            onClick={() => setActiveTab('students')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'students' 
                ? 'bg-gradient-to-r from-blue-900 to-slate-700 text-white shadow-md' 
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Student Analysis</span>
          </button>
          
          <button
            onClick={() => setActiveTab('evaluation')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              activeTab === 'evaluation' 
                ? 'bg-gradient-to-r from-blue-900 to-slate-700 text-white shadow-md' 
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ClipboardCheck className="w-5 h-5" />
            <span>Student Evaluation</span>
            {pendingEvaluations > 0 && (
              <Badge className="ml-auto bg-orange-500 text-white">
                {pendingEvaluations}
              </Badge>
            )}
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
        {/* Header - Matching Admin Style */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h1 className="text-slate-900">
                {coordinatorProfile.department} Department View
              </h1>
              <p className="text-sm text-slate-600">Welcome back, {coordinatorProfile.name}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-slate-100 rounded-full transition-colors">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-slate-200 text-slate-700 hover:bg-slate-100"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-800">{coordinatorProfile.name}</p>
                  <p className="text-xs text-slate-500">{coordinatorProfile.role}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-900 to-slate-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">{coordinatorProfile.avatar}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-8">
          {activeTab === 'dashboard' && (
            <div>
              <h2 className="text-slate-900 mb-6">Department Statistics</h2>
              
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <GraduationCap className="w-8 h-8 opacity-80" />
                    <TrendingUp className="w-5 h-5 opacity-60" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{departmentStats.totalStudents}</h3>
                  <p className="text-sm opacity-90">Total Students</p>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <Briefcase className="w-8 h-8 opacity-80" />
                    <TrendingUp className="w-5 h-5 opacity-60" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{departmentStats.ongoingInternships}</h3>
                  <p className="text-sm opacity-90">Ongoing</p>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <Clock className="w-8 h-8 opacity-80" />
                    <Badge className="bg-white/20 text-white text-xs">Urgent</Badge>
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{pendingEvaluations}</h3>
                  <p className="text-sm opacity-90">Pending Evaluations</p>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <CheckCircle className="w-8 h-8 opacity-80" />
                    <TrendingUp className="w-5 h-5 opacity-60" />
                  </div>
                  <h3 className="text-3xl font-bold mb-1">{departmentStats.completedEvaluations}</h3>
                  <p className="text-sm opacity-90">Completed</p>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div>
              <h2 className="text-slate-900 mb-6">Student Analysis</h2>
              <Card className="p-6">
                <p className="text-slate-500 text-center py-12">Student analysis dashboard coming soon...</p>
              </Card>
            </div>
          )}

          {activeTab === 'evaluation' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-slate-900">Student Evaluation Center</h2>
                <Badge className="bg-orange-100 text-orange-700 px-4 py-2">
                  {pendingEvaluations} Pending Reviews
                </Badge>
              </div>

              {studentsLoading ? (
                <Card className="p-8 text-center text-slate-600">
                  Loading department students...
                </Card>
              ) : departmentStudents.length === 0 ? (
                <Card className="p-8 text-center text-slate-600">
                  No students found for this department yet.
                </Card>
              ) : (
                <div className="space-y-4">
                  {departmentStudents.map((student) => (
                    <Card key={student.id} className="p-6 hover:shadow-lg transition-shadow border border-slate-200 bg-white">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-900 to-slate-700 rounded-full flex items-center justify-center text-white font-semibold">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-800">{student.name}</h3>
                              <p className="text-sm text-slate-500">{student.rollNo}</p>
                            </div>
                          </div>
                          
                          <div className="ml-15 space-y-1">
                            <p className="text-sm">
                              <span className="font-medium text-slate-700">Department:</span>{' '}
                              <span className="text-slate-600">{student.branch || coordinatorProfile.department}</span>
                            </p>
                            <p className="text-sm">
                              <span className="font-medium text-slate-700">Company:</span>{' '}
                              <span className="text-slate-600">{student.company}</span>
                            </p>
                            <p className="text-sm">
                              <span className="font-medium text-slate-700">Position:</span>{' '}
                              <span className="text-slate-600">{student.internshipTitle}</span>
                            </p>
                            <p className="text-sm">
                              <span className="font-medium text-slate-700">Duration:</span>{' '}
                              <span className="text-slate-600">{student.duration} ({student.startDate} to {student.endDate})</span>
                            </p>
                            
                            <div className="flex items-center gap-4 mt-3">
                            {student.internshipCertificate?.data_url ? (
                              <Badge className="bg-green-100 text-green-700">
                                <Award className="w-3 h-3 mr-1" />
                                Certificate Uploaded
                              </Badge>
                            ) : (
                              <Badge className="bg-amber-100 text-amber-700">
                                <Clock className="w-3 h-3 mr-1" />
                                Certificate Pending
                              </Badge>
                            )}
                            {student.internshipReport ? (
                              <Badge className="bg-blue-100 text-blue-700">
                                <FileText className="w-3 h-3 mr-1" />
                                Report Submitted
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-700">
                                <Clock className="w-3 h-3 mr-1" />
                                Report Pending
                              </Badge>
                            )}
                              {student.employerFeedback ? (
                                <Badge className="bg-purple-100 text-purple-700">
                                  <MessageSquare className="w-3 h-3 mr-1" />
                                  Employer Marks Received
                                </Badge>
                              ) : (
                                <Badge className="bg-slate-100 text-slate-700">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Employer Marks Pending
                                </Badge>
                              )}
                              {student.coordinatorEvaluation && (
                                <Badge className="bg-emerald-100 text-emerald-700">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Evaluated ({student.coordinatorEvaluation.total_score ?? 0}/150)
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          onClick={() => handleOpenEvaluation(student)}
                          className="bg-gradient-to-r from-blue-900 to-slate-700 hover:from-blue-800 hover:to-slate-600 text-white">
                          <ClipboardCheck className="w-4 h-4 mr-2" />
                          {student.coordinatorEvaluation ? 'Re-evaluate' : 'Review & Evaluate'}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'announcements' && (
            <div className="space-y-6">
              <Card className="p-8 bg-white border border-slate-200 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <Megaphone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-slate-900">Add New Announcement</h2>
                    <p className="text-sm text-slate-600">Publish internship opportunities for {coordinatorProfile.department} Department students</p>
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
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, companyName: e.target.value })}
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
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, role: e.target.value })}
                        placeholder="e.g., Full Stack Developer Intern"
                        className="rounded-lg border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-slate-700">Location</Label>
                      <Input
                        id="location"
                        value={announcementForm.location}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, location: e.target.value })}
                        placeholder="e.g., Mumbai, Maharashtra"
                        className="rounded-lg border-slate-300 bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration" className="text-slate-700">Duration</Label>
                      <Input
                        id="duration"
                        value={announcementForm.duration}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, duration: e.target.value })}
                        placeholder="e.g., 3 months"
                        className="rounded-lg border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                      <Label htmlFor="isPaid" className="text-slate-900">Payment Status</Label>
                      <p className="text-sm text-slate-600">Toggle for paid or unpaid internship</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-sm ${!announcementForm.isPaid ? 'text-slate-900' : 'text-slate-500'}`}>
                        Unpaid
                      </span>
                      <Switch
                        id="isPaid"
                        checked={announcementForm.isPaid}
                        onCheckedChange={(checked) => setAnnouncementForm({ ...announcementForm, isPaid: checked })}
                      />
                      <span className={`text-sm ${announcementForm.isPaid ? 'text-slate-900' : 'text-slate-500'}`}>
                        Paid
                      </span>
                    </div>
                  </div>

                  {announcementForm.isPaid && (
                    <div className="space-y-2">
                      <Label htmlFor="stipend" className="text-slate-700">Stipend Amount</Label>
                      <Input
                        id="stipend"
                        value={announcementForm.stipend}
                        onChange={(e) => setAnnouncementForm({ ...announcementForm, stipend: e.target.value })}
                        placeholder="e.g., ₹15,000/month"
                        className="rounded-lg border-slate-300 bg-white"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="skills" className="text-slate-700">Required Skills</Label>
                    <Input
                      id="skills"
                      value={announcementForm.skills}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, skills: e.target.value })}
                      placeholder="e.g., React, Node.js, MongoDB"
                      className="rounded-lg border-slate-300 bg-white"
                    />
                    <p className="text-xs text-slate-500">Separate skills with commas</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-slate-700">Description</Label>
                    <textarea
                      id="description"
                      value={announcementForm.description}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, description: e.target.value })}
                      placeholder="Detailed description of the internship role and responsibilities..."
                      className="w-full min-h-32 p-3 rounded-lg border border-slate-300 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline" className="text-slate-700">Application Deadline</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={announcementForm.deadline}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, deadline: e.target.value })}
                      className="rounded-lg border-slate-300 bg-white"
                    />
                  </div>

                  {/* Announcement Targeting Section */}
                  <div className="space-y-4 p-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900">Announcement Visibility</h3>
                      <Badge className="bg-blue-100 text-blue-700">Target Audience</Badge>
                    </div>
                    
                    <div className="space-y-3">
                      {/* Institute-wide option */}
                      <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white hover:border-blue-300 cursor-pointer transition-colors"
                           onClick={() => setAnnouncementForm({ ...announcementForm, targetType: 'institute' })}>
                        <input
                          type="radio"
                          id="instituteWide"
                          name="targetType"
                          checked={announcementForm.targetType === 'institute'}
                          onChange={() => setAnnouncementForm({ ...announcementForm, targetType: 'institute' })}
                          className="w-4 h-4 cursor-pointer"
                        />
                        <label htmlFor="instituteWide" className="cursor-pointer flex-1">
                          <span className="font-medium text-slate-900">Institute-Wide</span>
                          <p className="text-xs text-slate-600 mt-1">Visible to all students across all departments</p>
                        </label>
                      </div>

                      {/* Department-specific option */}
                      <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-white hover:border-blue-300 cursor-pointer transition-colors">
                        <input
                          type="radio"
                          id="departmentSpecific"
                          name="targetType"
                          checked={announcementForm.targetType === 'department'}
                          onChange={() => setAnnouncementForm({ ...announcementForm, targetType: 'department' })}
                          className="w-4 h-4 cursor-pointer mt-1"
                        />
                        <div className="flex-1">
                          <label htmlFor="departmentSpecific" className="cursor-pointer">
                            <span className="font-medium text-slate-900">Department Specific</span>
                            <p className="text-xs text-slate-600 mt-1">Visible to students in selected departments only</p>
                          </label>
                          
                          {announcementForm.targetType === 'department' && (
                            <div className="mt-3 space-y-2">
                              <div className="grid grid-cols-2 gap-2">
                                {availableDepartments.map((dept) => (
                                  <div key={dept.code} className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      id={`dept-${dept.code}`}
                                      checked={announcementForm.targetDepartments.includes(dept.code)}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setAnnouncementForm({
                                            ...announcementForm,
                                            targetDepartments: [...announcementForm.targetDepartments, dept.code]
                                          });
                                        } else {
                                          setAnnouncementForm({
                                            ...announcementForm,
                                            targetDepartments: announcementForm.targetDepartments.filter(d => d !== dept.code)
                                          });
                                        }
                                      }}
                                      className="w-4 h-4 cursor-pointer"
                                    />
                                    <label htmlFor={`dept-${dept.code}`} className="text-sm text-slate-700 cursor-pointer">
                                      {dept.code}
                                    </label>
                                  </div>
                                ))}
                              </div>
                              {announcementForm.targetDepartments.length > 0 && (
                                <p className="text-xs text-blue-600 mt-2">
                                  Selected: {announcementForm.targetDepartments
                                    .map(code => availableDepartments.find(d => d.code === code)?.name)
                                    .filter(Boolean)
                                    .join(', ')}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-3 mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <PlusCircle className="w-5 h-5 text-blue-700" />
                      <p className="text-sm text-slate-700">
                        {announcementForm.targetType === 'institute' ? (
                          <>This announcement will be published to <strong>all students across the institute</strong></>
                        ) : (
                          <>This announcement will be published to students in: <strong>{announcementForm.targetDepartments.length > 0 ? announcementForm.targetDepartments.map(code => availableDepartments.find(d => d.code === code)?.name).filter(Boolean).join(', ') : 'No departments selected'}</strong></>
                        )}
                      </p>
                    </div>
                    <Button
                      onClick={handlePublishAnnouncement}
                      className="w-full bg-gradient-to-r from-blue-900 to-slate-700 hover:from-blue-800 hover:to-slate-600 text-white py-6 rounded-lg shadow-md"
                    >
                      <Megaphone className="w-5 h-5 mr-2" />
                      Publish Announcement
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* Evaluation Modal - Split Screen Design */}
      {showEvaluationModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-[95vw] w-full max-h-[95vh] overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-900 to-slate-700 px-6 py-5 flex items-center justify-between border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-white">Evaluation Workspace</h2>
                <p className="text-sm text-white/80 mt-1">
                  {selectedStudent.name} • {selectedStudent.rollNo} • {selectedStudent.company}
                </p>
              </div>
              <button
                onClick={() => setShowEvaluationModal(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Split Screen Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* LEFT PANEL - Document Viewer (The Trilogy) */}
              <div className="w-[60%] bg-slate-50 p-6 overflow-y-auto border-r border-slate-300">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-slate-800 mb-1">Document Review Panel</h3>
                  <p className="text-sm text-slate-600">Three-Pillar Verification System</p>
                </div>

                {/* Three Column Document Layout */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Certificate */}
                  <Card className="p-4 bg-white shadow-md rounded-lg border border-slate-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Award className="w-5 h-5 text-green-600" />
                      </div>
                      <h4 className="font-semibold text-slate-800 text-sm">Certificate</h4>
                    </div>
                    <div className="aspect-[3/4] bg-gradient-to-br from-green-50 to-green-100 rounded-lg mb-3 overflow-hidden border-2 border-green-200 flex items-center justify-center">
                      {selectedStudent.internshipCertificate?.data_url ? (
                        <div className="text-center px-3">
                          <Award className="w-14 h-14 text-green-600 mx-auto mb-2" />
                          <p className="text-xs font-medium text-slate-700 break-words">
                            {selectedStudent.internshipCertificate.file_name || 'Internship Certificate'}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center px-3">
                          <Award className="w-14 h-14 text-slate-400 mx-auto mb-2" />
                          <p className="text-xs font-medium text-slate-500">Certificate not uploaded yet</p>
                        </div>
                      )}
                    </div>
                    <div className="text-xs space-y-1.5 mb-3">
                      <p className="text-slate-600">
                        <span className="font-medium text-slate-800">Uploaded by:</span><br/>
                        {selectedStudent.internshipCertificate?.issued_by || 'Employer'}
                      </p>
                      <p className="text-slate-600">
                        <span className="font-medium text-slate-800">Date:</span><br/>
                        {selectedStudent.internshipCertificate?.uploaded_at
                          ? new Date(selectedStudent.internshipCertificate.uploaded_at).toLocaleString()
                          : 'Not uploaded'}
                      </p>
                    </div>
                    {selectedStudent.internshipCertificate?.data_url ? (
                      <a
                        href={selectedStudent.internshipCertificate.data_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={selectedStudent.internshipCertificate.file_name || 'internship_certificate'}
                        className="w-full inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white text-xs py-2 rounded-md"
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        View / Download
                      </a>
                    ) : (
                      <div className="w-full inline-flex items-center justify-center bg-slate-300 text-slate-600 text-xs py-2 rounded-md cursor-not-allowed">
                        <FileText className="w-3 h-3 mr-1" />
                        Not Uploaded
                      </div>
                    )}
                  </Card>

                  {/* Report */}
                  <Card className="p-4 bg-white shadow-md rounded-lg border border-slate-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-slate-800 text-sm">Report</h4>
                    </div>
                    <div className="aspect-[3/4] bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg mb-3 overflow-hidden border-2 border-blue-200 flex items-center justify-center">
                      {selectedStudent.internshipReport?.data_url ? (
                        <div className="text-center px-3">
                          <FileText className="w-14 h-14 text-blue-600 mx-auto mb-2" />
                          <p className="text-xs font-medium text-slate-700 break-words">
                            {selectedStudent.internshipReport.file_name || 'Internship Report'}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center px-3">
                          <FileText className="w-14 h-14 text-slate-400 mx-auto mb-2" />
                          <p className="text-xs font-medium text-slate-500">Report not uploaded yet</p>
                        </div>
                      )}
                    </div>
                    <div className="text-xs space-y-1.5 mb-3">
                      <p className="text-slate-600">
                        <span className="font-medium text-slate-800">Uploaded by:</span><br/>
                        {selectedStudent.internshipReport ? 'Student' : 'Not available'}
                      </p>
                      <p className="text-slate-600">
                        <span className="font-medium text-slate-800">File:</span><br/>
                        {selectedStudent.internshipReport?.file_name || 'Not uploaded'}
                      </p>
                      <p className="text-slate-600">
                        <span className="font-medium text-slate-800">Date:</span><br/>
                        {selectedStudent.internshipReport?.uploaded_at
                          ? new Date(selectedStudent.internshipReport.uploaded_at).toLocaleString()
                          : 'Not uploaded'}
                      </p>
                    </div>
                    {selectedStudent.internshipReport?.data_url ? (
                      <a
                        href={selectedStudent.internshipReport.data_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        download={selectedStudent.internshipReport.file_name || 'internship_report'}
                        className="w-full inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 rounded-md"
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        View / Download
                      </a>
                    ) : (
                      <div className="w-full inline-flex items-center justify-center bg-slate-300 text-slate-600 text-xs py-2 rounded-md cursor-not-allowed">
                        <FileText className="w-3 h-3 mr-1" />
                        Not Uploaded
                      </div>
                    )}
                  </Card>

                  {/* Employer Feedback */}
                  <Card className="p-4 bg-white shadow-md rounded-lg border border-slate-200 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-purple-600" />
                      </div>
                      <h4 className="font-semibold text-slate-800 text-sm">Employer Marks</h4>
                    </div>
                    {selectedStudent.employerFeedback ? (
                      <>
                        <div className="mb-3">
                          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 border-2 border-purple-200">
                            <p className="text-xs text-slate-600 mb-1">Overall Rating</p>
                            <div className="flex items-center gap-2">
                              <span className="text-3xl font-bold text-purple-700">
                                {selectedStudent.employerFeedback.overall_rating ?? 0}
                              </span>
                              <div>
                                <p className="text-xs text-slate-600">/ 5.0</p>
                                <div className="flex gap-0.5 mt-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <div
                                      key={i}
                                      className={`w-3 h-3 rounded-full ${
                                        i < Math.floor(selectedStudent.employerFeedback?.overall_rating ?? 0)
                                          ? 'bg-yellow-400'
                                          : 'bg-slate-300'
                                      }`}
                                    ></div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            {selectedStudent.employerFeedback.performance && (
                              <Badge className="mt-2 bg-purple-600 text-white text-xs">
                                {selectedStudent.employerFeedback.performance}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-xs space-y-2 mb-3">
                          <p className="text-slate-600">
                            <span className="font-medium text-slate-800">Technical Skills:</span>{' '}
                            {selectedStudent.employerFeedback.technical_skills ?? 0}/5
                          </p>
                          <p className="text-slate-600">
                            <span className="font-medium text-slate-800">Punctuality:</span>{' '}
                            {selectedStudent.employerFeedback.punctuality ?? 0}/5
                          </p>
                          <p className="text-slate-600">
                            <span className="font-medium text-slate-800">Teamwork:</span>{' '}
                            {selectedStudent.employerFeedback.teamwork ?? 0}/5
                          </p>
                          <p className="text-slate-600">
                            <span className="font-medium text-slate-800">Communication:</span>{' '}
                            {selectedStudent.employerFeedback.communication ?? 0}/5
                          </p>
                          <p className="text-slate-600">
                            <span className="font-medium text-slate-800">Problem Solving:</span>{' '}
                            {selectedStudent.employerFeedback.problem_solving ?? 0}/5
                          </p>
                        </div>
                        <div className="pt-2 border-t border-slate-200 text-xs text-slate-600">
                          <p>
                            <span className="font-medium text-slate-800">By:</span>{' '}
                            {selectedStudent.employerFeedback.evaluator_name || 'Employer'}
                          </p>
                          <p className="text-slate-500 mt-0.5">
                            {selectedStudent.employerFeedback.evaluator_designation || 'Employer'}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-600">
                        Employer has not submitted marks yet.
                      </div>
                    )}
                  </Card>
                </div>

                {/* Employer Detailed Remarks */}
                <Card className="p-5 bg-white shadow-md rounded-lg border border-slate-200 mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                    <h4 className="font-semibold text-slate-800">Detailed Employer Remarks</h4>
                  </div>
                  {selectedStudent.employerFeedback?.remarks ? (
                    <>
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <p className="text-sm text-slate-700 italic leading-relaxed">
                          "{selectedStudent.employerFeedback.remarks}"
                        </p>
                      </div>
                      <div className="mt-3 text-xs text-slate-500">
                        <p>
                          Evaluated on:{' '}
                          {selectedStudent.employerFeedback.submitted_at
                            ? new Date(selectedStudent.employerFeedback.submitted_at).toLocaleString()
                            : 'N/A'}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-600">
                      No detailed remarks submitted by employer yet.
                    </div>
                  )}
                </Card>
              </div>

              {/* RIGHT PANEL - Rubric Scoring Form */}
              <div className="w-[40%] bg-white p-6 overflow-y-auto">
                <TooltipProvider>
                  <div className="mb-5">
                    <h3 className="text-lg font-bold text-slate-800 mb-1">VIT Rubric-Based Evaluation</h3>
                    <p className="text-sm text-slate-600">Standardized Assessment Framework (150 Marks)</p>
                  </div>

                  {/* Student Info Card */}
                  <Card className="p-4 mb-5 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-900 to-slate-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{selectedStudent.name}</h4>
                        <p className="text-sm text-slate-600">{selectedStudent.rollNo}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-slate-500">Company</p>
                        <p className="font-semibold text-slate-800">{selectedStudent.company}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Duration</p>
                        <p className="font-semibold text-slate-800">{selectedStudent.duration}</p>
                      </div>
                    </div>
                  </Card>

                  {/* Rubric Scoring Form */}
                  <div className="space-y-4 mb-5">
                    {/* Criteria 1: Technical Skills */}
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm font-semibold text-slate-800">
                            Technical Skills & Enhancement
                          </Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="p-0.5 hover:bg-slate-200 rounded-full transition-colors">
                                <Info className="w-4 h-4 text-blue-600" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs bg-white border border-slate-300 shadow-lg p-3">
                              <div className="text-xs space-y-1">
                                <p className="font-semibold text-slate-800">Rubric:</p>
                                <p><strong>Excellent (45-50):</strong> Outstanding technical growth</p>
                                <p><strong>Good (35-44):</strong> Strong technical development</p>
                                <p><strong>Average (25-34):</strong> Moderate improvement</p>
                                <p><strong>Poor (≤24):</strong> Limited progress</p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <span className="text-xs text-slate-600 font-medium">Max: 50</span>
                      </div>
                      <Input
                        type="number"
                        min="0"
                        max="50"
                        placeholder="Enter marks (0-50)"
                        value={evaluationForm.technicalSkills}
                        onChange={(e) => setEvaluationForm({...evaluationForm, technicalSkills: e.target.value})}
                        className="bg-white border-slate-300"
                      />
                      <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                          style={{width: `${((parseFloat(evaluationForm.technicalSkills) || 0) / 50) * 100}%`}}
                        />
                      </div>
                    </div>

                    {/* Criteria 2: Task Execution */}
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-semibold text-slate-800">
                          Task Execution & Technical Contribution
                        </Label>
                        <span className="text-xs text-slate-600 font-medium">Max: 30</span>
                      </div>
                      <Input
                        type="number"
                        min="0"
                        max="30"
                        placeholder="Enter marks (0-30)"
                        value={evaluationForm.taskExecution}
                        onChange={(e) => setEvaluationForm({...evaluationForm, taskExecution: e.target.value})}
                        className="bg-white border-slate-300"
                      />
                      <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-300"
                          style={{width: `${((parseFloat(evaluationForm.taskExecution) || 0) / 30) * 100}%`}}
                        />
                      </div>
                    </div>

                    {/* Criteria 3: Viva & Presentation */}
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-semibold text-slate-800">
                          Viva & Presentation Skills
                        </Label>
                        <span className="text-xs text-slate-600 font-medium">Max: 20</span>
                      </div>
                      <Input
                        type="number"
                        min="0"
                        max="20"
                        placeholder="Enter marks (0-20)"
                        value={evaluationForm.vivaPresentation}
                        onChange={(e) => setEvaluationForm({...evaluationForm, vivaPresentation: e.target.value})}
                        className="bg-white border-slate-300"
                      />
                      <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-300"
                          style={{width: `${((parseFloat(evaluationForm.vivaPresentation) || 0) / 20) * 100}%`}}
                        />
                      </div>
                    </div>

                    {/* Criteria 4: Report Quality */}
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-semibold text-slate-800">
                          Report Quality & Documentation
                        </Label>
                        <span className="text-xs text-slate-600 font-medium">Max: 30</span>
                      </div>
                      <Input
                        type="number"
                        min="0"
                        max="30"
                        placeholder="Enter marks (0-30)"
                        value={evaluationForm.reportQuality}
                        onChange={(e) => setEvaluationForm({...evaluationForm, reportQuality: e.target.value})}
                        className="bg-white border-slate-300"
                      />
                      <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300"
                          style={{width: `${((parseFloat(evaluationForm.reportQuality) || 0) / 30) * 100}%`}}
                        />
                      </div>
                    </div>

                    {/* Criteria 5: Industry Supervisor Feedback */}
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-semibold text-slate-800">
                          Industry Supervisor Feedback
                        </Label>
                        <span className="text-xs text-slate-600 font-medium">Max: 10</span>
                      </div>
                      <Input
                        type="number"
                        min="0"
                        max="10"
                        placeholder="Enter marks (0-10)"
                        value={evaluationForm.supervisorFeedback}
                        onChange={(e) => setEvaluationForm({...evaluationForm, supervisorFeedback: e.target.value})}
                        className="bg-white border-slate-300"
                      />
                      <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-teal-500 to-teal-600 transition-all duration-300"
                          style={{width: `${((parseFloat(evaluationForm.supervisorFeedback) || 0) / 10) * 100}%`}}
                        />
                      </div>
                    </div>

                    {/* Criteria 6: Company Grade */}
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-sm font-semibold text-slate-800">
                          Company Grade (Category A/B/C)
                        </Label>
                        <span className="text-xs text-slate-600 font-medium">Max: 10</span>
                      </div>
                      <Input
                        type="number"
                        min="0"
                        max="10"
                        placeholder="Enter marks (0-10)"
                        value={evaluationForm.companyGrade}
                        onChange={(e) => setEvaluationForm({...evaluationForm, companyGrade: e.target.value})}
                        className="bg-white border-slate-300"
                      />
                      <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-pink-500 to-pink-600 transition-all duration-300"
                          style={{width: `${((parseFloat(evaluationForm.companyGrade) || 0) / 10) * 100}%`}}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Total Score Display */}
                  <Card className="p-5 bg-gradient-to-br from-blue-900 to-slate-700 text-white mb-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90 mb-1">Total Score</p>
                        <p className="text-4xl font-bold">{calculateTotalScore()}<span className="text-xl opacity-80">/150</span></p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm opacity-90 mb-1">Percentage</p>
                        <p className="text-2xl font-bold">
                          {calculateTotalScore() > 0 ? Math.round((calculateTotalScore() / 150) * 100) : 0}%
                        </p>
                      </div>
                    </div>
                  </Card>

                  {/* Program Outcomes Mapping */}
                  <Card className="p-4 bg-blue-50 border border-blue-200 mb-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-5 h-5 text-blue-700" />
                      <h4 className="font-semibold text-slate-800 text-sm">Program Outcomes (PO) Mapping</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-blue-600 text-white">PO5: Modern Tools</Badge>
                      <Badge className="bg-purple-600 text-white">PO10: Communication</Badge>
                      <Badge className="bg-green-600 text-white">PSO1: Technical Skills</Badge>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">
                      This evaluation contributes to achieving Program Outcomes defined by VIT IQAC.
                    </p>
                  </Card>

                  {/* Additional Remarks */}
                  <div className="mb-5">
                    <Label className="text-sm font-semibold text-slate-800 mb-2 block">
                      Additional Remarks & Recommendations
                    </Label>
                    <textarea
                      rows={4}
                      placeholder="Add any additional observations, suggestions, or recommendations..."
                      value={evaluationForm.remarks}
                      onChange={(e) => setEvaluationForm({...evaluationForm, remarks: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm text-sm"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      onClick={handleSaveDraft}
                      className="w-full bg-slate-200 text-slate-700 hover:bg-slate-300 py-5 shadow-sm"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Draft
                    </Button>
                    <Button
                      onClick={handleSubmitEvaluation}
                      className="w-full bg-gradient-to-r from-blue-900 to-slate-700 hover:from-blue-800 hover:to-slate-600 text-white py-6 shadow-lg hover:shadow-xl transition-all"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Submit Final Evaluation
                    </Button>
                    <Button
                      onClick={() => setShowEvaluationModal(false)}
                      className="w-full bg-white text-slate-700 hover:bg-slate-100 py-3 border border-slate-300"
                    >
                      Cancel
                    </Button>
                  </div>

                  {/* Info Box */}
                  <div className="mt-5 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-900">
                      <span className="font-semibold">VIT IQAC Notice:</span> This evaluation follows the standardized 5-credit (150 marks) internship assessment framework. Once submitted, it will be final and accessible to the student and administration.
                    </p>
                  </div>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
