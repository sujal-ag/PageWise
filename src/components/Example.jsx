import React from 'react'
import { Search } from 'lucide-react'

function Example() {
    return (
        <div className="mb-52 mt-20 max-w-3xl mx-auto border border-gray-100 rounded-3xl bg-white shadow-[0_20px_50px_rgba(255,165,0,0.1)] p-2">
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
        </div>
    )
}

export default Example