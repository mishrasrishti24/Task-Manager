import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Projects() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setLoading(true);
                const res = await api.get("/projects");
                setProjects(res.data.projects || []);
            } catch (err) {
                console.error("Error fetching projects:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

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
                
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-400 bg-clip-text text-transparent">
                            My Projects
                        </h1>
                        <p className="text-xs text-slate-400 mt-1">
                            A list of workspaces you created or were added to as a teammate.
                        </p>
                    </div>
                </div>

                {/* Projects Grid */}
                {projects.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-slate-850 rounded-3xl text-slate-500 text-sm">
                        No projects recorded yet. Create a project to get started.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map(p => (
                            <div
                                key={p._id}
                                className="bg-slate-900 border border-slate-850 hover:border-slate-700/80 p-6 rounded-2xl cursor-pointer transition duration-300 shadow-md hover:shadow-indigo-500/5 flex flex-col justify-between h-48 group"
                                onClick={() => navigate(`/projects/${p._id}`)}
                            >
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-slate-200 group-hover:text-white text-lg transition duration-200 truncate">
                                            {p.name}
                                        </h3>
                                    </div>
                                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                                        {p.description || "No project description provided."}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-slate-850 flex justify-between items-center text-[10px]">
                                    <div className="flex items-center gap-1.5 text-slate-400">
                                        <span className="font-semibold text-slate-300">Admin:</span>
                                        <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded truncate max-w-[100px]">
                                            {p.admin?.username || "You"}
                                        </span>
                                    </div>
                                    <span className="bg-slate-800 text-slate-300 font-semibold px-2 py-0.5 rounded-full">
                                        👥 {p.members?.length || 1} Members
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}