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

            <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-xl bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-8 rounded-3xl shadow-2xl relative z-10 space-y-6">

                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                        Create & Assign Task
                    </h2>
                    <p className="text-xs text-slate-400">
                        Designate team deliverables, assign owners, specify timelines and set priorities.
                    </p>
                </div>

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

                <form onSubmit={createTask} className="space-y-4">

                    <input
                        name="title"
                        value={form.title}
                        placeholder="Task Title"
                        onChange={handleChange}
                        className="w-full p-3 rounded-xl bg-slate-950 text-white"
                        required
                        disabled={loading}
                    />

                    <textarea
                        name="description"
                        value={form.description}
                        placeholder="Task Description"
                        onChange={handleChange}
                        rows="3"
                        className="w-full p-3 rounded-xl bg-slate-950 text-white"
                        disabled={loading}
                    />

                    <select
                        name="projectId"
                        value={form.projectId}
                        onChange={handleChange}
                        className="w-full p-3 rounded-xl bg-slate-950 text-white"
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

                    <select
                        name="assignedTo"
                        value={form.assignedTo}
                        onChange={handleChange}
                        className="w-full p-3 rounded-xl bg-slate-950 text-white"
                        required
                        disabled={!form.projectId || loading}
                    >
                        <option value="">Assign To</option>
                        {members.map((m) => (
                            <option key={m._id} value={m._id}>
                                {m.username}
                            </option>
                        ))}
                    </select>

                    <select
                        name="priority"
                        value={form.priority}
                        onChange={handleChange}
                        className="w-full p-3 rounded-xl bg-slate-950 text-white"
                        disabled={loading}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>

                    <input
                        type="date"
                        name="dueDate"
                        value={form.dueDate}
                        onChange={handleChange}
                        className="w-full p-3 rounded-xl bg-slate-950 text-white"
                        disabled={loading}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-3 rounded-xl"
                    >
                        {loading ? "Creating Task..." : "Create & Assign Task"}
                    </button>

                </form>

            </div>
        </div>
    );
}