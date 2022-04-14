import React from 'react';
import { useRoutes } from 'react-router-dom';

import NewUserForm from './Users/NewUserForm';
import NewSessionForm from './Sessions/NewSessionForm';

function App() {
  const routes = useRoutes([
    { path: '/register', element: <NewUserForm /> },
    { path: '/login', element: <NewSessionForm /> },
  ]);
  return (
    <div>{routes}</div>
  );
}

export default App;
