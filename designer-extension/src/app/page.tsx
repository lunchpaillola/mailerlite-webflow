"use client";
import { motion } from "framer-motion"; // For animations
import React, { useEffect, useState } from "react";
import { Webhook } from "webflow-api/dist/api";
// import Image from "next/image";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Site {
  id: string;
  shortName: string;
}

interface WebflowFormFields {
  displayName: string;
  id: string;
}

interface FieldObject {
  displayName: string;
  placeholder: string;
  type: string;
  userVisible: boolean;
}

type FieldArrayItem = Array<string | FieldObject>;

type FieldsArray = FieldArrayItem[];

//removing for now will expand MailerLite fields later...
interface MailerliteFields {
  id: string;
  name: string;
  key: string;
}

interface MailerliteGroups {
  id: string;
  name: string;
}

interface ConfigureMailerLiteProps {
  setSelectedForm: any;
  selectedForm: any;
  setPage: any;
  token: string;
  domain: Domain | null;
  selectedSite: Site | null;
}

interface SelectFormProps {
  setSelectedForm: any;
  selectedForm: any;
  setPage: any;
  token: string;
  domain: Domain | null;
  selectedSite: Site | null;
}

interface SelectDomainProps {
  setPage: any;
  token: string;
  selectedDomain: any;
  setSelectedDomain: any;
  selectedSite: Site | null;
}

interface ViewWebhookProps {
  setPage: any;
  token: string;
  selectedSite: Site | null;
}

interface WebhookProps {
  id: string;
  triggerType: string;
  siteId: string;
  workspaceId: string;
  filter: { formId: string, formName: string,};
  lastTriggered: Date;
  createdOn: Date;
  url: string;
}

interface LoginProps {
  setPage: any;
  token: any;
  setToken: any;
}
interface Field {
  [key: string]: {
    displayName: string;
    type: string;
    placeholder: string;
    userVisible: boolean;
  };
}

interface Form {
  id: string;
  displayName: string;
  siteId: string;
  workspaceId?: string;
  siteDomainId?: string;
  pageId?: string;
  pageName?: string;
  responseSettings: {
    sendEmailConfirmation: boolean;
    redirectUrl: string;
    redirectMethod: string;
    redirectAction?: string;
  };
  fields: Field[];
  createdOn: string;
  lastUpdated: string;
}

interface Domain {
  id: string;
  url: string;
}

const MainPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [token, setToken] = useState<string>("");
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Get authorization, if already authorized then set setPage to 1
      const auth = localStorage.getItem("devflow_token");

      const getSiteInfo = async () => {
        const siteInfo = await webflow.getSiteInfo();
        const siteId = siteInfo.siteId;
        setSelectedSite({
          id: siteId,
          shortName: siteInfo.shortName,
        });
      };
      setPage(auth ? 1 : 0);
      setToken(auth || "");
      getSiteInfo();
    }
  }, []);

  // If token is undefined send user to Login Page
  if (!token) {
    return <Login setPage={setPage} token={token} setToken={setToken} />;
  }

  // This function determines which content appears on the page
  switch (page) {
    case 0:
      return <Login setPage={setPage} token={token} setToken={setToken} />;
    case 1:
      return (
        <SelectDomain
          setPage={setPage}
          token={token}
          selectedSite={selectedSite}
          selectedDomain={selectedDomain}
          setSelectedDomain={setSelectedDomain}
        />
      );
    case 2:
      return (
        <SelectForm
          selectedForm={selectedForm}
          setSelectedForm={setSelectedForm}
          setPage={setPage}
          domain={selectedDomain}
          token={token}
          selectedSite={selectedSite}
        />
      );
    case 3:
      return (
        <ConfigureMailerlite
          selectedForm={selectedForm}
          setSelectedForm={setSelectedForm}
          setPage={setPage}
          domain={selectedDomain}
          token={token}
          selectedSite={selectedSite}
        />
      );
    case 4:
      return (
        <ViewWebhooks
          setPage={setPage}
          token={token}
          selectedSite={selectedSite}
        />
      );
  }
};

const Login: React.FC<LoginProps> = ({
  setPage,
  token,
  setToken,
}: {
  setPage: any;
  token: any;
  setToken: any;
}) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen py-2 bg-wf-gray text-wf-lightgray"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center space-y-8">
        <div>
          <h1 className="mt-3 text-4xl font-bold text-gray-200 mb-2">
            Connect Mailerlite to Webflow
          </h1>
          <h2 className="mt-3 text-lg text-gray-400 mb-2">
            by Lunch Pail Labs
          </h2>
          <div className="mt-8 space-y-6">
            <input
              type="text"
              onBlur={(e) => {
                setToken(e.target.value);
              }}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Enter your auth token"
            />
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer border-gray-700"
              onClick={() => {
                localStorage.setItem("devflow_token", token);
                setPage(1);
              }}
            >
              Authenticate
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

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
              Select a form on domain, {domain?.url}, to connect to Mailerlite
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
                    <option key={webflowField.id} value={webflowField.displayName}>
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

export default MainPage;
