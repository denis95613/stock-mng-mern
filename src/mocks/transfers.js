import { mock } from 'src/utils/axios';

let transfers = [
  {
    id: 1,
    date: '2020.2.2',
    referenceNo: 1,
    store: {
      id: 1,
      name: 'store1'
    },
    shop: {
      id: 1,
      name: 'Ebay'
    },
    status: 'done',
    amount: 300,
    shippingCharge: 3.4,
    addedBy: {
      id: 4,
      name: 'Modesta Sauer',
      avatar: '/static/images/avatars/4.jpg'
    },
    note: 'note'
  },
  {
    id: 2,
    date: '2021.5.3',
    referenceNo: 2,
    store: {
      id: 2,
      name: 'store2'
    },
    shop: {
      id: 2,
      name: 'Eshop'
    },
    status: 'sending',
    amount: 200,
    shippingCharge: 2,
    addedBy: {
      id: 4,
      name: 'Modesta Sauer',
      avatar: '/static/images/avatars/4.jpg'
    },
    note: 'note'
  },
  {
    id: 3,
    date: '2022.9.7',
    referenceNo: 3,
    store: {
      id: 3,
      name: 'store3'
    },
    shop: {
      id: 3,
      name: 'Triger shop'
    },
    status: 'sending',
    amount: 200,
    shippingCharge: 5,
    addedBy: {
      id: 4,
      name: 'Modesta Sauer',
      avatar: '/static/images/avatars/4.jpg'
    },
    note: 'note'
  }
];

mock.onGet('/api/transfers').reply(() => {
  return [200, { transfers }];
});

mock.onGet('/api/transfer').reply((config) => {
  const { transferId } = config.params;
  const transfer = transfers.find((_transfer) => _transfer.id === transferId);

  return [200, { transfer }];
});
