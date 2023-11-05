"use client";
import React, { useEffect, useState } from "react";
import { SelectDomainProps, Domain } from "../types/globalTypes";

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
   setSelectedDomain(domain);
   setPage(2);
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

 return (
   <div className="flex flex-col items-center justify-center py-2 px-2 bg-wf-gray text-wf-lightgray h-screen overflow-auto">
     <div className="text-center space-y-4 flex flex-col h-full justify-between pb-2">
       {isLoading ? (
         <div>Loading...</div>
       ) : (
         <div>
           <h1 className="text-lg font-bold text-gray-200 mb-2 mt-2">
             Select Domain
           </h1>
           <p className="text-sm mb-4">
             Multiple domains are linked to your Webflow site. Please select
             the domain from which you would like to send forms to MailerLite.
             You can set up multiple domains later.
           </p>
           <ul className="space-y-2">
             {domains.map((domain, index) => (
               <li key={index} className="border-b border-gray-600">
                 <button
                   onClick={() => handleDomainClick(domain)}
                   className={`py-2 px-4 w-full text-left hover:bg-gray-800 ${
                     domain === selectedDomain ? "bg-gray-700 text-white" : ""
                   }`}
                 >
                   {domain.url}
                 </button>
               </li>
             ))}
           </ul>
         </div>
       )}
     </div>
   </div>
 );
};

export default SelectDomain;