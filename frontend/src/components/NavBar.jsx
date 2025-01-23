import { CiLogout } from "react-icons/ci";

const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem("googleToken");
    window.location.href = "/";
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img
            className="w-10 h-10 rounded-full border-2 border-white"
            src="https://cdn-icons-png.flaticon.com/128/1309/1309475.png"
            alt="Logo"
          />
          <h1 className="text-2xl font-bold text-white">ReplyAI</h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-opacity-50"
        >
          <CiLogout className="text-xl" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
