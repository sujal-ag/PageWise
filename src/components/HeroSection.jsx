import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, BrainCircuit, FileSearch, CheckCircle2, ArrowRight } from 'lucide-react'

function Hero() {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log("Uploaded:", selectedFile.name);
    }
  };

  const handleProceed = () => {
    navigate('/reader'); 
  };

  return (
    <section className="relative bg-white pt-24 overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 bg-orange-50 rounded-full blur-[120px] -z-10 opacity-60" />

      <div className="max-w-7xl mx-auto px-6 text-center">

        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-gray-500 text-xs font-bold uppercase tracking-widest">
          <BrainCircuit className="w-4 h-4 text-orange-400" />
          Semantic Document Retrieval
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-8 tracking-tight leading-[1.1]">
          Remember the concept, <br />
          <span className="text-orange-400">forgot the page?</span>
        </h1>

        <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 mb-12 leading-relaxed">
          Upload your PDF and search by
          <span className="font-semibold text-gray-800 italic"> half-remembered words and vague ideas.</span>
          &nbsp;PageWise finds the exact passage for you, so you can stop scrolling and start studying.
        </p>

        <div className="flex flex-col items-center justify-center gap-5 mt-10">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf"
          />

          {!file ? (
            <button
              onClick={handleButtonClick}
              className="group w-full sm:w-auto px-10 py-4 bg-orange-400 text-white rounded-full font-bold text-lg hover:bg-orange-500 transition-all shadow-xl shadow-orange-100 flex items-center justify-center gap-3 active:scale-95"
            >
              <FileSearch className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Upload PDF & Search
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in zoom-in duration-300">
              <div className="flex items-center gap-3 px-6 py-4 bg-orange-50 border border-orange-100 rounded-full text-orange-700 font-medium">
                <CheckCircle2 className="w-5 h-5" />
                <span className="max-w-[150px] truncate">{file.name}</span>
                <button onClick={() => setFile(null)} className="text-xs underline ml-2 opacity-70 hover:opacity-100">Change</button>
              </div>

              <button
                onClick={handleProceed}
                className="group w-full sm:w-auto px-10 py-4 bg-gray-900 text-white rounded-full font-bold text-lg hover:bg-black transition-all shadow-xl flex items-center justify-center gap-3 active:scale-95"
              >
                Go to Reader
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* Example */}
        {/* <div className="mt-20 max-w-3xl mx-auto border border-gray-100 rounded-3xl bg-white shadow-[0_20px_50px_rgba(255,165,0,0.1)] p-2">
          <div className="bg-gray-50 rounded-2xl p-6 md:p-10 text-left italic">
            <p className="text-gray-500 text-sm text-center mb-4">Example</p>

            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-orange-200 shadow-sm mb-8">
              <Search className="text-orange-400 w-6 h-6 shrink-0" />
              <div className="text-gray-400 font-medium italic">
                "Something about that graph that shows supply and demand curves crossing..."
              </div>
            </div>

            <div className="space-y-4 opacity-80">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-orange-400" />
                <span className="text-xs font-bold text-gray-400 uppercase">Page 42 - Economics_Unit1.pdf</span>
              </div>
              <div className="p-4 bg-orange-50/50 border-l-4 border-orange-400 rounded-r-lg">
                <p className="text-gray-700 text-sm leading-relaxed italic">
                  "...this intersection point is known as the <span className="bg-orange-200/50 px-1 font-bold">Equilibrium Point</span>, where the quantity supplied and quantity demanded are equal..."
                </p>
              </div>
            </div>

          </div>
        </div> */}

      </div>
    </section>
  )
}

export default Hero