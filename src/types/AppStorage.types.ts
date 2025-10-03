export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];

export type StorageValue = JsonValue;

export type StoredLoginState = {
  isLoggedIn: boolean;
  sessionToken: string;
  webSocketPath: string;
  loginTime: number;
  timeoutLength: number;
  titanDate: number;
};

export type StoredUserData = {
  user: JsonObject;
  userAuthorizations: Record<string, boolean>;
  userGroups: Array<{ value: string; description: string }>;
};

export type MarketMenu = Record<string, string | number | boolean | null>;

export type StoredAppData = {
  universes: Array<{ id: number; name: string; color: string }>;
  marketMenu: MarketMenu;
  calculationHypotheses: string[];
  selectedHypothesis: string;
};
