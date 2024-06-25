import { CiLogout } from "react-icons/ci";

const Navbar = () => {
  const handleLogout = () => {
    localStorage.removeItem("googleToken");
    window.location.href = "/";
  };

  return (
    <nav className="bg-white p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-3">
        <img
          className="w-auto h-7 sm:h-8"
          src="https://cdn-icons-png.flaticon.com/128/1309/1309475.png"
          alt="Logo"
        />
        <h1 className="text-2xl font-semibold text-black capitalize sm:text-3xl">
          ReplyAI
        </h1>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
      >
        <CiLogout /> Logout
      </button>
    </nav>
  );
};

export default Navbar;
