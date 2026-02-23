import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";

import { mockUsers } from "../auth/mockUsers";
import { login } from "../redux/authSlice";
import { authApi } from "../utils/api";

import { Eye, EyeOff, ArrowRight } from "lucide-react";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("admin@owms.com");
    const [password, setPassword] = useState("password123");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = (user) => {
        dispatch(login(user));
        navigate(`/${user.role}/dashboard`);
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await authApi.login({ email, password });
            dispatch(login(response));
            navigate(`/${response.user.role}/dashboard`);
        } catch (err) {
            setError(err.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                {/* Header */}
                <h1 className="text-3xl font-bold text-slate-900">
                    Welcome back
                </h1>
                <p className="mt-1 text-slate-500">
                    Sign in to access your dashboard
                </p>

                {/* Error Message */}
                {error && (
                    <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSignIn} className="mt-6 space-y-5">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@company.com"
                            className="mt-1 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700">
                            Password
                        </label>
                        <div className="relative mt-1">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 pr-10 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Sign in */}
                    <button 
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition cursor-pointer disabled:bg-indigo-400 disabled:cursor-not-allowed"
                    >
                        {loading ? "Signing in..." : "Sign in"} {!loading && <ArrowRight size={16} />}
                    </button>
                </form>

                {/* Demo buttons */}
                <div className="grid grid-cols-2 gap-3">
                    {mockUsers.map((u) => (
                        <button
                            key={u.email}
                            onClick={() => handleLogin(u)}
                            className="rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                        >
                            Login as {u.role}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Login;
