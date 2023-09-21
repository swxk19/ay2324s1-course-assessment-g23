import React from 'react'
import '../styles/Navbar.css'
import { Link, useMatch, useResolvedPath } from 'react-router-dom'

const Navbar: React.FC = () => {
    return (
        <nav className='nav'>
            <Link to='/' className='site-title'>
                PeerPrep
            </Link>
            <ul>
                <CustomLink to='/questions'>Questions</CustomLink>
                <CustomLink to='/users'>Users</CustomLink>
                <div>Profile</div>
            </ul>
        </nav>
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
export default Navbar
