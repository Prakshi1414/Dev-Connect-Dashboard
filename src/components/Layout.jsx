import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="sticky max-h-screen">
        <Sidebar />
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        <aside className="sticky">
          <Navbar />
        </aside>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
