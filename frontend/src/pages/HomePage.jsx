import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Emails from "../components/Emails";
import Navbar from "../components/NavBar";

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getQueryParameterByName = (name) => {
      const urlParams = new URLSearchParams(location.search);
      return urlParams.get(name);
    };

    const token = getQueryParameterByName("token");

    if (token) {
      localStorage.setItem("googleToken", token);

      const urlWithoutToken = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, urlWithoutToken);
    } else {
      const storedToken = localStorage.getItem("googleToken");
      if (!storedToken) {
        navigate("/");
      }
    }
  }, [navigate, location.search]);

  return (
    <div>
      <Navbar />
      <Emails />
    </div>
  );
};

export default HomePage;
