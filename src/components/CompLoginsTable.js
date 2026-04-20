import { useState, useEffect } from "react";

export default function LoginsTable() {
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line
  }, [currentPage]);

  async function fetchLogs() {
    try {
      const res = await fetch("http://localhost/IAS/iasfinals/php/logins_table.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({currentPage}),
      });

      const data = await res.json();

      setLogs(data.logs ?? []);
      setTotalPages(Number(data.totalPages) || 1);
    } catch (err) {
      console.error(err);
      setLogs([]);
      setTotalPages(1);
    }
  }

  const goToPage = (page) => {
    const safePage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(safePage);
  };

  return (
    <div className="w-full">
      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-emerald-200 border-b border-x border-green-800 rounded-lg">
          <thead className="bg-emerald-400 border-b border-green-800">
            <tr>
              <Th text="Email" />
              <Th text="Timestamp" />
            </tr>
          </thead>

          <tbody className="divide-y divide-green-800">
            {logs.map((log) => (
              <tr key={log.log_id} className="hover:bg-gray-50">
                <Td text={log.log_email} />
                <Td text={formatDate(log.log_datetime)} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION (same style as users table) */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </p>

        <div className="space-x-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-white"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
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

/* helpers */
function Th({ text }) {
  return (
    <th className="px-6 py-3 text-left text-xs font-semibold uppercase">
      {text}
    </th>
  );
}

function Td({ text }) {
  return <td className="px-6 py-4 text-sm">{text}</td>;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString();
}