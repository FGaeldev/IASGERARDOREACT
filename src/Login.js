import "./output.css";
import LoginForm from "./components/CompLoginForm.js";
import CompNavbar from "./components/CompNavbar";
import { useState } from "react";
import SQForm from "./components/CompSQForm.js";

function Login() {
  const [step, setStep] = useState("login");
  const [data, setData] = useState(); //login or security
  return (
    <div className="bg-white">
      <CompNavbar />
      {step === "login" && (
        <LoginForm
          onSuccess={(data) => {
            setData(data)
            setStep("security");
          }}
        />
      )}
      {step === "security" && <SQForm mydata={data}/>}
    </div>
  );
}

export default Login;
