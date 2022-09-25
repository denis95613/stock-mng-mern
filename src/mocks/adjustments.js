import { mock } from 'src/utils/axios';

let adjustments = [
  {
    id: 1,
    date: '2020.2.2',
    referenceNo: 1,
    shop: {
      id: 1,
      name: 'Ebay'
    },
    type: 'done',
    amount: 300,
    recovered: 33,
    reason: 'reason',
    addedBy: {
      id: 4,
      name: 'Modesta Sauer',
      avatar: '/static/images/avatars/4.jpg'
    }
  },
  {
    id: 2,
    date: '2020.3.9',
    referenceNo: 21,
    shop: {
      id: 2,
      name: 'Triger shop'
    },
    type: '',
    amount: 120,
    recovered: 34,
    reason: 'reason',
    addedBy: {
      id: 4,
      name: 'Modesta Sauer',
      avatar: '/static/images/avatars/4.jpg'
    }
  },
  {
    id: 3,
    date: '2020.6.3',
    referenceNo: 3,
    shop: {
      id: 1,
      name: 'eshop'
    },
    type: '',
    amount: 123,
    recovered: 32,
    reason: 'reason',
    addedBy: {
      id: 4,
      name: 'Modesta Sauer',
      avatar: '/static/images/avatars/4.jpg'
    }
  }
];

mock.onGet('/api/adjustments').reply(() => {
  return [200, { adjustments }];
});

mock.onGet('/api/adjustment').reply((config) => {
  const { adjustmentId } = config.params;
  const adjustment = adjustments.find(
    (_adjustment) => _adjustment.id === adjustmentId
  );

  return [200, { adjustment }];
});
