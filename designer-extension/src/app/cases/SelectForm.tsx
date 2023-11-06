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
         (form: { siteDomainId: any }) => form.siteDomainId === domain
       );
       setForms(filteredForms);
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
             Select a Form
           </h1>
           <p className="text-sm mb-4">
             Select a form to connect to Mailerlite
           </p>
           <ul>
             {forms.map((form, index) => (
               <li key={index} className="border-b border-gray-600">
                 <button
                   onClick={() => handleFormClick(form)}
                   className={`py-2 px-4 w-full text-left ${
                     form === selectedForm ? "bg-gray-700 text-white" : ""
                   }`}
                 >
                   {form.displayName}
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

export default SelectForm;