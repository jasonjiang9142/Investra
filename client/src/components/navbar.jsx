import React, { useState, useEffect, useRef } from "react";
import SearchForm from "./searchform";

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
        <nav className="bg-white shadow-lg sticky top-0 z-10 py-4">
            <div className="max-w-7xl mx-auto ">
                <div className="flex justify-between items-center h-16">

                    {/* Logo Section */}
                    <div className="flex items-center">
                        <h1 className="text-3xl font-bold text-gray-900 hover:text-blue-600 transition duration-200 cursor-pointer">
                            Stock Simulator
                        </h1>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a
                            href="#"
                            onClick={handleSearchClick}
                            className="text-gray-700 hover:text-blue-600 transition duration-200 cursor-pointer"
                        >
                            Search
                        </a>
                    </div>

                    {/* Form Dropdown */}
                    {isOpen && (
                        <div className="absolute top-16 right-4 w-96  shadow-lg rounded-lg border border-gray-100">
                            <SearchForm passDataToParent={passDataToParent} />
                        </div>
                    )}
                </div>
            </div>
        </nav>

    );
    // };
    // const SearchForm1 = ({ passDataToGrandparent }) => {

    //     const passDataToParent = (data) => {
    //         passDataToGrandparent(data);
    //     };

    //     return (
    //         <div className="absolute top-16 right-0 w-96 bg-white shadow-lg p-4">
    //             <SearchForm passDataToParent={passDataToParent} />
    //         </div>
    //     );
};

export default Navbar;
