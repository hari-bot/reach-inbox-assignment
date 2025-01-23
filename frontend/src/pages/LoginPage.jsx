import GoogleOauth from "../components/GoogleOauth";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <img
            className="mx-auto h-16 w-auto"
            src="https://cdn-icons-png.flaticon.com/128/1309/1309475.png"
            alt="ReplyAI"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to ReplyAI
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access your intelligent email assistant
          </p>
        </div>
        <div className="mt-8 flex justify-center">
          <GoogleOauth />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
