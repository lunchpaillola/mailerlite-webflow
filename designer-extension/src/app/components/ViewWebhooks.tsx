"use client";
import React, { useEffect, useState } from "react";
import { ViewWebhookProps, WebhookProps } from "../types/globalTypes";
import LoadingComponent from "./LoadingComponent";
import ChevronLeftIcon from "../icons/ChevronLeftIcon";
import DeleteIcon from "../icons/DeleteIcon";
import "./style.css";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const ViewWebhooks: React.FC<ViewWebhookProps> = ({
  token,
  selectedSite,
  selectedForm,
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
        setWebhooks(data.webhooks);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-wf-gray text-wf-lightgray">
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <>
        <div className= "bg-wf-gray fixed mb-4 top-0 w-full z-10">
          <div className="fixed top-0 w-full bg-wf-gray">
            <button
             onClick={() => setPage(selectedForm ? 3 : 1)}
              className="flex px-4 mt-2 mb-2 items-center text-sm font-regular text-white text-left"
            >
              <ChevronLeftIcon />
              Back
            </button>
            <h1 className="text-md px-4 font-medium text-center mt-8 text-gray-200">
              Mailerlite connections
            </h1>
            <p className="text-sm px-4 text-center mb-4 text-gray-400">
              Manage form connections
            </p>
            </div>
          </div>
          <div className="mt-32">
            <ul className="space-y-4 divide-y border-t border-gray-600 divide-gray-600">
              {webhooks.map((webhook) => (
                <li className="pt-2" key={webhook.id}>
                  <span className="text-sm text-left">
                  Name: {webhook.filter.formName}
                  </span>
                  <div>
                  <span className="block text-sm text-left mt-2">
                    Page: {webhook.filter.pageName}
                    </span>
                    <span className="block text-sm text-left mt-2">
                      Last run:{" "}
                      {webhook.lastTriggered
                        ? new Date(webhook.lastTriggered).toLocaleString()
                        : "Never"}
                    </span>
                    <div className="flex justify-start mt-2 text-sm text-[#CF313B] hover:text-red-700">
                    <button className="flex col"  onClick={() => handleDelete(webhook)}>
                    <DeleteIcon /> Delete connection
                    </button>
                  </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex mt-8 mb-8 space-x-2">
              <button
                onClick={() => setPage(token ? 2 : 0)}
                className="bg-[#1f2de6] text-white px-4 py-2 rounded outline-none w-full box-border hover:bg-[#1634d1] focus:outline-none focus:ring-2 focus:ring-[#1f2de6] focus:ring-opacity-50"
              >
                Connect new form
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewWebhooks;
