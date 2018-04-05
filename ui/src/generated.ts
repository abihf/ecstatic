/* tslint:disable */
//  This file was automatically generated and should not be edited.

export interface BasiUserInfoQuery {
  viewer:  {
    __typename: "Viewer",
    // return current user
    me:  {
      __typename: "User",
      full_name: string | null,
    },
  } | null,
};
