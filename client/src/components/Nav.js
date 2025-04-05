import React, { useEffect } from "react";

function Navigation({ isSidebarOpen, toggleSidebar }) {
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        // Automatically open the sidebar on large screens
        toggleSidebar();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [toggleSidebar]);

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar position-fixed top-0 start-0 w-100">
        <button
          className="btn btn-outline-light ms-3"
          onClick={toggleSidebar}
          style={{ fontSize: "20px", padding: "3px 8px", lineHeight: "1" }}
        >
          ☰
        </button>
      </nav>

      {/* Sidebar */}
      <div
        className={`sidebar position-fixed top-0 start-0 vh-100 text-white p-3 ${!isSidebarOpen ? "collapsed" : ""}`}
        style={{
          width: isSidebarOpen ? "250px" : "0",
          overflow: "hidden",
          transition: "width 0.3s ease-in-out"
        }}
      >
        <h4 style={{ display: isSidebarOpen ? "block" : "none" }}>Sidebar</h4>
        <ul className="nav flex-column" style={{ display: isSidebarOpen ? "block" : "none" }}>
          <li className="nav-item">
            <a className="nav-link text-white" href="#">Home</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="#">About</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="#">Contact</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navigation;
