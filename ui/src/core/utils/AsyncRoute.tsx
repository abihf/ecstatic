import React from "react";

import Loadable, { OptionsWithoutRender } from "react-loadable";
import { Route, RouteComponentProps, RouteProps } from "react-router";
import { SimpleLoading } from "./SimpleLoading";

export interface ILoadableRouteProps extends RouteProps {
  loader(): Promise<any>;
}

type Loader<Props> = () => Promise<React.ComponentType<Props>>;
export default function AsyncRoute({ loader, ...props }: ILoadableRouteProps) {
  const opts: OptionsWithoutRender<{}> = {
    loader: loader as Loader<{}>,
    loading: SimpleLoading,
    delay: 1000,
  };
  return <Route {...props} component={Loadable(opts)} />;
}
