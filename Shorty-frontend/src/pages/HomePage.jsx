import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@/components/ui/button";

function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="text-center flex flex-col items-center">
      <h1 className="animate-fade-in-up text-5xl md:text-7xl font-extrabold text-white pb-4">
        The Ultimate Link Shortener
      </h1>
      <p className="animate-fade-in-up delay-200 text-slate-400 mt-4 max-w-2xl mx-auto text-lg">
        A simple, powerful, and open-source tool to shorten your long URLs.
        Create a free account to manage your links, track real-time clicks, and
        generate QR codes on the fly.
      </p>
      <div className="animate-fade-in-up delay-400 mt-8">
        {isAuthenticated ? (
          <Link to="/dashboard">
            <Button
              size="lg"
              className="bg-[#C9FBFF] text-black font-bold hover:bg-[#C9FBFF]/90 transition-transform hover:scale-105 shadow-lg"
            >
              Go to Your Dashboard
            </Button>
          </Link>
        ) : (
          <Link to="/signup">
            <Button
              size="lg"
              className="bg-[#C9FBFF] text-black font-bold hover:bg-[#C9FBFF]/90 transition-transform hover:scale-105 shadow-lg"
            >
              Get Started for Free
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

export default HomePage;