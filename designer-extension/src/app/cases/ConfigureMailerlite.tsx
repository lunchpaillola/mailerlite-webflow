"use client";
import React, { useEffect, useState } from "react";
import {
  FieldsArray,
  FieldObject,
  WebflowFormFields,
  MailerliteGroups,
  ConfigureMailerLiteProps,
} from "../types/globalTypes";
import "./style.css";

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
      <div className="text-center space-y-4 flex flex-col h-full justify-between pb-2">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div>
            <div className="flex justify-start fixed top-2">
            <button
              onClick={() => {
                setPage(2);
              }}
              className="text-sm font-regular text-left"
              style={{ color: "#8AC2FF" }}
            >
              <span className="inline-block">{"<"}</span>{" "}
              Back
            </button>
            </div>
              <h1 className="text-md font-medium text-left text-gray-200 mb-2 mt-4">
                Connect Webflow fields to Mailerlite
              </h1>
              <p className="text-sm mb-2 text-left text-gray-400">
                Select Email
              </p>
              <div className="mb-4">
                <select
                  required
                  onChange={(e) =>
                    handleDropdownChange("email", e.target.value)
                  }
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
              <p className="text-sm mb-2 text-left text-gray-400">
                Select Group
              </p>
              <div className="mb-8">
                <select
                  required
                  onChange={(e) =>
                    handleDropdownChange("group", e.target.value)
                  }
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
              <button
                onClick={() => handleConfirm()}
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

export default ConfigureMailerlite;
