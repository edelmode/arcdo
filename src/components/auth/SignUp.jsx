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
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const responseData = await response.json();
                localStorage.setItem("user_id", responseData.user_id);
                navigate('/adminprofile');
            } else {
                alert('Registration failed. Please try again.');
            }
        } catch (error) {
            alert('An error occurred. Please try again later.');
        }
    };

    const handleSignInClick = () => {
        navigate("/login");
    };

    const backgroundImages = ["/bg.png", "/bg1.jpg", "/bg2.jpeg"];
    const randomImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];

    return (
        <div 
            className="fixed inset-0 font-montserrat overflow-hidden flex items-center justify-center px-4 md:px-8"
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
            <div className="relative w-full max-w-md md:w-[35%] h-auto md:h-screen flex flex-col justify-center items-center bg-white bg-opacity-50 backdrop-blur-2xl shadow-lg md:ml-auto p-8 overflow-y-auto md:-mr-10 rounded-lg md:rounded-none">


                <h2 className="text-2xl font-bold text-center">
                    Create New <span className="text-red-600">Account</span>
                </h2>
                <p className="text-center text-gray-600 mb-6">
                    Please provide your details
                </p>
                
                <form className="space-y-5 w-full" onSubmit={handleFormSubmit}>
                    <div>
                        <label className="block text-sm font-medium">Your Email</label>
                        <input type="email" name="email" className="w-full mt-1 p-2 border rounded-md" placeholder="name@gmail.com" required value={formData.email} onChange={handleInputChange} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Create Password</label>
                        <div className="relative">
                            <input type={passwordVisible ? 'text' : 'password'} name="password" className="w-full mt-1 p-2 border rounded-md" placeholder="••••••••" required value={formData.password} onChange={handleInputChange} />
                            <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-3 flex items-center text-gray-600">
                                {passwordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Full Name</label>
                        <input type="text" name="name" className="w-full mt-1 p-2 border rounded-md" placeholder="Sandara Park" required value={formData.name} onChange={handleInputChange} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Contact Number</label>
                        <input type="tel" name="contact_number" className="w-full mt-1 p-2 border rounded-md" placeholder="123-456-7890" required value={formData.contact_number} onChange={handleInputChange} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Position</label>
                        <input type="text" name="position" className="w-full mt-1 p-2 border rounded-md" placeholder="Secretary" required value={formData.position} onChange={handleInputChange} />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Campus</label>
                        <select name="campus" className="w-full mt-1 p-2 border rounded-md" required value={formData.campus} onChange={handleInputChange}>
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
                        
                    <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md">Sign Up</button>
                    <p className="text-center text-sm mt-4">
                        Already have an account?{' '}
                        <button type="button" className="text-red-500 hover:underline" onClick={handleSignInClick}>Sign In</button>
                    </p>
                </form>
            </div>
        </div>
    );
}
