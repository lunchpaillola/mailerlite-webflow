"use client";
import React, { useEffect, useState } from "react";
import { ViewWebhookProps, WebhookProps } from "../types/globalTypes";
import "./style.css";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const ViewWebhooks: React.FC<ViewWebhookProps> = ({
  token,
  selectedSite,
  setPage,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [webhooks, setWebhooks] = useState<WebhookProps[]>([]);

  useEffect(() => {
    fetchWebhooks();
  }, [selectedSite]);

  if (!selectedSite) {
    return;
  }

  const handleDelete = async (webhook: WebhookProps) => {
    const deleteParams = new URLSearchParams({
      auth: token,
      webhookId: webhook.id,
    });

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/webhooks?${deleteParams.toString()}`,
        {
          method: "DELETE",
        }
      );

      if (response.status === 204) {
        console.log("Webhook deleted successfully");
        setWebhooks((webhooks) => webhooks.filter((w) => w.id !== webhook.id));
      } else {
        const data = await response.json();
        if (data.error) {
          console.error("Error deleting webhook:", data.error);
          // TODO: Inform the user of the error.
        } else {
          console.log("Received unexpected data:", data);
        }
      }
    } catch (error) {
      console.error("Exception when calling delete:", error);
      // TODO: Inform the user there was a problem processing the deletion.
    }
  };

  const fetchWebhooks = async () => {

    const params = new URLSearchParams({
      auth: token,
      siteId: selectedSite.id,
    });

    try {
      const response = await fetch(
        `${BACKEND_URL}/api/webhooks?${params.toString()}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.webhooks) {
        setWebhooks(data.webhooks.webhooks);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center py-4 px-4 bg-wf-gray text-wf-lightgray h-screen overflow-auto">
      <div className="text-center space-y-4 flex flex-col h-full justify-between pb-2">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div className="flex justify-start fixed top-2">
            <button
              onClick={() => {
                setPage(3);
              }}
              className="text-sm font-regular text-left"
              style={{ color: "#fff" }}
            >
              <span className="inline-block">{"<"}</span> Back
            </button>
          </div>
          <h1 className="text-md font-medium text-left text-gray-200 mb-2 mt-4">
            Form connections to Mailerlite
          </h1>
          <p className="text-sm mb-4 text-left text-gray-400">
            View and remove connections
          </p>
          <div className="mb-8">
            <ul className="space-y-4 divide-y divide-gray-600">
              {webhooks.map((webhook) => (
                <li
                  key={webhook.id}
                  className="flex justify-between items-center py-2"
                >
                  <div>
                    <span className="block text-sm text-left">
                  {webhook.filter.formName}
                    </span>
                    <span className="block text-sm text-left text-gray-400">
                      Page:{" "}
                      {webhook.filter.pageName}
                    </span>
                    <span className="block text-sm text-left text-gray-400">
                      Last triggered:{" "}
                      {webhook.lastTriggered
                        ? new Date(webhook.lastTriggered).toLocaleString()
                        : "Never"}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(webhook)}
                    className="text-sm text-[#CF313B] py-2 px-4"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex justify-between mt-8 space-x-2">
              <button
                onClick={() =>setPage(token ? 2 : 0)}
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
                Connect new form
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default ViewWebhooks;
