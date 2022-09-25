import { mock } from 'src/utils/axios';

let shops = [
  {
    id: '1',
    contactID: 'Sh001',
    name: 'Ebay',
    avatar: '/static/images/avatars/2.jpg',
    addedOn: '2020.9.4',
    mobile: '234555',
    location: 'New York'
  },
  {
    id: '2',
    contactID: 'Sh002',
    name: 'Triger Shop',
    avatar: '/static/images/avatars/1.jpg',
    addedOn: '2019.7.4',
    mobile: '75677',
    location: 'Lisbon'
  },
  {
    id: '3',
    contactID: 'Sh003',
    name: 'Eshop',
    avatar: '/static/images/avatars/3.jpg',
    addedOn: '2018.4.2',
    mobile: '756545',
    location: 'Hong Kong'
  }
];

mock.onGet('/api/shops').reply(() => {
  return [200, { shops }];
});

mock.onGet('/api/shop').reply((config) => {
  const { shopId } = config.params;
  const shop = shops.find((_shop) => _shop.id === shopId);

  return [200, { shop }];
});
