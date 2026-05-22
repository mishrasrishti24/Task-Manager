import { useEffect, useState } from "react";
import api from "../services/api";

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const projectRes = await api.get("/api/projects");
            const taskRes = await api.get("/api/tasks/all");

            setProjects(projectRes.data.projects || []);
            setTasks(taskRes.data.tasks || []);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const completedTasks = tasks.filter(
        (task) => task.status === "Completed"
    ).length;

    const pendingTasks = tasks.filter(
        (task) => task.status !== "Completed"
    ).length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdueTasks = tasks.filter(
        (task) => task.status !== "Completed" && task.dueDate && new Date(task.dueDate) < today
    ).length;

    // Calculate tasks per user analytics
    const userAnalyticsMap = {};
    tasks.forEach(task => {
        const u = task.assignedTo;
        if (u) {
            if (!userAnalyticsMap[u._id]) {
                userAnalyticsMap[u._id] = {
                    username: u.username,
                    email: u.email,
                    role: u.role,
                    total: 0,
                    completed: 0,
                    pending: 0
                };
            }
            userAnalyticsMap[u._id].total += 1;
            if (task.status === "Completed") {
                userAnalyticsMap[u._id].completed += 1;
            } else {
                userAnalyticsMap[u._id].pending += 1;
            }
        }
    });
    const userAnalytics = Object.values(userAnalyticsMap);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="relative w-16 h-16">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500/20 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-t-indigo-500 rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Welcome Card */}
                <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="absolute -right-20 -top-20 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="space-y-2">
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-400 bg-clip-text text-transparent">
                            Welcome Back, {user?.username} 👋
                        </h1>
                        <p className="text-slate-400 max-w-xl">
                            Manage your workspace, track project milestones, and coordinate team tasks dynamically.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-2xl">
                        <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse"></span>
                        <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">{user?.role} Access</span>
                    </div>
                </div>

                {/* Dashboard Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {/* Projects */}
                    <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl shadow-lg relative group overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-indigo-500/10 rounded-full group-hover:scale-125 transition duration-300 pointer-events-none blur-lg"></div>
                        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Projects</h3>
                        <p className="text-4xl font-bold mt-4 text-indigo-400">{projects.length}</p>
                    </div>

                    {/* Total Tasks */}
                    <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl shadow-lg relative group overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-blue-500/10 rounded-full group-hover:scale-125 transition duration-300 pointer-events-none blur-lg"></div>
                        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Tasks</h3>
                        <p className="text-4xl font-bold mt-4 text-blue-400">{tasks.length}</p>
                    </div>

                    {/* Completed Tasks */}
                    <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl shadow-lg relative group overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-emerald-500/10 rounded-full group-hover:scale-125 transition duration-300 pointer-events-none blur-lg"></div>
                        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Completed</h3>
                        <p className="text-4xl font-bold mt-4 text-emerald-400">{completedTasks}</p>
                    </div>

                    {/* Pending Tasks */}
                    <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl shadow-lg relative group overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-amber-500/10 rounded-full group-hover:scale-125 transition duration-300 pointer-events-none blur-lg"></div>
                        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Pending</h3>
                        <p className="text-4xl font-bold mt-4 text-amber-400">{pendingTasks}</p>
                    </div>

                    {/* Overdue Tasks */}
                    <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-2xl shadow-lg relative group overflow-hidden">
                        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-rose-500/10 rounded-full group-hover:scale-125 transition duration-300 pointer-events-none blur-lg"></div>
                        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Overdue</h3>
                        <p className="text-4xl font-bold mt-4 text-rose-400">{overdueTasks}</p>
                    </div>
                </div>

                {/* Team Tasks Per User Analytics */}
                <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                            Team Performance & Task Distribution
                        </h2>
                        <p className="text-xs text-slate-400">
                            A granular view of tasks assigned to each teammate and their completion rates.
                        </p>
                    </div>

                    {userAnalytics.length === 0 ? (
                        <div className="text-center py-10 border border-dashed border-slate-850 rounded-2xl text-slate-500 text-sm">
                            No team task assignments recorded yet.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {userAnalytics.map(u => {
                                const completionPercentage = u.total > 0 ? Math.round((u.completed / u.total) * 100) : 0;
                                return (
                                    <div key={u.email} className="bg-slate-900 border border-slate-850 p-6 rounded-2xl space-y-4 shadow-md">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-bold text-slate-200">{u.username}</h4>
                                                <p className="text-xs text-slate-400 truncate max-w-[180px]">{u.email}</p>
                                            </div>
                                            <span className="text-[10px] font-semibold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                {u.role}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                                                <span className="block text-[10px] text-slate-400 font-medium">Assigned</span>
                                                <span className="block text-lg font-bold mt-1 text-slate-200">{u.total}</span>
                                            </div>
                                            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                                                <span className="block text-[10px] text-slate-400 font-medium">Completed</span>
                                                <span className="block text-lg font-bold mt-1 text-emerald-400">{u.completed}</span>
                                            </div>
                                            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                                                <span className="block text-[10px] text-slate-400 font-medium">Pending</span>
                                                <span className="block text-lg font-bold mt-1 text-amber-400">{u.pending}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <div className="flex justify-between text-xs font-semibold text-slate-400">
                                                <span>Completion Rate</span>
                                                <span className="text-indigo-400">{completionPercentage}%</span>
                                            </div>
                                            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                                                <div
                                                    className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                                                    style={{ width: `${completionPercentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Dashboard;