import React from 'react'
import { Link } from 'react-router-dom'
import { LogoWithText } from '../assets/index.js'
import { Mail } from 'lucide-react' 

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-white md:mx-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

        {/* Left Section: Logo & Description */}
        <div>
          <img src={LogoWithText} alt="PageWise Logo" className='mb-5 w-48' />
          <p className='w-full md:w-2/3 text-gray-600 leading-6'>
            PageWise is designed to help students find what they half-remember. 
            By using semantic search, we allow you to search through your PDF 
            documents by meaning and context, rather than just matching keywords.
          </p>
        </div>

        {/* Center Section: Quick Links */}
        <div>
          <p className='text-xl font-bold mb-5 text-orange-400 uppercase tracking-tight'>Platform</p>
          <ul className='flex flex-col gap-2 text-gray-600 font-medium'>
            <li onClick={() => window.scrollTo(0, 0)} className='hover:text-orange-400 transition-all cursor-pointer'>
              <Link to="/">Home</Link>
            </li>
            <li onClick={() => window.scrollTo(0, 0)} className='hover:text-orange-400 transition-all cursor-pointer'>
              <Link to="/about">About Us</Link>
            </li>
            <li onClick={() => window.scrollTo(0, 0)} className='hover:text-orange-400 transition-all cursor-pointer'>
              <Link to="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* Right Section: Contact Info */}
        <div>
          <p className='text-xl font-bold mb-5 text-orange-400 uppercase tracking-tight'>
            Get in Touch
          </p>

          <ul className='flex flex-col gap-3 text-gray-600'>
            <li>
              <a
                href="mailto:info@pagewise.app"
                className='flex items-center gap-2 hover:text-orange-400 transition-all font-medium'
              >
                <Mail className="w-4 h-4 text-orange-400" />
                info@pagewise.app
              </a>
            </li>
            <li className='flex items-center gap-2 mt-2'>
               <span className="text-xs text-gray-400 italic font-light">Built for students by students</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className='mt-10'>
        <hr className='border-gray-200' />
        <p className='py-8 text-sm text-center text-gray-500 font-bold'>
          Copyright {currentYear} @ pagewise.app - All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer