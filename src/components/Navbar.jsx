import React from 'react'
import { LogoWithText } from '../assets/index.js'
import { NavLink, useNavigate } from 'react-router-dom'

function Navbar() {

  const navigate = useNavigate()

  return (
    <nav className='md:mx-10 px-4 md:px-0 flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-300'>

      <div className="flex-shrink-0">
        <img onClick={() => (navigate("/about"))} src={LogoWithText} alt="Logo with text" className='h-12'/>
      </div>

      <ul className='hidden md:flex items-start gap-12 font-medium text-base'>
        <li>
          <NavLink to="/" className={({isActive}) => `${isActive ? "text-orange-600" : "text-orange-400 hover:text-orange-500"}`}>Home</NavLink>
        </li>
        <li>
          <NavLink to="/about" className={({isActive}) => `${isActive ? "text-orange-600" : "text-orange-400 hover:text-orange-500"}`}>About</NavLink>
        </li>
        <li>
          <NavLink to="/contact" className={({isActive}) => `${isActive ? "text-orange-600" : "text-orange-400 hover:text-orange-500"}`}>Contact</NavLink>
        </li>
      </ul>

      {/* Empty div to balance the logo on the left */}
      <div className="w-14 hidden lg:block"></div> 
    </nav>
  )
}

export default Navbar