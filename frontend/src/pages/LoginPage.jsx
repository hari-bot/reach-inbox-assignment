import GoogleOauth from "../components/GoogleOauth";

const LoginPage = () => {
  return (
    <div className="flex  min-h-screen items-center justify-center px-6 py-12 lg:px-8">
      <div className="border px-10 py-20 rounded-lg shadow-md">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://cdn-icons-png.flaticon.com/128/1309/1309475.png"
            alt="ReplyAI"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm flex justify-center">
          <GoogleOauth />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
