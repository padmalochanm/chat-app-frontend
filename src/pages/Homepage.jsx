import SIgnUpForm from "../components/SIgnUpForm";
import { useState } from "react";
const Homepage = () => {
  const [isSignUp, setIsSignUp] = useState(true); // Initial state is signup mode
  const toggleSignUp = () => {
    setIsSignUp(!isSignUp); // Toggle between signup and login mode
  };
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content flex-col lg:flex-row">
        <div>
          <img
            src="../../reviews-concept-landing-page.png"
            className="max-w-full lg:max-w-lg rounded-lg mb-5 lg:mb-0"
            alt="Hero"
          />
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl p-5">
          <SIgnUpForm isSignUp={isSignUp} onToggle={toggleSignUp} />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
