import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Eye, EyeOff, CircleAlert } from 'lucide-react';

export default function Signin() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [email, setEmail] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleCreateAccountClick = () => {
        navigate("/signUp"); 
    };

    const handleForgotPassClick = () => {
        navigate("/forgotPassword"); 
    };


    useEffect(() => {
        const savedEmail = localStorage.getItem('savedEmail');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const password = e.target.password.value;

        try {
            const response = await fetch('http://localhost:3001/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Login failed: ${errorMessage}`);
            }

            const data = await response.json();
    
            if (data.refresh_token) {
                // Save the token and user ID in local storage
                localStorage.setItem('token', data.refresh_token);
                localStorage.setItem('user_id', data.id); 
                localStorage.setItem('role', data.role); 

                console.log("userId: ", data.id)
    
                // Save the email if "Remember me" is checked
                if (rememberMe) {
                    localStorage.setItem('savedEmail', email);
                } else {
                    localStorage.removeItem('savedEmail');
                }
    
                // Redirect to the fetching page after login
                navigate('/overview');
            } else {
                setError("Something went wrong. No token received.");
            }

        } catch (error) {
            setError(error.message);
            setTimeout(() => {
                setError('');
            }, 2000);
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="h-screen bg-cover flex justify-center items-center px-4"
        style={{ backgroundImage: "url('/public/bg.png')" }}>
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xs sm:max-w-sm md:max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-4">Login to <b>ARCDO Dashboard</b></h2>
                <p className="text-center text-gray-600 mb-6">Please enter your email and password to continue</p>
                <div className="p-4">
                    {error && (
                        <div className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                            <CircleAlert className="w-5 h-5 mr-2 text-red-700" />
                            <span>{error}</span>
                        </div>
                    )}
                    <form className="space-y-4" onSubmit={handleFormSubmit}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                                Your email
                            </label>
                            <input
                                type="email"
                                name="email"
                                className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-red-800 focus:outline-none"
                                placeholder="name@gmail.com"
                                required
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                                Your password
                            </label>
                            <div className="relative">
                                <input
                                    type={passwordVisible ? 'text' : 'password'}
                                    name="password"
                                    placeholder="••••••••"
                                    className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-red-800 focus:outline-none"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                                >
                                    {passwordVisible ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-600 dark:border-gray-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-[#DDDDD]-800"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                </div>
                                <label className="ms-2 text-sm font-medium text-black-300 dark:text-black-300">
                                    Remember me
                                </label>
                            </div>
                            <a href="#" className="text-sm font-medium text-gray-700 flex justify-between hover:underline dark:text-gray-700"  onClick={handleForgotPassClick}>
                                Forgot Password? 
                            </a>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-[#800101] text-white py-2 rounded-md hover:bg-red-600 transition"   
                        >
                            Sign In
                        </button>
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-700">
                            Don't have an account?{' '}
                            <a href="#" className="text-red-500 font-semibold hover:underline dark:text-red-700" onClick={handleCreateAccountClick}>
                                Sign Up
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
