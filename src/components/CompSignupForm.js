import { useState, useMemo } from "react";
import PasswordInput from "./CompPasswordInput";
import { useNavigate } from "react-router";

export default function SignUpForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: "",
    password: "",
    password_confirm: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Email validation
  const emailValid = useMemo(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  }, [form.email]);

  // Password rules
  const passwordRules = useMemo(() => {
    const value = form.password;
    return {
      length: value.length >= 8,
      upper: /[A-Z]/.test(value),
      lower: /[a-z]/.test(value),
      number: /\d/.test(value),
      special: /[^A-Za-z\d]/.test(value),
    };
  }, [form.password]);

  const passwordValid = useMemo(() => {
    return Object.values(passwordRules).every(Boolean);
  }, [passwordRules]);

  // Confirm password
  const isConfirmed = useMemo(() => {
    return form.password && form.password === form.password_confirm;
  }, [form.password, form.password_confirm]);

  // Final button state
  const canSubmit = emailValid && passwordValid && isConfirmed;

  const handleSubmit = (e) => {
    e.preventDefault();

    const res = fetch("http://localhost/IAS/iasfinals/api/signin.php", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res.success) {
          throw new Error(res.message);
        }
        navigate("/login")
      })
      .catch((err) => {
        console.error(err);
        alert(err);
      });
  };

  //Helper for UI indicators
  const Rule = ({ valid, text }) => (
    <p
      className={`text-sm flex items-center gap-2 ${valid ? "text-green-600" : "text-red-600"}`}
    >
      <span>{valid ? "✔" : "✖"}</span>
      {text}
    </p>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-emerald-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        {/* EMAIL */}
        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              form.email
                ? emailValid
                  ? "border-green-500 focus:ring-green-400"
                  : "border-red-500 focus:ring-red-400"
                : "focus:ring-blue-400"
            }`}
            required
          />
          {form.email && (
            <p
              className={`text-sm mt-1 ${emailValid ? "text-green-600" : "text-red-600"}`}
            >
              {emailValid ? "✔ Valid email" : "✖ Invalid email format"}
            </p>
          )}
        </div>

        {/* PASSWORD */}
        <PasswordInput
          handleChange={handleChange}
          name="password"
          placeholder="Password"
          value={form.password}
        />

        <div className="mb-4">
          <Rule valid={passwordRules.length} text="At least 8 characters" />
          <Rule valid={passwordRules.upper} text="Uppercase letter" />
          <Rule valid={passwordRules.lower} text="Lowercase letter" />
          <Rule valid={passwordRules.number} text="Number" />
          <Rule valid={passwordRules.special} text="Special character" />
        </div>

        {/* CONFIRM PASSWORD */}
        <PasswordInput
          handleChange={handleChange}
          name="password_confirm"
          placeholder="Confirm Password"
          value={form.password_confirm}
        />

        {form.password_confirm && (
          <p
            className={`text-sm mb-2 ${isConfirmed ? "text-green-600" : "text-red-600"}`}
          >
            {isConfirmed ? "✔ Passwords match" : "✖ Passwords do not match"}
          </p>
        )}

        {/* SUBMIT */}
        <button
          disabled={!canSubmit}
          type="submit"
          className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sign Up
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
