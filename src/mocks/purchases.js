import { mock } from 'src/utils/axios';

let purchases = [
  {
    id: '1',
    date: '2020..3.4',
    referenceNo: 'R001',
    location: {
      id: 1,
      name: 'ebay'
    },
    supplier: {
      id: 1,
      name: 'Madeline Pagac',
      contactID: 'C001'
    },
    purchaseStatus: 'purchase state',
    paymentStatus: 'paid',
    addedBy: {
      id: 2,
      name: 'Madeline Pagac',
      avatar: '/static/images/avatars/2.jpg'
    }
  },
  {
    id: '2',
    date: '2021..9.5',
    referenceNo: 'R002',
    location: {
      id: 1,
      name: 'ebay'
    },
    supplier: {
      id: 2,
      name: 'DDD Pagac',
      contactID: 'C002'
    },
    purchaseStatus: 'purchase state',
    paymentStatus: 'paid',
    addedBy: {
      id: 2,
      name: 'Madeline Pagac',
      avatar: '/static/images/avatars/2.jpg'
    }
  },
  {
    id: '3',
    date: '2021..2.1',
    referenceNo: 'R003',
    location: {
      id: 3,
      name: 'eshop'
    },
    supplier: {
      id: 3,
      name: 'Wade sdfe',
      contactID: 'C002'
    },
    purchaseStatus: 'purchase state',
    paymentStatus: 'paid',
    addedBy: {
      id: 4,
      name: 'Modesta Sauer',
      avatar: '/static/images/avatars/4.jpg'
    }
  }
];

mock.onGet('/api/purchases').reply(() => {
  return [200, { purchases }];
});

mock.onGet('/api/purchase').reply((config) => {
  const { purchaseId } = config.params;
  const purchase = purchases.find((_purchase) => _purchase.id === purchaseId);

  return [200, { purchase }];
});
