import React from 'react'
import { BrainCircuit, SearchX, Zap, Sparkles } from 'lucide-react'

function About() {
  return (
    <div className="bg-white min-h-screen pt-20 pb-20">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-orange-400 font-bold uppercase tracking-widest text-sm mb-4 italic underline underline-offset-8 decoration-orange-200">
            The Evolution of Search
          </h2>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Search <span className="text-orange-400">Beyond</span> Ctrl+F.
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Standard keyword search is literal, rigid, and often useless.
            PageWise was built to bridge the gap between <span className="text-gray-900 font-bold italic">what you remember</span> and <span className="text-gray-900 font-bold italic">what the PDF says.</span>
          </p>
        </div>

        {/* The Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">

          {/* Old Way */}
          <div className="p-10 rounded-3xl bg-gray-50 border border-gray-100 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mb-6">
              <SearchX className="text-gray-300 w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-400 mb-3">The Old Way: Keywords</h3>
            <p className="text-gray-500 leading-relaxed text-sm">
              Requires 100% accuracy. If the author wrote "Macroeconomics" but you
              searched "Money stuff," you get zero results. It’s a game of manual hunting.
            </p>
          </div>

          {/* New Way (PageWise) */}
          <div className="p-10 rounded-3xl bg-orange-50/50 border-2 border-orange-100 flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="w-20 h-20 text-orange-400" />
            </div>
            <div className="w-14 h-14 bg-white rounded-full shadow-md flex items-center justify-center mb-6">
              <BrainCircuit className="text-orange-400 w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-orange-500 mb-3">The PageWise Way: Context</h3>
            <p className="text-gray-700 leading-relaxed text-sm font-medium">
              We look for <strong>intent and meaning.</strong> Search using vague descriptions
              or half-remembered ideas, and our semantic engine finds the exact passage
              across hundreds of pages.
            </p>
          </div>

        </div>

        {/* Manifesto Section */}
        <div className="bg-white rounded-[2.5rem] p-12 md:p-24 border-2 border-orange-50 flex flex-col items-center text-center relative shadow-sm">

          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-6 py-2 border-2 border-orange-50 rounded-full">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-400">
              The PageWise Philosophy
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-10 tracking-tighter leading-tight">
            Built for the <br />
            <span className="text-orange-400">Messy-Minded.</span>
          </h2>

          <div className="w-16 h-1 bg-orange-100 mb-10 rounded-full" />

          <p className="text-gray-600 text-xl md:text-2xl max-w-4xl leading-relaxed font-medium mb-12 italic px-4">
            "We built PageWise because students think in concepts, not in strings of characters.
            It’s our attempt to make your document library as searchable as your own thoughts."
          </p>

          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest border-t border-gray-100 pt-8 w-full max-w-xs">
            A Student-Led Initiative
          </p>
        </div>

      </div>
    </div>
  )
}

export default About