import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function SignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        contact_number: '',
        position: '',
        campus: '',
        college: ''
    });
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        if (name === 'password') {
            validatePassword(value);
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const validatePassword = (password) => {
        if (password.length < 8) {
            setErrorMessage('Password must be at least 8 characters long.');
        } else if (!/[0-9!@#$%^&*]/.test(password)) {
            setErrorMessage('Password must contain at least one number or special character.');
        } else {
            setErrorMessage('');
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (errorMessage) {
            alert('Please fix the errors in the form before submitting.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    name: formData.name,
                    contact_number: formData.contact_number,
                    position: formData.position,
                    campus: formData.campus,
                    college: formData.college,
                }),
            });

            if (response.ok) {
                const responseData = await response.json();
                localStorage.setItem("user_id", responseData.user_id); 
                navigate('/adminprofile');
            } else {
                const errorData = await response.json();
                alert('Registration failed. Please try again.');
            }
        } catch (error) {
            alert('An error occurred. Please try again later.');
        }
    };

    
    const handleSignInClick = () => {
        navigate("/login");
    };


    return (
        <div className="fixed inset-0 font-montserrat overflow-hidden h-screen bg-cover flex justify-center items-center px-4"
        style={{ backgroundImage: "url('/public/bg.png')" }}>
            <div className="relative p-8 w-full max-w-md h-[90vh] overflow-y-auto bg-white rounded-lg shadow-md sm:max-w-sm md:max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-4">Create New Account</h2>
                <p className="text-center text-gray-600 mb-6">Please provide your details</p>
                <div className="p-4">
                    <form className="space-y-4" onSubmit={handleFormSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Your email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-red-800 focus:outline-none"
                                placeholder="name@gmail.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 flex justify-between">
                                Create password
                            </label>
                            <div className="relative">
                                <input
                                    type={passwordVisible ? 'text' : 'password'}
                                    name="password"
                                    id="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-red-800 focus:outline-none"
                                    placeholder="••••••••"
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
                            {errorMessage && (
                                <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
                            )}
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 flex justify-between">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-red-800 focus:outline-none"
                                placeholder="Sandara Park"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 flex justify-between">
                                Contact Number
                            </label>
                            <input
                                type="tel"
                                name="contact_number"
                                id="contact_number"
                                value={formData.contact_number}
                                onChange={handleInputChange}
                                className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-red-800 focus:outline-none"
                                placeholder="123-456-7890"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 flex justify-between">
                                Position
                            </label>
                            <input
                                type="text"
                                name="position"
                                id="position"
                                value={formData.position}
                                onChange={handleInputChange}
                                className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-red-800 focus:outline-none"
                                placeholder="Secretary"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 flex justify-between">
                                Campus
                            </label>
                            <select
                                name="campus"
                                id="campus"
                                value={formData.campus}
                                onChange={handleInputChange}
                                className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-red-800 focus:outline-none"
                                required
                            >
                                <option value="">Select Campus</option>
                                <option value="Main">PUP Main</option>
                                <option value="Bataan">PUP Bataan</option>
                                <option value="Calauan">PUP Calauan</option>
                                <option value="Lopez">PUP Lopez</option>
                                <option value="Paranaque">PUP Paranaque</option>
                                <option value="Quezon City">PUP Quezon City</option>
                                <option value="Ragay">PUP Ragay</option>
                                <option value="San Juan">PUP San Juan</option>
                                <option value="Sto. Tomas">PUP Sto. Tomas</option>
                                <option value="San Pedro">PUP San Pedro</option>
                                <option value="Santa Rosa">PUP Santa Rosa</option>
                                <option value="Taguig">PUP Taguig</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700 flex justify-between">
                                College
                            </label>
                            <input
                                type="text"
                                name="college"
                                id="college"
                                value={formData.college}
                                onChange={handleInputChange}
                                className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-red-800 focus:outline-none"
                                placeholder="College of Engineering"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-[#800101] text-white py-2 rounded-md hover:bg-red-600 transition"
                        >
                            Sign Up
                        </button>
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-700">
                            Already have an account?{' '}
                            <a href="#" className="text-dark-pastel-orange font-semibold hover:underline dark:text-dark-pastel-orange" onClick={handleSignInClick}>
                                Sign In
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
