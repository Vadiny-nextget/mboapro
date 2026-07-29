export interface ProfilesStoreShape {
  pending: boolean;
  value: ProfilesSuccessPayload;
  errors: string[];
}

export interface Profile {
  id: string;
  lastname: string;
  firstname: string;
  email: string;
  phone: string;
  gender: string;
  picture?: string;
  userlanguage: string;
  theme: string;
  role: string;
  website: string;
  github: string;
  linkedin: string;
  notify_email: boolean;
  notify_phone: boolean;
  notify_in_app: boolean;
}

interface ProfilesSuccessPayload {
  profiles?: Profile[];
  token: string;
  message: string;
  message_email?: string;
}