import { useEffect, useState } from "react";
import api from "../services/api";

export default function CreateTask() {
    const [projects, setProjects] = useState([]);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [form, setForm] = useState({
        title: "",
        description: "",
        priority: "Medium",
        dueDate: "",
        projectId: "",
        assignedTo: ""
    });

    // Fetch projects
    const fetchProjects = async () => {
        try {
            const res = await api.get("/projects");
            setProjects(res.data.projects || []);
        } catch (err) {
            console.error("Error fetching projects:", err);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));

        // if project changes, load its members
        if (name === "projectId") {
            const selectedProj = projects.find((p) => p._id === value);
            setMembers(selectedProj ? selectedProj.members : []);
            setForm((prev) => ({
                ...prev,
                assignedTo: "",
                projectId: value
            }));
        }
    };

    const createTask = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) {
            setError("Task title is required.");
            return;
        }
        if (!form.projectId) {
            setError("Please select a project.");
            return;
        }
        if (!form.assignedTo) {
            setError("Please assign this task to a team member.");
            return;
        }

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await api.post("/tasks/create", form);

            setSuccess("Task issued and assigned successfully!");

            // reset form
            setForm({
                title: "",
                description: "",
                priority: "Medium",
                dueDate: "",
                projectId: "",
                assignedTo: ""
            });
            setMembers([]);
        } catch (err) {
            setError(err.response?.data?.message || "Error creating task. Please verify your inputs.");
        } finally {
            setLoading(false);
        }
    };

    const getPriorityBadgeColor = (p) => {
        switch (p) {
            case "High": return "bg-rose-500/10 border-rose-500/30 text-rose-400";
            case "Medium": return "bg-amber-500/10 border-amber-500/30 text-amber-400";
            default: return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400";
        }
    };

    return (
        <div className="min-h-[calc(100vh-73px)] bg-slate-950 text-slate-100 p-8 flex items-center justify-center relative overflow-hidden">
            {/* Ambient Background glows */}
            <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-xl bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-8 rounded-3xl shadow-2xl relative z-10 space-y-6">
                
                {/* Header */}
                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                        Create & Assign Task
                    </h2>
                    <p className="text-xs text-slate-400">
                        Designate team deliverables, assign owners, specify timelines and set priorities.
                    </p>
                </div>

                {/* Notifications */}
                {error && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-xs flex items-center gap-2 animate-pulse">
                        <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                        <span>{success}</span>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={createTask} className="space-y-4">
                    
                    {/* Title */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Task Title</label>
                        <input
                            name="title"
                            value={form.title}
                            placeholder="e.g. Implement Oauth Authentication Flow"
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 text-slate-100 p-3.5 rounded-xl text-xs outline-none transition duration-200"
                            required
                            disabled={loading}
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Task Description</label>
                        <textarea
                            name="description"
                            value={form.description}
                            placeholder="Explain the scope, prerequisites, and expected outcomes..."
                            onChange={handleChange}
                            rows="3"
                            className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 text-slate-100 p-3.5 rounded-xl text-xs outline-none transition duration-200 resize-none"
                            disabled={loading}
                        />
                    </div>

                    {/* Select Project & Assignee */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Project Workspace</label>
                            <select
                                name="projectId"
                                value={form.projectId}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 text-slate-100 p-3.5 rounded-xl text-xs outline-none transition duration-200 cursor-pointer"
                                required
                                disabled={loading}
                            >
                                <option value="">Select Project</option>
                                {projects.map((p) => (
                                    <option key={p._id} value={p._id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Assignee</label>
                            <select
                                name="assignedTo"
                                value={form.assignedTo}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 text-slate-100 p-3.5 rounded-xl text-xs outline-none transition duration-200 cursor-pointer disabled:opacity-50"
                                disabled={!form.projectId || loading}
                                required
                            >
                                <option value="">Assign To Teammate</option>
                                {members.map((m) => (
                                    <option key={m._id} value={m._id}>
                                        {m.username} ({m.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Priority & Due Date */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Priority Level</label>
                            <div className="relative">
                                <select
                                    name="priority"
                                    value={form.priority}
                                    onChange={handleChange}
                                    className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 text-slate-100 p-3.5 rounded-xl text-xs outline-none transition duration-200 cursor-pointer"
                                    disabled={loading}
                                >
                                    <option value="Low">Low Priority</option>
                                    <option value="Medium">Medium Priority</option>
                                    <option value="High">High Priority</option>
                                </select>
                                <span className={`absolute right-10 top-1/2 -translate-y-1/2 border px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${getPriorityBadgeColor(form.priority)}`}>
                                    {form.priority}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Due Date</label>
                            <input
                                type="date"
                                name="dueDate"
                                value={form.dueDate}
                                onChange={handleChange}
                                className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 text-slate-100 p-3.5 rounded-xl text-xs outline-none transition duration-200 cursor-pointer"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold py-3.5 rounded-xl text-xs transition duration-200 shadow-lg shadow-indigo-500/15 hover:shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-4"
                    >
                        {loading ? "Creating Task..." : "Create & Assign Task"}
                    </button>
                </form>

            </div>
        </div>
    );
}