"use client";
import React, { useEffect, useState } from "react";
import {
  FieldsArray,
  FieldObject,
  WebflowFormFields,
  MailerliteGroups,
  ConfigureMailerLiteProps,
} from "../types/globalTypes";
import LoadingComponent from "./LoadingComponent";
import ChevronLeftIcon from "../icons/ChevronLeftIcon";
import "./style.css";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const ConfigureMailerlite: React.FC<ConfigureMailerLiteProps> = ({
  setPage,
  selectedForm,
  selectedSite,
  token,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [groups, setGroups] = useState<MailerliteGroups[]>([]);
  const [webflowFormFields, setWebflowFormFields] = useState<
    WebflowFormFields[]
  >([]);
  const [fieldConnections, setFieldConnections] = useState<
    Record<string, string>
  >({});

  const fetchMailerlite = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/mailerlite`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.groups) {
        setGroups(data.groups);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMailerlite();
    const transformedData = transformFields(fieldsArray);
    setWebflowFormFields(transformedData);
  }, [selectedForm]);

  const fieldsArray: FieldsArray = Object.entries(selectedForm.fields);

  const transformFields = (fields: FieldsArray): WebflowFormFields[] => {
    return fields.map((item) => {
      return {
        id: item[0] as string,
        displayName: (item[1] as FieldObject).displayName,
      };
    });
  };

  // Update selections when a dropdown value is changed
  const handleDropdownChange = (fieldId: string, selectedValue: string) => {
    setFieldConnections((prevState) => ({
      ...prevState,
      [fieldId]: selectedValue,
    }));
  };

  const handleConfirm = async () => {
    try {
      const webhookParams = new URLSearchParams({
        fieldConnection: JSON.stringify(fieldConnections),
        siteId: selectedSite ? selectedSite.id : "none",
        auth: token,
        pageId: selectedForm.pageId,
        pageName: selectedForm.pageName,
        formName: selectedForm.displayName,
      });
      const response = await fetch(
        `${BACKEND_URL}/api/webhooks?${webhookParams.toString()}`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        setPage(4);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //TODO: Add something here that does something when there are 0 fields.......
  return (
    <div className="flex items-center min-h-screen py-2 bg-wf-gray text-wf-lightgray">
      <div className="w-full">
        {isLoading ? (
          <LoadingComponent />
        ) : (
          <>
            <div className="fixed top-2 px-4">
              <button
                onClick={() => {
                  setPage(2);
                }}
                className="flex items-center text-sm font-regular text-white text-left"
              >
                <ChevronLeftIcon />
                Back
              </button>
            </div>
            <div className="w-full fixed top-12 px-4">
              <h1 className="text-md font-medium text-center text-gray-200">
                Map fields
              </h1>
              <p className="text-sm text-center text-gray-400">
                Connect {selectedForm.displayName} fields
              </p>
            </div>
            <div className="px-4 mt-16">
              <p className="text-sm mb-2 text-left text-gray-400">
                Select Email
              </p>
              <select
                required
                onChange={(e) => handleDropdownChange("email", e.target.value)}
                className="bg-[#383838] text-white px-4 py-2 rounded outline-none w-full box-border mb-4"
              >
                <option value="" disabled selected>
                  Select Email Field
                </option>
                {webflowFormFields.map((webflowField) => (
                  <option
                    key={webflowField.id}
                    value={webflowField.displayName}
                  >
                    {webflowField.displayName}
                  </option>
                ))}
              </select>
              <p className="text-sm mb-2 text-left text-gray-400">
                Select Group
              </p>
              <select
                required
                onChange={(e) => handleDropdownChange("group", e.target.value)}
                className="bg-[#383838] text-white px-4 py-2 rounded outline-none w-full box-border mb-4"
              >
                <option value="" disabled selected>
                  Select Mailerlite Group
                </option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleConfirm()}
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

export default ConfigureMailerlite;
