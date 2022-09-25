import { Suspense, lazy } from 'react';

import SuspenseLoader from 'src/components/SuspenseLoader';
import Guest from 'src/components/Guest';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Auth
const Login = Loader(lazy(() => import('src/pages/auth/login')));
const Register = Loader(lazy(() => import('src/pages/auth/register')));

const RecoverPassword = Loader(
  lazy(() => import('src/pages/auth/recoverPassword'))
);

const authRoutes = [
  {
    path: 'login',
    element: (
      <Guest>
        <Login />
      </Guest>
    )
  },
  {
    path: 'register',
    element: (
      <Guest>
        <Register />
      </Guest>
    )
  },
  {
    path: 'recover-password',
    element: <RecoverPassword />
  }
];

export default authRoutes;
