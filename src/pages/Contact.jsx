import React from 'react'
import { Mail, Send, MessageCircle } from 'lucide-react'

function Contact() {
  return (
    <div className="bg-white min-h-screen pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Direct Text */}
        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight">
            Let's make <br />
            <span className="text-orange-400">PageWise</span> better.
          </h1>
          <p className="text-lg text-gray-600 mb-10 leading-relaxed max-w-md">
            Have feedback on your search results or found a bug? 
            We're building this for you, and we'd love to hear how it's working.
          </p>

          <a 
            href="mailto:sujalagarwal0987@gmail.com" 
            className="inline-flex items-center gap-4 p-5 rounded-3xl border border-orange-100 bg-orange-50/50 hover:border-orange-400 transition-all group"
          >
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <Mail className="text-orange-400 w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Direct Email</p>
              <p className="text-gray-800 font-bold text-lg">info@pagewise.app</p>
            </div>
          </a>
        </div>

        {/* Right Side: Form */}
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border-2 border-gray-50 shadow-2xl shadow-orange-100/40">
          <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center gap-2">
            Send a message <MessageCircle className="text-orange-400 w-5 h-5" />
          </h3>
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 gap-4">
              <input 
                type="text" 
                placeholder="Name"
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-400 transition-all text-sm font-medium"
              />
              <input 
                type="email" 
                placeholder="Email Address"
                className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-400 transition-all text-sm font-medium"
              />
            </div>
            <textarea 
              rows="5"
              placeholder="How can we help?"
              className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-orange-400 transition-all text-sm font-medium resize-none"
            ></textarea>
            <button 
              type="submit"
              className="w-full py-4 bg-orange-400 text-white rounded-2xl font-bold hover:bg-orange-500 transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-3 text-lg"
            >
              <Send className="w-5 h-5" />
              Shoot Message
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}

export default Contact