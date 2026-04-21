import { useState, useEffect } from "react";

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  //LOAD tbl_accounts on page load
  useEffect(() => {
    fetchTable();
  }, [currentPage]);

  //LOAD tbl_accounts
  function fetchTable() {
    fetch("http://localhost/IAS/iasfinals/api/users_table.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ page: currentPage }),
    })
      .then((res) => res.json())
      .then((data) => {
        /* console.log(data); *//* For DEV only*/
        setUsers(data.users);
        setTotalPages(data.totalPages);
      })
      .catch(console.error);
  }

  //HANDLE role change
  const handleRoleChange = async (id, newRole) => {
    const prevUsers = [...users];
    try {
      const res = await fetch("http://localhost/IAS/iasfinals/api/update_role.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          role: newRole,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);

      // 🔁 rollback if failed
      setUsers(prevUsers);

      alert("Failed to update role");
    }
    fetchTable();
  };

  //HANDLE delete user
  const handleUserDelete = async (id, email) => {
    const prevUsers = [...users];
    try {
      const res = await fetch("http://localhost/IAS/iasfinals/api/delete_user.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          email,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Deletion failed");
      }
    } catch (err) {
      console.error(err);

      // 🔁 rollback if failed
      setUsers(prevUsers);

      alert(`Failed to delete user ${err}`);
    }
    fetchTable();
  };

  return (
    <div className="w-full">
      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-emerald-200 border-b border-x divide-green-800 rounded-lg table-fixed">
          <thead className="bg-emerald-400 border-b border-green-800">
            <tr>
              <UsersTh text="Email" />
              <UsersTh text="Role" />
              <UsersTh text="Actions" />
            </tr>
          </thead>

          <tbody className="divide-y divide-green-800">
            {users.map((user) => (
              <tr key={user.acc_id} className="hover:bg-emerald-100">
                <UsersTd text={user.acc_email} />
                <UsersTd text={user.acc_role === 1 ? "Admin" : "User"} />
                <td className="px-6 py-4 flex justify-evenly">
                  <UsersAction
                    text="Promote"
                    color="bg-blue-500"
                    hover="enabled:hover:bg-blue-600"
                    disabled={[1].includes(user.acc_role) ? true : false}
                    id={user.acc_id}
                    role={1}
                    handler={handleRoleChange}
                  />
                  <UsersAction
                    text="Demote"
                    color="bg-orange-500"
                    hover="enabled:hover:bg-orange-600"
                    disabled={[0].includes(user.acc_role) ? true : false}
                    id={user.acc_id}
                    role={0}
                    handler={handleRoleChange}
                  />
                  <UsersActionDel
                    text="Delete"
                    color="bg-red-500"
                    hover="hover:bg-red-600"
                    id={user.acc_id}
                    handler={handleUserDelete}
                    email={user.acc_email}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </p>

        <div className="space-x-2">
          <button
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-white"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function UsersTh({ text }) {
  return (
    <th className="px-6 py-3 w-1/3 text-center text-xs font-semibold uppercase">
      {text}
    </th>
  );
}

function UsersTd({ text }) {
  return <td className="px-6 py-4 text-left">{text}</td>;
}

function UsersAction({ text, color, hover, disabled, id, role, handler }) {
  return (
    <button
      disabled={disabled}
      onClick={() => handler(id, role)}
      className={`${color} ${hover} text-white rounded-lg px-3 py-1 disabled:opacity-50`}
    >
      {text}
    </button>
  );
}

function UsersActionDel({ text, color, hover, disabled, id, handler, email}) {
  return (
    <button
    onClick={() => handler(id, email)}
      className={`${color} ${hover} text-white rounded-lg px-3 py-1`}
    >
      {text}
    </button>
  );
}
