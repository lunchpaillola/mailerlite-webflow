"use client";
import React, { useEffect, useState } from "react";
import Login from "./components/Login";
import Navigate from "./components/Navigate";
import LoadingComponent from "./components/LoadingComponent";
import { Site } from "./types/globalTypes";

const MainPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [token, setToken] = useState<string>("");
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Get authorization, if already authorized then set setPage to 1.

    const auth = localStorage.getItem("webflow_token");

      const getSiteInfo = async () => {
        const siteInfo = await webflow.getSiteInfo();
        const siteId = siteInfo.siteId;
        setSelectedSite({
          id: siteId,
          shortName: siteInfo.shortName,
        });
      };
      setPage(auth ? 1 : 0);
      setToken(auth || "");
      getSiteInfo().then(() => setIsLoading(false));
    }
  }, []);

  // If token is undefined send user to Login Page
  if (!token) {
    return <Login setPage={setPage} token={token} setToken={setToken} />;
  }

  if (isLoading) {
    return <LoadingComponent />;
  }

  // This function determines which content appears on the page
  switch (page) {
    case 0:
      return <Login setPage={setPage} token={token} setToken={setToken} />;
    case 1:
      return <Navigate setPage={setPage} />;
};
}

export default MainPage;
