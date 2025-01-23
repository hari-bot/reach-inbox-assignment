import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Emails from "../components/Emails";
import Navbar from "../components/NavBar";

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const getQueryParameterByName = (name) => {
      const urlParams = new URLSearchParams(location.search);
      return urlParams.get(name);
    };

    const token = getQueryParameterByName("token");
    const userInfoString = getQueryParameterByName("userInfo");

    if (token) {
      localStorage.setItem("googleToken", token);

      if (userInfoString) {
        const userInfo = JSON.parse(decodeURIComponent(userInfoString));
        setUserInfo(userInfo);
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
      }

      const urlWithoutParams =
        window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, urlWithoutParams);
    } else {
      const storedToken = localStorage.getItem("googleToken");
      const storedUserInfo = localStorage.getItem("userInfo");
      if (storedToken && storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
      } else {
        navigate("/");
      }
    }
  }, [navigate, location.search]);

  return (
    <div>
      <Navbar userInfo={userInfo} />
      <Emails />
    </div>
  );
};

export default HomePage;
