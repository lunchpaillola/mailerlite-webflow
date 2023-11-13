"use client";
import React, { useEffect, useState } from "react";
import { SelectFormProps, Form } from "../types/globalTypes";
import LoadingComponent from "./LoadingComponent";
import ChevronLeftIcon from '../icons/ChevronLeftIcon';
import "./style.css";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const SelectForm: React.FC<SelectFormProps> = ({
  token,
  selectedSite,
  setPage,
  setSelectedForm,
  selectedForm,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [forms, setForms] = useState<Form[]>([]);

  useEffect(() => {
    fetchForms();
  }, [selectedSite]);

  const handleFormClick = (form: Form) => {
    setSelectedForm(form);
    setPage(3);
  };

  const fetchForms = async () => {
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

      //filtering for unique forms across all domains
      if (data.forms.forms) {
        const filteredForms = data.forms.forms
          .reduce((uniqueForms: Map<string, Form>, form: Form) => {
            const identifier = form.pageId + "-" + form.displayName; // Create a unique identifier
            if (!uniqueForms.has(identifier)) {
              uniqueForms.set(identifier, form); // Add new unique form to the Set
            }
            return uniqueForms;
          }, new Map<string, Form>())
          .values();

        const uniqueFormsArray: Form[] = Array.from(filteredForms);
        setForms(uniqueFormsArray); // Update the state with the unique forms
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
    <div className="flex items-center min-h-screen py-2 bg-wf-gray text-wf-lightgray">
      <div className="w-full">
        {isLoading ? (
          <LoadingComponent/>
        ) : (
          <>
            <div className="fixed top-2 px-4">
              <button
                onClick={() => {
                  setPage(1);
                }}
                className="flex items-center text-sm font-regular text-white text-left"
                >
                  <ChevronLeftIcon/>
                  Back
                </button>
            </div>
            <div className="w-full fixed top-16">
            <h1 className="text-md font-medium text-center text-gray-200">
              Select a Form
            </h1>
            <p className="text-sm text-center text-gray-400">
              Connect a form to Mailerlite
            </p>
            </div>
            <div className="px-4">
              <select
                value={selectedForm?.id || ""}
                onChange={handleDropdownChange}
                className="bg-[#383838] text-white px-4 py-2 rounded outline-none w-full box-border mb-4"
              >
                <option value="">Select a form</option>
                {forms.map((form, index) => (
                  <option key={index} value={form.id}>
                    {form.pageName}: {form.displayName}
                  </option>
                ))}
              </select>
              <button
              onClick={() => handleFormClick(selectedForm)}
              className="bg-[#1f2de6] text-white px-4 py-2 rounded outline-none w-full box-border hover:bg-[#1634d1] focus:outline-none focus:ring-2 focus:ring-[#1f2de6] focus:ring-opacity-50"
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

export default SelectForm;
