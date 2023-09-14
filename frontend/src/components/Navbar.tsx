import React, {useState} from "react";
import '../styles/Navbar.css'
import { Link, useMatch,  useResolvedPath } from "react-router-dom";


const Navbar: React.FC = () => {
    const [open, setOpen] = useState(false);

    return (
        <nav className='nav'>
            <Link to="/" className="site-title">
                PeerPrep
            </Link>
            <ul>
                <CustomLink to="/questions">Questions</CustomLink>
                <CustomLink to="/users">Users</CustomLink>
                <li className={`profile-button ${open? 'active' : 'inactive'}`} onClick={()=>setOpen(!open)}>
                        Profile
                </li>
                <div className={`dropdown-menu ${open? 'active' : 'inactive'}`} >
                    <h3>afiqzu<br/><span>Website Designer</span></h3>
                    <ul>
                        <DropdownItem text = {"Edit Profile"}/>
                        <DropdownItem text = {"Logout"}/>
                    </ul>
                </div>
            </ul>
        </nav>
    );
};

interface CustomLinkProps {
    to: string;
    children: React.ReactNode;
}
function CustomLink({ to, children, ...props}: CustomLinkProps) {
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname, end:true})
    return (
        <li className={isActive ? "active" : ""}>
            <Link to={to} {...props}>{children}</Link>
        </li>
    )
}

interface DropdownItemProps {
    text: string;
}

function DropdownItem(props : DropdownItemProps){
    return(
        <li className = 'dropdownItem'>
            <a> {props.text} </a>
        </li>
    );
}
export default Navbar;
