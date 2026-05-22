import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function CreateProject() {
    const [form, setForm] = useState({
        name: "",
        description: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const createProject = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) {
            setError("Project name is required.");
            return;
        }

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            // ✅ ONLY FIXED ROUTE
            await api.post("/api/projects", form);

            setSuccess("Project created successfully! Redirecting...");
            setTimeout(() => {
                navigate("/projects", { state: { refresh: true } });
            }, 1200);

        } catch (err) {
            setError(err.response?.data?.message || "Failed to create project. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-73px)] bg-slate-950 text-slate-100 p-8 flex items-center justify-center relative overflow-hidden">
            <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-xl bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-8 rounded-3xl shadow-2xl relative z-10 space-y-6">

                <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                        Create Project Workspace
                    </h2>
                    <p className="text-xs text-slate-400">
                        Establish a central hub to organize, assign tasks, and track team progress.
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

                <form onSubmit={createProject} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                            Project Name
                        </label>
                        <input
                            name="name"
                            placeholder="e.g. Q3 Mobile Client Release"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 text-slate-100 p-3.5 rounded-xl text-xs outline-none transition duration-200"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
                            Project Description
                        </label>
                        <textarea
                            name="description"
                            placeholder="Detail the scope, team goals, and critical deliverables of this project workspace..."
                            value={form.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 text-slate-100 p-3.5 rounded-xl text-xs outline-none transition duration-200 resize-none"
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold py-3.5 rounded-xl text-xs transition duration-200 shadow-lg shadow-indigo-500/15 hover:shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-2"
                    >
                        {loading ? "Creating workspace..." : "Create Project Workspace"}
                    </button>
                </form>

            </div>
        </div>
    );
}