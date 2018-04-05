import React from "react";
import { LoadingComponentProps } from "react-loadable";

type LoadingComponent = (
  props: LoadingComponentProps
) => React.ReactElement<LoadingComponentProps>;

export const SimpleLoading: LoadingComponent = props => (
  <span className="loading">Loading ...</span>
);
