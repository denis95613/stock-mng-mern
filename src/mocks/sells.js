import { mock } from 'src/utils/axios';

let sells = [
  {
    id: 1,
    date: '2020.3.6',
    invoiceNo: 1,
    customer: {
      id: 1,
      name: 'Mdif Gidf'
    },
    contactID: 'S001',
    shop: {
      id: 1,
      name: 'Ebay'
    },
    paymentStatus: 'payment status',
    paymentMethod: 'paypal',
    amount: 300,
    paid: 'paid',
    sellDue: 15,
    sellReturnDue: 24,
    shippingStatus: 'shipping status',
    items: [],
    addedBy: {
      id: 4,
      name: 'Modesta Sauer',
      avatar: '/static/images/avatars/4.jpg'
    },
    sellNote: 'sell note',
    stuffNote: 'stuff note',
    shippingNote: 'shipping note'
  },
  {
    id: 2,
    date: '2020.3.6',
    invoiceNo: 2,
    customer: {
      id: 1,
      name: 'Mdif Gidf'
    },
    contactID: 'S001',
    shop: {
      id: 1,
      name: 'Ebay'
    },
    paymentStatus: 'payment status',
    paymentMethod: 'stripe',
    amount: 300,
    paid: 'paid',
    sellDue: 15,
    sellReturnDue: 24,
    sippingStatus: 'sipping status',
    items: [],
    addedBy: {
      id: 4,
      name: 'Modesta Sauer',
      avatar: '/static/images/avatars/4.jpg'
    },
    sellNote: 'sell note',
    stuffNote: 'stuff note',
    shippingNote: 'shipping note'
  },
  {
    id: 3,
    date: '2020.3.6',
    invoiceNo: 3,
    customer: {
      id: 1,
      name: 'Mdif Gidf'
    },
    contactID: 'S001',
    shop: {
      id: 1,
      name: 'Ebay'
    },
    paymentStatus: 'payment status',
    paymentMethod: 'paypal',
    amount: 300,
    paid: 'paid',
    sellDue: 15,
    sellReturnDue: 24,
    sippingStatus: 'sipping status',
    items: [],
    addedBy: {
      id: 4,
      name: 'Modesta Sauer',
      avatar: '/static/images/avatars/4.jpg'
    },
    sellNote: 'sell note',
    stuffNote: 'stuff note',
    shippingNote: 'shipping note'
  }
];

mock.onGet('/api/sells').reply(() => {
  return [200, { sells }];
});

mock.onGet('/api/sell').reply((config) => {
  const { sellId } = config.params;
  const sell = sells.find((_sell) => _sell.id === sellId);

  return [200, { sell }];
});
