import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from 'login';
import Container from './Container';
import Footer from 'login/components/Footer';
import UserProvideer from 'shared/providers/firebaseAuthProvider';
import PrivateRoute from './PrivateRoute';
import Todos from './Todos';

const App = () => {
  return (
    <UserProvideer>
      <Container>
        <Switch>
          <Route exact path='/'>
            <Login />
            <Footer />
          </Route>
          <PrivateRoute path='/todos' component={Todos} />
        </Switch>
      </Container>
    </UserProvideer>
  );
};

export default App;
