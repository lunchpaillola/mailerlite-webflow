"use client";
import React, { useEffect, useState } from "react";
import { SelectDomainProps, Domain } from "../types/globalTypes";
import "./style.css";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const SelectDomain: React.FC<SelectDomainProps> = ({
  token,
  selectedSite,
  setPage,
  setSelectedDomain,
  selectedDomain,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [domains, setDomains] = useState<Domain[]>([]);

  useEffect(() => {
    fetchDomains();
  }, [selectedSite]);

  const handleDomainClick = (domain: Domain) => {
    console.log("selectedDomain 2", selectedDomain);
    setSelectedDomain(domain);
    setPage(2);
    console.log("selectedDomain 1", selectedDomain);
  };

  const fetchDomains = async () => {
    setIsLoading(true);

    if (!selectedSite) {
      return;
    }
    const params = new URLSearchParams({
      auth: token,
      siteId: selectedSite.id,
    });

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/domains?${params.toString()}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.domains.customDomains) {
        const additionalDomain = {
          id: selectedSite.id,
          url: `${selectedSite.shortName}.webflow.io`,
        };

        const updatedDomains = [
          ...data.domains.customDomains,
          additionalDomain,
        ];
        setDomains(updatedDomains);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDropdownChange = (event: { target: { value: any } }) => {
    const selectedValue = event.target.value;
    const matchedDomain = domains.find((domain) => domain.id === selectedValue);
    setSelectedDomain(matchedDomain);
  };


  return (
    <div className="flex flex-col items-center justify-center py-4 px-4 bg-wf-gray text-wf-lightgray h-screen overflow-auto">
      <div className="text-center space-y-4 flex flex-col h-full justify-between pb-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
          <div>
          <div className="flex justify-start fixed top-2">
            <button
              onClick={() => {
                setPage(0);
              }}
              className="text-sm font-regular text-left"
              style={{ color: "#8AC2FF" }}
            >
              <span className="inline-block">{"<"}</span>{" "}
              Back
            </button>
            </div>
              <h1 className="text-md font-medium text-left text-gray-200 mb-2 mt-4">
                Select Domain
              </h1>
              <p className="text-sm text-left text-gray-400 mb-8">
                You can set up multiple domains later.
              </p>
              <div className="mb-8">
                <select
                  required
                  value={selectedDomain?.id || ""}
                  onChange={handleDropdownChange}
                  style={{
                    backgroundColor: "#383838",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    outline: "none",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <option value="">Select a domain</option>
                  {domains.map((domain, index) => (
                    <option key={index} value={domain.id}>
                      {domain.url}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => handleDomainClick(selectedDomain)}
                style={{
                  backgroundColor: "#0b71ce",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  outline: "none",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                Confirm
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SelectDomain;
