import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from 'shared/providers/firebaseAuthProvider';
// destructure props to get authentication and select component to serve
const PrivateRoute = ({ component: Component, ...rest }: any) => {
  const currentUser = useAuth()!.currentUser;
  return <Route {...rest} component={() => (currentUser ? <Component /> : <Redirect to='/' />)} />;
};
export default PrivateRoute;
