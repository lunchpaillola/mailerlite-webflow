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
 const [isLoading, setIsLoading] = useState<boolean>(false);
 const [webhooks, setWebhooks] = useState<WebhookProps[]>([]);
 

 useEffect(() => {
   fetchWebhooks();
 }, [selectedSite]);

 if (!selectedSite) {
   return;
 }
 

 const handleDelete = async (webhook: WebhookProps) => {
   console.log("Attempting to delete webhook:", webhook.id);
   const deleteParams = new URLSearchParams({
     auth: token,
     webhookId: webhook.id
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
       setWebhooks(webhooks => webhooks.filter(w => w.id !== webhook.id));
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


 const handleBack = () => {
   setPage(3);
 };

 const handleConnectNew = () => {
   setPage(token ? 1 : 0);
 };

 const fetchWebhooks = async () => {
   setIsLoading(true);

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
       console.log("webhooks", data.webhooks.webhooks);
       setWebhooks(data.webhooks.webhooks);
     }
   } catch (error) {
     console.error("Error:", error);
   } finally {
     setIsLoading(false);
   }
 };

 return (
   <div className="flex flex-col items-center justify-center py-6 px-4 bg-wf-gray text-wf-lightgray min-h-screen">
     {isLoading ? (
       <div>Loading...</div>
     ) : (
       <div className="w-full max-w-xl space-y-6">
         <h1 className="text-2xl font-semibold text-gray-200 text-center">
           View and remove webhooks
         </h1>
         <p className="text-sm mb-2 text-center">View all form connections</p>
         <ul className="space-y-4 divide-y divide-gray-600">
           {webhooks.map((webhook) => (
             <li
               key={webhook.id}
               className="flex justify-between items-center py-2"
             >
               <span>{webhook.filter.formName}</span>
               <button
                 onClick={() => handleDelete(webhook)}
                 className="py-2 px-4 hover:bg-red-600 bg-red-500 text-white rounded-md"
               >
                 Delete Connection
               </button>
             </li>
           ))}
         </ul>
         <div className="flex justify-between mt-4 space-x-2">
           <button
             onClick={() => handleBack()}
             className="py-2 px-4 bg-gray-600 hover:bg-gray-700 text-white rounded-md flex-grow"
           >
             Back
           </button>
           <button
             onClick={() => handleConnectNew()}
             className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex-grow"
           >
             Create New Connection
           </button>
         </div>
       </div>
     )}
   </div>
 );
};

export default ViewWebhooks;