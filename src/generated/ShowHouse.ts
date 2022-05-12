/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ShowHouse
// ====================================================

export interface ShowHouse_house {
  __typename: "House";
  id: string;
  userId: string;
  longitude: number | null;
  latitude: number | null;
  publicId: string;
  bedrooms: number;
  address: string;
  image: string;
}

export interface ShowHouse {
  house: ShowHouse_house | null;
}

export interface ShowHouseVariables {
  id: string;
}
