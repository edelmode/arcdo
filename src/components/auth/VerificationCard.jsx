import { useNavigate } from 'react-router-dom';

export default function VerificationCard({ toggleModal, openSignInModal, openNewPassModal }) {

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
            <div className="relative p-4 w-full max-w-md max-h-full bg-white rounded-lg shadow">
                {/* Modal header */}
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-black">
                        Verification
                    </h3>
                    <button
                        onClick={toggleModal}
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        type="button"
                    >
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                {/* Modal body */}
                <div className="p-9 md:p-10">
                    <form className="space-y-4" onSubmit={openNewPassModal}>
                        <div>
                            <label htmlFor="number" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black text-center">
                                Enter verification code
                            </label>
                            <div className='flex flex-wrap sm:flex-row flex-col items-center gap-x-5 justify-center mx-auto mt-1 mb-10'>
                                <form id="otp-form">
                                    <div class="flex items-center justify-center gap-3">
                                        <input
                                            type="text"
                                            class="w-14 h-14 text-center text-2xl font-extrabold dark:bg-gray-100 border dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                                            pattern="\d*" 
                                            maxlength="1" 
                                            required
                                        />
                                        <input
                                            type="text"
                                            class="w-14 h-14 text-center text-2xl font-extrabold dark:bg-gray-100 border dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                                            required    
                                        />
                                        <input
                                            type="text"
                                            class="w-14 h-14 text-center text-2xl font-extrabold dark:bg-gray-100 border dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                                            maxlength="1" 
                                            required    
                                        />
                                        <input
                                            type="text"
                                            class="w-14 h-14 text-center text-2xl font-extrabold dark:bg-gray-100 border dark:border-gray-500 dark:placeholder-gray-400 dark:text-black"
                                            maxlength="1" 
                                            required
                                        />

                                    </div>
                                    <div className="text-sm font-medium text-gray-700 dark:text-gray-500 text-center p-2">
                                        Didn't receive a code?{' '}
                                            <a href="#" className="text-paymongo hover:underline dark:text-paymongo text-center">
                                                Resend Code
                                            </a>
                                    </div>
                                </form>
                            </div>

                        </div>


                        <button
                            type="submit"
                            className="w-full text-white bg-paymongo-700 hover:bg-dark-green focus:ring-4 focus:outline-none focus:ring-paymongo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-paymongo dark:hover:bg-paymongo-700 "
                        >
                            Verify
                        </button>
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-700">
                            Already have an account?{' '}
                            <a href="#" className="text-paymongo hover:underline dark:text-paymongo" onClick={openSignInModal}>
                                Sign In
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
