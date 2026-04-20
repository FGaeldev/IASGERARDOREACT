import "./output.css";
import SignUpForm from "./components/CompSignupForm";
import CompNavbar from "./components/CompNavbar";

function Onboarding() {
  return (
    <div className="bg-white">
      <CompNavbar />
      <SignUpForm />
    </div>
  );
}

export default Onboarding;
