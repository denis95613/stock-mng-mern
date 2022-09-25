import { mock } from 'src/utils/axios';

let suppliers = [
  {
    id: '1',
    contactID: 'C001',
    businessName: 'Global MS',
    name: 'Madeline Pagac',
    username: 'Odessa_Goodwin38',
    avatar: '/static/images/avatars/2.jpg',
    email: 'Francis64@gmail.com',
    taxNumber: 'Tax001',
    payTerm: 15,
    openingBalance: 20,
    advanceBalance: 13,
    addedOn: '2021.3.2',
    address: 'Flaviomouth',
    mobile: '340495323',
    purchaseDue: 'p due',
    purchaseReturnDue: 'p r due'
  },
  {
    id: '2',
    contactID: 'C002',
    businessName: 'asdfe MS',
    name: 'DDD Pagac',
    username: 'sdfgwef',
    avatar: '/static/images/avatars/4.jpg',
    email: 'Susan_Wolff@gmail.com',
    taxNumber: 'Tax001',
    payTerm: 15,
    openingBalance: 20,
    advanceBalance: 13,
    addedOn: '2021.3.2',
    address: 'Josieview',
    mobile: '7345345',
    purchaseDue: 'p due',
    purchaseReturnDue: 'p r due'
  },
  {
    id: '3',
    contactID: 'C001',
    businessName: 'Global MS',
    name: 'Wade sdfe',
    username: 'sdfgwef',
    avatar: '/static/images/avatars/1.jpg',
    email: 'Ortiz50@gmail.com',
    taxNumber: 'Tax003',
    payTerm: 32,
    openingBalance: 22,
    advanceBalance: 54,
    addedOn: '2017.7.9',
    address: 'Gaetanoside',
    mobile: '53774534',
    purchaseDue: 'p due',
    purchaseReturnDue: 'p r due'
  }
];

mock.onGet('/api/suppliers').reply(() => {
  return [200, { suppliers }];
});

mock.onGet('/api/supplier').reply((config) => {
  const { supplierId } = config.params;
  const supplier = suppliers.find((_supplier) => _supplier.id === supplierId);

  return [200, { supplier }];
});
