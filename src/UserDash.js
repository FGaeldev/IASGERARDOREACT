import CompNavbar from "./components/CompNavbar";
import { useEffect, useState } from "react";
import { checkAuth } from "./components/CompCheckAuth";
import { useNavigate } from "react-router";

export default function UserDash() {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [role, setRole] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  //Check if logged in
  useEffect(() => {
    checkAuth().then((data) => {
      if (!data.loggedIn) {
        navigate("/");
      }
      setUser(data.user);
      setRole([0].includes(data.role) ? "User" : "Admin");

      getData(data.user);
    });
  }, [navigate]);

  return (
    <>
      <CompNavbar />
      <div className="flex flex-col items-center min-h-screen bg-emerald-50 pt-10">
        <div className="flex items-baseline justify-between w-4/5 bg-emerald-400 px-4 py-2 shadow mb-2 rounded-t-2xl">
          <h1 className="text-4xl font-bold">{user}</h1>
          <span className="text-2xl font-bold h-max">{role}</span>
        </div>
        <div className="flex flex-col min-w-4/5 h-3/4 bg-emerald-400 shadow">
          <span className="text-2xl font-semibold mx-2 py-2">
            Security Settings
          </span>
          <div className="flex flex-col w-full bg-emerald-200 pl-8 pr-2 py-2 shadow">
            <span className="flex font-bold justify-between">
              Security Question
              <button
                onClick={() => {
                  setIsEditing((prev) => {
                    const next = !prev;

                    if (prev) {
                      handleSave();
                    }else{
                      setAnswer("");
                    }

                    return next;
                  });
                }}
              >
                {isEditing ? "Save" : "Reset"}
              </button>
            </span>
            <span>
              <label>Q: </label>
              <input
                type="text"
                onChange={(e) => setQuestion(e.target.value)}
                disabled={!isEditing}
                value={question}
                className="w-1/2"
              ></input>
            </span>
            <span>
              <label>A: </label>
              <input
                type={isEditing ? "text" : "password"}
                onChange={(e) => setAnswer(e.target.value)}
                disabled={!isEditing}
                value={answer}
                className="w-1/2"
              ></input>
            </span>
          </div>
        </div>
      </div>
    </>
  );
  async function handleSave() {
    try {
      const res = await fetch(
        "http://localhost/IAS/iasfinals/api/update_secQuestion.php",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user,
            question: question,
            answer: answer,
          }),
        },
      );

      console.log(question, answer);
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      getData();
    } catch (err) {
      console.error(err);
    }
  }

  async function getData() {
    try {
      const res = await fetch(
        "http://localhost/IAS/iasfinals/api/read_secQuestion.php",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      setQuestion(data.question ? data.question : "");
      setAnswer(data.answer ? data.answer : "");
    } catch (err) {
      console.error(err);
    }
  }
}
