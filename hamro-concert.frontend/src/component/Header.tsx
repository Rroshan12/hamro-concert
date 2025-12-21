import React from "react";
import { Music, Ticket } from "lucide-react";

const Header = React.memo(function Header() {
  return (
    <header className="relative overflow-hidden theme-gradient-primary text-white shadow-2xl">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-red-400 blur-md opacity-60 animate-pulse"></div>
              <div className="relative bg-white p-3 rounded-xl">
                <Music className="h-9 w-9 cursor-pointer theme-text-primary-700" />
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-extrabold tracking-wide">
                Hamro <span className="theme-text-secondary-300">Concert</span>
              </h1>
              <p className="text-red-100 text-sm tracking-wide">
                स्वागत छ • Nepal’s Premier Live Music Platform
              </p>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 rounded-full blur opacity-0 group-hover:opacity-70 transition theme-border-secondary-400"></div>
            <div className="relative bg-white/10 p-3 rounded-full backdrop-blur">
              <Ticket className="h-8 w-8 text-white cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});

export default Header;
