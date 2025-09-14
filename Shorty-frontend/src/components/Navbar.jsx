import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "../hooks/useAuth";

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="w-full bg-white text-slate-900 py-3 px-6 flex justify-between items-center shadow-md sticky top-0 z-50">
      <Link
        to="/"
        className="text-lg font-bold flex items-center justify-center rounded-md py-2 px-4 bg-[#040F0F] text-white"
      >
        SHORTY
      </Link>
      <nav className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">
              <Button
                className="bg-[#040F0F] text-white hover:bg-[#040F0F]/90"
              >
                Dashboard
              </Button>
            </Link>
            <Button
              onClick={handleLogout}
              className="bg-[#040F0F] text-white hover:bg-[#040F0F]/90"
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link to="/login">
               <Button
                className="bg-[#040F0F] text-white hover:bg-[#040F0F]/90"
              >
                Login
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-[#040F0F] text-white hover:bg-[#040F0F]/90">
                Sign Up
              </Button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;