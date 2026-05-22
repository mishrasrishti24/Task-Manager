import { useEffect, useState } from "react";
import api from "../services/api";

export default function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user"));

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await api.get("/api/tasks/all");
            setTasks(res.data.tasks || []);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const updateStatus = async (taskId, status) => {
        try {
            await api.put("/api/tasks/update-status", {
                taskId,
                status
            });
            fetchTasks();
        } catch (error) {
            console.error("Error updating status:", error);
            alert(error.response?.data?.message || "Failed to update task status");
        }
    };

    const todoTasks = tasks.filter(t => t.status === "Todo");
    const inProgressTasks = tasks.filter(t => t.status === "In Progress");
    const completedTasks = tasks.filter(t => t.status === "Completed");

    const getPriorityBadge = (priority) => {
        switch (priority) {
            case "High":
                return "bg-rose-500/10 border-rose-500/20 text-rose-400";
            case "Medium":
                return "bg-amber-500/10 border-amber-500/20 text-amber-400";
            case "Low":
                return "bg-slate-500/10 border-slate-500/20 text-slate-400";
            default:
                return "bg-indigo-500/10 border-indigo-500/20 text-indigo-400";
        }
    };

    const getInitials = (name) => {
        if (!name) return "?";
        return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
    };

    const TaskCard = ({ task }) => {
        const isAssigned = task.assignedTo?._id === user.id || task.assignedTo === user.id;

        return (
            <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl shadow-lg relative group transition duration-300 hover:border-slate-700/80 hover:shadow-indigo-500/5 space-y-4">
                <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-slate-200 group-hover:text-white transition duration-200">
                        {task.title}
                    </h4>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getPriorityBadge(task.priority)}`}>
                        {task.priority}
                    </span>
                </div>

                {task.description && (
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                        {task.description}
                    </p>
                )}

                <div className="pt-2 border-t border-slate-850 flex flex-col gap-2">
                    <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span className="font-semibold text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10 truncate max-w-[120px]">
                            📁 {task.project?.name || "Project"}
                        </span>
                        {task.dueDate && (
                            <span className="flex items-center gap-1 font-medium">
                                📅 {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                        )}
                    </div>

                    <div className="flex justify-between items-center pt-2">
                        {/* Assignee display */}
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gradient-to-tr from-pink-500 to-indigo-600 rounded-full flex items-center justify-center font-bold text-[10px] text-white">
                                {getInitials(task.assignedTo?.username)}
                            </div>
                            <span className="text-[11px] font-medium text-slate-300 truncate max-w-[100px]">
                                {task.assignedTo?.username || "Unassigned"}
                            </span>
                        </div>

                        {/* Status Select dropdown - visible and active only for assigned user */}
                        {isAssigned ? (
                            <select
                                value={task.status}
                                onChange={(e) => updateStatus(task._id, e.target.value)}
                                className="text-[11px] font-semibold bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg px-2 py-1 outline-none transition duration-200 cursor-pointer"
                            >
                                <option value="Todo">Todo</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        ) : (
                            <span className="text-[10px] font-medium text-slate-500 bg-slate-950 border border-slate-900 px-2 py-1 rounded-lg">
                                Read Only
                            </span>
                        )}
                    </div>
                </div>
            </div>
        );
    };

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

                {/* Header Section */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-400 bg-clip-text text-transparent">
                            Task Board
                        </h1>
                        <p className="text-xs text-slate-400 mt-1">
                            Drag-like board setup for workflow staging. Team tasks grouped by operational status.
                        </p>
                    </div>
                </div>

                {/* Kanban columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">

                    {/* Todo Column */}
                    <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-850 pb-3">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                                <h3 className="font-bold text-slate-200">Todo</h3>
                            </div>
                            <span className="text-xs font-semibold bg-slate-850 text-slate-400 px-2 py-0.5 rounded-full">
                                {todoTasks.length}
                            </span>
                        </div>
                        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                            {todoTasks.length === 0 ? (
                                <p className="text-xs text-slate-500 text-center py-6">No tasks in Todo</p>
                            ) : (
                                todoTasks.map(task => <TaskCard key={task._id} task={task} />)
                            )}
                        </div>
                    </div>

                    {/* In Progress Column */}
                    <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-850 pb-3">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                                <h3 className="font-bold text-slate-200">In Progress</h3>
                            </div>
                            <span className="text-xs font-semibold bg-slate-850 text-slate-400 px-2 py-0.5 rounded-full">
                                {inProgressTasks.length}
                            </span>
                        </div>
                        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                            {inProgressTasks.length === 0 ? (
                                <p className="text-xs text-slate-500 text-center py-6">No tasks in progress</p>
                            ) : (
                                inProgressTasks.map(task => <TaskCard key={task._id} task={task} />)
                            )}
                        </div>
                    </div>

                    {/* Completed Column */}
                    <div className="bg-slate-900/40 border border-slate-850 p-5 rounded-2xl space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-850 pb-3">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                <h3 className="font-bold text-slate-200">Completed</h3>
                            </div>
                            <span className="text-xs font-semibold bg-slate-850 text-slate-400 px-2 py-0.5 rounded-full">
                                {completedTasks.length}
                            </span>
                        </div>
                        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                            {completedTasks.length === 0 ? (
                                <p className="text-xs text-slate-500 text-center py-6">No completed tasks</p>
                            ) : (
                                completedTasks.map(task => <TaskCard key={task._id} task={task} />)
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}