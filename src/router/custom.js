import { Suspense, lazy } from 'react';
// import { Navigate } from 'react-router-dom';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

const Home = Loader(lazy(() => import('src/pages/home')));
const Roles = Loader(lazy(() => import('src/pages/roles')));
const Users = Loader(lazy(() => import('src/pages/users')));
// const User = Loader(lazy(() => import('src/pages/users/single')));
const Products = Loader(lazy(() => import('src/pages/products')));
const SingleProduct = Loader(lazy(() => import('src/pages/products/single')));
const Product = Loader(lazy(() => import('src/pages/products/create')));
const Categories = Loader(lazy(() => import('src/pages/categories')));
const Customers = Loader(lazy(() => import('src/pages/customers')));
const Suppliers = Loader(lazy(() => import('src/pages/suppliers')));
const Shops = Loader(lazy(() => import('src/pages/shops')));
const Shop = Loader(lazy(() => import('src/pages/shops/single')));
const Stores = Loader(lazy(() => import('src/pages/stores')));
const Sells = Loader(lazy(() => import('src/pages/sells')));
const Sell = Loader(lazy(() => import('src/pages/sells/single')));
const Purchases = Loader(lazy(() => import('src/pages/purchases')));
const Purchase = Loader(lazy(() => import('src/pages/purchases/single')));
const Transfers = Loader(lazy(() => import('src/pages/transfers')));
const Adjustments = Loader(lazy(() => import('src/pages/adjustments')));
const Recepits = Loader(lazy(() => import('src/pages/recepits')));
const Notifications = Loader(lazy(() => import('src/pages/notifications')));

const customRoutes = [
  {
    path: '',
    element: <Home />
  },
  {
    path: 'users',
    children: [
      {
        path: 'list',
        element: <Users />
      }
      // {
      //   path: 'single',
      //   children: [
      //     {
      //       path: ':userId',
      //       element: <User />
      //     }
      //   ]
      // }
    ]
  },
  {
    path: 'roles',
    children: [
      {
        path: 'list',
        element: <Roles />
      }
    ]
  },
  {
    path: 'customers',
    children: [
      {
        path: 'list',
        element: <Customers />
      }
    ]
  },
  {
    path: 'suppliers',
    children: [
      {
        path: 'list',
        element: <Suppliers />
      }
    ]
  },
  {
    path: 'shops',
    children: [
      {
        path: 'list',
        element: <Shops />
      },
      {
        path: 'single',
        element: <Shop />
      }
    ]
  },
  {
    path: 'stores',
    children: [
      {
        path: 'list',
        element: <Stores />
      }
    ]
  },
  {
    path: 'products',
    children: [
      {
        path: 'list',
        element: <Products />
      },
      {
        path: 'single',
        children: [
          {
            path: ':productId',
            element: <SingleProduct />
          }
        ]
      },
      {
        path: 'create',
        element: <Product />
      },
      {
        path: 'edit',
        element: <Product />
      }
    ]
  },
  {
    path: 'categories',
    children: [
      {
        path: 'list',
        element: <Categories />
      }
    ]
  },
  {
    path: 'recepits',
    children: [
      {
        path: 'list',
        element: <Recepits />
      }
    ]
  },
  {
    path: 'sells',
    children: [
      {
        path: 'list',
        element: <Sells />
      },
      {
        path: 'single',
        element: <Sell />
      }
    ]
  },
  {
    path: 'purchases',
    children: [
      {
        path: 'list',
        element: <Purchases />
      },
      {
        path: 'single',
        element: <Purchase />
      }
    ]
  },
  {
    path: 'transfers',
    children: [
      {
        path: 'list',
        element: <Transfers />
      }
    ]
  },
  {
    path: 'adjustments',
    children: [
      {
        path: 'list',
        element: <Adjustments />
      }
    ]
  },
  {
    path: 'notifications',
    children: [
      {
        path: 'list',
        element: <Notifications />
      }
    ]
  }
];

export default customRoutes;
