"use client";
import React, { useEffect, useState } from "react";
import { SelectFormProps, Form } from "../types/globalTypes";
import "./style.css";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const SelectForm: React.FC<SelectFormProps> = ({
  token,
  selectedSite,
  setPage,
  domain,
  setSelectedForm,
  selectedForm,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [forms, setForms] = useState<Form[]>([]);

  useEffect(() => {
    fetchForms();
  }, [selectedSite]);

  const handleFormClick = (form: Form) => {
    setSelectedForm(form);
    setPage(3);
  };

  const fetchForms = async () => {
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
        `${BACKEND_URL}/api/forms?${params.toString()}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.forms.forms && domain) {
        const filteredForms = data.forms.forms.filter(
          (form: { siteDomainId: any }) => form.siteDomainId === domain.id
        );
        setForms(filteredForms);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDropdownChange = (event: { target: { value: any } }) => {
    const selectedValue = event.target.value;
    const matchedForm = forms.find((form) => form.id === selectedValue);
    setSelectedForm(matchedForm);
  };

  return (
    <div className="flex flex-col items-center justify-center py-4 px-4 bg-wf-gray text-wf-lightgray h-screen overflow-auto">
      <div className="text-center space-y-4 flex flex-col h-full justify-between pb-2">
          <>
          <div>
          <div className="flex justify-start fixed top-2">
            <button
              onClick={() => {
                setPage(1);
              }}
              className="text-sm font-regular text-left"
              style={{ color: "#fff" }}
            >
              <span className="inline-block">{"<"}</span>{" "}
              Back
            </button>
            </div>
            <h1 className="text-md font-medium text-left text-gray-200 mb-2 mt-4">
              Select a Form
            </h1>
            <p className="text-sm mb-4 text-left text-gray-400">
              Select a form to connect to Mailerlite
            </p>
            <div className="mb-8">
              <select
                value={selectedForm?.id || ""}
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
                <option value="">Select a form</option>
                {forms.map((form, index) => (
                  <option key={index} value={form.id}>
                    {form.displayName}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => handleFormClick(selectedForm)}
              style={{
                backgroundColor: "#1f2de6",
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
      </div>
    </div>
  );
};

export default SelectForm;
