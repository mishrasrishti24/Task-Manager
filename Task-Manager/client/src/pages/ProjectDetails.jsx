import { useEffect, useState } from "react";
import api from "../services/api";
import { useParams, useNavigate } from "react-router-dom";

export default function ProjectDetails() {
    const { projectId } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [userId, setUserId] = useState("");
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));

    const fetchProject = async () => {
        try {
            setLoading(true);
            setError("");
            const res = await api.get("/api/projects");
            const found = res.data.projects.find(p => p._id === projectId);
            if (!found) {
                setError("Project workspace not found.");
                return;
            }
            setProject(found);
            setMembers(found.members || []);
        } catch (err) {
            setError("Failed to retrieve project details. Please reload.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProject();
    }, [projectId]);

    const addMember = async (e) => {
        e.preventDefault();
        if (!userId.trim()) {
            setError("Please provide a valid User ID.");
            return;
        }

        setError("");
        setSuccess("");
        setActionLoading(true);

        try {
            await api.put(`/api/projects/${projectId}/add-member`, {
                userId: userId.trim()
            });

            setSuccess("Member added successfully!");
            setUserId("");
            // Refresh project details
            const res = await api.get("/projects");
            const found = res.data.projects.find(p => p._id === projectId);
            if (found) {
                setProject(found);
                setMembers(found.members || []);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add member. Check the User ID.");
        } finally {
            setActionLoading(false);
        }
    };

    const removeMember = async (memberId) => {
        if (!window.confirm("Are you sure you want to remove this member from the project?")) {
            return;
        }

        setError("");
        setSuccess("");
        setActionLoading(true);

        try {
            await api.put(`api/projects/${projectId}/remove-member`, {
                userId: memberId
            });

            setSuccess("Member removed successfully.");
            // Refresh project details
            const res = await api.get("/projects");
            const found = res.data.projects.find(p => p._id === projectId);
            if (found) {
                setProject(found);
                setMembers(found.members || []);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to remove member.");
        } finally {
            setActionLoading(false);
        }
    };

    const isProjectAdmin = project?.admin?._id === user?.id || project?.admin === user?.id;

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
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8 relative overflow-hidden">
            {/* Ambient glows */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-7xl mx-auto space-y-8 relative z-10">
                {/* Back button */}
                <button
                    onClick={() => navigate("/projects")}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition duration-150 cursor-pointer"
                >
                    &larr; Back to Workspaces
                </button>

                {/* Project Header card */}
                <div className="bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-400 bg-clip-text text-transparent">
                            {project?.name}
                        </h1>
                        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                            {project?.description || "No workspace description provided."}
                        </p>
                    </div>

                    <div className="flex flex-col gap-1 items-end">
                        <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Workspace Owner</span>
                        <div className="bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-xl flex items-center gap-2">
                            <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></span>
                            <span className="text-xs font-semibold text-indigo-300">{project?.admin?.username || "You"}</span>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                {error && (
                    <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3.5 rounded-xl text-xs flex items-center gap-2 animate-pulse">
                        <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3.5 rounded-xl text-xs flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                        <span>{success}</span>
                    </div>
                )}

                {/* Content grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Member list column */}
                    <div className="lg:col-span-2 bg-slate-900/60 border border-slate-800/80 p-8 rounded-3xl shadow-lg space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-slate-200">Teammates</h3>
                                <p className="text-xs text-slate-400 mt-0.5">Users currently linked to this workspace.</p>
                            </div>
                            <span className="text-xs font-semibold bg-slate-800 text-slate-300 px-3 py-1 rounded-full">
                                👥 {members.length} Members
                            </span>
                        </div>

                        <div className="divide-y divide-slate-850">
                            {members.map(m => {
                                const isMemberAdmin = project?.admin?._id === m._id || project?.admin === m._id;
                                return (
                                    <div key={m._id} className="py-4 flex justify-between items-center first:pt-0 last:pb-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500/20 to-pink-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-xs text-indigo-300">
                                                {m.username?.[0]?.toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-slate-200 text-sm">{m.username}</h4>
                                                <p className="text-xs text-slate-400 truncate max-w-[200px] sm:max-w-xs">{m.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${isMemberAdmin
                                                ? "bg-indigo-500/10 border border-indigo-500/20 text-indigo-400"
                                                : "bg-slate-800 border border-slate-700/50 text-slate-300"
                                                }`}>
                                                {isMemberAdmin ? "Admin" : m.role || "Member"}
                                            </span>

                                            {/* Remove member option: Only project admin can see this, and can't remove themselves */}
                                            {isProjectAdmin && !isMemberAdmin && (
                                                <button
                                                    onClick={() => removeMember(m._id)}
                                                    disabled={actionLoading}
                                                    className="bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 hover:border-rose-500 text-rose-400 hover:text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition duration-150 cursor-pointer disabled:opacity-50"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Member management panel (Admin Only) */}
                    <div className="space-y-6">
                        {isProjectAdmin ? (
                            <div className="bg-slate-900/60 border border-slate-800/80 p-8 rounded-3xl shadow-lg space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-200">Add Teammate</h3>
                                    <p className="text-xs text-slate-400 mt-0.5">Extend workspace membership to another user.</p>
                                </div>

                                <form onSubmit={addMember} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">User ID</label>
                                        <input
                                            placeholder="Paste teammate's unique User ID"
                                            value={userId}
                                            onChange={(e) => setUserId(e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 text-slate-100 p-3.5 rounded-xl text-xs outline-none transition duration-200"
                                            required
                                            disabled={actionLoading}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={actionLoading}
                                        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold py-3.5 rounded-xl text-xs transition duration-200 shadow-lg shadow-indigo-500/15 hover:shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                                    >
                                        {actionLoading ? "Adding Teammate..." : "Add Teammate"}
                                    </button>
                                </form>

                                <div className="bg-slate-950/80 border border-slate-850 p-4 rounded-xl text-[10px] text-slate-400 leading-relaxed space-y-1.5">
                                    <h5 className="font-semibold text-slate-300 uppercase tracking-wider">How to invite users?</h5>
                                    <p>Since this project operates on secure team boundaries, ask your colleague for their unique MongoDB ID (found in their profile metadata) to link them to this project.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-slate-900/30 border border-slate-900 p-8 rounded-3xl text-center space-y-3">
                                <span className="text-3xl block">🔒</span>
                                <h4 className="font-bold text-slate-300">Admin Section Restricted</h4>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Only the project owner/admin ({project?.admin?.username}) has permissions to add new members or manage workspace roles.
                                </p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}