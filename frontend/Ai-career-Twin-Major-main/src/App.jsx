import axios from "axios";
import interviewService from "./services/interviewService";
import jobService from "./services/jobService";
import { getSkillGapAnalysis } from "./services/skillService";
import API from "./services/api";
import {
    generateRoadmap,
    getLatestRoadmap,
    updateRoadmapTaskStatus
} from "./services/roadmapService";
import { useState, useEffect } from "react";
import {
  uploadResume,
  analyzeResume,
  getResumeAnalysis,
  getResumeHistory
} from "./services/resumeService";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  getCareerAnalysis,
  getCareerRecommendations,
  getAvailableRoles
} from "./services/careerTwinService";
import {
    getProjects,
    addProject,
    updateProject,
    deleteProject
} from "./services/projectService";
import { getMyProfile, updateMyProfile } from "./services/profileService";
import {
  loginUser,
  registerUser,
   logoutUser

} from "./services/authService";
import {
  getMySkills,
  addSkill as saveSkill,
  updateSkill,
  deleteSkill
} from "./services/skillService";


import sendChatRequest from "./services/chatService";
import {
  LayoutDashboard,
  BrainCircuit,
  UserRound,
  Code2,
  FileText,
  FolderKanban,
  Target,
  Map,
  BriefcaseBusiness,
  MessagesSquare,
  Bot,
  ShieldCheck,
  Search,
  Bell,
  ChevronDown,
  ArrowUpRight,
  TrendingUp,
  Clock3,
  CheckCircle2,
  CircleDashed,
  Sparkles,
  Menu,
  X,
  GraduationCap,
  LogOut,
  Plus,
  Send,
  Zap,
  Award,
  CalendarDays,
  Rocket,
} from "lucide-react";

import "./App.css";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, group: "MAIN" },
  { label: "Career Twin", icon: BrainCircuit, group: "MAIN" },
  { label: "My Profile", icon: UserRound, group: "MAIN" },
  { label: "My Skills", icon: Code2, group: "CAREER TOOLS" },
  { label: "Resume Analyzer", icon: FileText, group: "CAREER TOOLS" },
  { label: "My Projects", icon: FolderKanban, group: "CAREER TOOLS" },
  { label: "Skill Gap Analysis", icon: Target, group: "CAREER TOOLS" },
  { label: "Career Roadmap", icon: Map, group: "CAREER TOOLS" },
  { label: "Job Opportunities", icon: BriefcaseBusiness, group: "CAREER TOOLS" },
  { label: "Interview Practice", icon: MessagesSquare, group: "CAREER TOOLS" },
  { label: "AI Career Chat", icon: Bot, group: "MORE" },
  { label: "Admin Panel", icon: ShieldCheck, group: "MORE" },
];



const roadmapTasks = [
  { title: "Strengthen Java fundamentals", duration: "Week 1", done: true },
  { title: "Build REST APIs with Spring Boot", duration: "Week 2–3", done: true },
  { title: "Master React components and hooks", duration: "Week 4–5", done: false },
  { title: "Build a full-stack application", duration: "Week 6–7", done: false },
];

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(
        Boolean(localStorage.getItem("token"))
    );

  

    const [authMode, setAuthMode] = useState("login");
    const [activePage, setActivePage] = useState("Dashboard");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [chatInput, setChatInput] = useState("");
    const [chatLoading, setChatLoading] = useState(false);

    const [chatMessages, setChatMessages] = useState([
        {
            role: "assistant",
            text: "Hi! I'm your AI Career Twin. I can help you explore career paths, identify skill gaps, and plan your next steps. What would you like to work on today?",
        },
    ]);

    const [roadmap, setRoadmap] = useState(null);
    const [loadingRoadmap, setLoadingRoadmap] = useState(false);
    const [roadmapError, setRoadmapError] = useState("");
    
const handleGenerateRoadmap = async () => {
    try {
        setLoadingRoadmap(true);
        setRoadmapError("");

        const data = await generateRoadmap(profile.targetRole);

        setRoadmap(data);
        setNotice("Your career roadmap has been generated successfully!");

    } catch (error) {
        console.error("Roadmap generation failed:", error);
        setRoadmapError(
            error.message || "Unable to generate roadmap."
        );
    } finally {
        setLoadingRoadmap(false);
    }
};

    const [skills, setSkills] = useState([]);
    const [projects, setProjects] = useState([]);

    const [resumeName, setResumeName] = useState("");
    const [notice, setNotice] = useState("");

    const savedUser = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const [profile, setProfile] = useState({
        name: savedUser.fullName || "User",
        email: savedUser.email || "",
        targetRole: "Java Full Stack Developer",
        experience: "Fresher",
        location: "India",
    });
  
    
    // BACKEND HEALTH CHECK
    useEffect(() => {
        fetch(`${API}/api/health`)
            .then(response => response.json())
            .then(data => {
                console.log("Backend Response:", data);
            })
            .catch(error => {
                console.error("Backend Connection Failed:", error);
            });
    }, []);

    // FETCH LATEST ROADMAP
    useEffect(() => {
        if (!isAuthenticated) {
            setRoadmap(null);
            return;
        }

        const loadRoadmap = async () => {
            try {
                setLoadingRoadmap(true);
                setRoadmapError("");

                const data = await getLatestRoadmap();

                setRoadmap(data);

                console.log("ROADMAP LOADED:", data);

            } catch (error) {
                console.error("Unable to load roadmap:", error);
                setRoadmapError(
                    error.message || "Unable to load roadmap."
                );
            } finally {
                setLoadingRoadmap(false);
            }
        };

        loadRoadmap();
    }, [isAuthenticated]);

    // FETCH PROFILE
    useEffect(() => {
        if (!isAuthenticated) return;

        const loadProfile = async () => {
            try {
                const data = await getMyProfile();

                setProfile(prev => ({
                    ...prev,
                    name: data.fullName || prev.name,
                    email: data.email || prev.email,
                    targetRole: data.targetRole || prev.targetRole,
                    experience: data.experience || prev.experience,
                    location: data.location || prev.location,
                }));

                console.log("PROFILE LOADED:", data);

            } catch (error) {
                console.error("Profile loading failed:", error);
            }
        };

        loadProfile();
    }, [isAuthenticated]);

    // FETCH SKILLS
    useEffect(() => {
        if (!isAuthenticated) return;

        const loadSkills = async () => {
            try {
                const data = await getMySkills();

                const formattedSkills = data.map(skill => ({
                    id: skill.id,
                    name: skill.skillName,
                    category: skill.category,
                    proficiency: skill.proficiency,
                    level:
                        skill.proficiency === "Beginner" ? 25 :
                        skill.proficiency === "Intermediate" ? 50 :
                        skill.proficiency === "Advanced" ? 75 :
                        skill.proficiency === "Expert" ? 100 : 0,
                    color: "blue"
                }));

                setSkills(formattedSkills);

                console.log("SKILLS LOADED:", data);

            } catch (error) {
                console.error("Skills loading failed:", error);
                setNotice("Unable to load your skills.");
            }
        };

        loadSkills();
    }, [isAuthenticated]);

    // FETCH PROJECTS
    useEffect(() => {
        if (!isAuthenticated) return;

        const loadProjects = async () => {
            try {
                const data = await getProjects();
                setProjects(data);

                console.log("PROJECTS LOADED:", data);

            } catch (error) {
                console.error("Projects loading failed:", error);
                setNotice("Unable to load your projects.");
            }
        };

        loadProjects();
    }, [isAuthenticated]);

    // NAVIGATION
    function navigateTo(page) {
        setActivePage(page);
        setMobileMenuOpen(false);
        setNotice("");
    }

    // LOGOUT
    function handleLogout() {
        logoutUser();
        setIsAuthenticated(false);
        setRoadmap(null);
        setActivePage("Dashboard");
        setMobileMenuOpen(false);
        setNotice("");
    }

    // UPDATE TASK LOCALLY
    // Database persistence will be added separately.
  const toggleTask = async (taskId) => {
    if (!roadmap) return;

    // Find the selected task
    const selectedTask = roadmap.phases
        .flatMap(phase => phase.tasks)
        .find(task => task.id === taskId);

    if (!selectedTask) return;

    const newStatus = !selectedTask.completed;

    try {
        // Save status in MySQL through Spring Boot
        await updateRoadmapTaskStatus(
            roadmap.id,
            taskId,
            newStatus
        );

        // Update React state after successful API response
        setRoadmap(previous => ({
            ...previous,
            phases: previous.phases.map(phase => ({
                ...phase,
                tasks: phase.tasks.map(task =>
                    task.id === taskId
                        ? { ...task, completed: newStatus }
                        : task
                )
            }))
        }));

    } catch (error) {
        console.error("Task update failed:", error);
        alert("Unable to update task. Please try again.");
    }
};

    // ROADMAP PROGRESS
    const allTasks = roadmap?.phases?.flatMap(
        phase => phase.tasks || []
    ) || [];

    const completedTasks = allTasks.filter(
        task => task.completed
    ).length;

    const progressPercentage = allTasks.length > 0
        ? Math.round(
            (completedTasks / allTasks.length) * 100
        )
        : 0;

    // DASHBOARD COMPATIBILITY
    const tasks = allTasks.map(task => ({
        ...task,
        done: task.completed
    }));

    // ADD SKILL
    async function addSkill(skillData) {
        try {
            const savedSkill = await saveSkill({
                skillName: skillData.name.trim(),
                category: skillData.category.trim(),
                proficiency: skillData.proficiency
            });

            const level =
                savedSkill.proficiency === "Beginner" ? 25 :
                savedSkill.proficiency === "Intermediate" ? 50 :
                savedSkill.proficiency === "Advanced" ? 75 : 100;

            setSkills(current => [
                ...current,
                {
                    id: savedSkill.id,
                    name: savedSkill.skillName,
                    category: savedSkill.category,
                    proficiency: savedSkill.proficiency,
                    level,
                    color: "blue"
                }
            ]);

            setNotice("Skill added successfully!");
            return true;

        } catch (error) {
            console.error("Add skill failed:", error);
            setNotice("Unable to add skill. Please try again.");
            return false;
        }
    }

    // UPDATE SKILL
    async function handleUpdateSkill(id, skillData) {
        try {
            await updateSkill(id, {
                skillName: skillData.name.trim(),
                category: skillData.category.trim(),
                proficiency: skillData.proficiency
            });

            const level =
                skillData.proficiency === "Beginner" ? 25 :
                skillData.proficiency === "Intermediate" ? 50 :
                skillData.proficiency === "Advanced" ? 75 : 100;

            setSkills(current =>
                current.map(skill =>
                    skill.id === id
                        ? {
                            ...skill,
                            name: skillData.name.trim(),
                            category: skillData.category.trim(),
                            proficiency: skillData.proficiency,
                            level
                        }
                        : skill
                )
            );

            setNotice("Skill updated successfully!");
            return true;

        } catch (error) {
            console.error("Update skill failed:", error);
            setNotice("Unable to update skill.");
            return false;
        }
    }

    // DELETE SKILL
    async function handleDeleteSkill(id) {
        try {
            await deleteSkill(id);

            setSkills(current =>
                current.filter(skill => skill.id !== id)
            );

            setNotice("Skill deleted successfully!");
            return true;

        } catch (error) {
            console.error("Delete skill failed:", error);
            setNotice("Unable to delete skill.");
            return false;
        }
    }

    // ADD PROJECT
    async function handleAddProject(project) {
        try {
            const savedProject = await addProject(project);

            setProjects(current => [
                ...current,
                savedProject
            ]);

            setNotice("Project added successfully!");
            return true;

        } catch (error) {
            console.error("Add project failed:", error);
            setNotice("Unable to add project.");
            return false;
        }
    }

    // UPDATE PROJECT
    async function handleUpdateProject(id, project) {
        try {
            const updatedProject = await updateProject(id, project);

            setProjects(current =>
                current.map(p =>
                    p.id === id ? updatedProject : p
                )
            );

            setNotice("Project updated successfully!");
            return true;

        } catch (error) {
            console.error("Update project failed:", error);
            setNotice("Unable to update project.");
            return false;
        }
    }

    // DELETE PROJECT
    async function handleDeleteProject(id) {
        try {
            await deleteProject(id);

            setProjects(current =>
                current.filter(p => p.id !== id)
            );

            setNotice("Project deleted successfully!");
            return true;

        } catch (error) {
            console.error("Delete project failed:", error);
            setNotice("Unable to delete project.");
            return false;
        }
    }

    // SKILL HISTORY
    async function handleGetSkillHistory(skillId) {
        try {
            const response = await axios.get(
                `http://localhost:8081/api/skills/${skillId}/history`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            return response.data;

        } catch (error) {
            console.error("Error fetching skill history:", error);
            throw error;
        }
    }

    // AI CHAT
    async function sendChatMessage(event) {
        event.preventDefault();

        const message = chatInput.trim();

        if (!message || chatLoading) return;

        setChatMessages(current => [
            ...current,
            { role: "user", text: message }
        ]);

        setChatInput("");
        setChatLoading(true);

        try {
            const reply = await sendChatRequest(message);

            setChatMessages(current => [
                ...current,
                { role: "assistant", text: reply }
            ]);

        } catch (error) {
            console.error("AI Chat Error:", error);

            setChatMessages(current => [
                ...current,
                {
                    role: "assistant",
                    text: error.message ||
                        "Unable to connect to the AI assistant. Please try again."
                }
            ]);

        } finally {
            setChatLoading(false);
        }
    }

    const filteredSkills = skills.filter(skill =>
        skill.name.toLowerCase().includes(searchText.toLowerCase())
    );

    // AUTHENTICATION
    if (!isAuthenticated) {
        return (
            <AuthPage
                mode={authMode}
                setMode={setAuthMode}
                onLogin={() => setIsAuthenticated(true)}
            />
        );
    }

    // MAIN APPLICATION
    return (
        <div className="app-shell">

            {mobileMenuOpen && (
                <button
                    className="mobile-overlay"
                    aria-label="Close navigation"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            <aside className={`sidebar ${mobileMenuOpen ? "sidebar-open" : ""}`}>

                <div className="brand">
                    <div className="brand-icon">
                        <GraduationCap size={25} />
                    </div>

                    <div>
                        <div className="brand-name">CareerTwin</div>
                        <div className="brand-caption">AI CAREER COMPANION</div>
                    </div>

                    <button
                        className="icon-button mobile-close"
                        onClick={() => setMobileMenuOpen(false)}
                        aria-label="Close menu"
                    >
                        <X size={19} />
                    </button>
                </div>

                <div className="workspace-label">WORKSPACE</div>

                <nav className="side-navigation">
                    {["MAIN", "CAREER TOOLS", "MORE"].map(group => (
                        <div className="nav-group" key={group}>
                            <div className="nav-group-title">{group}</div>

                            {navigation
                                .filter(item => item.group === group)
                                .map(item => {
                                    const Icon = item.icon;

                                    return (
                                        <button
                                            key={item.label}
                                            className={`nav-item ${
                                                activePage === item.label
                                                    ? "nav-item-active"
                                                    : ""
                                            }`}
                                            onClick={() => navigateTo(item.label)}
                                        >
                                            <Icon size={18} strokeWidth={1.8} />
                                            <span>{item.label}</span>

                                            {item.label === "Career Twin" && (
                                                <span className="nav-ai-dot" />
                                            )}
                                        </button>
                                    );
                                })}
                        </div>
                    ))}
                </nav>

                <div className="sidebar-bottom">

                    <div className="upgrade-card">
                        <div className="upgrade-icon">
                            <Sparkles size={19} />
                        </div>

                        <h4>Your next chapter starts here</h4>

                        <p>
                            Keep building skills and moving towards your career goals.
                        </p>

                        <button onClick={() => navigateTo("Career Roadmap")}>
                            View my roadmap <ArrowUpRight size={15} />
                        </button>
                    </div>

                    <div className="sidebar-user">
                        <div className="avatar">
  {profile?.name
    ?.trim()
    .split(/\s+/)
    .map(word => word[0])
    .join("")
    .toUpperCase()}
</div>

                        <div className="sidebar-user-info">
                            <strong>{profile?.name || "User"}</strong>
                            <span>Free account · Demo</span>
                        </div>

                        <button
                            className="icon-button"
                            aria-label="User menu"
                            onClick={() => navigateTo("My Profile")}
                        >
                            <ChevronDown size={17} />
                        </button>
                    </div>

                    <button
                        className="nav-item logout-button"
                        onClick={handleLogout}
                    >
                        <LogOut size={18} strokeWidth={1.8} />
                        <span>Logout</span>
                    </button>

                </div>
            </aside>

            <main className="main-area">

                <header className="topbar">
                    <div className="topbar-left">

                        <button
                            className="icon-button mobile-menu-button"
                            onClick={() => setMobileMenuOpen(true)}
                            aria-label="Open navigation"
                        >
                            <Menu size={21} />
                        </button>

                        <div className="breadcrumb">
                            <span>Workspace</span>
                            <span className="breadcrumb-divider">/</span>
                            <strong>{activePage}</strong>
                        </div>

                    </div>

                    <div className="topbar-actions">

              

                        <div className="environment-badge">
                            <span />
                        </div>

                        <button
                            className="icon-button notification-button"
                            aria-label="Notifications"
                            onClick={() =>
                                setNotice("You are all caught up! No new notifications.")
                            }
                        >
                            <Bell size={19} />
                            <span className="notification-dot" />
                        </button>

                       <div className="topbar-avatar">
  {profile?.name
    ?.trim()
    .split(/\s+/)
    .map(word => word[0])
    .join("")
    .toUpperCase()}
</div>

                    </div>
                </header>

                <div className="page-content">

                    {notice && (
                        <div className="notice-banner">
                            <CheckCircle2 size={17} />
                            <span>{notice}</span>

                            <button
                                className="icon-button"
                                aria-label="Dismiss message"
                                onClick={() => setNotice("")}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    {activePage === "Dashboard" && (
                        <DashboardPage
                            profile={profile}
                            tasks={tasks}
                            completedTasks={completedTasks}
                            progressPercentage={progressPercentage}
                            navigateTo={navigateTo}
                            toggleTask={toggleTask}
                            skills={skills}
                            projects={projects}
                        />
                    )}

                    {activePage === "Career Twin" && (
                        <CareerTwinPage navigateTo={navigateTo} />
                    )}

                    {activePage === "My Profile" && (
                        <ProfilePage
                            profile={profile}
                            setProfile={setProfile}
                            setNotice={setNotice}
                        />
                    )}

                    {activePage === "My Skills" && (
                        <SkillsPage
                            skills={skills}
                            searchText={searchText}
                            setSearchText={setSearchText}
                            addSkill={addSkill}
                            onUpdateSkill={handleUpdateSkill}
                            onDeleteSkill={handleDeleteSkill}
                            onGetSkillHistory={handleGetSkillHistory}
                        />
                    )}

                    {activePage === "Resume Analyzer" && (
                        <ResumePage
                            resumeName={resumeName}
                            setResumeName={setResumeName}
                            setNotice={setNotice}
                        />
                    )}

                    {activePage === "My Projects" && (
                        <ProjectsPage
                            projects={projects}
                            onAddProject={handleAddProject}
                            onUpdateProject={handleUpdateProject}
                            onDeleteProject={handleDeleteProject}
                            navigateTo={navigateTo}
                        />
                    )}

                    {activePage === "Skill Gap Analysis" && (
                        <SkillGapPage navigateTo={navigateTo} />
                    )}

                    {activePage === "Career Roadmap" && (
    loadingRoadmap ? (
        <p>Loading your personalized roadmap...</p>
    ) : roadmapError ? (
        <div>
            <p>{roadmapError}</p>

            <button
                className="primary-button"
                onClick={handleGenerateRoadmap}
            >
                Try Again
            </button>
        </div>
    ) : roadmap ? (
        <RoadmapPage
            roadmap={roadmap}
            toggleTask={toggleTask}
            progressPercentage={progressPercentage}
        />
    ) : (
        <div
            className="panel"
            style={{ padding: "24px", textAlign: "center" }}
        >
            <h2>No career roadmap found</h2>

            <p>
                Generate your personalized learning roadmap to get started.
            </p>

            <button
                className="primary-button"
                onClick={handleGenerateRoadmap}
                disabled={loadingRoadmap}
            >
                {loadingRoadmap ? "Generating..." : "Generate Roadmap"}
            </button>
        </div>
    )
)}

{activePage === "Job Opportunities" && (
    <JobsPage navigateTo={navigateTo} />
)}
                    {activePage === "Job Opportunities" && (
                        <JobsPage navigateTo={navigateTo} />
                    )}

                    {activePage === "Interview Practice" && (
                        <InterviewPage />
                    )}

                    {activePage === "AI Career Chat" && (
                        <ChatPage
                            messages={chatMessages}
                            input={chatInput}
                            setInput={setChatInput}
                            sendMessage={sendChatMessage}
                            loading={chatLoading}
                        />
                    )}

                    {activePage === "Admin Panel" && <AdminPage />}

                </div>

                <footer className="app-footer">
                    <span>© 2026 CareerTwin · AI-powered career guidance</span>

                    <span>
                        Built for your brighter future{" "}
                        <span className="footer-heart">✦</span>
                    </span>
                </footer>

            </main>
        </div>
    );
}


function PageHeading({ eyebrow, title, description, action }) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

function DashboardPage({
  profile,
  tasks,
  completedTasks,
  progressPercentage,
  navigateTo,
  toggleTask,
  skills = [],
  projects = [],
}) {  // Calculate profile completion
  const profileFields = [
    profile.name,
    profile.email,
    profile.targetRole,
    profile.experience,
    profile.location
  ];
   const [resumeHistory, setResumeHistory] = useState([]);

useEffect(() => {
  async function loadResumeHistory() {
    try {
      const history = await getResumeHistory();
      setResumeHistory(history);
    } catch (error) {
      console.error("Failed to load resume history:", error);
    }
  }

  loadResumeHistory();
}, []);
  const profileScore = Math.round(
    (profileFields.filter(
      (field) => field && field.trim() !== ""
    ).length / profileFields.length) * 100
  );

  // Calculate skill score (maximum 5 skills)
  const skillScore = Math.min(skills.length * 20, 100);

  // Calculate project score (maximum 3 projects)
  const projectScore = Math.min(projects.length * 33.33, 100);

  // Calculate overall career readiness
  const careerReadiness = Math.round(
    (profileScore + skillScore + projectScore + progressPercentage) / 4
  );


  const careerProgressData = [
  { label: "Profile", value: profileScore },
  { label: "Skills", value: skillScore },
  { label: "Projects", value: Math.round(projectScore) },
  { label: "Roadmap", value: progressPercentage },
];
const averageSkillLevel = skills.length
  ? Math.round(
      skills.reduce((total, skill) => total + Number(skill.level || 0), 0) /
        skills.length
    )
  : 0;

const strongestSkill = skills.length
  ? skills.reduce((best, skill) =>
      Number(skill.level || 0) > Number(best.level || 0) ? skill : best
    )
  : null;
  return (
    <>
      <PageHeading
        eyebrow="YOUR CAREER WORKSPACE"
        title={`Welcome back, ${profile.name.split(" ")[0]}!`}
        description="Here's your career progress at a glance. Small steps today lead to big opportunities tomorrow."
        action={
          <button
            className="primary-button"
            onClick={() => navigateTo("Career Twin")}
          >
            <Sparkles size={17} /> Explore Career Twin
          </button>
        }
      />

      <section className="welcome-banner">
        <div className="welcome-copy">
          <div className="welcome-tag">
            <Sparkles size={14} /> YOUR PERSONAL CAREER COMPANION
          </div>
          <h2>Your potential is bigger than you think.</h2>
          <p>
            Discover your strengths, bridge skill gaps, and create a career
            path that fits your ambitions.
          </p>
          <button
            className="welcome-button"
            onClick={() => navigateTo("Career Twin")}
          >
            Discover my career path <ArrowUpRight size={17} />
          </button>
        </div>

        <div className="welcome-art" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="art-glow">
            <BrainCircuit size={66} strokeWidth={1.2} />
          </div>
          <div className="floating-chip chip-one">
            <Zap size={15} /> Skills
          </div>
          <div className="floating-chip chip-two">
            <Target size={15} /> Goals
          </div>
          <div className="floating-chip chip-three">
            <Rocket size={15} /> Growth
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <StatCard
          label="Career readiness"
  value={`${careerReadiness}%`}
  change="Based on your career profile"
  icon={TrendingUp}
  color="purple"
  progress={careerReadiness}
  isLive={true}
        />


       <StatCard
  label="Skills tracked"
  value={skills.length}
  change="Your saved skills"
  icon={Code2}
  color="blue"
  progress={Math.min(skills.length * 10, 100)}
  isLive={true}
/>
        <StatCard
          label="Roadmap progress"
          value={`${progressPercentage}%`}
          change={`${completedTasks} of ${tasks.length} tasks done`}
          icon={Map}
          color="green"
          progress={progressPercentage}
        />
       <StatCard
  label="Projects tracked"
  value={projects.length}
  change="Your saved projects"
  icon={FolderKanban}
  color="orange"
  progress={Math.min(projects.length * 20, 100)}
  isLive={true}
/>

 <StatCard
    label="Resume analyses"
    value={resumeHistory.filter((resume) => resume.analyzed).length}
    change="Successfully analyzed resumes"
    icon={FileText}
    color="purple"
    isLive={true}
  />


      </section>
      <section className="panel career-chart-panel">
  <div className="panel-heading">
    <div>
      <div className="panel-title">Career Progress Overview</div>
      <div className="panel-subtitle">
        Your current progress across different career areas
      </div>
    </div>
    <TrendingUp size={22} />
  </div>

  <div className="career-chart">
    {careerProgressData.map((item) => (
      <div className="career-chart-row" key={item.label}>
        <div className="career-chart-label">
          <strong>{item.label}</strong>
          <span>{item.value}%</span>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill purple"
            style={{ width: `${item.value}%` }}
          />
        </div>
      </div>
    ))}
  </div>

  <section className="panel roadmap-chart-panel">
  <div className="panel-heading">
    <div>
      <div className="panel-title">Roadmap Completion</div>
      <div className="panel-subtitle">
        Track your completed and remaining learning tasks
      </div>
    </div>
    <Map size={22} />
  </div>

  <div className="roadmap-chart-stats">
    <div>
      <span className="completed-dot"></span>
      <strong>Completed</strong>
      <span>{completedTasks}</span>
    </div>

    <div>
      <span className="pending-dot"></span>
      <strong>Pending</strong>
      <span>{Math.max(tasks.length - completedTasks, 0)}</span>
    </div>
  </div>

  <div className="roadmap-stacked-bar">
    <div
      className="completed-bar"
      style={{
        width: `${tasks.length ? (completedTasks / tasks.length) * 100 : 0}%`
      }}
    />
  </div>

  <p className="roadmap-chart-caption">
    {completedTasks} of {tasks.length} tasks completed
  </p>
</section>
</section>
      <section className="dashboard-grid">
        <div className="panel skills-panel">
          <div className="panel-heading">
            <div>
              <div className="panel-title">Your skill snapshot</div>
              <div className="panel-subtitle">
              Your saved skills and current proficiency levels
              </div>
            </div>
            <button
              className="text-button"
              onClick={() => navigateTo("My Skills")}
            >
              View all <ArrowUpRight size={15} />
            </button>
          </div>

          <div className="skill-list">
  {skills.length > 0 ? (
    skills.slice(0, 4).map((skill, index) => {
      const colors = ["purple", "blue", "green", "orange"];
      const color = colors[index % colors.length];

      return (
        <div className="skill-row" key={skill.id}>
          <div className={`skill-icon ${color}`}>
            <Code2 size={18} />
          </div>

          <div className="skill-row-main">
            <div className="skill-row-title">
              <strong>{skill.name}</strong>
              <span>{skill.level}%</span>
            </div>

            <div className="progress-track">
              <div
                className={`progress-fill ${color}`}
                style={{ width: `${skill.level}%` }}
              />
            </div>
          </div>
        </div>
      );
    })
  ) : (
    <p>No skills added yet. Add your first skill!</p>
  )}
</div>
          <button
            className="panel-bottom-link"
            onClick={() => navigateTo("Skill Gap Analysis")}
          >
            Identify your next skill to learn <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="panel roadmap-panel">
          <div className="panel-heading">
            <div>
              <div className="panel-title">Your career roadmap</div>
              <div className="panel-subtitle">
                A sample learning plan for your target role
              </div>
            </div>
            <button
              className="icon-button"
              aria-label="Open roadmap"
              onClick={() => navigateTo("Career Roadmap")}
            >
              <ArrowUpRight size={18} />
            </button>
          </div>

          <div className="roadmap-progress-heading">
            <span>Overall progress</span>
            <strong>{progressPercentage}%</strong>
          </div>

          <div className="progress-track roadmap-main-progress">
            <div
              className="progress-fill purple"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="task-list">
            {tasks.slice(0, 3).map((task, index) => (
              <button
                className="task-row"
                key={task.title}
                onClick={() => toggleTask(index)}
              >
                <span className={`task-check ${task.done ? "done" : ""}`}>
                  {task.done && <CheckCircle2 size={17} />}
                </span>
                <span className="task-text">
                  <strong className={task.done ? "task-completed" : ""}>
                    {task.title}
                  </strong>
                  <span>{task.duration}</span>
                </span>
                <span className="task-status">
                  {task.done ? "Done" : "To do"}
                </span>
              </button>
            ))}
          </div>

          <button
            className="panel-bottom-link"
            onClick={() => navigateTo("Career Roadmap")}
          >
            Open full roadmap <ArrowUpRight size={16} />
          </button>
        </div>
      </section>

      
<section className="dashboard-grid overview-grid">
  <div className="panel overview-panel skills-overview">
    <div className="overview-heading">
      <div className="overview-icon purple">
        <Code2 size={22} />
      </div>
      <div>
        <div className="panel-title">Skills Overview</div>
        <div className="panel-subtitle">Your current skill development</div>
      </div>
    </div>

    <div className="overview-number">
      {skills.length}
      <span>Skills Added</span>
    </div>

    <div className="overview-progress-info">
      <span>Average proficiency</span>
      <strong>{averageSkillLevel}%</strong>
    </div>

    <div className="progress-track">
      <div
        className="progress-fill purple"
        style={{ width: `${averageSkillLevel}%` }}
      />
    </div>

    <div className="strongest-skill">
      <span> <Award size={17} /> Strongest skill</span>
      <strong>
        {strongestSkill
          ? `${strongestSkill.name} (${strongestSkill.level}%)`
          : "No skills added yet"}
      </strong>
    </div>
  </div>

  <div className="panel overview-panel projects-overview">
    <div className="overview-heading">
      <div className="overview-icon orange">
        <FolderKanban size={22} />
      </div>
      <div>
        <div className="panel-title">Projects Overview</div>
        <div className="panel-subtitle">Your practical experience</div>
      </div>
    </div>

    <div className="overview-number">
      {projects.length}
      <span>Projects Added</span>
    </div>

    <div className="overview-project-list">
      {projects.length > 0 ? (
        projects.slice(0, 3).map((project, index) => (
          <div className="overview-project-item" key={project.id || index}>
            <div className="project-mini-icon">
              <FolderKanban size={17} />
            </div>
            <strong>
              {project.name || project.title || "Untitled Project"}
            </strong>
            <CheckCircle2 size={17} className="project-check" />
          </div>
        ))
      ) : (
        <p>No projects added yet.</p>
      )}
    </div>
  </div>
</section>



      <section className="bottom-grid">
        <div className="panel quick-actions-panel">
          <div className="panel-title">Pick up where you left off</div>
          <div className="panel-subtitle">
            Continue building your career profile
          </div>

          

          <div className="quick-actions">
            <QuickAction
              icon={FileText}
              title="Analyze resume"
              description="Review your resume"
              color="orange"
              onClick={() => navigateTo("Resume Analyzer")}
            />
            <QuickAction
              icon={Target}
              title="Find skill gaps"
              description="Discover what to learn"
              color="purple"
              onClick={() => navigateTo("Skill Gap Analysis")}
            />
            <QuickAction
              icon={BriefcaseBusiness}
              title="Explore jobs"
              description="Browse sample roles"
              color="blue"
              onClick={() => navigateTo("Job Opportunities")}
            />
          </div>
        </div>

        <div className="panel goal-panel">
          <div className="goal-icon">
            <GraduationCap size={23} />
          </div>
          <div className="goal-eyebrow">YOUR CURRENT GOAL</div>
          <h3>Become a Java Full Stack Developer</h3>
          <p>
            Build strong backend and frontend skills, then bring them together
            in a real project.
          </p>
          <button
            className="text-button"
            onClick={() => navigateTo("My Profile")}
          >
            Review career goal <ArrowUpRight size={15} />
          </button>
        </div>
      </section>
    </>
  );
}

function StatCard({  
  label,
  value,
  change,
  icon: Icon,
  color,
  progress,
  isLive = false }) {
  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className={`stat-icon ${color}`}>
          <Icon size={20} />
        </div>
        <span className="stat-indicator">
  <TrendingUp size={13} /> {isLive ? "Live" : "Demo"}
</span>
      </div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-bottom">
        <span>{change}</span>
        <div className="mini-track">
          <div
            className={`mini-fill ${color}`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, title, description, color, onClick }) {
  return (
    <button className="quick-action" onClick={onClick}>
      <div className={`quick-action-icon ${color}`}>
        <Icon size={20} />
      </div>
      <span className="quick-action-copy">
        <strong>{title}</strong>
        <span>{description}</span>
      </span>
      <ArrowUpRight className="quick-action-arrow" size={17} />
    </button>
  );
}

function FeatureCard({ icon: Icon, title, description, color, onClick, tag }) {
  return (
    <button className="feature-card" onClick={onClick}>
      <div className={`feature-icon ${color}`}>
        <Icon size={23} />
      </div>
      {tag && <span className="feature-tag">{tag}</span>}
      <h3>{title}</h3>
      <p>{description}</p>
      <span className="feature-link">
        Explore feature <ArrowUpRight size={15} />
      </span>
    </button>
  );
}

function CareerTwinPage({ navigateTo }) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [recommendations, setRecommendations] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("Java Developer");
  const [roleLoading, setRoleLoading] = useState(true);

  // Fetch career analysis for the selected role
  async function loadCareerAnalysis(role = selectedRole) {
    setLoading(true);
    setError("");

    try {
      const data = await getCareerAnalysis(role);
      setAnalysis(data);
    } catch (err) {
      console.error("Career analysis error:", err);
      setError(err.message || "Unable to load career analysis.");
    } finally {
      setLoading(false);
    }
  }

  // Fetch Groq AI recommendations for the selected role
  async function loadAIRecommendations(role = selectedRole) {
    setAiLoading(true);
    setAiError("");

    try {
      const data = await getCareerRecommendations(role);
      setRecommendations(data.recommendations || "");
    } catch (err) {
      console.error("AI recommendations error:", err);
      setAiError(err.message || "Unable to generate AI recommendations.");
    } finally {
      setAiLoading(false);
    }
  }

  // Load available roles and initial analysis
  useEffect(() => {
    async function initializeCareerTwin() {
      try {
        const data = await getAvailableRoles();
        setRoles(data);

        const defaultRole = data.includes("Java Developer")
          ? "Java Developer"
          : data[0];

        if (!defaultRole) {
          setError("No target roles are available.");
          setLoading(false);
          return;
        }

        setSelectedRole(defaultRole);

        await Promise.all([
          loadCareerAnalysis(defaultRole),
          loadAIRecommendations(defaultRole)
        ]);
      } catch (err) {
        console.error("Career Twin initialization error:", err);
        setError(err.message || "Unable to initialize Career Twin.");
        setLoading(false);
      } finally {
        setRoleLoading(false);
      }
    }

    initializeCareerTwin();
  }, []);

  // Analyze the newly selected role
  async function refreshCareerTwin() {
    await Promise.all([
      loadCareerAnalysis(selectedRole),
      loadAIRecommendations(selectedRole)
    ]);
  }

  return (
    <>
      <PageHeading
        eyebrow="YOUR PERSONAL AI COMPANION"
        title="Your Career Twin"
        description="Understand your career readiness through your actual profile, skills, and projects."
        action={
          <button
            className="primary-button"
            onClick={refreshCareerTwin}
            disabled={loading || aiLoading || roleLoading || !selectedRole}
          >
            {loading || aiLoading ? "Refreshing..." : "Refresh Analysis"}
          </button>
        }
      />

      {/* TARGET ROLE SELECTION */}
      <section className="panel">
        <div className="panel-title">
          <Target size={20} />
          Choose Your Target Career
        </div>

        <p>
          Select the career role you want to prepare for.
          Your Career Twin will analyze your skills and projects
          according to that role.
        </p>

        <div className="form-field">
          <label htmlFor="career-role">Target Career Role</label>

          <select
            id="career-role"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            disabled={roleLoading}
          >
            {roleLoading ? (
              <option value="">Loading roles...</option>
            ) : (
              roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))
            )}
          </select>
        </div>

        <button
          className="primary-button"
          onClick={refreshCareerTwin}
          disabled={loading || aiLoading || roleLoading || !selectedRole}
        >
          {loading || aiLoading
            ? "Analyzing..."
            : "Analyze Selected Role"}
        </button>
      </section>

      {loading && (
        <div className="panel empty-state">
          <BrainCircuit size={30} />
          <h3>Analyzing your career profile...</h3>
          <p>Please wait while Career Twin evaluates your information.</p>
        </div>
      )}

      {!loading && error && (
        <div className="panel empty-state">
          <h3>Unable to load career analysis</h3>
          <p>{error}</p>

          <button
            className="primary-button"
            onClick={refreshCareerTwin}
            disabled={aiLoading}
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && analysis && (
        <>
          <section className="twin-hero">
            <div className="twin-hero-icon">
              <BrainCircuit size={43} />
            </div>

            <div>
              <span className="welcome-tag">
                <Sparkles size={14} /> YOUR CAREER ASSESSMENT
              </span>

              <h2>{analysis.readinessLevel}</h2>

              <p>
                Your target role is{" "}
                <strong>{analysis.targetRole || selectedRole}</strong>.
                Your readiness score is based on your saved profile,
                skills, and projects.
              </p>
            </div>
          </section>

          <section className="stats-grid">
            <StatCard
              label="Career readiness"
              value={`${analysis.readinessScore}%`}
              change={analysis.readinessLevel}
              icon={TrendingUp}
              color="purple"
              progress={analysis.readinessScore}
              isLive={true}
            />

            <StatCard
              label="Skills available"
              value={analysis.existingSkills.length}
              change="Matched skills"
              icon={Code2}
              color="blue"
              progress={Math.min(
                analysis.existingSkills.length * 10,
                100
              )}
              isLive={true}
            />

            <StatCard
              label="Missing skills"
              value={analysis.missingSkills.length}
              change="Skills to develop"
              icon={Target}
              color="orange"
              progress={Math.min(
                analysis.missingSkills.length * 10,
                100
              )}
              isLive={true}
            />

            <StatCard
              label="Projects"
              value={analysis.totalProjects}
              change="Your saved projects"
              icon={FolderKanban}
              color="green"
              progress={Math.min(
                analysis.totalProjects * 33.33,
                100
              )}
              isLive={true}
            />
          </section>

          <section className="dashboard-grid">
            <div className="panel">
              <div className="panel-title">
                Your existing skills
              </div>

              <div className="tag-list">
                {analysis.existingSkills.length > 0 ? (
                  analysis.existingSkills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))
                ) : (
                  <p>No matching skills found. Add skills in My Skills.</p>
                )}
              </div>
            </div>

            <div className="panel">
              <div className="panel-title">
                Skills you need to learn
              </div>

              <div className="tag-list">
                {analysis.missingSkills.length > 0 ? (
                  analysis.missingSkills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))
                ) : (
                  <p>No missing skills identified.</p>
                )}
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel-title">
              Improvement areas
            </div>

            {analysis.improvementAreas.length > 0 ? (
              <ul>
                {analysis.improvementAreas.map((area, index) => (
                  <li key={index}>{area}</li>
                ))}
              </ul>
            ) : (
              <p>No additional improvement areas were returned.</p>
            )}
          </section>

          <section className="panel">
            <div className="panel-title">
              Your project highlights
            </div>

            {analysis.projectHighlights.length > 0 ? (
              <ul>
                {analysis.projectHighlights.map((project, index) => (
                  <li key={index}>{project}</li>
                ))}
              </ul>
            ) : (
              <p>No projects added yet.</p>
            )}

            <button
              className="primary-button"
              onClick={() => navigateTo("My Projects")}
            >
              Manage Projects <ArrowUpRight size={16} />
            </button>
          </section>

          {/* GROQ AI RECOMMENDATIONS */}
          <section className="panel career-ai-panel">
            <div className="panel-title">
              <Sparkles size={20} />
              AI-Powered Career Recommendations

              <button
                className="primary-button"
                onClick={() => loadAIRecommendations(selectedRole)}
                disabled={aiLoading || roleLoading}
              >
                {aiLoading ? "Generating..." : "Regenerate"}
              </button>
            </div>

            <p>
              Personalized career guidance generated by Groq AI
              using your actual skills, projects, and readiness score.
            </p>

            {aiLoading && (
              <div className="empty-state">
                <BrainCircuit size={30} />
                <h3>Career Twin is thinking...</h3>
                <p>
                  Generating your personalized career roadmap.
                  This may take a few seconds.
                </p>
              </div>
            )}

            {!aiLoading && aiError && (
              <div className="empty-state">
                <h3>Unable to generate recommendations</h3>
                <p>{aiError}</p>

                <button
                  className="primary-button"
                  onClick={() => loadAIRecommendations(selectedRole)}
                >
                  Try Again
                </button>
              </div>
            )}

            {!aiLoading && !aiError && recommendations && (
              <div className="career-ai-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {recommendations}
                </ReactMarkdown>
              </div>
            )}

            {!aiLoading && !aiError && !recommendations && (
              <p>No recommendations available yet.</p>
            )}
          </section>

          <section className="panel">
            <div className="panel-title">
              Continue your career journey
            </div>

            <p>
              Improve your skills and projects to increase your
              career readiness.
            </p>

            <button
              className="primary-button"
              onClick={() => navigateTo("My Skills")}
            >
              Update My Skills <ArrowUpRight size={16} />
            </button>
          </section>
        </>
      )}
    </>
  );
}



function ProfilePage({ profile, setProfile, setNotice }) {
 
const handleChange = (event) => {
  const { name, value } = event.target;

  // 1. Full Name: Allow letters, spaces, hyphens, and apostrophes
  if (name === "name" && !/^[\p{L}\s'-]*$/u.test(value)) {
    return;
  }

  // 2. Email: Allow valid email characters
  if (name === "email" && !/^[a-zA-Z0-9@._%+-]*$/.test(value)) {
    return;
  }

  // 3. Location: Allow letters, spaces, commas, periods, and hyphens
  if (
    name === "location" &&
    !/^[\p{L}\s,.-]*$/u.test(value)
  ) {
    return;
  }

  // 4. Target Career Role: Allow letters, numbers, spaces,
  // hyphens, periods, plus signs, and parentheses
  if (
    name === "targetRole" &&
    !/^[\p{L}\p{N}\s.+()/#&-]*$/u.test(value)
  ) {
    return;
  }

  // Update the profile without changing other fields
  setProfile((prevProfile) => ({
    ...prevProfile,
    [name]: value,
  }));
};


 async function handleSubmit(event) {
  event.preventDefault();

  try {
    const updatedData = await updateMyProfile(profile);

    setProfile((prev) => ({
      ...prev,
      name: updatedData.fullName || prev.name,
      email: updatedData.email || prev.email,
      targetRole: updatedData.targetRole || prev.targetRole,
      experience: updatedData.experience || prev.experience,
      location: updatedData.location || prev.location,
    }));

    setNotice("Profile updated successfully!");
  } catch (error) {
    console.error("Profile update failed:", error);
    setNotice("Failed to update profile. Please try again.");
  }
}

  return (
    <>
      <PageHeading
        eyebrow="YOUR INFORMATION"
        title="My profile"
        description="Maintain the details that will help personalize your career journey."
      />

      <form className="panel form-panel" onSubmit={handleSubmit}>
        <div className="profile-cover">
          <div className="profile-large-avatar">
            {profile.name
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <h2>{profile.name}</h2>
            <p>{profile.targetRole}</p>
            <span className="sample-badge"></span>
          </div>
        </div>

        <div className="form-section-title">Personal information</div>

        <div className="form-grid">
          <label className="form-field">
            Full name
            <input
              name="name"
              value={profile.name}
              onChange={handleChange}
              required
            />
          </label>

          <label className="form-field">
            Email address
            <input
              name="email"
              type="email"
              value={profile.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="form-field">
            Target career role
            <input
              name="targetRole"
              value={profile.targetRole}
              onChange={handleChange}
              required
            />
          </label>

          <label className="form-field">
            Experience level
            <select
              name="experience"
              value={profile.experience}
              onChange={handleChange}
            >
              <option>Fresher</option>
              <option>Student</option>
              <option>Intern</option>
              <option>0–2 years</option>
              <option>3–5 years</option>
              <option>5+ years</option>
            </select>
          </label>

          <label className="form-field">
            Location
            <input
              name="location"
              value={profile.location}
              onChange={handleChange}
            />
          </label>
        </div>

        <div className="form-footer">
          <span>Your profile details are saved to your account.</span>
          <button className="primary-button" type="submit">
            Save profile
          </button>
        </div>
      </form>
    </>
  );
}

function SkillsPage({
    skills,
    searchText,
    setSearchText,
    addSkill,
    onUpdateSkill,
    onDeleteSkill,
    onGetSkillHistory
}) {
    const emptyForm = {
        name: "",
        category: "Backend",
        proficiency: "Beginner"
    };

    const [modalType, setModalType] = useState(null);
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [formData, setFormData] = useState(emptyForm);
    const [isSaving, setIsSaving] = useState(false);

    // Progress history states
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historySkill, setHistorySkill] = useState(null);
    const [historyError, setHistoryError] = useState("");

    function getProficiencyPercentage(proficiency) {
        const percentages = {
            Beginner: 25,
            Intermediate: 50,
            Advanced: 75,
            Expert: 100
        };

        return percentages[proficiency] || 0;
    }

    function getProficiencyFromPercentage(level) {
        if (level <= 25) return "Beginner";
        if (level <= 50) return "Intermediate";
        if (level <= 75) return "Advanced";
        return "Expert";
    }

    function openAddModal() {
        setSelectedSkill(null);
        setFormData(emptyForm);
        setModalType("add");
    }

    function openEditModal(skill) {
        setSelectedSkill(skill);

        const proficiency =
            skill.proficiency ||
            getProficiencyFromPercentage(skill.level || 0);

        setFormData({
            name: skill.name,
            category: skill.category,
            proficiency
        });

        setModalType("edit");
    }

    function openDeleteModal(skill) {
        setSelectedSkill(skill);
        setModalType("delete");
    }

    function closeModal() {
        if (isSaving) return;

        setModalType(null);
        setSelectedSkill(null);
        setFormData(emptyForm);
    }

    function handleInputChange(e) {
        const { name, value } = e.target;

        setFormData((current) => ({
            ...current,
            [name]: value
        }));
    }

    async function handleSaveSkill(e) {
        e.preventDefault();

        if (!formData.name.trim() || !formData.category.trim()) {
            return;
        }

        try {
            setIsSaving(true);

            let success = false;

            if (modalType === "add") {
                success = await addSkill(formData);
            } else if (modalType === "edit" && selectedSkill) {
                success = await onUpdateSkill(
                    selectedSkill.id,
                    formData
                );
            }

            if (success) {
                setModalType(null);
                setSelectedSkill(null);
                setFormData(emptyForm);
            }
        } catch (error) {
            console.error("Skill save failed:", error);
        } finally {
            setIsSaving(false);
        }
    }

    async function handleConfirmDelete() {
        if (!selectedSkill) return;

        try {
            setIsSaving(true);

            const success = await onDeleteSkill(selectedSkill.id);

            if (success) {
                setModalType(null);
                setSelectedSkill(null);
            }
        } catch (error) {
            console.error("Skill deletion failed:", error);
        } finally {
            setIsSaving(false);
        }
    }

    // Load skill progress history
    async function openHistory(skill) {
        setHistorySkill(skill);
        setHistory([]);
        setHistoryError("");

        if (!onGetSkillHistory) {
            setHistoryError("History service is not connected.");
            return;
        }

        try {
            setHistoryLoading(true);

            const result = await onGetSkillHistory(skill.id);

            setHistory(Array.isArray(result) ? result : []);
        } catch (error) {
            console.error("Failed to load skill history:", error);
            setHistoryError("Unable to load progress history.");
        } finally {
            setHistoryLoading(false);
        }
    }

    function closeHistory() {
        if (historyLoading) return;

        setHistorySkill(null);
        setHistory([]);
        setHistoryError("");
    }

    return (
        <>
            <PageHeading
                eyebrow="YOUR TECHNICAL TOOLKIT"
                title="My skills"
                description="Track your technologies and identify opportunities to grow."
                action={
                    <button
                        className="primary-button"
                        onClick={openAddModal}
                    >
                        <Plus size={17} /> Add a skill
                    </button>
                }
            />

            <div className="search-panel">
                <Search size={19} />
                <input
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    placeholder="Search your skills..."
                />
            </div>

            <div className="skills-cards-grid">
                {skills.map((skill) => {
                    const proficiency =
                        skill.proficiency ||
                        getProficiencyFromPercentage(skill.level || 0);

                    const percentage =
                        getProficiencyPercentage(proficiency);

                    return (
                        <div
                            className="panel individual-skill-card"
                            key={skill.id}
                        >
                            <div className={`skill-icon large ${skill.color}`}>
                                <Code2 size={23} />
                            </div>

                            <div className="skill-card-category">
                                {skill.category}
                            </div>

                            <h3>{skill.name}</h3>

                            <div className="skill-actions">
                                <button
                                    className="secondary-button"
                                    onClick={() => openEditModal(skill)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="secondary-button"
                                    onClick={() => openDeleteModal(skill)}
                                >
                                    Delete
                                </button>

                                <button
                                    className="secondary-button"
                                    onClick={() => openHistory(skill)}
                                >
                                    View History
                                </button>
                            </div>

                            <div className="skill-row-title">
                                <span>{proficiency}</span>
                                <strong>{percentage}%</strong>
                            </div>

                            <div className="progress-track">
                                <div
                                    className={`progress-fill ${skill.color}`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>

                            <p className="skill-note">
                                Your skill progress is saved in your account.
                            </p>
                        </div>
                    );
                })}

                {skills.length === 0 && (
                    <div className="panel empty-state">
                        <Search size={28} />
                        <h3>No matching skills</h3>
                        <p>Try another search term or add a new skill.</p>
                    </div>
                )}
            </div>

            {/* ADD / EDIT SKILL MODAL */}
            {(modalType === "add" || modalType === "edit") && (
                <div
                    className="modal-overlay"
                    onClick={closeModal}
                >
                    <div
                        className="custom-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-heading">
                            <div>
                                <h2>
                                    {modalType === "add"
                                        ? "Add New Skill"
                                        : "Edit Skill"}
                                </h2>
                                <p>Enter your skill details below.</p>
                            </div>

                            <button
                                type="button"
                                className="modal-close"
                                onClick={closeModal}
                                disabled={isSaving}
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSaveSkill}>
                            <label>Skill Name</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="e.g. Java"
                                required
                            />

                            <label>Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                            >
                                <option value="Backend">Backend</option>
                                <option value="Frontend">Frontend</option>
                                <option value="Database">Database</option>
                                <option value="Programming">Programming</option>
                                <option value="Tools">Tools</option>
                                <option value="Other">Other</option>
                            </select>

                            <label>Proficiency Level</label>
                            <select
                                name="proficiency"
                                value={formData.proficiency}
                                onChange={handleInputChange}
                            >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                                <option value="Expert">Expert</option>
                            </select>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={closeModal}
                                    disabled={isSaving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="save-btn"
                                    disabled={isSaving}
                                >
                                    {isSaving
                                        ? "Saving..."
                                        : modalType === "add"
                                            ? "Add Skill"
                                            : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRMATION MODAL */}
            {modalType === "delete" && (
                <div
                    className="modal-overlay"
                    onClick={closeModal}
                >
                    <div
                        className="custom-modal delete-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="delete-icon">!</div>

                        <h2>Delete Skill?</h2>

                        <p>
                            Are you sure you want to delete
                            <strong> {selectedSkill?.name}</strong>?
                            This action cannot be undone.
                        </p>

                        <div className="modal-actions">
                            <button
                                className="cancel-btn"
                                onClick={closeModal}
                                disabled={isSaving}
                            >
                                Cancel
                            </button>

                            <button
                                className="delete-btn"
                                onClick={handleConfirmDelete}
                                disabled={isSaving}
                            >
                                {isSaving ? "Deleting..." : "Yes, Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* SKILL PROGRESS HISTORY MODAL */}
            {historySkill && (
                <div
                    className="modal-overlay"
                    onClick={closeHistory}
                >
                    <div
                        className="custom-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-heading">
                            <div>
                                <h2>{historySkill.name} Progress</h2>
                                <p>Your proficiency improvement history.</p>
                            </div>

                            <button
                                type="button"
                                className="modal-close"
                                onClick={closeHistory}
                                disabled={historyLoading}
                            >
                                &times;
                            </button>
                        </div>

                        {historyLoading ? (
                            <p>Loading progress history...</p>
                        ) : historyError ? (
                            <p>{historyError}</p>
                        ) : history.length === 0 ? (
                            <p>No progress history available yet.</p>
                        ) : (
                            <div className="skill-history-list">
                                {history.map((item) => (
                                    <div
                                        key={item.id}
                                        className="skill-history-item"
                                    >
                                        <strong>
                                            {item.previousProficiency || "New"}{" "}
                                            → {item.newProficiency}
                                        </strong>

                                        <p>
                                            {item.updatedAt
                                                ? new Date(
                                                    item.updatedAt
                                                ).toLocaleString()
                                                : ""}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}



function ResumePage({ resumeName, setResumeName, setNotice }) {
  const [resumeId, setResumeId] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resumeHistory, setResumeHistory] = useState([]);

  // Load saved resume history when the page opens
  useEffect(() => {
    async function loadHistory() {
      try {
        const history = await getResumeHistory();
        setResumeHistory(history);

        if (history.length > 0) {
          const savedId = localStorage.getItem("selectedResumeId");

          const selected = history.find(
            item => String(item.resumeId) === savedId
          ) || history[0];

          await selectResume(selected);
        }
      } catch (err) {
        console.error("History loading error:", err);
      }
    }

    loadHistory();
  }, []);

  // Select an existing resume and load its analysis
  async function selectResume(resume) {
    try {
      setLoading(true);
      setError("");

      setResumeId(resume.resumeId);
      setResumeName(resume.fileName);

      localStorage.setItem(
        "selectedResumeId",
        String(resume.resumeId)
      );

      const response = await getResumeAnalysis(resume.resumeId);
      setAnalysis(response.analysis || "");

      setNotice("Resume loaded successfully.");
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
        "Unable to load selected resume."
      );
    } finally {
      setLoading(false);
    }
  }

  // Upload and analyze resume
  async function handleUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please select a PDF or DOCX file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    try {
      setLoading(true);
      setError("");
      setAnalysis("");
      setResumeName(file.name);
      setNotice("Uploading your resume...");

      const uploadResponse = await uploadResume(file);
      const id = uploadResponse.resumeId;

      setResumeId(id);

      localStorage.setItem("selectedResumeId", String(id));

      setNotice("Resume uploaded. AI analysis started...");

      const analysisResponse = await analyzeResume(id);

      setAnalysis(analysisResponse.analysis || "");
      setNotice("Resume analyzed successfully!");

      // Refresh saved resume history
      const history = await getResumeHistory();
      setResumeHistory(history);

    } catch (err) {
      console.error("Resume error:", err);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Something went wrong while analyzing your resume."
      );

      setNotice("Resume analysis failed.");
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  }

  // Reload currently selected analysis
  async function handleLoadPrevious() {
    if (!resumeId) return;

    const selected = resumeHistory.find(
      item => item.resumeId === resumeId
    );

    if (selected) {
      await selectResume(selected);
    } else {
      try {
        setLoading(true);
        const response = await getResumeAnalysis(resumeId);
        setAnalysis(response.analysis || "");
      } catch (err) {
        setError("Unable to load previous analysis.");
      } finally {
        setLoading(false);
      }
    }
  }

  // Extract score from AI-generated Markdown
  const scoreMatch = analysis.match(
    /Score:\s*(\d+)\s*\/\s*100/i
  );

  const score = scoreMatch ? scoreMatch[1] : "--";

  return (
    <>
      <PageHeading
        eyebrow="RESUME INTELLIGENCE"
        title="Resume analyzer"
        description="Prepare your resume for your next career opportunity."
      />

      <div className="resume-layout">
        <div className="panel resume-upload-panel">
          <div className="resume-heading-icon">
            <FileText size={27} />
          </div>

          <h2>Upload your resume</h2>

          <p>
            Select a PDF or Word document to prepare it for analysis.
          </p>

          <label className="upload-zone">
            <div className="upload-icon">
              <Plus size={24} />
            </div>

            <strong>Choose a resume file</strong>
            <span>PDF or DOCX · Maximum 5 MB</span>

            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleUpload}
              disabled={loading}
            />
          </label>

          {resumeName && (
            <div className="selected-file">
              <FileText size={19} />
              <span>{resumeName}</span>
              <CheckCircle2 size={17} />
            </div>
          )}

          {loading && (
            <p>Processing resume. Please wait...</p>
          )}

          {error && (
            <p style={{ color: "red" }}>{error}</p>
          )}

          {analysis && (
            <button
              type="button"
              onClick={handleLoadPrevious}
              disabled={loading}
            >
              Load saved analysis
            </button>
          )}

          <div className="privacy-note">
            <ShieldCheck size={18} />
            <span>
              Your resume is uploaded to the server for AI analysis.
            </span>
          </div>

          {/* Saved Resume History */}
          <div className="resume-history">
            <h3>Previous resumes</h3>

            {resumeHistory.length === 0 ? (
              <p>No previous resumes found.</p>
            ) : (
              resumeHistory.map(resume => (
                <button
                  type="button"
                  key={resume.resumeId}
                  onClick={() => selectResume(resume)}
                  disabled={loading}
                  className="resume-history-item"
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px",
                    marginBottom: "8px",
                    cursor: "pointer",
                    border: resumeId === resume.resumeId
                      ? "2px solid #6366f1"
                      : "1px solid #ddd",
                    borderRadius: "8px"
                  }}
                >
                  <span>
                    <FileText size={16} />
                    {" "}{resume.fileName}
                  </span>

                  <span>
                    {resume.analyzed ? "Analyzed ✓" : "Not analyzed"}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="panel resume-results-panel">
          <div className="panel-title">Analysis preview</div>

          <div className="panel-subtitle">
            Your resume analysis will appear here.
          </div>

          <div className="resume-score-placeholder">
            <div className="score-ring">
              <FileText size={28} />
            </div>

            <strong className="resume-score-value">
              {analysis ? `${score} / 100` : "-- / 100"}
            </strong>

            <span>
              {loading
                ? "Analyzing..."
                : analysis
                ? "Resume score"
                : "Awaiting analysis"}
            </span>
          </div>

          {analysis ? (
            <div className="resume-analysis-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {analysis}
              </ReactMarkdown>
            </div>
          ) : (
            <>
              <div className="preview-list-item">
                <CircleDashed size={18} />
                <span>Skills and keywords</span>
              </div>

              <div className="preview-list-item">
                <CircleDashed size={18} />
                <span>Resume quality feedback</span>
              </div>

              <div className="preview-list-item">
                <CircleDashed size={18} />
                <span>Suggestions for improvement</span>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}




function ProjectsPage({
  projects,
  onAddProject,
  onUpdateProject,
  onDeleteProject,
  navigateTo
}) {
  const [modalType, setModalType] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const emptyForm = {
    title: "",
    category: "Full Stack",
    description: "",
    technologies: "Java, Spring Boot, MySQL",
    status: "In Progress"
  };

  const [formData, setFormData] = useState(emptyForm);

  function openAddModal() {
    setSelectedProject(null);
    setFormData(emptyForm);
    setModalType("add");
  }

  function openEditModal(project) {
    setSelectedProject(project);

    setFormData({
      title: project.title || "",
      category: project.category || "",
      description: project.description || "",
      technologies: project.technologies || "",
      status: project.status || "In Progress"
    });

    setModalType("edit");
  }

  function openDeleteModal(project) {
    setSelectedProject(project);
    setModalType("delete");
  }

  function closeModal() {
    if (isSaving) return;

    setModalType(null);
    setSelectedProject(null);
    setFormData(emptyForm);
  }

  async function handleSaveProject(e) {
    e.preventDefault();

    if (!formData.title.trim()) return;

    const projectData = {
      title: formData.title.trim(),
      category: formData.category.trim(),
      description: formData.description.trim(),
      technologies: formData.technologies.trim(),
      status: formData.status
    };

    try {
      setIsSaving(true);

      let success = false;

      if (modalType === "add") {
        success = await onAddProject(projectData);
      } else if (modalType === "edit" && selectedProject) {
        success = await onUpdateProject(
          selectedProject.id,
          projectData
        );
      }

      if (success) {
        setModalType(null);
        setSelectedProject(null);
        setFormData(emptyForm);
      }
    } catch (error) {
      console.error("Project save failed:", error);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleConfirmDelete() {
    if (!selectedProject) return;

    try {
      setIsSaving(true);

      const success = await onDeleteProject(selectedProject.id);

      if (success) {
        setModalType(null);
        setSelectedProject(null);
      }
    } catch (error) {
      console.error("Project deletion failed:", error);
    } finally {
      setIsSaving(false);
    }
  }

  function handleInputChange(e) {
    const { name, value } = e.target;

    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  }

  return (
    <>
      <PageHeading
        eyebrow="YOUR PORTFOLIO"
        title="My projects"
        description="Showcase your work and the technologies you have practiced."
        action={
          <button className="primary-button" onClick={openAddModal}>
            <Plus size={17} /> Add Project
          </button>
        }
      />

      <div className="project-grid">
        {projects.map((project, index) => (
          <div className="panel project-card" key={project.id}>
            <div className="project-card-top">
              <div className={`project-icon project-color-${(index % 3) + 1}`}>
                <FolderKanban size={23} />
              </div>

              <span className="project-status">{project.status}</span>
            </div>

            <div className="skill-card-category">
              {project.category}
            </div>

            <h3>{project.title}</h3>
            <p>{project.description}</p>

            <div className="tag-list">
              {(project.technologies || "")
                .split(",")
                .map((technology) => technology.trim())
                .filter(Boolean)
                .map((technology) => (
                  <span key={technology}>{technology}</span>
                ))}
            </div>

            <div className="skill-actions">
              <button
                className="secondary-button"
                onClick={() => openEditModal(project)}
              >
                Edit
              </button>

              <button
                className="secondary-button"
                onClick={() => openDeleteModal(project)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="panel empty-state">
            <FolderKanban size={28} />
            <h3>No projects added yet</h3>
            <p>Click Add Project to add your first project.</p>
          </div>
        )}
      </div>

      {/* ADD / EDIT PROJECT MODAL */}
      {(modalType === "add" || modalType === "edit") && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="custom-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-heading">
              <div>
                <h2>
                  {modalType === "add" ? "Add New Project" : "Edit Project"}
                </h2>
                <p>Enter your project details below.</p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeModal}
                disabled={isSaving}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveProject}>
              <label>Project Title</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter project title"
                required
              />

              <label>Category</label>
              <input
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                placeholder="e.g. Full Stack"
                required
              />

              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your project"
                required
              />

              <label>Technologies</label>
              <input
                name="technologies"
                value={formData.technologies}
                onChange={handleInputChange}
                placeholder="Java, Spring Boot, MySQL"
                required
              />

              <label>Project Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Planned">Planned</option>
              </select>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
                  disabled={isSaving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                  disabled={isSaving}
                >
                  {isSaving
                    ? "Saving..."
                    : modalType === "add"
                    ? "Add Project"
                    : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {modalType === "delete" && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="custom-modal delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-icon">!</div>

            <h2>Delete Project?</h2>

            <p>
              Are you sure you want to delete
              <strong> {selectedProject?.title}</strong>?
              This action cannot be undone.
            </p>

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={closeModal}
                disabled={isSaving}
              >
                Cancel
              </button>

              <button
                className="delete-btn"
                onClick={handleConfirmDelete}
                disabled={isSaving}
              >
                {isSaving ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


function SkillGapPage({ navigateTo }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch skill gap analysis from Spring Boot
  const fetchSkillGaps = async () => {
    try {
        setLoading(true);
        setError("");

        const result = await getSkillGapAnalysis();
        setData(result);

    } catch (error) {
        console.error("Skill Gap Analysis Error:", error);
        setError(error.message || "Unable to load skill gap analysis.");
    } finally {
        setLoading(false);
    }
};

  useEffect(() => {
    fetchSkillGaps();
  }, []);

  // Determine skill priority using backend importance weight
  function getPriority(importance) {
    if (importance >= 8) return "High";
    if (importance >= 6) return "Medium";
    return "Low";
  }

  // Display loading state
  if (loading) {
    return (
      <div className="panel empty-state">
        <BrainCircuit size={30} />
        <h3>Analyzing your skill gaps...</h3>
        <p>Please wait while we compare your skills with your target role.</p>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="panel empty-state">
        <h3>Unable to load skill gap analysis</h3>
        <p>{error}</p>
        <button className="primary-button" onClick={fetchSkillGaps}>
          Try Again
        </button>
      </div>
    );
  }

  if (!data) return null;

  // Reusable skill category display
  function renderSkills(skills, title) {
    return (
      <div className="panel gap-panel">
        <div className="panel-heading">
          <div>
            <div className="panel-title">{title}</div>
            <div className="panel-subtitle">
              {skills.length} skills
            </div>
          </div>
        </div>

        {skills.length === 0 ? (
          <p>No skills in this category.</p>
        ) : (
          skills.map((skill) => {
            const priority = getPriority(skill.importance);

            return (
              <div className="gap-row" key={skill.skillName}>
                <div className="gap-row-header">
                  <strong>{skill.skillName}</strong>

                  <span
                    className={`priority-badge ${priority.toLowerCase()}`}
                  >
                    {priority} priority
                  </span>
                </div>

                <div className="gap-bar-labels">
                  <span>
                    Current: {skill.currentProficiency}
                  </span>
                  <span>
                    Importance: {skill.importance}
                  </span>
                </div>

                <p>{skill.recommendation}</p>
              </div>
            );
          })
        )}
      </div>
    );
  }

  return (
    <>
      <PageHeading
        eyebrow="LEARN WITH PURPOSE"
        title="Skill gap analysis"
        description="Discover your strengths, missing skills, and areas that need improvement."
        action={
          <span className="sample-badge">Live Analysis</span>
        }
      />

      {/* TARGET ROLE */}
      <div className="panel target-role-banner">
        <div className="target-role-icon">
          <Target size={25} />
        </div>

        <div>
          <span className="skill-card-category">TARGET ROLE</span>
          <h2>{data.targetRole}</h2>
          <p>Based on your actual profile and saved skills</p>
        </div>

        <button
          className="secondary-button"
          onClick={() => navigateTo("My Profile")}
        >
          Edit target role
        </button>
      </div>

      {/* SKILL GAP SUMMARY */}
      <div className="panel gap-panel">
        <div className="panel-title">Skill Gap Summary</div>

        <div className="gap-row">
          <p>
            Total required skills: {data.totalRequiredSkills}
          </p>

          <p>
            Skills already added: {data.totalMatchedSkills}
          </p>

          <p>
            Missing skills: {data.totalMissingSkills}
          </p>

          <p>
            Skills to improve: {data.improvementSkills.length}
          </p>
        </div>
      </div>

      {/* SKILL CATEGORIES */}
      {renderSkills(data.missingSkills, "Missing Skills")}

      {renderSkills(data.improvementSkills, "Skills to Improve")}

      {renderSkills(data.matchedSkills, "Matched Skills")}

      {/* REFRESH ANALYSIS */}
      <button
        className="primary-button"
        onClick={fetchSkillGaps}
      >
        <BrainCircuit size={17} />
        Refresh Analysis
      </button>

      <button
        className="primary-button"
        onClick={() => navigateTo("Career Roadmap")}
      >
        <Map size={17} />
        View Learning Roadmap
      </button>
    </>
  );
}



function RoadmapPage({ roadmap, toggleTask, progressPercentage }) {
  if (!roadmap) {
    return <p>No roadmap available. Generate your roadmap first.</p>;
  }

  return (
    <>
      <PageHeading
        eyebrow="YOUR LEARNING JOURNEY"
        title="Career roadmap"
        description="Track your learning milestones as you work toward your target role."
        action={
          <span className="sample-badge">
            {roadmap.totalDuration}
          </span>
        }
      />

      <div className="panel roadmap-summary">
        <div className="roadmap-summary-icon">
          <Map size={26} />
        </div>

        <div className="roadmap-summary-main">
          <h2>{roadmap.targetRole}</h2>
          <p>Your personalized AI learning plan</p>

          <div className="progress-track">
            <div
              className="progress-fill purple"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        <div className="roadmap-summary-percent">
          {progressPercentage}%
        </div>
      </div>

      {roadmap.phases.map((phase) => (
        <div className="panel roadmap-timeline-panel" key={phase.id}>
          <div className="panel-title">
            {phase.phaseOrder}. {phase.phaseName}
          </div>

          <div className="panel-subtitle">
            Duration: {phase.duration}
          </div>

          <div className="roadmap-timeline">
            {phase.tasks.map((task, index) => (
              <button
                key={task.id}
                className="timeline-item"
                onClick={() => toggleTask(task.id)}
              >
                <div
                  className={`timeline-node ${
                    task.completed ? "completed" : ""
                  }`}
                >
                  {task.completed ? (
                    <CheckCircle2 size={19} />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>

                <div className="timeline-content">
                  <div className="timeline-topline">
                    <span className="timeline-week">
                      {task.duration}
                    </span>

                    <span
                      className={`timeline-status ${
                        task.completed ? "done" : ""
                      }`}
                    >
                      {task.completed ? "Completed" : "Upcoming"}
                    </span>
                  </div>

                  <h3
                    className={
                      task.completed ? "task-completed" : ""
                    }
                  >
                    {task.title}
                  </h3>

                  <p>{task.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}


function JobsPage({ navigateTo }) {
  
const [jobs, setJobs] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await jobService.getJobRecommendations();
        setJobs(data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Unable to load job recommendations.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return <p>Loading job recommendations...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <PageHeading
        eyebrow="YOUR NEXT OPPORTUNITY"
        title="Job opportunities"
        description="Explore jobs ranked according to your skills."
        action={<span className="sample-badge">Database listings</span>}
      />

      <div className="jobs-list">
        {jobs.length === 0 ? (
          <p>No job recommendations available.</p>
        ) : (
          jobs.map((job) => (
            <div className="panel job-card" key={job.id}>
              <div className="job-company-logo">
                <BriefcaseBusiness size={24} />
              </div>

              <div className="job-main">
                <span className="job-type">{job.jobType}</span>
                <h3>{job.title}</h3>
                <div className="job-company">{job.company}</div>
                <div className="job-location">
                  {job.location} · {job.experienceLevel}
                </div>

                <p>{job.description}</p>

                <div className="tag-list">
                  {job.requiredSkills.split(",").map((skill) => (
                    <span key={skill}>{skill.trim()}</span>
                  ))}
                </div>

                <p>
                  <strong>Salary:</strong> {job.salary}
                </p>

                <p>
                  <strong>Matched skills:</strong>{" "}
                  {job.matchedSkills.join(", ") || "None"}
                </p>

                <p>
                  <strong>Missing skills:</strong>{" "}
                  {job.missingSkills.join(", ") || "None"}
                </p>
              </div>

              <div className="job-match">
                <div className="match-circle">
                  <span>{job.matchPercentage}%</span>
                </div>

                <span>Skill match</span>

                <button
                  className="secondary-button"
                  onClick={() => navigateTo("Skill Gap Analysis")}
                >
                  Review skills
                </button>

                <a
                  href={job.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Apply Now
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}


function InterviewPage() {
  const [role, setRole] = useState("Java Developer");
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateQuestions = async () => {
    try {
      setLoading(true);
      setError("");
      setFeedback("");
      setAnswers({});
      setQuestionIndex(0);

      const data = await interviewService.generateQuestions(role);
      setQuestions(data.questions || []);

      if (!data.questions || data.questions.length === 0) {
        setError("No questions received. Please try again.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswers = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await interviewService.evaluateAnswers(
        role,
        answers
      );

      setFeedback(result.feedback);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeading
        eyebrow="PRACTICE AND PREPARE"
        title="Interview practice"
        description="Practice answering AI-generated interview questions."
        action={<span className="sample-badge">AI Practice</span>}
      />

      <div className="panel">
        <label className="form-field">
          Select Job Role
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Enter job role"
          />
        </label>

        <button
          className="primary-button"
          onClick={generateQuestions}
          disabled={loading || !role.trim()}
        >
          {loading ? "Generating..." : "Generate Questions"}
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {questions.length > 0 && (
        <div className="interview-layout">
          <div className="panel interview-question-panel">
            <div className="interview-topline">
              <span className="question-counter">
                QUESTION {questionIndex + 1} OF {questions.length}
              </span>
              <span className="difficulty-badge">
                Beginner friendly
              </span>
            </div>

            <div className="interview-question-icon">
              <MessagesSquare size={27} />
            </div>

            <h2>{questions[questionIndex]}</h2>

            <label className="form-field">
              Your Answer
              <textarea
                value={answers[questionIndex] || ""}
                onChange={(e) =>
                  setAnswers({
                    ...answers,
                    [questionIndex]: e.target.value,
                  })
                }
                placeholder="Write your answer here..."
                rows={7}
              />
            </label>

            <div className="interview-controls">
              <button
                className="secondary-button"
                disabled={questionIndex === 0}
                onClick={() =>
                  setQuestionIndex((current) => current - 1)
                }
              >
                Previous
              </button>

              {questionIndex < questions.length - 1 ? (
                <button
                  className="primary-button"
                  onClick={() =>
                    setQuestionIndex((current) => current + 1)
                  }
                >
                  Next Question <ArrowUpRight size={16} />
                </button>
              ) : (
                <button
                  className="primary-button"
                  onClick={submitAnswers}
                  disabled={loading}
                >
                  {loading ? "Evaluating..." : "Submit Answers"}
                </button>
              )}
            </div>
          </div>

          <div className="panel interview-tips-panel">
            <div className="tips-icon">
              <Sparkles size={23} />
            </div>
            <h3>Practice Tip</h3>
            <p>
              Explain your answers clearly and use examples
              wherever possible.
            </p>
            <div className="privacy-note">
              <Bot size={18} />
              <span>AI feedback is available after submission.</span>
            </div>
          </div>
        </div>
      )}

     {feedback && (
  <div className="panel interview-feedback">
    <h2>AI Interview Feedback</h2>

    <div className="feedback-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {feedback}
      </ReactMarkdown>
    </div>
  </div>
)}
    </>
  );
}


function ChatPage({ messages, input, setInput, sendMessage, loading }) {
  return (
    <>
      <PageHeading
        eyebrow="CAREER CONVERSATIONS"
        title="AI career chat"
        description="Ask questions about skills, career paths, and learning strategies."
        action={<span className="sample-badge">Live AI assistant</span>}
      />

      <div className="panel chat-panel">
        <div className="chat-header">
          <div className="chat-bot-icon">
            <Bot size={25} />
          </div>
          <div>
            <h3>CareerTwin Assistant</h3>
            <span>
              <span className="online-dot" /> Connected to CareerTwin AI
            </span>
          </div>
        </div>

        <div className="chat-messages">
          {messages.map((message, index) => (
            <div
              className={`chat-message ${
                message.role === "user" ? "chat-message-user" : ""
              }`}
              key={`${message.role}-${index}`}
            >
              {message.role === "assistant" && (
                <div className="chat-message-avatar">
                  <Bot size={17} />
                </div>
              )}
              <div className="chat-bubble">
  {message.role === "assistant" ? (
    <div className="markdown-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {message.text}
      </ReactMarkdown>
    </div>
  ) : (
    message.text
  )}
</div>
            </div>
          ))}
        </div>

        <form className="chat-input-form" onSubmit={sendMessage}>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about your career journey..."
            aria-label="Chat message"
          />
          <button
            type="submit"
            className="primary-button send-button"
            aria-label="Send message"
            disabled={loading || !input.trim()}
          >
            {loading ? "..." : <Send size={17} />}
          </button>
        </form>
        <div className="chat-disclaimer">
          {loading ? "CareerTwin AI is thinking..." : "Powered by Groq AI · CareerTwin Assistant"}
        </div>
      </div>
    </>
  );
}

function AdminPage() {
  const items = [
    { title: "Registered users", value: "—", icon: UserRound },
    { title: "Skills catalogue", value: "—", icon: Code2 },
    { title: "Job listings", value: "—", icon: BriefcaseBusiness },
    { title: "AI requests", value: "—", icon: BrainCircuit },
  ];

  return (
    <>
      <PageHeading
        eyebrow="APPLICATION MANAGEMENT"
        title="Admin panel"
        description="A preview of the administrative tools planned for the project."
        action={<span className="sample-badge">UI preview only</span>}
      />

      <div className="admin-notice">
        <ShieldCheck size={21} />
        <div>
          <strong>Administration is not connected</strong>
          <p>
            User management and administrative operations will require a
            secured Spring Boot backend and proper authorization.
          </p>
        </div>
      </div>

      <div className="stats-grid admin-stats-grid">
        {items.map((item) => (
          <StatCard
            key={item.title}
            label={item.title}
            value={item.value}
            change="Backend not connected"
            icon={item.icon}
            color="blue"
            progress={0}
          />
        ))}
      </div>

      <div className="panel admin-placeholder">
        <div className="admin-placeholder-icon">
          <ShieldCheck size={31} />
        </div>
        <h2>Admin workspace</h2>
        <p>
          This space can later contain user management, skill catalog
          maintenance, job administration, and usage analytics.
        </p>
      </div>
    </>
  );
}

function AuthPage({ mode, setMode, onLogin }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [targetRole, setTargetRole] = useState("Java Full Stack Developer");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (mode === "register") {
        await registerUser({
          fullName,
          email,
          password,
          targetRole
        });

        setMessage("Registration successful! Please login.");
        setMode("login");
      } else {
        await loginUser({ email, password });
onLogin();
      }
    } catch (error) {
      setMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <GraduationCap size={30} />
        </div>

        <h1>CareerTwin</h1>
        <p className="auth-subtitle">
          Your AI-powered career companion
        </p>

        <h2>
          {mode === "login" ? "Welcome Back!" : "Create Your Account"}
        </h2>

        <form onSubmit={handleSubmit}>
          {mode === "register" && (
            <>
              <label>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
              />

              <label>Target Career Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                required
              />
            </>
          )}

          <label>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            minLength={8}
            required
          />

          {message && (
            <p className="auth-message">{message}</p>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Login"
                : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          {mode === "login"
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            type="button"
            onClick={() => {
              setMessage("");
              setMode(mode === "login" ? "register" : "login");
            }}
          >
            {mode === "login" ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}



export default App;
