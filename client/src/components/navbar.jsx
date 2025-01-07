import React, { useState, useEffect, useRef } from "react";
import SearchForm from "./searchform";
import { FaSearch } from 'react-icons/fa';

const Navbar = ({ passDataToGrandparent }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleSearchClick = () => {
        setIsOpen((prev) => !prev);
    };

    const passDataToParent = (data) => {
        passDataToGrandparent(data);
    };



    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        // Add event listener for click events
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up the event listener on unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return (
        <nav className="bg-white shadow-lg sticky top-0 z-10 py-2 ">
            <div className="max-w-7xl mx-auto ">
                <div className="flex justify-between items-center h-16 px-20">

                    {/* Logo Section */}
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition duration-200 cursor-pointer">
                            Stock Simulator
                        </h1>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8 bg-gray-100 px-8 py-2 rounded-full duration-300 hover:bg-blue-100">
                        <a
                            href="#"
                            onClick={handleSearchClick}
                            onMouseEnter={handleSearchClick}
                            className="flex items-center font-semibold text-gray-900 hover:text-blue-600 transition-all duration-300 cursor-pointer"
                        >
                            <FaSearch className="mr-2 text-lg" /> {/* Adjust icon size for better balance */}
                            <span className="hidden sm:inline opacity-0 sm:opacity-100 transition-opacity duration-300 hover:opacity-100">
                                Search
                            </span> {/* Smooth transition for text visibility on hover */}
                        </a>
                    </div>

                    {/* Form Dropdown */}
                    {isOpen && (
                        <div className="absolute top-16 right-4 w-96  shadow-lg rounded-lg border border-gray-100 bg-white">
                            <SearchForm passDataToParent={passDataToParent} />
                        </div>
                    )}
                </div>
            </div>
        </nav>

    );
};

export default Navbar;
