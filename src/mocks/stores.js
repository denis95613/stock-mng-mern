import { mock } from 'src/utils/axios';

let stores = [
  {
    id: '1',
    contactID: 'S001',
    name: 'Store1',
    avatar: '/static/images/avatars/2.jpg',
    addedOn: '2020.9.4',
    mobile: '234555',
    location: 'New York'
  },
  {
    id: '2',
    contactID: 'S002',
    name: 'Store2',
    avatar: '/static/images/avatars/1.jpg',
    addedOn: '2019.7.4',
    mobile: '75677',
    location: 'Lisbon'
  },
  {
    id: '3',
    contactID: 'S003',
    name: 'Store3',
    avatar: '/static/images/avatars/3.jpg',
    addedOn: '2018.4.2',
    mobile: '756545',
    location: 'Hong Kong'
  }
];

mock.onGet('/api/stores').reply(() => {
  return [200, { stores }];
});

mock.onGet('/api/store').reply((config) => {
  const { storeId } = config.params;
  const store = stores.find((_store) => _store.id === storeId);

  return [200, { store }];
});
