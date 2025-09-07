export interface JiraConfig {
  url: string;
  email: string;
  token: string;
  created_at: string;
  last_used?: string;
}

export interface JiraUser {
  accountId: string;
  displayName: string;
  emailAddress?: string;
  active: boolean;
}

export interface JiraProject {
  id: string;
  key: string;
  name: string;
  description?: string;
  projectTypeKey: string;
}

export interface JiraIssue {
  id: string;
  key: string;
  summary: string;
  status: string;
  assignee?: string;
  reporter?: string;
  created: string;
  updated: string;
}

export interface JiraConnectionStatus {
  connected: boolean;
  user?: JiraUser;
  lastChecked: Date;
  error?: string;
}

export enum StorageBackend {
  NativeKeyring = "NativeKeyring",
  EncryptedFile = "EncryptedFile", 
  InMemory = "InMemory"
}

export enum SecurityLevel {
  High = "High",
  Medium = "Medium",
  Low = "Low"
}

export interface EnvironmentInfo {
  is_wsl: boolean;
  is_wsl2: boolean;
  has_keyring: boolean;
  has_desktop_environment: boolean;
  storage_backend: StorageBackend;
  security_level: SecurityLevel;
}