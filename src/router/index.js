import Authenticated from 'src/components/Authenticated';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';

import customRoutes from './custom';
import authRoutes from './auth';

const router = [
  // Custom Layout
  {
    path: '/',
    element: (
      <Authenticated>
        <ExtendedSidebarLayout />
      </Authenticated>
    ),
    children: [
      {
        path: '',
        children: customRoutes
      }
    ]
  },
  {
    path: '',
    children: authRoutes
  }
];

export default router;
