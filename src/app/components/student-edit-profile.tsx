import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, BookOpen, Briefcase, Code, Linkedin, Save, X, ChevronLeft, FileText, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { studentService } from '@/services/student';
import { authService } from '@/services/auth';

interface StudentProfile {
  first_name?: string;
  last_name?: string;
  roll_number?: string;
  phone?: string;
  address?: string;
  education?: string;
  internship_experience?: string;
  professional_experience?: string;
  skills?: string[];
  linkedin_url?: string;
  email?: string;
  branch?: string;
  year?: string;
  resume?: string;
  certifications?: string[];
}

export function StudentEditProfile() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [certificationsFiles, setCertificationsFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<StudentProfile>({
    first_name: '',
    last_name: '',
    roll_number: '',
    phone: '',
    address: '',
    education: '',
    internship_experience: '',
    professional_experience: '',
    skills: [],
    linkedin_url: '',
    email: '',
    branch: '',
    year: '',
    resume: '',
    certifications: [],
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        // Use cache=true to get cached data on edit page (faster load)
        const profile = await studentService.getCurrentProfile(true);
        if (profile) {
          setFormData({
            first_name: profile.user_data?.first_name || '',
            last_name: profile.user_data?.last_name || '',
            roll_number: profile.roll_number || '',
            phone: profile.phone || '',
            address: profile.address || '',
            education: profile.education || '',
            internship_experience: profile.internship_experience || '',
            professional_experience: profile.professional_experience || '',
            skills: profile.skills || [],
            linkedin_url: profile.linkedin_url || '',
            email: profile.user_data?.email || '',
            branch: profile.branch || '',
            year: profile.year || '',
            resume: profile.resume || '',
            certifications: profile.certifications || [],
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
        if ((error as any).response?.status === 401) {
          authService.logout();
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddSkill = () => {
    if (
      skillInput.trim() &&
      !formData.skills?.includes(skillInput.trim())
    ) {
      setFormData({
        ...formData,
        skills: [...(formData.skills || []), skillInput.trim()],
      });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills?.filter(
        (skill) => skill !== skillToRemove,
      ) || [],
    });
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setResumeFile(files[0]);
    }
  };

  const handleCertificationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setCertificationsFiles(Array.from(files));
    }
  };

  const handleRemoveCertification = (index: number) => {
    setFormData({
      ...formData,
      certifications: formData.certifications?.filter((_, i) => i !== index) || [],
    });
  };

  const downloadFile = (fileData: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileData;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.first_name || !formData.last_name) {
      toast.error('Please enter first and last name');
      return;
    }

    setIsSaving(true);
    try {
      // Convert resume file to base64 if new file selected
      let resumeBase64 = formData.resume;
      if (resumeFile) {
        resumeBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(resumeFile);
        });
      }

      // Convert certification files to base64 if new files selected
      let certificationsBase64 = formData.certifications;
      if (certificationsFiles.length > 0) {
        const newCerts: string[] = [];
        for (const cert of certificationsFiles) {
          try {
            const base64 = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(cert);
            });
            newCerts.push(base64);
          } catch (err) {
            console.error('Error reading certification file:', err);
          }
        }
        // Combine existing certs with new ones
        certificationsBase64 = [...(formData.certifications || []), ...newCerts];
      }

      const updateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        roll_number: formData.roll_number,
        phone: formData.phone,
        address: formData.address,
        year: formData.year,
        education: formData.education,
        internship_experience: formData.internship_experience,
        professional_experience: formData.professional_experience,
        skills: formData.skills,
        linkedin_url: formData.linkedin_url,
        resume: resumeBase64,
        certifications: certificationsBase64,
      };
      
      console.log('Sending update data:', updateData);
      const response = await studentService.updateProfile(updateData);
      console.log('Update response:', response);

      toast.success('Profile updated successfully!');
      // Reset file inputs
      setResumeFile(null);
      setCertificationsFiles([]);
      // Wait a moment before navigating to ensure data is saved
      setTimeout(() => {
        navigate('/student/dashboard', { state: { refreshProfile: true } });
      }, 500);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-900 border-t-slate-200"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="p-2 hover:bg-slate-200 rounded-lg transition"
          >
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Edit Profile</h1>
            <p className="text-slate-600">Update your information</p>
          </div>
        </div>

        {/* Edit Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Section */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4">Personal Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="first_name"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="last_name"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="block w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none transition"
                    required
                  />
                </div>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="roll_number"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Roll Number
                </label>
                <input
                  type="text"
                  id="roll_number"
                  name="roll_number"
                  value={formData.roll_number}
                  onChange={handleChange}
                  className="block w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none transition"
                  required
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t border-slate-200 pt-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Email (Read-only)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      disabled
                      className="block w-full pl-10 px-3 py-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full pl-10 px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none transition"
                      placeholder="+91 1234567890"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                      <MapPin className="h-5 w-5 text-slate-400" />
                    </div>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      className="block w-full pl-10 px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none transition resize-none"
                      placeholder="Enter your address"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="border-t border-slate-200 pt-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Academic Information</h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="year"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Academic Year
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BookOpen className="h-5 w-5 text-slate-400" />
                    </div>
                    <select
                      id="year"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      className="block w-full pl-10 px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none transition appearance-none bg-white"
                    >
                      <option value="">Select your academic year</option>
                      <option value="First Year">First Year</option>
                      <option value="Second Year">Second Year</option>
                      <option value="Third Year">Third Year</option>
                      <option value="Fourth Year">Fourth Year</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="education"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Education Qualification
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BookOpen className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      id="education"
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      className="block w-full pl-10 px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none transition"
                      placeholder="e.g., B.Tech in Information Technology"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Experience */}
            <div className="border-t border-slate-200 pt-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Experience</h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="internship_experience"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Internship Experience
                  </label>
                  <textarea
                    id="internship_experience"
                    name="internship_experience"
                    value={formData.internship_experience}
                    onChange={handleChange}
                    rows={3}
                    className="block w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none transition resize-none"
                    placeholder="Describe your internship experience..."
                  />
                </div>

                <div>
                  <label
                    htmlFor="professional_experience"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Professional Experience
                  </label>
                  <textarea
                    id="professional_experience"
                    name="professional_experience"
                    value={formData.professional_experience}
                    onChange={handleChange}
                    rows={3}
                    className="block w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none transition resize-none"
                    placeholder="Describe your professional experience..."
                  />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="border-t border-slate-200 pt-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Technical Skills</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Skills</label>
                <div className="flex gap-2 mb-3">
                  <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Code className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                      className="block w-full pl-10 px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none transition"
                      placeholder="Add a skill and press Enter"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="bg-blue-900 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-800 transition"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills?.map((skill, idx) => (
                    <div
                      key={idx}
                      className="bg-blue-50 text-blue-900 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-red-600 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* LinkedIn */}
            <div className="border-t border-slate-200 pt-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Social Profile</h2>
              <div>
                <label
                  htmlFor="linkedin_url"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  LinkedIn Profile URL
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Linkedin className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="url"
                    id="linkedin_url"
                    name="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={handleChange}
                    className="block w-full pl-10 px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none transition"
                    placeholder="https://linkedin.com/in/your-profile"
                  />
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="border-t border-slate-200 pt-6">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Documents</h2>
              <div className="space-y-6">
                {/* Resume */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Resume</label>
                  
                  {/* Current Resume */}
                  {formData.resume && (
                    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-5 h-5 text-blue-900" />
                          <span className="text-sm font-medium text-blue-900">Current Resume</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => downloadFile(formData.resume!, 'resume.pdf')}
                          className="text-blue-900 hover:text-blue-700 transition"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-600 mt-2">Click the download icon to view your current resume</p>
                    </div>
                  )}

                  {/* Upload New Resume */}
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-900 transition cursor-pointer">
                    <input
                      type="file"
                      id="resume"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeChange}
                      className="hidden"
                    />
                    <label htmlFor="resume" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-slate-700">
                        {resumeFile ? resumeFile.name : 'Click to upload new resume'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">PDF, DOC, or DOCX • Max 10MB</p>
                    </label>
                  </div>
                </div>

                {/* Certificates */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Certificates</label>
                  
                  {/* Current Certificates */}
                  {formData.certifications && formData.certifications.length > 0 && (
                    <div className="mb-4 space-y-2">
                      <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Uploaded Certificates</p>
                      <div className="space-y-2">
                        {formData.certifications.map((cert, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="w-5 h-5 text-green-900" />
                              <span className="text-sm font-medium text-green-900">Certificate {idx + 1}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => downloadFile(cert, `certificate_${idx + 1}.pdf`)}
                                className="text-green-900 hover:text-green-700 transition"
                              >
                                <Download className="w-5 h-5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveCertification(idx)}
                                className="text-red-500 hover:text-red-700 transition"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Upload New Certificates */}
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-900 transition cursor-pointer">
                    <input
                      type="file"
                      id="certifications"
                      accept=".pdf,.jpg,.jpeg,.png"
                      multiple
                      onChange={handleCertificationsChange}
                      className="hidden"
                    />
                    <label htmlFor="certifications" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-slate-700">
                        {certificationsFiles.length > 0
                          ? `${certificationsFiles.length} file(s) selected`
                          : 'Click to upload new certificates'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">PDF, JPG, or PNG • Max 10MB each • Multiple files allowed</p>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="border-t border-slate-200 pt-6 flex gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition disabled:opacity-70 gap-2 flex items-center justify-center"
              >
                <Save className="w-5 h-5" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/student/dashboard')}
                className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-200 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
