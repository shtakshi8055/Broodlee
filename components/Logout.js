'use client'
import React, { useState } from 'react'
import Button from './Button'
import { useAuth } from '@/context/AuthContext'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Logout() {
    const { logout, currentUser } = useAuth()
    const [hovered, setHovered] = useState(false)
    const pathname = usePathname()

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
        <div className="flex items-center space-x-2">
            {/* User Icon (Font Awesome) */}
            <div 
                className="relative" 
                onMouseEnter={() => setHovered(true)} 
                onMouseLeave={() => setHovered(false)}
            >
                <i className="fa-solid fa-user text-2xl"></i>
                
                {/* Display email on hover */}
                {hovered && (
                    <div className="absolute left-0 mt-2 bg-black text-white text-sm px-2 py-1 rounded-md">
                        {currentUser.email}
                    </div>
                )}
            </div>

            {/* Logout Button */}
            <Button text='Logout' clickHandler={logout} />
        </div>
    )
}
