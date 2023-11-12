// ==== Login types and Navigation Props ====

export interface LoginProps {
 setPage: any;
 token: any;
}

//not used in this demo but will incorporate a version for API keys later
export interface ApiKeyProps {
  setPage: any;
  token: any;
  setToken: any;
 }
 

export interface NavigateProps {
  setPage: any;
 }


// ==== Site Types ====
export interface Site {
 id: string;
 shortName: string;
}

// ==== Form Types ====

export interface WebflowFormFields {
 displayName: string;
 id: string;
}

export interface FieldObject {
 displayName: string;
 placeholder: string;
 type: string;
 userVisible: boolean;
}

export type FieldArrayItem = Array<string | FieldObject>;

export type FieldsArray = FieldArrayItem[];

export interface SelectFormProps {
 setSelectedForm: any;
 selectedForm: any;
 setPage: any;
 token: string;
 selectedSite: Site | null;
}

export interface Field {
 [key: string]: {
   displayName: string;
   type: string;
   placeholder: string;
   userVisible: boolean;
 };
}

export interface Form {
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



// ==== MailerLiteTypes ====
//removing for now will expand MailerLite fields later...
export interface MailerliteFields {
 id: string;
 name: string;
 key: string;
}

export interface MailerliteGroups {
 id: string;
 name: string;
}

export interface ConfigureMailerLiteProps {
 setSelectedForm: any;
 selectedForm: any;
 setPage: any;
 token: string;
 selectedSite: Site | null;
}


// ==== Webhook types ====
export interface ViewWebhookProps {
 setPage: any;
 token: string;
 selectedSite: Site | null;
}

export interface WebhookProps {
 id: string;
 triggerType: string;
 siteId: string;
 workspaceId: string;
 filter: { pageId: string, pageName: string, formName: string,};
 lastTriggered: Date;
 createdOn: Date;
 url: string;
}
