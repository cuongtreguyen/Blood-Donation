import React, { useState, useEffect } from "react";
import { FaHeart, FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navItems = [
        { name: "Trang chủ", href: "#Home" },
        { name: "Hiến máu", href: "#donation-process" },
        { name: "Tìm điểm hiến máu", href: "#donation-centers" },
        { name: "Đánh Giá", href: "#blog-customer" },
        { name: "Đăng nhập", href: "/login" }
    ];

    const handleScrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: "smooth" });
        }
        setIsOpen(false); // đóng menu mobile
    };

    return (
        <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-red-700 shadow-lg" : "bg-red-600"}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo Section */}
                    <div className="flex-shrink-0 flex items-center">
                        <img
                            src="https://th.bing.com/th/id/OIP.77dgISHWSmlAGTmDFcrp3QAAAA?cb=iwc2&rs=1&pid=ImgDetMain"
                            alt="Logo"
                            className="h-8 w-8 text-red-100 animate-pulse rounded-full"
                        />
                        <span className="ml-2 text-2xl font-bold text-white">Dòng Máu Việt</span>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        {navItems.map((item) =>
                            item.name === "Hiến máu" ? (
                                <button
                                    key={item.name}
                                    onClick={() => handleScrollToSection("donation-process")}
                                    className="no-underline text-amber-50 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                                >
                                    {item.name}
                                </button>
                            ) : item.name === "Tìm điểm hiến máu" ? (
                                <button
                                    key={item.name}
                                    onClick={() => handleScrollToSection("donation-centers")}
                                    className="no-underline text-amber-50 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                                >
                                    {item.name}
                                </button>
                            ) : item.name === "Đánh Giá" ? (
                                <button
                                    key={item.name}
                                    onClick={() => handleScrollToSection("blog-customer")}
                                    className="no-underline text-amber-50 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                                >
                                    {item.name}
                                </button>
                            ) : (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    style={{ color: "white", textDecoration: "none" }}
                                    className="no-underline text-amber-50 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                                    aria-label={item.name}
                                >
                                    {item.name}
                                </Link>
                            )
                        )}
                    </nav>

                    {/* CTA Button */}
                    <div className="hidden md:flex items-center">
                        <button
                            className="bg-white text-red-600 hover:bg-red-50 hover:text-red-700 px-6 py-2 rounded-full font-bold shadow-md transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 animate-bounce"
                            aria-label="Donate Now"
                        >
                            Donate Now
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-white hover:text-red-100 focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? (
                                <FaTimes className="h-6 w-6" />
                            ) : (
                                <FaBars className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`${isOpen ? "block" : "hidden"} md:hidden transition-all duration-300 ease-in-out`}>
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map((item) =>
                            item.name === "Hiến máu" ? (
                                <button
                                    key={item.name}
                                    onClick={() => handleScrollToSection("donation-process")}
                                    className="text-red-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                >
                                    {item.name}
                                </button>
                            ) : item.name === "Tìm điểm hiến máu" ? (
                                <button
                                    key={item.name}
                                    onClick={() => handleScrollToSection("donation-centers")}
                                    className="text-red-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                >
                                    {item.name}
                                </button>
                            ) : item.name === "Đánh Giá" ? (
                                <button
                                    key={item.name}
                                    onClick={() => handleScrollToSection("blog-customer")}
                                    className="text-red-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                >
                                    {item.name}
                                </button>
                            ) : (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className="text-red-100 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                                    aria-label={item.name}
                                >
                                    {item.name}
                                </Link>
                            )
                        )}
                        <button
                            className="w-full bg-white text-red-600 hover:bg-red-50 hover:text-red-700 px-6 py-2 rounded-full font-bold shadow-md transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 mt-4"
                            aria-label="Donate Now"
                        >
                            Donate Now
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
