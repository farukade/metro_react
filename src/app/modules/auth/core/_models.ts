export interface LoginResponse {
  success: boolean;
  message: string;
  data: UserModel & AuthModel;
}
export interface TransactionsResponse {
  success: boolean;
  message: string;
  data: {
    result: TransactionModel[];
    totalSpent: number;
    totalSpentPrevious: number;
    transactionCount: number;
    transactionCountPrevious: number;
    percentageDifference: number;
    difference: number;
  };
}

export interface TransactionResponse {
  success: boolean;
  message: string;
  data: TransactionModel;
}

export interface AuthModel {
  api_token: string;
  refreshToken?: string;
}

export interface UserAddressModel {
  addressLine: string;
  city: string;
  state: string;
  postCode: string;
}

export interface UserCommunicationModel {
  email: boolean;
  sms: boolean;
  phone: boolean;
}

export interface UserEmailSettingsModel {
  emailNotification?: boolean;
  sendCopyToPersonalEmail?: boolean;
  activityRelatesEmail?: {
    youHaveNewNotifications?: boolean;
    youAreSentADirectMessage?: boolean;
    someoneAddsYouAsAsAConnection?: boolean;
    uponNewOrder?: boolean;
    newMembershipApproval?: boolean;
    memberRegistration?: boolean;
  };
  updatesFromKeenthemes?: {
    newsAboutKeenthemesProductsAndFeatureUpdates?: boolean;
    tipsOnGettingMoreOutOfKeen?: boolean;
    thingsYouMissedSindeYouLastLoggedIntoKeen?: boolean;
    newsAboutStartOnPartnerProductsAndOtherServices?: boolean;
    tipsOnStartBusinessProducts?: boolean;
  };
}

export interface UserSocialNetworksModel {
  linkedIn: string;
  facebook: string;
  twitter: string;
  instagram: string;
}

export interface UserModel {
  id: number;
  password: string | undefined;
  email: string;
  unitBalance: number;
  openingBalance: number;
  firstName: string;
  lastName: string;
  occupation?: string;
  totalSpent?: number;
  transactionCount?: number;
  totalSpentPrevious?: number;
  transactionCountPrevious?: number;
  percentageDifference?: number;
  difference?: number;
  phone?: string;
  roles?: Array<number>;
  image?: string;
  language?: "en" | "de" | "es" | "fr" | "ja" | "zh" | "ru";
  timeZone?: string;
  website?: "https://wareeba.com";
  emailSettings?: UserEmailSettingsModel;
  auth?: AuthModel;
  communication?: UserCommunicationModel;
  address?: string;
  socialNetworks?: UserSocialNetworksModel;
  type: string;
  token: string;
  totalUsed: number;
  total: number;
  amountSpent: number;
}

export interface TransactionModel {
  id?: number;
  date: Date;
  description: string;
  amount: number;
  mode: string;
  unitValue: number;
}
