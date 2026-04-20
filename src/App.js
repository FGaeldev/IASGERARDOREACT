import "./output.css";
import CompNavbar from "./components/CompNavbar";

function App() {
  return (
    <div className="bg-white">
      <CompNavbar />
      <div className="min-h-screen flex items-center justify-center bg-emerald-50">
        <div className="flex-col items-center text-center gap-6 px-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl mb-4 font-bold text-gray-800 max-w-xl">
            This Project Is My IAS Final Output
          </h1>
        </div>
      </div>
    </div>
  );
}

export default App;
