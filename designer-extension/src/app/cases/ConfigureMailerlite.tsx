"use client";
import React, { useEffect, useState } from "react";
import {
  FieldsArray,
  FieldObject,
  WebflowFormFields,
  MailerliteGroups,
  ConfigureMailerLiteProps,
} from "../types/globalTypes";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const ConfigureMailerlite: React.FC<ConfigureMailerLiteProps> = ({
  setPage,
  selectedForm,
  selectedSite,
  token,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //const [fields, setFields] = useState<MailerliteFields[]>([]);
  const [groups, setGroups] = useState<MailerliteGroups[]>([]);
  const [webflowFormFields, setWebflowFormFields] = useState<
    WebflowFormFields[]
  >([]);
  const [fieldConnections, setFieldConnections] = useState<
    Record<string, string>
  >({});

  const mKey = String(process.env.MAILERLITE_API_KEY);

  const fetchMailerlite = async () => {
    setIsLoading(true);

    const params = new URLSearchParams({
      auth: mKey,
    });

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/mailerlite?${params.toString()}`,
        {
          method: "GET",
        }
      );

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
      console.log("at the try the selectedForm");
      const webhookParams = new URLSearchParams({
        fieldConnection: JSON.stringify(fieldConnections),
        siteId: selectedSite ? selectedSite.id : "none",
        auth: token,
        formId: selectedForm.id,
        formName: selectedForm.displayName,
      });

      console.log("webhookparams", webhookParams);
      console.log(
        "url",
        `${BACKEND_URL}/api/webhooks?${webhookParams.toString()}`
      );

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
    <div className="flex flex-col items-center justify-center py-4 px-4 bg-wf-gray text-wf-lightgray h-screen overflow-auto">
      <div className="text-center space-y-6 flex flex-col h-full justify-between">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <h1 className="text-2xl font-semibold text-gray-200 mb-4 mt-4">
              Configure Webflow form fields for Mailerlite
            </h1>
            <div className="space-y-6">
              {/* Select email */}
              <div className="border-b border-gray-600 py-2 flex justify-between items-center">
                <span>Email</span>
                <select
                  required
                  onChange={(e) =>
                    handleDropdownChange("email", e.target.value)
                  }
                  className="appearance-none py-1 px-3 bg-wf-gray border rounded shadow leading-tight focus:outline-none focus:shadow-outline"
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
              </div>
              {/* Select group */}
              <div className="border-b border-gray-600 py-2 flex justify-between items-center">
                <span>Group</span>
                <select
                  required
                  onChange={(e) =>
                    handleDropdownChange("group", e.target.value)
                  }
                  className="appearance-none py-1 px-3 bg-wf-gray border rounded shadow leading-tight focus:outline-none focus:shadow-outline"
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
              </div>
            </div>
            <button
              className="mt-6 mb-6 px-6 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 transition duration-150 ease-in-out"
              onClick={handleConfirm}
            >
              Confirm Selections
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ConfigureMailerlite;
