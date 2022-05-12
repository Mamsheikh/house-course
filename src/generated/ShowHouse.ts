/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ShowHouse
// ====================================================

export interface ShowHouse_house_nearBy {
  __typename: "House";
  id: string;
  latitude: number;
  longitude: number;
}

export interface ShowHouse_house {
  __typename: "House";
  id: string;
  userId: string;
  longitude: number;
  latitude: number;
  publicId: string;
  bedrooms: number;
  address: string;
  image: string;
  nearBy: ShowHouse_house_nearBy[];
}

export interface ShowHouse {
  house: ShowHouse_house | null;
}

export interface ShowHouseVariables {
  id: string;
}
