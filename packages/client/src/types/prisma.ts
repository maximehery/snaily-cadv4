/* eslint-disable capitalized-comments */
/**
 * Model cad
 */

import { FullDeputy, FullOfficer } from "state/dispatchState";

export type cad = {
  id: string;
  name: string;
  ownerId: string;
  areaOfPlay: string | null;
  steamApiKey: string | null;
  registrationCode: string | null;
  discordWebhookURL: string | null;
  whitelisted: boolean;
  towWhitelisted: boolean;
  disabledFeatures: Feature[];
} & { miscCadSettings: MiscCadSettings };

/**
 * Model MiscCadSettings
 */

export type MiscCadSettings = {
  id: string;
  heightPrefix: string;
  weightPrefix: string;
  maxCitizensPerUser: number | null;
  maxPlateLength: number;
  maxBusinessesPerCitizen: number | null;
  pairedUnitSymbol: string | null;
  callsignTemplate: string | null;
  signal100Enabled: boolean;
};

/**
 * Model User
 */

export type User = {
  id: string;
  username: string;
  rank: Rank;
  isLeo: boolean;
  isSupervisor: boolean;
  isEmsFd: boolean;
  isDispatch: boolean;
  isTow: boolean;
  banned: boolean;
  banReason: boolean | null;
  avatarUrl: string | null;
  steamId: string | null;
  whitelistStatus: WhitelistStatus;
  isDarkTheme: boolean;
};

/**
 * Model Citizen
 */

export type Citizen = {
  id: string;
  userId: string;
  name: string;
  surname: string;
  dateOfBirth: Date;
  genderId: string;
  gender: Value<"GENDER">;
  ethnicityId: string;
  ethnicity: Value<"ETHNICITY">;
  hairColor: string;
  eyeColor: string;
  address: string;
  height: string;
  weight: string;
  driversLicenseId: string | null;
  driversLicense: Value<"LICENSE"> | null;
  weaponLicenseId: string | null;
  weaponLicense: Value<"LICENSE"> | null;
  pilotLicenseId: string | null;
  pilotLicense: Value<"LICENSE"> | null;
  ccwId: string | null;
  ccw: Value<"LICENSE"> | null;
  imageId: string | null;
  note: string | null;
  dead: boolean | null;
  dateOfDead: Date | null;
  dlCategory: DriversLicenseCategoryValue[];
  dlPilotCategory: DriversLicenseCategoryValue[];
  phoneNumber: string | null;
};

/**
 * Model RegisteredVehicle
 */

export type RegisteredVehicle = {
  id: string;
  userId: string;
  citizenId: string;
  plate: string;
  vinNumber: string;
  modelId: string;
  model: Value<"VEHICLE">;
  color: string;
  createdAt: Date;
  registrationStatus: Value<"LICENSE">;
  registrationStatusId: string;
  insuranceStatus: string;
  reportedStolen: boolean;
};

/**
 * Model Weapon
 */

export type Weapon = {
  id: string;
  userId: string;
  citizenId: string;
  serialNumber: string;
  registrationStatus: Value<"LICENSE">;
  registrationStatusId: string;
  model: Value<"WEAPON">;
  modelId: string;
};

/**
 * Model MedicalRecord
 */

export type MedicalRecord = {
  id: string;
  userId: string;
  citizenId: string;
  type: string;
  description: string;
};

/**
 * Model Value
 */

export type Value<Type extends ValueType = ValueType> = {
  id: string;
  type: Type;
  value: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
  position: number | null;
};

/**
 * Model BleeterPost
 */

export type BleeterPost = {
  id: string;
  userId: string;
  title: string;
  body: string;
  imageId: string | null;
};

/**
 * Model TowCall
 */

export type TowCall = {
  id: string;
  createdAt: Date;
  userId: string;
  assignedUnitId: string | null;
  location: string;
  description: string;
  creatorId: string;
};

/**
 * Model TaxiCall
 */

export type TaxiCall = {
  id: string;
  createdAt: Date;
  userId: string;
  assignedUnitId: string | null;
  location: string;
  description: string;
  creatorId: string;
};

/**
 * Model Business
 */

export type Business = {
  id: string;
  userId: string;
  citizenId: string;
  name: string;
  whitelisted: boolean;
  address: string;
  createdAt: Date;
};

/**
 * Model Employee
 */

export type Employee = {
  id: string;
  userId: string;
  citizenId: string;
  businessId: string;
  roleId: string;
  employeeOfTheMonth: boolean;
  canCreatePosts: boolean;
  whitelistStatus: WhitelistStatus;
};

/**
 * Model BusinessPost
 */

export type BusinessPost = {
  id: string;
  userId: string;
  employeeId: string;
  businessId: string;
  title: string;
  body: string;
};

/**
 * Model EmployeeValue
 */

export type EmployeeValue = {
  id: string;
  valueId: string;
  as: EmployeeAsEnum;
  value: Value<"BUSINESS_ROLE">;
};

/**
 * Model Officer
 */

export type Officer = {
  id: string;
  name: string;
  departmentId: string;
  divisionId: string;
  callsign: string;
  callsign2: string;
  rankId: string;
  statusId: string | null;
  status: StatusValue | null;
  suspended: boolean;
  citizenId: string | null;
  userId: string;
  call911Id: string | null;
  badgeNumber: number | null;
  imageId: string | null;
};

/**
 * Model OfficerLog
 */

export type OfficerLog = {
  id: string;
  startedAt: Date;
  endedAt: Date | null;
  userId: string;
  officerId: string;
};

/**
 * Model StatusValue
 */

export type StatusValue = {
  id: string;
  valueId: string;
  value: Value<"CODES_10">;
  shouldDo: ShouldDoType;
  position: number | null;
  whatPages: WhatPages[];
  departmentId: string;
  color?: string;
};

/**
 * Model Call911
 */

export type Call911 = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  assignedUnits: AssignedUnit[];
  location: string;
  description: string;
  name: string;
};

/**
 * Model Bolo
 */

export type Bolo = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  type: BoloType;
  description: string;
  plate: string | null;
  name: string | null;
  color: string | null;
  officerId: string | null;
};

/**
 * Model PenalCode
 */

export type PenalCode = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  description: string;
};

/**
 * Model Record
 */

export type Record = {
  id: string;
  type: RecordType;
  citizenId: string;
  officerId: string;
  createdAt: Date;
  postal: string;
  notes: string | null;
};

/**
 * Model DivisionValue
 */

export type DivisionValue = {
  id: string;
  valueId: string;
  value: Value<"DIVISION">;
  departmentId: string | null;
  department: Value<"DEPARTMENT">;
  callsign: string | null;
};

/**
 * Model DepartmentValue
 */

export type DepartmentValue = {
  id: string;
  valueId: string;
  value: Value<"DEPARTMENT">;
  callsign: string | null;
};

/**
 * Model EmsFdDeputy
 */

export type EmsFdDeputy = {
  id: string;
  name: string;
  departmentId: string;
  callsign: string;
  callsign2: string;
  divisionId: string;
  rankId: string | null;
  status: StatusValue | null;
  statusId: string | null;
  suspended: boolean;
  badgeNumber: number | null;
  citizenId: string | null;
  userId: string;
  imageId: string | null;
};

/**
 * Model Call911Event
 */

export type Call911Event = {
  id: string;
  createdAt: Date;
  call911Id: string;
  description: string;
};

/**
 * Model TruckLog
 */

export type TruckLog = {
  id: string;
  citizenId: string | null;
  userId: string;
  vehicleId: string | null;
  startedAt: string;
  endedAt: string;
};

/**
 * Model Warrant
 */

export type Warrant = {
  id: string;
  citizenId: string;
  officerId: string;
  description: string;
  status: WarrantStatus;
  createdAt: Date;
};

/**
 * Model DriversLicenseCategoryValue
 */

export type DriversLicenseCategoryValue = {
  id: string;
  value: Value<"DRIVERSLICENSE_CATEGORY">;
  valueId: string;
  type: DriversLicenseCategoryType;
};

/**
 * Model AssignedUnit
 */

export type AssignedUnit = {
  id: string;
  officerId: string | null;
  emsFdDeputyId: string | null;
  call911Id: string | null;
  unit: FullDeputy | FullOfficer;
};

/**
 * Enums
 */

// Based on
// https://github.com/microsoft/TypeScript/issues/3192#issuecomment-261720275

export const rank = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export type Rank = typeof rank[keyof typeof rank];

export const whitelistStatus = {
  ACCEPTED: "ACCEPTED",
  PENDING: "PENDING",
  DECLINED: "DECLINED",
} as const;

export type WhitelistStatus = typeof whitelistStatus[keyof typeof whitelistStatus];

export const valueType = {
  LICENSE: "LICENSE",
  GENDER: "GENDER",
  ETHNICITY: "ETHNICITY",
  VEHICLE: "VEHICLE",
  WEAPON: "WEAPON",
  BLOOD_GROUP: "BLOOD_GROUP",
  BUSINESS_ROLE: "BUSINESS_ROLE",
  CODES_10: "CODES_10",
  PENAL_CODE: "PENAL_CODE",
  DEPARTMENT: "DEPARTMENT",
  OFFICER_RANK: "OFFICER_RANK",
  DIVISION: "DIVISION",
  DRIVERSLICENSE_CATEGORY: "DRIVERSLICENSE_CATEGORY",
} as const;

export type ValueType = typeof valueType[keyof typeof valueType];

export const feature = {
  BLEETER: "BLEETER",
  TOW: "TOW",
  TAXI: "TAXI",
  COURTHOUSE: "COURTHOUSE",
  TRUCK_LOGS: "TRUCK_LOGS",
  AOP: "AOP",
  BUSINESS: "BUSINESS",
} as const;

export type Feature = typeof feature[keyof typeof feature];

export const EmployeeAsEnum = {
  OWNER: "OWNER",
  MANAGER: "MANAGER",
  EMPLOYEE: "EMPLOYEE",
} as const;

export type EmployeeAsEnum = typeof EmployeeAsEnum[keyof typeof EmployeeAsEnum];

export const ShouldDoType = {
  SET_OFF_DUTY: "SET_OFF_DUTY",
  SET_ON_DUTY: "SET_ON_DUTY",
  SET_ASSIGNED: "SET_ASSIGNED",
  SET_STATUS: "SET_STATUS",
  PANIC_BUTTON: "PANIC_BUTTON",
} as const;

export type ShouldDoType = typeof ShouldDoType[keyof typeof ShouldDoType];

export const WhatPages = {
  DISPATCH: "DISPATCH",
  EMS_FD: "EMS_FD",
  LEO: "LEO",
} as const;

export type WhatPages = typeof WhatPages[keyof typeof WhatPages];

export const BoloType = {
  VEHICLE: "VEHICLE",
  PERSON: "PERSON",
  OTHER: "OTHER",
} as const;

export type BoloType = typeof BoloType[keyof typeof BoloType];

export const StatusEnum = {
  ON_DUTY: "ON_DUTY",
  OFF_DUTY: "OFF_DUTY",
} as const;

export type StatusEnum = typeof StatusEnum[keyof typeof StatusEnum];

export const RecordType = {
  ARREST_REPORT: "ARREST_REPORT",
  TICKET: "TICKET",
  WRITTEN_WARNING: "WRITTEN_WARNING",
} as const;

export type RecordType = typeof RecordType[keyof typeof RecordType];

export const WarrantStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
} as const;

export type WarrantStatus = typeof WarrantStatus[keyof typeof WarrantStatus];

export const DriversLicenseCategoryType = {
  AUTOMOTIVE: "AUTOMOTIVE",
  AVIATION: "AVIATION",
  WATER: "WATER",
} as const;

export type DriversLicenseCategoryType =
  typeof DriversLicenseCategoryType[keyof typeof DriversLicenseCategoryType];
