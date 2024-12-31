import React, { useState } from "react";
import SearchForm from "./searchform";

const Navbar = ({ passDataToGrandparent }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSearchClick = () => {
        setIsOpen((prev) => !prev);
    };

    const passDataToParent = (data) => {
        passDataToGrandparent(data);
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold text-gray-800">Stock Simulator</h1>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        <a
                            href="#"
                            onClick={handleSearchClick}
                            className="text-gray-600 hover:text-blue-500 cursor-pointer"
                        >
                            Search
                        </a>
                    </div>

                    {/* Form Dropdown */}
                    {isOpen && (
                        <div className="absolute top-16 right-0 w-96 bg-white shadow-lg p-4">
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
