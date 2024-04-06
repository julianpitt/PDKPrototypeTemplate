import * as React from 'react';
import { Route, Routes as ReactRoutes } from 'react-router-dom';
import Home from '../../pages/List';

const Routes: React.FC = () => {
  return (
    <ReactRoutes>
      <Route key={0} path="/" element={<Home />} />
    </ReactRoutes>
  );
};

export default Routes;
