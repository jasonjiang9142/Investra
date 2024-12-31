import React, { useState } from "react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-gray-800">Stock Simulator</h1>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        <a href="#" className="text-gray-600 hover:text-blue-500">
                            Search
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {isOpen ? (
                                <svg
                                    className="h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="h-6 w-6"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16m-7 6h7"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden">
                    <a href="#" className="block py-2 px-4 text-gray-600 hover:text-blue-500">
                        Home
                    </a>
                    <a href="#" className="block py-2 px-4 text-gray-600 hover:text-blue-500">
                        About
                    </a>
                    <a href="#" className="block py-2 px-4 text-gray-600 hover:text-blue-500">
                        Services
                    </a>
                    <a href="#" className="block py-2 px-4 text-gray-600 hover:text-blue-500">
                        Contact
                    </a>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
