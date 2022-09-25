import HomeIcon from '@mui/icons-material/Home';
import GroupsIcon from '@mui/icons-material/Groups';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StorageIcon from '@mui/icons-material/Storage';
import ChairIcon from '@mui/icons-material/Chair';
import BarChartIcon from '@mui/icons-material/BarChart';

const menuItems = [
  {
    heading: '',
    items: [
      {
        name: 'Home',
        icon: HomeIcon,
        link: '/'
      },
      {
        name: 'User Management',
        icon: GroupsIcon,
        items: [
          {
            name: 'Users',
            link: 'users/list'
          },
          {
            name: 'Roles',
            link: 'roles/list'
          }
        ]
      },
      {
        name: 'Contacts',
        icon: PermContactCalendarIcon,
        items: [
          {
            name: 'Suppliers',
            link: 'suppliers/list'
          },
          {
            name: 'Customers',
            link: 'customers/list'
          },
          {
            name: 'Shops',
            link: 'shops/list'
          },
          {
            name: 'Stores',
            link: 'stores/list'
          }
        ]
      },
      {
        name: 'Products',
        icon: ChairIcon,
        items: [
          {
            name: 'Products',
            link: 'products/list'
          },
          {
            name: 'Categories',
            link: 'categories/list'
          }
        ]
      },
      {
        name: 'Purchases',
        icon: ArrowCircleUpIcon,
        link: '/purchases/list'
      },
      {
        name: 'Sells',
        icon: ArrowCircleDownIcon,
        link: '/sells/list'
      },
      {
        name: 'Stock Transfer',
        icon: LocalShippingIcon,
        link: '/transfers/list'
      },
      {
        name: 'Stock Adjustment',
        icon: StorageIcon,
        link: '/adjustments/list'
      },
      {
        name: 'Report',
        icon: BarChartIcon,
        items: [
          {
            name: 'Reports',
            link: 'reports/list'
          }
        ]
      }
    ]
  }
];

export default menuItems;
