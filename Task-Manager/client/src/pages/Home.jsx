import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden flex flex-col justify-between">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl pointer-events-none"></div>

            {/* Navigation Header */}
            <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex justify-between items-center border-b border-slate-900/60 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-tr from-pink-500 to-indigo-600 rounded-lg flex items-center justify-center font-extrabold text-white shadow-lg shadow-indigo-500/20">
                        T
                    </div>
                    <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-indigo-400 bg-clip-text text-transparent">
                        TaskFlow
                    </span>
                </div>
                <div className="flex gap-4">
                    <Link
                        to="/login"
                        className="text-xs font-semibold text-slate-300 hover:text-white px-4 py-2.5 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition duration-200"
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/register"
                        className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-500/25 transition duration-200 active:scale-[0.98]"
                    >
                        Get Started
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <main className="relative z-10 flex-grow flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto py-16 space-y-12">
                <div className="space-y-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-semibold uppercase tracking-wider">
                        ✨ Next-gen Workspace Manager
                    </span>
                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.15] bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                        Manage Projects.<br />
                        Collaborate Seamlessly.
                    </h1>
                    <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 leading-relaxed">
                        Organize work items, delegate tasks, track deadlines, and monitor team performance metrics in a centralized, dark-mode workspace.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto">
                    <Link
                        to="/register"
                        className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white px-8 py-3.5 rounded-xl font-semibold shadow-xl shadow-indigo-500/15 hover:shadow-indigo-500/25 active:scale-[0.98] transition-all duration-200 text-sm"
                    >
                        Create Free Account
                    </Link>
                    <Link
                        to="/login"
                        className="w-full sm:w-auto bg-slate-900/80 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white px-8 py-3.5 rounded-xl font-semibold active:scale-[0.98] transition-all duration-200 text-sm"
                    >
                        Explore Console
                    </Link>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 max-w-5xl text-left">
                    {/* Feature 1 */}
                    <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl relative overflow-hidden group">
                        <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center font-bold text-base mb-4 group-hover:scale-110 transition duration-300">
                            🛡️
                        </div>
                        <h3 className="font-bold text-slate-200 text-base mb-2">Role-Based Operations</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Clear permission boundaries separating Admin managers from team Members. Ensure strict control over workspace integrity.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl relative overflow-hidden group">
                        <div className="w-10 h-10 bg-pink-500/10 border border-pink-500/20 text-pink-400 rounded-xl flex items-center justify-center font-bold text-base mb-4 group-hover:scale-110 transition duration-300">
                            📋
                        </div>
                        <h3 className="font-bold text-slate-200 text-base mb-2">Visual Kanban Board</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Move cards fluidly from Pending to In Progress and Completed. Teammates update status on assigned items dynamically.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl relative overflow-hidden group">
                        <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center font-bold text-base mb-4 group-hover:scale-110 transition duration-300">
                            📊
                        </div>
                        <h3 className="font-bold text-slate-200 text-base mb-2">Performance Analytics</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">
                            Monitor task distributions, workloads, overdue items, and real-time completion percentages per team member.
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-slate-900/60 py-6 text-center text-xs text-slate-500">
                <p>&copy; {new Date().getFullYear()} TaskFlow Inc. Built for premium project efficiency.</p>
            </footer>
        </div>
    );
};

export default Home;