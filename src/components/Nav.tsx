import React from "react"
import { Link } from "gatsby"
import "./nav.css"

const Nav = () => {
  return (
    <div className="nav__container">
      <Link to="/">BLOG</Link>
      <span className="nav__divider"> | </span>
      <Link to="/portfolio">PORTFOLIO</Link>
    </div>
  )
}

export default Nav
