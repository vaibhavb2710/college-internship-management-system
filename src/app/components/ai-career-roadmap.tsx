import { useState } from 'react';
import {
  Zap,
  ChevronRight,
  Clock,
  Target,
  BookOpen,
  Code,
  Award,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  Briefcase,
  Calendar as CalendarIcon
} from 'lucide-react';

interface SkillTag {
  id: string;
  label: string;
}

const predefinedSkills: SkillTag[] = [
  { id: 'react', label: 'React' },
  { id: 'nodejs', label: 'Node.js' },
  { id: 'python', label: 'Python' },
  { id: 'java', label: 'Java' },
  { id: 'ml', label: 'Machine Learning' },
  { id: 'sql', label: 'SQL' },
  { id: 'mongodb', label: 'MongoDB' },
  { id: 'aws', label: 'AWS' },
  { id: 'docker', label: 'Docker' },
  { id: 'angular', label: 'Angular' }
];

const skillsToLearn = [
  { id: 'ml', label: 'Machine Learning', icon: '🤖' },
  { id: 'webdev', label: 'Web Development', icon: '🌐' },
  { id: 'cloud', label: 'Cloud Computing', icon: '☁️' },
  { id: 'ai', label: 'Artificial Intelligence', icon: '🧠' },
  { id: 'mobile', label: 'Mobile Development', icon: '📱' },
  { id: 'devops', label: 'DevOps', icon: '⚙️' }
];

const educationLevels = [
  'Pursuing B.Tech',
  'Pursuing M.Tech',
  'B.Tech Completed',
  'M.Tech Completed',
  'Pursuing Diploma',
  'Diploma Completed'
];

const branches = [
  'Computer Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical Engineering'
];

const durations = [
  '1-2 Months',
  '3-4 Months',
  '5-6 Months',
  '6-12 Months'
];

interface RoadmapInputs {
  currentSkills: string[];
  education: string;
  branch: string;
  experience: string;
  targetPosition: string;
  skillToLearn: string;
  duration: string;
}

// Function to generate roadmap steps based on skill and duration
function generateRoadmapSteps(skillToLearn: string, duration: string, currentSkills: string[]) {
  const skillData: Record<string, any> = {
    'ml': {
      name: 'Machine Learning',
      steps: [
        { title: 'Python & Math Fundamentals', weeks: '3-4 weeks', icon: 'BookOpen' },
        { title: 'Statistics & Probability', weeks: '2-3 weeks', icon: 'TrendingUp' },
        { title: 'Supervised Learning Algorithms', weeks: '3-4 weeks', icon: 'Code' },
        { title: 'Deep Learning & Neural Networks', weeks: '4-5 weeks', icon: 'Sparkles' },
        { title: 'Real-World ML Projects', weeks: '3-4 weeks', icon: 'Award' },
        { title: 'Model Deployment & MLOps', weeks: '2-3 weeks', icon: 'Briefcase' }
      ]
    },
    'webdev': {
      name: 'Web Development',
      steps: [
        { title: 'HTML, CSS & JavaScript Basics', weeks: '2-3 weeks', icon: 'BookOpen' },
        { title: 'Frontend Framework (React/Angular)', weeks: '4-5 weeks', icon: 'Code' },
        { title: 'Backend Development (Node.js/Django)', weeks: '4-5 weeks', icon: 'TrendingUp' },
        { title: 'Database Design & SQL', weeks: '2-3 weeks', icon: 'Sparkles' },
        { title: 'REST APIs & Authentication', weeks: '3-4 weeks', icon: 'Award' },
        { title: 'Full-Stack Project & Deployment', weeks: '3-4 weeks', icon: 'Briefcase' }
      ]
    },
    'cloud': {
      name: 'Cloud Computing',
      steps: [
        { title: 'Cloud Fundamentals & AWS Basics', weeks: '2-3 weeks', icon: 'BookOpen' },
        { title: 'Compute Services (EC2, Lambda)', weeks: '3-4 weeks', icon: 'Code' },
        { title: 'Storage & Database Services', weeks: '3-4 weeks', icon: 'TrendingUp' },
        { title: 'Networking & Security', weeks: '3-4 weeks', icon: 'Sparkles' },
        { title: 'Containers & Kubernetes', weeks: '4-5 weeks', icon: 'Award' },
        { title: 'CI/CD & DevOps Practices', weeks: '3-4 weeks', icon: 'Briefcase' }
      ]
    },
    'ai': {
      name: 'Artificial Intelligence',
      steps: [
        { title: 'AI Fundamentals & Python', weeks: '3-4 weeks', icon: 'BookOpen' },
        { title: 'Machine Learning Basics', weeks: '3-4 weeks', icon: 'Code' },
        { title: 'Natural Language Processing', weeks: '4-5 weeks', icon: 'TrendingUp' },
        { title: 'Computer Vision', weeks: '4-5 weeks', icon: 'Sparkles' },
        { title: 'Deep Learning & Transformers', weeks: '4-5 weeks', icon: 'Award' },
        { title: 'AI Model Deployment', weeks: '2-3 weeks', icon: 'Briefcase' }
      ]
    },
    'mobile': {
      name: 'Mobile Development',
      steps: [
        { title: 'Mobile Development Basics', weeks: '2-3 weeks', icon: 'BookOpen' },
        { title: 'React Native / Flutter', weeks: '4-5 weeks', icon: 'Code' },
        { title: 'UI/UX for Mobile Apps', weeks: '3-4 weeks', icon: 'TrendingUp' },
        { title: 'State Management & Navigation', weeks: '3-4 weeks', icon: 'Sparkles' },
        { title: 'API Integration & Storage', weeks: '3-4 weeks', icon: 'Award' },
        { title: 'App Publishing & Testing', weeks: '2-3 weeks', icon: 'Briefcase' }
      ]
    },
    'devops': {
      name: 'DevOps',
      steps: [
        { title: 'Linux & Shell Scripting', weeks: '2-3 weeks', icon: 'BookOpen' },
        { title: 'Version Control & Git', weeks: '2-3 weeks', icon: 'Code' },
        { title: 'CI/CD Pipelines', weeks: '4-5 weeks', icon: 'TrendingUp' },
        { title: 'Containerization (Docker)', weeks: '3-4 weeks', icon: 'Sparkles' },
        { title: 'Container Orchestration (Kubernetes)', weeks: '4-5 weeks', icon: 'Award' },
        { title: 'Monitoring & Infrastructure as Code', weeks: '3-4 weeks', icon: 'Briefcase' }
      ]
    }
  };

  const skill = skillData[skillToLearn] || skillData['ml'];
  
  // Filter steps based on duration
  let steps = skill.steps;
  if (duration === '1-2 Months') {
    steps = steps.slice(0, 3);
  } else if (duration === '3-4 Months') {
    steps = steps.slice(0, 4);
  } else if (duration === '5-6 Months') {
    steps = steps.slice(0, 5);
  }
  
  return { name: skill.name, steps };
}

export function AICareerRoadmap() {
  const [roadmapGenerated, setRoadmapGenerated] = useState(false);
  const [inputs, setInputs] = useState<RoadmapInputs>({
    currentSkills: [],
    education: '',
    branch: '',
    experience: '',
    targetPosition: '',
    skillToLearn: '',
    duration: ''
  });

  const [showSkillDropdown, setShowSkillDropdown] = useState(false);

  const toggleSkill = (skillId: string) => {
    setInputs(prev => ({
      ...prev,
      currentSkills: prev.currentSkills.includes(skillId)
        ? prev.currentSkills.filter(s => s !== skillId)
        : [...prev.currentSkills, skillId]
    }));
  };

  const handleGenerateRoadmap = () => {
    // Validate inputs
    if (!inputs.education || !inputs.branch || !inputs.skillToLearn || !inputs.duration) {
      alert('Please fill in all required fields: Education, Branch, Skill to Learn, and Target Duration');
      return;
    }
    setRoadmapGenerated(true);
  };

  const handleResetRoadmap = () => {
    setRoadmapGenerated(false);
    setInputs({
      currentSkills: [],
      education: '',
      branch: '',
      experience: '',
      targetPosition: '',
      skillToLearn: '',
      duration: ''
    });
  };

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      BookOpen,
      Code,
      TrendingUp,
      Sparkles,
      Award,
      Briefcase
    };
    return icons[iconName] || BookOpen;
  };

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-6 h-6 text-blue-900" />
        <h2 className="text-xl font-bold text-slate-900">Accelerate Your Skills with AI Roadmaps</h2>
        <span className="text-xs bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-lg font-medium">
          Premium
        </span>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {!roadmapGenerated ? (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900 to-slate-700 p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Generate Your Personalized Learning Roadmap</h3>
              <p className="text-sm text-blue-100">
                Tell us about your background and goals, and we'll create a custom learning path just for you.
              </p>
            </div>

            {/* Input Form */}
            <div className="p-6">
              {/* Profile Section */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-900" />
                  Your Profile
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Current Skills */}
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Current Skills (Select all that apply)
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => setShowSkillDropdown(!showSkillDropdown)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-left text-sm hover:border-blue-900 transition-colors"
                      >
                        {inputs.currentSkills.length > 0
                          ? `${inputs.currentSkills.length} skill${inputs.currentSkills.length > 1 ? 's' : ''} selected`
                          : 'Select your current skills...'}
                      </button>
                      
                      {showSkillDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {predefinedSkills.map(skill => (
                            <label
                              key={skill.id}
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={inputs.currentSkills.includes(skill.id)}
                                onChange={() => toggleSkill(skill.id)}
                                className="w-4 h-4 text-blue-900 rounded"
                              />
                              <span className="text-sm text-slate-700">{skill.label}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                    {inputs.currentSkills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {inputs.currentSkills.map(skillId => {
                          const skill = predefinedSkills.find(s => s.id === skillId);
                          return (
                            <span
                              key={skillId}
                              className="bg-blue-50 text-blue-900 px-3 py-1 rounded-full text-xs font-medium"
                            >
                              {skill?.label}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Education */}
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Education (Highest Degree) <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={inputs.education}
                      onChange={e => setInputs({ ...inputs, education: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm hover:border-blue-900 transition-colors"
                    >
                      <option value="">Select education level...</option>
                      {educationLevels.map(level => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Branch */}
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Branch <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={inputs.branch}
                      onChange={e => setInputs({ ...inputs, branch: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm hover:border-blue-900 transition-colors"
                    >
                      <option value="">Select branch...</option>
                      {branches.map(branch => (
                        <option key={branch} value={branch}>
                          {branch}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Background Section */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-900" />
                  Background
                </h4>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Experience (if any)
                  </label>
                  <textarea
                    value={inputs.experience}
                    onChange={e => setInputs({ ...inputs, experience: e.target.value })}
                    placeholder="E.g., Completed internship at XYZ Company as Web Developer..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm hover:border-blue-900 transition-colors resize-none"
                    rows={3}
                  />
                </div>
              </div>

              {/* Future Goals Section */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-900" />
                  Future Goals
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Target Position */}
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Position to Apply in Future
                    </label>
                    <input
                      type="text"
                      value={inputs.targetPosition}
                      onChange={e => setInputs({ ...inputs, targetPosition: e.target.value })}
                      placeholder="E.g., ML Engineer, Full Stack Developer..."
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm hover:border-blue-900 transition-colors"
                    />
                  </div>

                  {/* Skill to Learn */}
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">
                      Skill to Learn <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={inputs.skillToLearn}
                      onChange={e => setInputs({ ...inputs, skillToLearn: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm hover:border-blue-900 transition-colors"
                    >
                      <option value="">Select skill to master...</option>
                      {skillsToLearn.map(skill => (
                        <option key={skill.id} value={skill.id}>
                          {skill.icon} {skill.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Timeline Section */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-blue-900" />
                  Timeline
                </h4>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Target Duration <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {durations.map(duration => (
                      <button
                        key={duration}
                        onClick={() => setInputs({ ...inputs, duration })}
                        className={`px-4 py-2.5 rounded-lg border-2 text-sm font-medium transition-all ${
                          inputs.duration === duration
                            ? 'border-blue-900 bg-blue-50 text-blue-900'
                            : 'border-slate-300 bg-white text-slate-700 hover:border-blue-300'
                        }`}
                      >
                        {duration}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-orange-200 rounded-lg p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-700 mb-1">
                      Premium AI-Powered Career Roadmap
                    </p>
                    <p className="text-2xl font-bold text-slate-900">₹499</p>
                    <p className="text-xs text-slate-500">One-time payment • Lifetime access</p>
                  </div>
                  <button
                    onClick={handleGenerateRoadmap}
                    className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-800 hover:to-indigo-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Generate Roadmap (₹499)</span>
                  </button>
                </div>
              </div>

              {/* Note */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-slate-600 text-center">
                  <strong>Note:</strong> Your personalized roadmap will be generated based on your current skills, 
                  education level, and career goals. All payments are securely processed.
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Generated Roadmap Display */}
            <div className="bg-gradient-to-r from-blue-900 to-slate-700 p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold">Your Personalized Roadmap</h3>
                <button
                  onClick={handleResetRoadmap}
                  className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Create New
                </button>
              </div>
              <p className="text-sm text-blue-100">
                Based on your profile: {inputs.branch} • {inputs.education}
              </p>
            </div>

            <div className="p-6">
              {(() => {
                const { name, steps } = generateRoadmapSteps(inputs.skillToLearn, inputs.duration, inputs.currentSkills);
                
                return (
                  <>
                    {/* Roadmap Header */}
                    <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-900 text-white rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                          {skillsToLearn.find(s => s.id === inputs.skillToLearn)?.icon || '🎯'}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-slate-900 mb-1">Mastering {name}</h4>
                          <p className="text-sm text-slate-600 mb-3">
                            {inputs.targetPosition 
                              ? `Career Goal: ${inputs.targetPosition}`
                              : 'Your personalized learning journey'}
                          </p>
                          
                          {/* Time to Completion */}
                          <div className="flex items-center gap-6 flex-wrap">
                            <div className="flex items-center gap-2">
                              <Clock className="w-5 h-5 text-blue-900" />
                              <div>
                                <p className="text-xs text-slate-500">Time to Completion</p>
                                <p className="text-sm font-bold text-slate-900">{inputs.duration}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Target className="w-5 h-5 text-blue-900" />
                              <div>
                                <p className="text-xs text-slate-500">Learning Modules</p>
                                <p className="text-sm font-bold text-slate-900">{steps.length} Stages</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Vertical Timeline/Progress Tracker */}
                    <div className="mb-6">
                      <h4 className="text-sm font-bold text-slate-900 mb-4">Your Learning Path</h4>
                      <div className="space-y-3">
                        {steps.map((step, index) => {
                          const IconComponent = getIconComponent(step.icon);
                          const isFirst = index === 0;
                          const isLast = index === steps.length - 1;
                          
                          return (
                            <div
                              key={index}
                              className={`relative flex items-center gap-4 p-4 rounded-lg transition-all ${
                                isFirst
                                  ? 'bg-blue-900 text-white'
                                  : 'bg-slate-50 hover:bg-slate-100'
                              }`}
                            >
                              {/* Step Number */}
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                                  isFirst
                                    ? 'bg-white text-blue-900'
                                    : 'bg-blue-900 text-white'
                                }`}
                              >
                                {index + 1}
                              </div>

                              {/* Step Content */}
                              <div className="flex-1">
                                <p className={`text-sm font-bold ${isFirst ? 'text-white' : 'text-slate-900'}`}>
                                  {step.title}
                                </p>
                                <p className={`text-xs ${isFirst ? 'text-blue-100' : 'text-slate-500'}`}>
                                  {step.weeks}
                                </p>
                              </div>

                              {/* Icon */}
                              <div className={isFirst ? 'text-white' : 'text-blue-900'}>
                                <IconComponent className="w-5 h-5" />
                              </div>

                              {/* Status Badge */}
                              {isFirst && (
                                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                  Start Here
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Completion Estimate */}
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg mb-6">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                        <div>
                          <p className="text-sm font-bold text-slate-900">Estimated Completion</p>
                          <p className="text-xs text-slate-600">
                            {inputs.duration} with consistent practice (15-20 hours/week)
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps CTA */}
                    <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-lg p-6 text-white">
                      <div className="flex items-start gap-4">
                        <Award className="w-8 h-8 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="font-bold mb-2">Ready to Start Your Journey?</h4>
                          <p className="text-sm text-blue-100 mb-4">
                            Get access to curated resources, practice exercises, mentor support, and project templates.
                          </p>
                          <button className="bg-white text-blue-900 px-6 py-2.5 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center gap-2">
                            <span>Access Full Roadmap</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
