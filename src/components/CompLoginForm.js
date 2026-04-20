import { useState, useEffect } from "react";
import { checkAuth } from "./CompCheckAuth";
import PasswordInput from "./CompPasswordInput";
import { useNavigate } from "react-router";

const MAX_ATTEMPTS = 3;
const LOCK_DURATION = 30;

export default function LoginForm({ onSuccess = () => {} }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [attempts, setAttempts] = useState(MAX_ATTEMPTS);
  const [lockTime, setLockTime] = useState(0);
  const [loading, setLoading] = useState(true);

  const isLocked = lockTime > 0;

  // ✅ handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ block login page if already logged in
  useEffect(() => {
    const init = async () => {
      const data = await checkAuth();

      if (data.loggedIn) {
        navigate("/");
      } else {
        setLoading(false);
      }
    };

    init();
  }, [navigate]);

  // ✅ countdown timer
  useEffect(() => {
    if (!isLocked) return;

    const timer = setInterval(() => {
      setLockTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isLocked]);

  // ✅ reset attempts when lock ends
  useEffect(() => {
    if (lockTime === 0 && attempts === 0) {
      setAttempts(MAX_ATTEMPTS);
      setMessage("");
    }
  }, [lockTime, attempts]);

  // ✅ submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLocked) return;

    try {
      const res = await fetch("http://localhost/IAS/IASPhp/login.php", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        await logAttempt();
        onSuccess(data);
        setAttempts(MAX_ATTEMPTS);
      } else {
        handleFailedAttempt();
        await logAttempt();
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Try again.");
    }
  };

  // ✅ isolate failure logic (cleaner)
  const handleFailedAttempt = () => {
    setAttempts((prev) => {
      const remaining = prev - 1;

      if (remaining <= 0) {
        setLockTime(LOCK_DURATION);
        setMessage("Too many attempts. Try again later.");
        return 0;
      } else {
        setMessage(`Invalid credentials. ${remaining} attempt(s) left.`);
        return remaining;
      }
    });
  };

  // ✅ backend logging (only on failure)
  const logAttempt = async () => {
    try {
      await fetch("http://localhost/IAS/IASPhp/log_attempt.php", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ prevent flicker
  if (loading) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-emerald-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {/* EMAIL */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        {/* PASSWORD */}
        <PasswordInput
          handleChange={handleChange}
          name="password"
          placeholder="Password"
          value={form.password}
        />

        {/* MESSAGE */}
        <p className="text-sm text-center mt-2 text-red-600">
          {isLocked
            ? `Too many attempts. Try again in ${lockTime}s`
            : message || " "}
        </p>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={isLocked}
          className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLocked ? `Locked (${lockTime}s)` : "Login"}
        </button>

        {/* LINK */}
        <p className="text-sm text-center mt-4">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
