import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
      window.history.replaceState({}, document.title, "/home");
    } else {
      navigate("/");
    }
  }, [navigate, location.search]);

  return <div>HomePage</div>;
};

export default HomePage;
