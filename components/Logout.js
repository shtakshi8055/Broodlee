'use client'
import React, { useState, useEffect, useRef } from 'react'
import Button from './Button'
import { useAuth } from '@/context/AuthContext'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Logout() {
    const { logout, currentUser } = useAuth()
    const [hovered, setHovered] = useState(false)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(false) // Theme state
    const dropdownRef = useRef(null) // Reference for dropdown
    const userIconRef = useRef(null) // Reference for user icon
    const pathname = usePathname()

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                userIconRef.current && !userIconRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener('click', handleClickOutside)
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [])

    // Toggle theme (dark mode / light mode)
    const toggleTheme = () => {
        setIsDarkMode((prevMode) => {
            const newMode = !prevMode;
            // You can add global state management or use CSS classes to switch the theme
            document.body.classList.toggle('dark', newMode); // Toggle 'dark' class on body
            return newMode;
        });
    };

    if (!currentUser) {
        return null
    }

    if (pathname === '/') {
        return (
            <Link href={'/dashboard'}>
                <Button text="Go to dashboard" />
            </Link>
        )
    }

    return (
        <div className="relative flex items-center space-x-2">
            {/* User Profile Icon */}
            <div 
                ref={userIconRef}
                className="relative flex items-center justify-center w-10 h-10 rounded-full bg-gray-200"
                onMouseEnter={() => setHovered(true)} 
                onMouseLeave={() => setHovered(false)}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown on click
            >
                {/* Display User's Profile Picture or Default Icon */}
                {currentUser.photoURL ? (
                    <img 
                        src={currentUser.photoURL} 
                        alt="User Icon" 
                        className="w-full h-full object-cover rounded-full" 
                    />
                ) : (
                    <i className="fa-solid fa-user text-xl text-gray-500"></i> // Default Icon if no photo
                )}
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div 
                    ref={dropdownRef} 
                    className="absolute left-0 mt-1 bg-white shadow-md rounded-lg w-48 z-30" 
                    style={{ top: 'calc(100% + 8px)' }} // Position dropdown below the icon
                >
                    <ul className="space-y-2 text-sm text-gray-700 p-2">
                        {/* Dropdown Items */}
                        <li>
                            <div className="block px-4 py-2 hover:bg-gray-100 rounded-md">
                                {currentUser.email}
                            </div>
                        </li>
                        {/* Theme Toggle */}
                        <li>
                            <button 
                                onClick={toggleTheme} 
                                className="block w-full px-4 py-2 text-left hover:bg-gray-100 rounded-md"
                            >
                                {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            </button>
                        </li>
                    </ul>
                </div>
            )}

            {/* Logout Button */}
            <Button text="Logout" clickHandler={logout} />
        </div>
    )
}
