import React, { useState } from 'react'
import '../styles/Navbar.css'
import { Link, useMatch, useResolvedPath } from 'react-router-dom'
import EditProfile from './EditProfile.tsx'
import { useLogoutUser } from '../stores/sessionStore.ts'

const Navbar: React.FC = () => {
    const logoutUserMutation = useLogoutUser()
    const [dropDownOpen, setDropDownOpen] = useState(false)
    const [editProfileOpen, setEditProfileOpen] = useState(false)

    const openEditProfile = () => {
        console.log('Opening Edit Profile')
        setEditProfileOpen(true)
        setDropDownOpen(false)
    }

    const handleSignOut = () => {
        logoutUserMutation.mutate()
    }

    console.log('editProfileOpen:', editProfileOpen)

    return (
        <div>
            <nav className='nav'>
                <Link to='/questions' className='site-title'>
                    PeerPrep
                </Link>
                <ul>
                    <CustomLink to='/questions'>Questions</CustomLink>
                    <CustomLink to='/users'>Users</CustomLink>
                    <li
                        className={`profile-button ${dropDownOpen ? 'active' : 'inactive'}`}
                        onClick={() => setDropDownOpen(!dropDownOpen)}
                    >
                        Profile
                    </li>
                    {dropDownOpen && (
                        <div className='overlay' onClick={() => setDropDownOpen(false)}></div>
                    )}
                    <div className={`dropdown-menu ${dropDownOpen ? 'active' : 'inactive'}`}>
                        <h3>
                            afiqzu
                            <br />
                            <span>Website Designer</span>
                        </h3>
                        <ul>
                            <DropdownItem text={'Edit Profile'} onClick={openEditProfile} />
                            <DropdownItem text={'Sign out'} onClick={handleSignOut} />
                        </ul>
                    </div>
                </ul>
            </nav>
            {editProfileOpen && <EditProfile onClose={() => setEditProfileOpen(false)} />}
        </div>
    )
}

interface CustomLinkProps {
    to: string
    children: React.ReactNode
}
function CustomLink({ to, children, ...props }: CustomLinkProps) {
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname, end: true })
    return (
        <li className={isActive ? 'active' : ''}>
            <Link to={to} {...props}>
                {children}
            </Link>
        </li>
    )
}

interface DropdownItemProps {
    text: string
    onClick?: () => void
}

function DropdownItem(props: DropdownItemProps) {
    const handleClick = () => {
        if (props.onClick) {
            props.onClick()
        }
    }
    return (
        <li className='dropdownItem' onClick={handleClick}>
            <a> {props.text} </a>
        </li>
    )
}

export default Navbar
