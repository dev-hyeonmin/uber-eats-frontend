/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: myRestaruants
// ====================================================

export interface myRestaruants_myRestaurants_restaurants_category {
  __typename: "Category";
  name: string;
}

export interface myRestaruants_myRestaurants_restaurants {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImage: string | null;
  category: myRestaruants_myRestaurants_restaurants_category | null;
  address: string;
  isPromoted: boolean;
}

export interface myRestaruants_myRestaurants {
  __typename: "MyRestaurantsOutput";
  ok: boolean;
  error: string | null;
  restaurants: myRestaruants_myRestaurants_restaurants[];
}

export interface myRestaruants {
  myRestaurants: myRestaruants_myRestaurants;
}
