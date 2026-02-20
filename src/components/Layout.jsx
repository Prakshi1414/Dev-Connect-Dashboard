import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useState } from "react";

const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-700  dark:text-gray-100 relative">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Overlay (only mobile) */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Main Content Wrapper */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
