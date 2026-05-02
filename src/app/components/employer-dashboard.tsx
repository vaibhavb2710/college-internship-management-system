import { useEffect, useState } from 'react';
import { 
  Bell, 
  User, 
  LogOut, 
  Search,
  Star,
  Upload,
  CheckCircle,
  Building2,
  MessageSquare,
  Award,
  FileText,
  Info,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { toast } from 'sonner';
import { employerService } from '@/services/employer';
import { authService } from '@/services/auth';


// Employer Profile Data use
const employerProfile = {
  name: 'Amit Patel',
  designation: 'Senior Tech Lead',
  company: 'TCS',
  email: 'amit.patel@tcs.com',
  companyLogo: 'TCS',
  avatar: 'AP'
};

// Mock Student List for the Company
const companyInterns = [
  {
    id: 'STU001',
    name: 'Priya Sharma',
    rollNo: '2021INFT001',
    department: 'INFT',
    email: 'priya.sharma@vit.edu.in',
    internshipTitle: 'Full Stack Developer Intern',
    startDate: '2024-06-01',
    endDate: '2024-11-30',
    status: 'active'
  },
  {
    id: 'STU002',
    name: 'Rahul Verma',
    rollNo: '2021INFT045',
    department: 'INFT',
    email: 'rahul.verma@vit.edu.in',
    internshipTitle: 'Data Analytics Intern',
    startDate: '2024-05-15',
    endDate: '2024-11-15',
    status: 'active'
  },
  {
    id: 'STU003',
    name: 'Anjali Desai',
    rollNo: '2021INFT078',
    department: 'INFT',
    email: 'anjali.desai@vit.edu.in',
    internshipTitle: 'Cloud Engineer Intern',
    startDate: '2024-06-10',
    endDate: '2024-12-10',
    status: 'active'
  }
];

type EmployerIntern = (typeof companyInterns)[number] & {
  employerFeedback?: {
    technical_skills?: number;
    punctuality?: number;
    teamwork?: number;
    communication?: number;
    problem_solving?: number;
    overall_rating?: number;
    performance?: string;
    remarks?: string;
    institute_feedback?: string;
    submitted_at?: string;
  } | null;
  internshipCertificate?: {
    file_name?: string;
    file_type?: string;
    file_size?: number;
    data_url?: string;
    uploaded_at?: string;
    issued_by?: string;
  } | null;
};

// Star Rating Component
const StarRating = ({ rating, onChange, readonly = false }: { rating: number; onChange?: (rating: number) => void; readonly?: boolean }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          disabled={readonly}
          className={`transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
        >
          <Star
            className={`w-6 h-6 ${
              star <= (hover || rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [companyStudents, setCompanyStudents] = useState<EmployerIntern[]>(companyInterns as EmployerIntern[]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<EmployerIntern | null>(null);
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  const [uploadedCertificate, setUploadedCertificate] = useState<File | null>(null);
  const [existingCertificate, setExistingCertificate] = useState<EmployerIntern['internshipCertificate'] | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Evaluation Form State
  const [evaluationForm, setEvaluationForm] = useState({
    technicalSkills: 0,
    punctuality: 0,
    teamwork: 0,
    communication: 0,
    problemSolving: 0,
    performanceRemarks: '',
    instituteFeedback: '',
    overallRating: 0
  });

  const loadStudents = async () => {
    setStudentsLoading(true);
    try {
      const response = await employerService.getStudents();
      const students = response?.students || [];
      const mappedStudents: EmployerIntern[] = students.map((student: any, index: number) => {
        const template = companyInterns[index % companyInterns.length];
        return {
          ...template,
          id: student._id || template.id,
          name: student.name || template.name,
          rollNo: student.roll_number || template.rollNo,
          department: student.branch || template.department,
          email: student.email || template.email,
          status: student.employer_feedback ? 'evaluated' : 'active',
          employerFeedback: student.employer_feedback || null,
          internshipCertificate: student.internship_certificate || null
        };
      });
      setCompanyStudents(mappedStudents);
    } catch (error) {
      console.error('Error loading students for employer:', error);
      toast.error('Failed to load students');
      setCompanyStudents(companyInterns as EmployerIntern[]);
    } finally {
      setStudentsLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleLogout = () => {
    authService.logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleSelectStudent = (student: EmployerIntern) => {
    const feedback = student.employerFeedback;
    setSelectedStudent(student);
    setShowEvaluationForm(true);
    setEvaluationForm({
      technicalSkills: feedback?.technical_skills || 0,
      punctuality: feedback?.punctuality || 0,
      teamwork: feedback?.teamwork || 0,
      communication: feedback?.communication || 0,
      problemSolving: feedback?.problem_solving || 0,
      performanceRemarks: feedback?.remarks || '',
      instituteFeedback: feedback?.institute_feedback || '',
      overallRating: feedback?.overall_rating || 0
    });
    setUploadedCertificate(null);
    setExistingCertificate(student.internshipCertificate || null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        setUploadedCertificate(file);
        setExistingCertificate(null);
        toast.success('Certificate uploaded successfully');
      } else {
        toast.error('Please upload a PDF or image file');
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf' || file.type.startsWith('image/')) {
        setUploadedCertificate(file);
        setExistingCertificate(null);
        toast.success('Certificate uploaded successfully');
      } else {
        toast.error('Please upload a PDF or image file');
      }
    }
  };

  const fileToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const getPerformanceLabel = (rating: number) => {
    if (rating >= 4.5) return 'Outstanding';
    if (rating >= 4.0) return 'Excellent';
    if (rating >= 3.0) return 'Good';
    if (rating >= 2.0) return 'Average';
    return 'Needs Improvement';
  };

  const handleSubmitEvaluation = async () => {
    // Validation
    if (!selectedStudent) {
      toast.error('Please select a student');
      return;
    }

    if (evaluationForm.technicalSkills === 0 || evaluationForm.punctuality === 0 || evaluationForm.teamwork === 0) {
      toast.error('Please provide ratings for all required fields');
      return;
    }

    if (!evaluationForm.performanceRemarks.trim()) {
      toast.error('Please provide performance remarks');
      return;
    }

    if (!uploadedCertificate && !existingCertificate?.data_url) {
      toast.error('Please upload a completion certificate');
      return;
    }

    try {
      setIsSubmitting(true);
      const averageRating = (
        evaluationForm.technicalSkills +
        evaluationForm.punctuality +
        evaluationForm.teamwork +
        evaluationForm.communication +
        evaluationForm.problemSolving
      ) / 5;
      const overallRating = evaluationForm.overallRating || Number(averageRating.toFixed(2));
      const performance = getPerformanceLabel(overallRating);

      let certificatePayload: any = existingCertificate;
      if (uploadedCertificate) {
        certificatePayload = {
          file_name: uploadedCertificate.name,
          file_type: uploadedCertificate.type || 'application/octet-stream',
          file_size: uploadedCertificate.size,
          data_url: await fileToDataUrl(uploadedCertificate),
          uploaded_at: new Date().toISOString()
        };
      }

      await employerService.evaluateStudent(selectedStudent.id, {
        technical_skills: evaluationForm.technicalSkills,
        punctuality: evaluationForm.punctuality,
        teamwork: evaluationForm.teamwork,
        communication: evaluationForm.communication,
        problem_solving: evaluationForm.problemSolving,
        overall_rating: overallRating,
        performance,
        remarks: evaluationForm.performanceRemarks,
        institute_feedback: evaluationForm.instituteFeedback,
        certificate: certificatePayload
      });

      toast.success(`Evaluation submitted successfully for ${selectedStudent.name}`);
      setShowEvaluationForm(false);
      setSelectedStudent(null);
      setUploadedCertificate(null);
      setExistingCertificate(null);
      await loadStudents();
    } catch (error: any) {
      console.error('Error submitting employer evaluation:', error);
      const errorMessage = error?.response?.data?.error || 'Failed to submit evaluation';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredInterns = companyStudents.filter(intern =>
    intern.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    intern.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-8 py-4">
          {/* Left: Company Branding */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#1e3a5f] to-[#2d5082] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">{employerProfile.companyLogo}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Employer Portal</h1>
              <p className="text-sm text-gray-500">Vidyalankar Institute of Technology</p>
            </div>
          </div>
          
          {/* Right: Company Profile */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">{employerProfile.name}</p>
                <p className="text-xs text-gray-600">{employerProfile.designation}</p>
                <p className="text-xs text-[#1e3a5f] font-semibold">{employerProfile.company}</p>
              </div>
              <div className="w-11 h-11 bg-[#1e3a5f] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">{employerProfile.avatar}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="ml-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Internship Management</h2>
          <p className="text-sm text-gray-600">Provide feedback and upload completion certificates for your interns</p>
        </div>

        {/* Module 1: Individual Student Feedback */}
        <Card className="p-6 mb-6 shadow-md rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Individual Student Feedback</h3>
              <p className="text-sm text-gray-600">Search and evaluate intern performance</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search interns by name or roll number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-6 border-gray-300 shadow-sm"
            />
          </div>

          {studentsLoading && (
            <div className="text-sm text-gray-500 mb-4">Loading students...</div>
          )}

          {/* Student List */}
          <div className="space-y-3">
            {filteredInterns.map((intern) => (
              <Card 
                key={intern.id} 
                className="p-4 bg-gradient-to-r from-slate-50 to-white border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleSelectStudent(intern)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#1e3a5f] rounded-full flex items-center justify-center text-white font-semibold">
                      {intern.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{intern.name}</h4>
                      <p className="text-sm text-gray-600">{intern.rollNo} • {intern.department}</p>
                      <p className="text-xs text-gray-500">{intern.internshipTitle}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {intern.employerFeedback ? (
                      <Badge className="bg-blue-100 text-blue-700 mb-2">Evaluated</Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-700 mb-2">Pending</Badge>
                    )}
                    <p className="text-xs text-gray-500">
                      {intern.startDate} to {intern.endDate}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredInterns.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No interns found matching your search</p>
            </div>
          )}
        </Card>

        {/* Module 2: Institute Feedback */}
        <Card className="p-6 mb-6 shadow-md rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Institute Feedback</h3>
              <p className="text-sm text-gray-600">Share your thoughts on student quality and curriculum</p>
            </div>
          </div>

          <div>
            <Label htmlFor="instituteFeedback" className="text-sm font-semibold text-gray-800 mb-2">
              General Feedback for Vidyalankar Institute of Technology
            </Label>
            <textarea
              id="instituteFeedback"
              rows={4}
              placeholder="Provide suggestions on student quality, curriculum improvements, or any recommendations for the institute..."
              value={evaluationForm.instituteFeedback}
              onChange={(e) => setEvaluationForm({...evaluationForm, instituteFeedback: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] bg-white shadow-sm text-sm"
            />
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-800">
              Your feedback helps the institute improve its curriculum and better prepare students for industry requirements.
            </p>
          </div>
        </Card>
      </main>

      {/* Evaluation Modal */}
      {showEvaluationForm && selectedStudent && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-4xl w-full my-8 shadow-2xl">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5082] px-6 py-5 flex items-center justify-between rounded-t-xl">
              <div>
                <h2 className="text-xl font-bold text-white">Performance Review & Completion</h2>
                <p className="text-sm text-white/80 mt-1">
                  {selectedStudent.name} • {selectedStudent.rollNo}
                </p>
              </div>
              <button
                onClick={() => setShowEvaluationForm(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Student Info */}
              <Card className="p-4 mb-6 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Position</p>
                    <p className="font-semibold text-gray-800">{selectedStudent.internshipTitle}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Department</p>
                    <p className="font-semibold text-gray-800">{selectedStudent.department}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Duration</p>
                    <p className="font-semibold text-gray-800">
                      {selectedStudent.startDate} to {selectedStudent.endDate}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Performance Rating Section */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Performance Ratings
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Technical Skills */}
                  <Card className="p-4 shadow-sm border border-gray-200">
                    <Label className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="text-red-500">*</span>
                      Technical Skills
                    </Label>
                    <StarRating
                      rating={evaluationForm.technicalSkills}
                      onChange={(rating) => setEvaluationForm({...evaluationForm, technicalSkills: rating})}
                    />
                    <p className="text-xs text-gray-500 mt-2">Rate technical competency and skill application</p>
                  </Card>

                  {/* Punctuality */}
                  <Card className="p-4 shadow-sm border border-gray-200">
                    <Label className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="text-red-500">*</span>
                      Punctuality & Discipline
                    </Label>
                    <StarRating
                      rating={evaluationForm.punctuality}
                      onChange={(rating) => setEvaluationForm({...evaluationForm, punctuality: rating})}
                    />
                    <p className="text-xs text-gray-500 mt-2">Rate time management and professional conduct</p>
                  </Card>

                  {/* Teamwork */}
                  <Card className="p-4 shadow-sm border border-gray-200">
                    <Label className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="text-red-500">*</span>
                      Teamwork & Collaboration
                    </Label>
                    <StarRating
                      rating={evaluationForm.teamwork}
                      onChange={(rating) => setEvaluationForm({...evaluationForm, teamwork: rating})}
                    />
                    <p className="text-xs text-gray-500 mt-2">Rate ability to work effectively in teams</p>
                  </Card>

                  {/* Communication */}
                  <Card className="p-4 shadow-sm border border-gray-200">
                    <Label className="text-sm font-semibold text-gray-800 mb-3">
                      Communication Skills
                    </Label>
                    <StarRating
                      rating={evaluationForm.communication}
                      onChange={(rating) => setEvaluationForm({...evaluationForm, communication: rating})}
                    />
                    <p className="text-xs text-gray-500 mt-2">Rate verbal and written communication</p>
                  </Card>

                  {/* Problem Solving */}
                  <Card className="p-4 shadow-sm border border-gray-200 md:col-span-2">
                    <Label className="text-sm font-semibold text-gray-800 mb-3">
                      Problem Solving & Initiative
                    </Label>
                    <StarRating
                      rating={evaluationForm.problemSolving}
                      onChange={(rating) => setEvaluationForm({...evaluationForm, problemSolving: rating})}
                    />
                    <p className="text-xs text-gray-500 mt-2">Rate analytical thinking and proactive approach</p>
                  </Card>
                </div>
              </div>

              {/* Performance Remarks */}
              <div className="mb-6">
                <Label htmlFor="performanceRemarks" className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-1">
                  <span className="text-red-500">*</span>
                  Performance Remarks
                </Label>
                <textarea
                  id="performanceRemarks"
                  rows={5}
                  placeholder="Provide detailed feedback on the intern's performance, achievements, areas of improvement, and overall contribution..."
                  value={evaluationForm.performanceRemarks}
                  onChange={(e) => setEvaluationForm({...evaluationForm, performanceRemarks: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] bg-white shadow-sm text-sm"
                />
              </div>

              {/* Module 3: Certificate Upload */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-600" />
                  Completion Certificate Upload
                  <span className="text-red-500 text-sm">*</span>
                </h3>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                    isDragging
                      ? 'border-[#1e3a5f] bg-blue-50'
                      : (uploadedCertificate || existingCertificate)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                  }`}
                >
                  {(uploadedCertificate || existingCertificate) ? (
                    <div>
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <p className="font-semibold text-gray-800 mb-1">Certificate Uploaded Successfully!</p>
                      <p className="text-sm text-gray-600 mb-1">
                        {uploadedCertificate?.name || existingCertificate?.file_name}
                      </p>
                      {existingCertificate?.uploaded_at && !uploadedCertificate && (
                        <p className="text-xs text-gray-500 mb-4">
                          Uploaded: {new Date(existingCertificate.uploaded_at).toLocaleString()}
                        </p>
                      )}
                      <Button
                        onClick={() => {
                          setUploadedCertificate(null);
                          setExistingCertificate(null);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white text-sm"
                      >
                        Remove File
                      </Button>
                      {existingCertificate?.data_url && !uploadedCertificate && (
                        <a
                          href={existingCertificate.data_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block ml-3 text-sm text-blue-700 underline"
                        >
                          View Existing
                        </a>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Upload className="w-8 h-8 text-gray-500" />
                      </div>
                      <p className="font-semibold text-gray-800 mb-1">Drag & Drop Certificate Here</p>
                      <p className="text-sm text-gray-600 mb-4">or click to browse files (PDF or Image)</p>
                      <label htmlFor="certificate-upload">
                        <Button
                          type="button"
                          onClick={() => document.getElementById('certificate-upload')?.click()}
                          className="bg-[#1e3a5f] hover:bg-[#2d5082] text-white"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Browse Files
                        </Button>
                      </label>
                      <input
                        id="certificate-upload"
                        type="file"
                        accept=".pdf,image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-2">
                  <Info className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-orange-800">
                    <p className="font-semibold mb-1">Important Notice:</p>
                    <p>Once you submit this evaluation, the certificate and feedback will instantly reflect on:</p>
                    <ul className="list-disc list-inside mt-2 ml-2 space-y-1">
                      <li>Student Dashboard (visible to the intern)</li>
                      <li>Institute Admin Dashboard (for statistical overview)</li>
                      <li>Department Coordinator Dashboard (for final grade assignment)</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowEvaluationForm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300 py-6"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitEvaluation}
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-[#1e3a5f] to-[#2d5082] hover:from-[#2d5082] hover:to-[#1e3a5f] text-white py-6 shadow-lg hover:shadow-xl transition-all"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {isSubmitting ? 'Submitting...' : 'Submit Final Evaluation'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
