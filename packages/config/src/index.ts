export enum Cookie {
  Session = "snaily-cad-session",
  ActiveOfficer = "snaily-cad-active-officer",
  ActiveDeputy = "snaily-cad-active-ems-fd-deputy",
}

export type AllowedFileExtension = typeof allowedFileExtensions[number];
export const allowedFileExtensions = ["image/png", "image/gif", "image/jpeg", "image/jpg"] as const;

export * from "./socket-events";
