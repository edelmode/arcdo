import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false); 
    const navigate = useNavigate();
    const location = useLocation();
    const token = new URLSearchParams(location.search).get('token');

    // Array of placeholder images
    const bgImages = [
        "/public/bg.png",
        "/public/bg1.jpg",
        "/public/bg2.jpeg"
    ];
    const randomBg = bgImages[Math.floor(Math.random() * bgImages.length)];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        if (newPassword.length < 8) {
            setMessage('Password must be at least 8 characters long.');
            setIsError(true);
            setIsSaving(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match.');
            setIsError(true);
            setIsSaving(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Your password has been successfully reset.');
                setIsError(false);
                setIsSubmitted(true); 

                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } else {
                setMessage(data.message || 'Failed to reset password.');
                setIsError(true);
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
            setIsError(true);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="h-screen flex justify-center items-center px-4 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${randomBg})` }}>
            {/* Overlay for blur effect on mobile */}
            <div className="absolute inset-0 bg-black bg-opacity-30 sm:bg-opacity-20 md:bg-transparent backdrop-blur-sm sm:backdrop-blur-md md:backdrop-blur-none"></div>

            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xs sm:max-w-sm md:max-w-md relative z-10">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-2xl font-semibold text-center">
                        Reset Password
                    </h3>
                </div>
                <div className="p-9 md:p-10">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                                Enter New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="newPassword"
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-red-800 focus:outline-none"
                                    placeholder="Enter your new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                                >
                                    {showPassword ? <Eye className="h-5 w-5 text-gray-500" /> : <EyeOff className="h-5 w-5 text-gray-500" />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-red-800 focus:outline-none"
                                    placeholder="Confirm your new password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                                >
                                    {showConfirmPassword ? <Eye className="h-5 w-5 text-gray-500" /> : <EyeOff className="h-5 w-5 text-gray-500" />}
                                </button>
                            </div>
                        </div>

                        {message && (
                            <div className={`text-sm text-center mb-4 ${isError ? 'text-red-500' : 'text-gray-700'}`}>
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSaving || isSubmitted}
                            className={`w-full py-2 rounded-md text-white transition 
                                ${isSaving || isSubmitted ? 'bg-gray-400' : 'bg-[#800101] hover:bg-red-600'}
                                focus:outline-none focus:ring-4 focus:ring-red-400`}
                        >
                            {isSubmitted ? 'Password Reset Successful' : isSaving ? 'Saving...' : 'Reset Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
