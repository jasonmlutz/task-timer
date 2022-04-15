import React from 'react';
import { useRoutes } from 'react-router-dom';

import Landing from './Landing';
import NewUserForm from './Users/NewUserForm';
import NewSessionForm from './Sessions/NewSessionForm';
import Profile from './Users/Profile';

function App() {
  const routes = useRoutes([
    { path: '/', element: <Landing /> },
    { path: 'register/', element: <NewUserForm /> },
    { path: 'login/', element: <NewSessionForm /> },
    { path: 'user/:user_id/', element: <Profile /> },
  ]);
  return (
    <div>{routes}</div>
  );
}

export default App;
