import React from 'react';
import { useRoutes } from 'react-router-dom';

import NewUserForm from './Users/NewUserForm';

function App() {
  const routes = useRoutes([
    { path: '/', element: <NewUserForm /> },
  ]);
  return (
    <div>{routes}</div>
  );
}

export default App;
