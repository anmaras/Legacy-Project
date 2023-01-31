import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Spinner from './Spinner';

const PrivateRoutes = () => {
  const { auth } = useAuth();
  if (auth === undefined) return <Spinner />;
  //If user is logged in render the home page otherwise return to authentication page
  return auth == true ? <Outlet /> : <Navigate to="/auth/signIn" />;
};

export default PrivateRoutes;
