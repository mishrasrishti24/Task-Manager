import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 px-6 py-4 flex justify-between items-center shadow-md">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(user?.role === "Admin" ? "/dashboard" : "/tasks")}>
                <div className="w-9 h-9 bg-gradient-to-tr from-pink-500 to-indigo-600 rounded-xl flex items-center justify-center font-extrabold text-white text-lg shadow-lg shadow-indigo-500/20">
                    T
                </div>
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-400 bg-clip-text text-transparent">
                    TaskFlow
                </span>
            </div>

            {/* Links */}
            <div className="flex gap-6 items-center">
                {user && (
                    <>
                        <Link 
                            to="/dashboard" 
                            className="text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 px-3 py-2 rounded-lg transition duration-200"
                        >
                            Dashboard
                        </Link>

                        <Link 
                            to="/tasks" 
                            className="text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 px-3 py-2 rounded-lg transition duration-200"
                        >
                            Tasks
                        </Link>
                    </>
                )}

                {/* ADMIN ONLY SECTION */}
                {user?.role === "Admin" && (
                    <>
                        <Link 
                            to="/projects" 
                            className="text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 px-3 py-2 rounded-lg transition duration-200"
                        >
                            Projects
                        </Link>

                        <Link 
                            to="/create-project" 
                            className="text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 px-3 py-2 rounded-lg transition duration-200"
                        >
                            Create Project
                        </Link>

                        <Link 
                            to="/create-task" 
                            className="text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 px-3 py-2 rounded-lg transition duration-200"
                        >
                            Create Task
                        </Link>
                    </>
                )}

                {/* User Status & Logout */}
                {user && (
                    <div className="flex items-center gap-4 ml-2 border-l border-slate-800 pl-6">
                        <div className="flex flex-col text-right hidden md:flex">
                            <span className="text-xs font-semibold text-slate-200">{user.username}</span>
                            <span className="text-[10px] text-slate-400 font-medium bg-slate-800 px-1.5 py-0.5 rounded self-end">{user.role}</span>
                        </div>
                        <button
                            onClick={logout}
                            className="bg-rose-600/90 hover:bg-rose-600 active:bg-rose-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition duration-200 shadow-sm"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
}