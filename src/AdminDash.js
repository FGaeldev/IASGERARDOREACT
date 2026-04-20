import CompNavbar from "./components/CompNavbar";
import { useEffect, useState } from "react";
import { checkAuth } from "./components/CompCheckAuth";
import { useNavigate } from "react-router";
import UsersTable from "./components/CompUsersTable";
import LoginsTable from "./components/CompLoginsTable";

export default function AdminDash() {
  // eslint-disable-next-line
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // eslint-disable-next-line
  const [activeTable, setActiveTable] = useState(<UsersTable />);
  const [isUsers, setIsUsers] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth().then((data) => {
      setIsLoggedIn(data.loggedIn);

      if (!data.loggedIn) {
        navigate("/login");
      }
      if ([0].includes(data.role)) {
        navigate("/");
      }
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isUsers) {
      setActiveTable(<UsersTable />);
    } else {
      setActiveTable(<LoginsTable />);
    }
  }, [isUsers]);

  return (
    <>
      <CompNavbar />
      <div className="min-h-screen px-8 py-8 flex-col justify-center bg-emerald-50">
        <TableNav />
        {activeTable}
      </div>
    </>
  );

  function TableNav() {
    return (
      <nav className="w-full flex">
        <button
          onClick={() => {
            setIsUsers(true);
          }}
          className={`w-1/2  ${isUsers ? "bg-emerald-400 border-t border-x border-green-800" : "bg-emerald-200 border-b border-green-800"}  px-2 py-1 rounded-tl-lg transition`}
        >
          <span className="font-bold">Users</span>
        </button>
        <button
          onClick={() => {
            setIsUsers(false);
          }}
          className={`w-1/2  ${isUsers ? "bg-emerald-200 border-b border-green-800" : "bg-emerald-400 border-t border-x border-green-800"}  px-2 py-1 rounded-tr-lg transition`}
        >
          <span className="font-bold">Logins</span>
        </button>
      </nav>
    );
  }
}
