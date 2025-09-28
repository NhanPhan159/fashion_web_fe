import React, { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from '@/services/auth';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage("");
        setLoading(true);

        const { error } = await authService.signInWithPassword(email, password);
        if (error) {
            setMessage(error.message);
            setEmail("");
            setPassword("");
            setLoading(false);
            return;
        }

        // Nếu thành công, navigate đến admin
        navigate("/admin");
    };

    const handleOAuth = async (provider: 'google' | 'azure') => {
        setLoading(true);
        setMessage("");
        const method = provider === 'google' ? authService.signInWithGoogle : authService.signInWithMicrosoft;
        const { error } = await method();
        if (error) {
            setMessage(error.message);
        }
        // Redirect tự động nếu không error
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
                        {/* Icon hoặc logo */}
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Đăng nhập</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Hoặc{" "}
                        <Link to="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
                            tạo tài khoản mới
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {message && (
                        <div className="p-3 rounded-md bg-red-50 text-red-700 border border-red-200">
                            {message}
                        </div>
                    )}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                required
                                disabled={loading}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mật khẩu"
                                required
                                disabled={loading}
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-50 text-gray-500">Hoặc đăng nhập với</span>
                        </div>
                    </div>

                    <div className="grid gap-3">
                        <button
                            onClick={() => handleOAuth('google')}
                            disabled={loading}
                            type="button"
                            className="w-full justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="h-4 w-4 mr-2 inline" />
                            Google
                        </button>
                        <button
                            onClick={() => handleOAuth('azure')}
                            disabled={loading}
                            type="button"
                            className="w-full justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        >
                            <img src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Microsoft-logo.svg" alt="Microsoft" className="h-4 w-4 mr-2 inline" />
                            Microsoft
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;