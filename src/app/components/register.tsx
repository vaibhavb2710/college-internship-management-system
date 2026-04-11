import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Building2,
  BookOpen,
  Briefcase,
  Upload,
  Award,
  X,
  ChevronLeft,
  Linkedin,
} from "lucide-react";
import { authService } from "../../services/auth";

interface FormData {
  name: string;
  branch: string;
  email: string;
  roll_number: string;
  phone: string;
  address: string;
  password: string;
  confirmPassword: string;
  year: string;
  education: string;
  skills: string[];
  linkedin_url: string;
  internshipExperience: string;
  professionalExperience: string;
  resume: File | null;
  certifications: File[];
}

export function Register() {
  const navigate = useNavigate(); // Initialize the navigation hook
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    branch: "",
    email: "",
    roll_number: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    year: "",
    education: "",
    skills: [],
    linkedin_url: "",
    internshipExperience: "",
    professionalExperience: "",
    resume: null,
    certifications: [],
  });
  const [skillInput, setSkillInput] = useState("");

  const branches = [
    { code: "CMPN", label: "Computer Engineering (CMPN)" },
    { code: "INFT", label: "Information Technology (INFT)" },
    { code: "EXTC", label: "Electronics & Telecommunication (EXTC)" },
    { code: "EXCS", label: "Computer Science & Engineering (EXCS)" },
    { code: "BIOMED", label: "Biomedical Engineering (BIOMED)" },
  ];

  const years = [
    "First Year",
    "Second Year",
    "Third Year",
    "Fourth Year",
  ];

  const sections = [
    { title: "Basic Details", icon: User },
    { title: "Academic & Skills", icon: BookOpen },
    { title: "Experience", icon: Briefcase },
    { title: "Documents", icon: Upload },
  ];

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
      !formData.skills.includes(skillInput.trim())
    ) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(
        (skill) => skill !== skillToRemove,
      ),
    });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "resume" | "certifications",
  ) => {
    const files = e.target.files;
    if (!files) return;

    if (field === "resume") {
      setFormData({ ...formData, resume: files[0] });
    } else {
      setFormData({
        ...formData,
        certifications: [
          ...formData.certifications,
          ...Array.from(files),
        ],
      });
    }
  };

  const handleRemoveCertification = (index: number) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter(
        (_, i) => i !== index,
      ),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords before proceeding
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!formData.name || !formData.email || !formData.branch || !formData.roll_number || !formData.year) {
      alert("Please fill in all required fields (Name, Email, Branch, Roll Number, Year)");
      return;
    }

    // Validate student email domain
    if (!formData.email.toLowerCase().endsWith("@vit.edu.in")) {
      alert("Students must register with a valid @vit.edu.in email address");
      return;
    }

    try {
      // Parse full name into first and last name
      const nameParts = formData.name.trim().split(" ");
      const first_name = nameParts[0];
      const last_name = nameParts.slice(1).join(" ") || "Student";

      const branch = formData.branch;
      
      // Use the user-provided roll number
      const roll_number = formData.roll_number.toUpperCase();

      // Convert resume file to base64
      let resumeBase64 = '';
      if (formData.resume) {
        resumeBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(formData.resume as File);
        });
      }

      // Convert certification files to base64
      const certificationsBase64: string[] = [];
      for (const cert of formData.certifications) {
        try {
          const base64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(cert);
          });
          certificationsBase64.push(base64);
        } catch (err) {
          console.error('Error reading certification file:', err);
        }
      }

      // Prepare data for backend
      const registrationData = {
        email: formData.email,
        password: formData.password,
        first_name,
        last_name,
        role: "student",
        roll_number,
        branch,
        year: formData.year || "First Year",
        skills: formData.skills,
        linkedin_url: formData.linkedin_url,
        phone: formData.phone,
        address: formData.address,
        education: formData.education,
        internshipExperience: formData.internshipExperience,
        professionalExperience: formData.professionalExperience,
        resume: resumeBase64,
        certifications: certificationsBase64,
      };

      console.log("Sending registration data:", registrationData);

      // Call the registration API
      const response = await authService.register(registrationData);
      
      if (response && response.token) {
        alert("Registration successful! Redirecting to dashboard...");
        // Redirect to the Student Dashboard upon successful registration
        navigate("/student/dashboard");
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessage = error.response?.data?.error || error.message || "Registration failed";
      alert(`Registration Error: ${errorMessage}`);
    }
  };

  const nextSection = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-900 rounded-2xl mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Student Registration
          </h1>
          <p className="text-slate-600">
            Create your account to get started
          </p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center">
            {sections.map((section, index) => {
              const Icon = section.icon;
              const isActive = index === currentSection;
              const isCompleted = index < currentSection;

              return (
                <div
                  key={index}
                  className="flex-1 flex items-center"
                >
                  <div className="flex flex-col items-center w-full">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                        isActive
                          ? "bg-blue-900 text-white"
                          : isCompleted
                            ? "bg-green-500 text-white"
                            : "bg-slate-200 text-slate-400"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-xs mt-2 text-center ${isActive ? "text-blue-900 font-semibold" : "text-slate-500"}`}
                    >
                      {section.title}
                    </span>
                  </div>
                  {index < sections.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-2 ${isCompleted ? "bg-green-500" : "bg-slate-200"}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit}>
            {/* Section 1: Basic Details */}
            {currentSection === 0 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-slate-900 mb-6">
                  Basic Details
                </h2>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none transition"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="branch"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Branch
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <BookOpen className="h-5 w-5 text-slate-400" />
                    </div>
                    <select
                      id="branch"
                      name="branch"
                      value={formData.branch}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none transition appearance-none bg-white"
                      required
                    >
                      <option value="">
                        Select your branch
                      </option>
                      {branches.map((branch) => (
                        <option key={branch.code} value={branch.code}>
                          {branch.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

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
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none transition appearance-none bg-white"
                      required
                    >
                      <option value="">
                        Select your academic year
                      </option>
                      {years.map((yr) => (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="roll_number"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Roll Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      id="roll_number"
                      name="roll_number"
                      value={formData.roll_number}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none transition"
                      placeholder="Enter your roll number"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Email Address <span className="text-red-500">*VIT Email Required</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none transition"
                      placeholder="your.email@vit.edu.in"
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Please use your VIT college email address (@vit.edu.in)</p>
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
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none transition"
                      placeholder="+91 1234567890"
                      required
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
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none transition resize-none"
                      placeholder="Enter your address"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none transition"
                      placeholder="Create a password"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none transition"
                      placeholder="Confirm your password"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Section 2: Academic & Skills */}
            {currentSection === 1 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-slate-900 mb-6">
                  Academic & Skills
                </h2>
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
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none transition appearance-none bg-white"
                      required
                    >
                      <option value="">
                        Select your academic year
                      </option>
                      {years.map((yr) => (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="education"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Education History
                  </label>
                  <textarea
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    rows={4}
                    className="block w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none transition resize-none"
                    placeholder="e.g., B.Tech Computer Engineering (2022-2026)"
                  />
                </div>

                <div>
                  <label
                    htmlFor="skills"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Skills
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) =>
                        setSkillInput(e.target.value)
                      }
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleAddSkill())
                      }
                      className="flex-1 px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none transition"
                      placeholder="Add a skill (e.g., React, Python)"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition font-medium"
                    >
                      Add
                    </button>
                  </div>
                  {formData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-900 rounded-full text-sm font-medium"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveSkill(skill)
                            }
                            className="hover:bg-blue-200 rounded-full p-0.5 transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

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
                      className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none transition"
                      placeholder="https://www.linkedin.com/in/yourprofile"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Section 3: Experience */}
            {currentSection === 2 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-slate-900 mb-6">
                  Experience
                </h2>
                <div>
                  <label
                    htmlFor="internshipExperience"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Internship Experience
                  </label>
                  <textarea
                    id="internshipExperience"
                    name="internshipExperience"
                    value={formData.internshipExperience}
                    onChange={handleChange}
                    rows={4}
                    className="block w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none transition resize-none"
                    placeholder="Describe your internship experience..."
                  />
                </div>

                <div>
                  <label
                    htmlFor="professionalExperience"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Past Professional Experience
                  </label>
                  <textarea
                    id="professionalExperience"
                    name="professionalExperience"
                    value={formData.professionalExperience}
                    onChange={handleChange}
                    rows={4}
                    className="block w-full px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-900 outline-none transition resize-none"
                    placeholder="Describe your professional experience..."
                  />
                </div>
              </div>
            )}

            {/* Section 4: Documents */}
            {currentSection === 3 && (
              <div className="space-y-5">
                <h2 className="text-xl font-bold text-slate-900 mb-6">
                  Documents
                </h2>
                <div>
                  <label
                    htmlFor="resume"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Resume Upload
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-900 transition">
                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-sm text-slate-600 mb-2">
                      {formData.resume
                        ? formData.resume.name
                        : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-slate-500">
                      PDF, DOC, DOCX (Max. 5MB)
                    </p>
                    <input
                      type="file"
                      id="resume"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) =>
                        handleFileChange(e, "resume")
                      }
                      className="hidden"
                    />
                    <label
                      htmlFor="resume"
                      className="inline-block mt-3 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition cursor-pointer"
                    >
                      Choose File
                    </label>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="certifications"
                    className="block text-sm font-medium text-slate-700 mb-2"
                  >
                    Certifications
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-900 transition">
                    <Award className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-sm text-slate-600 mb-2">
                      Upload your certifications
                    </p>
                    <input
                      type="file"
                      id="certifications"
                      accept=".pdf,.jpg,.jpeg,.png"
                      multiple
                      onChange={(e) =>
                        handleFileChange(e, "certifications")
                      }
                      className="hidden"
                    />
                    <label
                      htmlFor="certifications"
                      className="inline-block mt-3 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition cursor-pointer"
                    >
                      Choose Files
                    </label>
                  </div>
                  {formData.certifications.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {formData.certifications.map(
                        (cert, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                          >
                            <span className="text-sm text-slate-700 truncate flex-1">
                              {cert.name}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveCertification(index)
                              }
                              className="ml-2 p-1 hover:bg-slate-200 rounded transition"
                            >
                              <X className="w-4 h-4 text-slate-600" />
                            </button>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-200">
              {currentSection > 0 ? (
                <button
                  type="button"
                  onClick={prevSection}
                  className="flex items-center gap-2 px-6 py-3 text-slate-700 hover:text-slate-900 font-medium transition"
                >
                  <ChevronLeft className="w-5 h-5" /> Previous
                </button>
              ) : (
                <Link
                  to="/"
                  className="flex items-center gap-2 px-6 py-3 text-slate-700 hover:text-slate-900 font-medium transition"
                >
                  <ChevronLeft className="w-5 h-5" /> Back to
                  Login
                </Link>
              )}

              {currentSection < sections.length - 1 ? (
                <button
                  type="button"
                  onClick={nextSection}
                  className="px-8 py-3 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition shadow-lg shadow-blue-900/30"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition shadow-lg shadow-green-600/30"
                >
                  Complete Registration
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
