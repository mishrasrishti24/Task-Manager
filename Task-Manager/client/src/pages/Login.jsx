import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const res = await api.post("/api/auth/login", {
                email,
                password
            });

            login(res.data.user, res.data.token);
            setSuccess("Login Successful! Redirecting...");

            setTimeout(() => {
                if (res.data.user.role === "Admin") {
                    navigate("/dashboard");
                } else {
                    navigate("/tasks");
                }
            }, 1000);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Invalid credentials. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-slate-950 px-4 relative overflow-hidden">
            {/* Background ambient spots */}
            <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-8 rounded-3xl shadow-2xl relative z-10 space-y-6">

                {/* Logo & Header */}
                <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-gradient-to-tr from-pink-500 to-indigo-600 rounded-2xl flex items-center justify-center font-extrabold text-white text-2xl mx-auto shadow-lg shadow-indigo-500/20 mb-2">
                        T
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-100">
                        Welcome Back
                    </h1>
                    <p className="text-xs text-slate-400">
                        Enter your credentials to access your workspaces.
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
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Email Address</label>
                        <input
                            type="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 text-slate-100 p-3.5 rounded-xl text-xs outline-none transition duration-200"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-850 focus:border-indigo-500 text-slate-100 p-3.5 rounded-xl text-xs outline-none transition duration-200"
                            required
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold py-3.5 rounded-xl text-xs transition duration-200 shadow-lg shadow-indigo-500/15 hover:shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none mt-2"
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-xs text-slate-400 pt-2">
                    Don't have an account?
                    <Link
                        to="/register"
                        className="text-indigo-400 font-semibold ml-1.5 hover:text-indigo-300 transition duration-150"
                    >
                        Register Here
                    </Link>
                </p>

            </div>
        </div>
    );
};

export default Login;