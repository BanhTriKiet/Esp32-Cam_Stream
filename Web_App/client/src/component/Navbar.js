import { Link, useMatch, useResolvedPath } from "react-router-dom"
import './style.css'
export default function Navbar() {
    return (
      <nav className="nav">
        <Link to="/" >Esp32-Cam Stream</Link>
        <ul>
        
          <CustomLink to="/storage" >Storage</CustomLink>
        </ul>
      </nav>
    )
  }
  function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname, end: true })
  
    return (
      <li className={isActive ? "active" : ""}>
        <Link to={to} {...props} >
          {children}
        </Link>
      </li>
    )
  }


