import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const backgroundImages = ["/bg.png", "/bg1.jpg", "/bg2.jpeg"];
    const randomImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];

    const handleEmailChange = (e) => setEmail(e.target.value);

    const handleSignInClick = () => navigate("/login");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:3001/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setMessage('A reset link has been sent to your email.');
                setIsSubmitted(true);
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || 'Failed to send reset link. Please try again.');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 font-montserrat overflow-hidden h-screen flex items-center justify-center px-4 md:px-20"
            style={{ 
                backgroundImage: `url('${randomImage}')`, 
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            {/* Background overlay without blur */}
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            
            {/* Form container with blur effect */}
            <div className="relative w-full max-w-md md:w-[35%] h-auto md:h-screen flex flex-col justify-center items-center bg-white bg-opacity-40 backdrop-blur-lg shadow-md md:ml-auto p-8 overflow-y-auto md:-mr-20 rounded-lg md:rounded-none">
                <h3 className="text-2xl font-semibold text-center mb-4">Forgot Password</h3>
                <form className="space-y-6 w-full" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-900">Enter email address</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-red-800 focus:outline-none"
                            placeholder="name@example.com"
                            required
                        />
                    </div>
                    {message && <div className="text-sm text-center text-gray-700">{message}</div>}
                    <button
                        type="submit"
                        disabled={isLoading || isSubmitted}
                        className={`w-full px-4 py-2 rounded-lg font-medium text-white transition duration-300 
                            ${isLoading || isSubmitted ? 'bg-gray-400' : 'bg-[#800101] hover:bg-red-600'}
                            focus:outline-none focus:ring-4 focus:ring-red-400`}
                    >
                        {isSubmitted ? 'Check your Email' : isLoading ? 'Sending Verification...' : 'Send Verification'}
                    </button>
                    <p className="text-sm text-center">
                        Already have an account?{' '}
                        <button type="button" className="text-red-500 font-semibold hover:underline" onClick={handleSignInClick}>
                            Sign In
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
}
