import React from "react";

class Container {
  state: any = {};
}

interface ContainerConstructor {
  new (): Container;
}

interface Constructor<C extends Container> {
  new (): C;
}

type Lala<T> = Record<string, Container>;

type SubscribeParam<T, P extends number> = { [P in keyof T]: Constructor<T[P] & Container> };

type SubscribeProp<T> = { [P in keyof T]: T[P] };

function initiate<T extends Container>(c: Constructor<T>): T {
  return undefined;
}

function subscribe<T>(
  param: SubscribeParam<T, number>,
): <P>(component: React.ComponentType<P & SubscribeProp<T>>) => React.ComponentType<P> {
  let p = {} as SubscribeProp<T>;
  for (const k in param) {
    if (param[k] instanceof Container) {
    } else {
      p[k] = initiate(param[k] as Constructor<any>);
    }
  }
  return (Comp: React.ComponentType<SubscribeProp<T>>) =>
    function<P>(props) {
      return <Comp {...props} {...p} />;
    };
}

// Promise.all()

class TestContainer extends Container {
  state = {
    a: "Lala",
  };
}
class Nasal {}

const decorate = subscribe({
  test: TestContainer,
});

decorate<{}>(props => {
  return <div title={props.test.state.a} />;
});
