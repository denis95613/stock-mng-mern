import { mock } from 'src/utils/axios';

let customers = [
  {
    id: '1',
    contactID: 'C001',
    businessName: 'Global MS',
    name: 'Mdif Gidf',
    username: 'oiejd',
    avatar: '/static/images/avatars/2.jpg',
    email: 'sdfwe@gmail.com',
    taxNumber: 'Tax007',
    payTerm: 23,
    openingBalance: 5,
    advanceBalance: 17,
    addedOn: '2021.5.7',
    address: 'Fgjidde',
    mobile: '340495323',
    saleDue: 's due',
    saleReturnDue: 'S r due'
  },
  {
    id: '2',
    contactID: 'C002',
    businessName: 'Global Gse',
    name: 'Defg Gdife',
    username: 'hwef',
    avatar: '/static/images/avatars/3.jpg',
    email: 'fgerg@gmail.com',
    taxNumber: 'Tax008',
    payTerm: 23,
    openingBalance: 26,
    advanceBalance: 2,
    addedOn: '2021.8.12',
    address: 'Hfgergf',
    mobile: '545745633',
    saleDue: 's due',
    saleReturnDue: 'S r due'
  },
  {
    id: '3',
    contactID: 'C002',
    businessName: 'Global DEfe',
    name: 'Hdfw Gefe',
    username: 'hdfe',
    avatar: '/static/images/avatars/4.jpg',
    email: 'wefdf@gmail.com',
    taxNumber: 'Tax009',
    payTerm: 33,
    openingBalance: 18,
    advanceBalance: 29,
    addedOn: '2022.4.12',
    address: 'Efdfe',
    mobile: '7456345',
    saleDue: 's due',
    saleReturnDue: 'S r due'
  }
];

mock.onGet('/api/customers').reply(() => {
  return [200, { customers }];
});

mock.onGet('/api/customer').reply((config) => {
  const { customerId } = config.params;
  const customer = customers.find((_customer) => _customer.id === customerId);

  return [200, { customer }];
});
