import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import PasswordInput from "./CompPasswordInput";

export default function SQForm({ mydata }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    question: "",
    answer: "",
  });

  /** LOAD question */
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch(
          "http://localhost/IAS/iasfinals/php/read_secQuestion.php",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(mydata.email),
          },
        );

        const data = await res.json();

        if (!data.success) {
          throw new Error(data.message);
        }

        setForm((prev) => ({
          ...prev,
          question: data.question ?? "",
        }));
      } catch (err) {
        console.error(err);
      }
    };

    fetchQuestion();
  }, []);

  /** HANDLE input */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /** DO on submit */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost/IAS/iasfinals/php/login_step_two.php", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          email: mydata.email,
        }),
      });

      const response = await res.json();
      if (!response) {
        throw Error("Error with the fetch request");
      }

      if ([1].includes(response.role)) {
        navigate("/dashboard");
      } else {
        navigate("/profile");
      }
    } catch (err) {}
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-emerald-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Verification</h2>

        {/* EMAIL */}
        <input
          type="text"
          readOnly={true}
          value={form.question}
          className="w-full mt-3 px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        ></input>

        {/* PASSWORD */}
        <PasswordInput
          handleChange={handleChange}
          name="answer"
          placeholder="Password"
        />

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Login
        </button>
      </form>
    </div>
  );
}
