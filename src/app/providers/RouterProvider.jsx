import { HashRouter } from 'react-router-dom';

export const RouterProvider = ({ children }) => {
  return <HashRouter>{children}</HashRouter>;
}; 