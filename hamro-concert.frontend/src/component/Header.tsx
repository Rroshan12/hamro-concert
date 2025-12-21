import React from "react";
import { Music, Ticket } from "lucide-react";

const Header = React.memo(function Header() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-r from-red-800 via-red-700 to-orange-600 text-white shadow-2xl">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-red-400 blur-md opacity-60 animate-pulse"></div>
              <div className="relative bg-white p-3 rounded-xl">
                <Music className="h-9 w-9 text-red-700" />
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-extrabold tracking-wide">
                Hamro <span className="text-orange-300">Concert</span>
              </h1>
              <p className="text-red-100 text-sm tracking-wide">
                स्वागत छ • Nepal’s Premier Live Music Platform
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 rounded-full bg-orange-400 blur opacity-0 group-hover:opacity-70 transition"></div>
            <div className="relative bg-white/10 p-3 rounded-full backdrop-blur">
              <Ticket className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});

export default Header;
