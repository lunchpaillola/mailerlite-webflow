"use client";
import React, { useEffect, useState } from "react";
import Login from "./components/Login";
import Navigate from "./components/Navigate";
import SelectForm from "./components/SelectForm";
import ConfigureMailerlite from "./components/ConfigureMailerlite";
import ViewWebhooks from "./components/ViewWebhooks";
import LoadingComponent from "./components/LoadingComponent";
import { Site, Form } from "./types/globalTypes";

const MainPage: React.FC = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const [page, setPage] = useState(0);
  const [token, setToken] = useState<string>("");
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // This effect will run once, after the initial render, and will indicate that the component has mounted to solve hydration issues
  useEffect(() => {
    setHasMounted(true);
  }, []);
  

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

  if (!hasMounted) {
    return null; // Will only occur on the initial render
  }


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
    case 2:
      return (
        <SelectForm
          selectedForm={selectedForm}
          setSelectedForm={setSelectedForm}
          setPage={setPage}
          token={token}
          selectedSite={selectedSite}
        />
      );
    case 3:
      return (
        <ConfigureMailerlite
          selectedForm={selectedForm}
          setSelectedForm={setSelectedForm}
          setPage={setPage}
          token={token}
          selectedSite={selectedSite}
        />
      );
    case 4:
      return (
        <ViewWebhooks
          selectedForm={selectedForm}
          setPage={setPage}
          token={token}
          selectedSite={selectedSite}
        />
      );
  }
};

export default MainPage;
