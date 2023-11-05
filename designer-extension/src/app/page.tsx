"use client";
import React, { useEffect, useState } from "react";
import Login from "./cases/Login";
import SelectDomain from "./cases/SelectDomain";
import SelectForm from "./cases/SelectForm";
import ConfigureMailerlite from "./cases/ConfigureMailerlite";
import ViewWebhooks from "./cases/ViewWebhooks";
import { Site, Form, Domain } from "./types/globalTypes";

const MainPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [token, setToken] = useState<string>("");
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Get authorization, if already authorized then set setPage to 1
      const auth = localStorage.getItem("devflow_token");

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
      getSiteInfo();
    }
  }, []);

  // If token is undefined send user to Login Page
  if (!token) {
    return <Login setPage={setPage} token={token} setToken={setToken} />;
  }

  // This function determines which content appears on the page
  switch (page) {
    case 0:
      return <Login setPage={setPage} token={token} setToken={setToken} />;
    case 1:
      return (
        <SelectDomain
          setPage={setPage}
          token={token}
          selectedSite={selectedSite}
          selectedDomain={selectedDomain}
          setSelectedDomain={setSelectedDomain}
        />
      );
    case 2:
      return (
        <SelectForm
          selectedForm={selectedForm}
          setSelectedForm={setSelectedForm}
          setPage={setPage}
          domain={selectedDomain}
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
          domain={selectedDomain}
          token={token}
          selectedSite={selectedSite}
        />
      );
    case 4:
      return (
        <ViewWebhooks
          setPage={setPage}
          token={token}
          selectedSite={selectedSite}
        />
      );
  }
};

export default MainPage;
