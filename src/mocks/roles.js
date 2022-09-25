import { mock } from 'src/utils/axios';

let roles = [
  {
    id: '1',
    name: 'Admin',
    description: 'Administrator'
  },
  {
    id: '2',
    name: 'Cashier',
    description: 'Cashier'
  }
];

mock.onGet('/api/roles').reply(() => {
  return [200, { roles }];
});

mock.onGet('/api/role').reply((config) => {
  const { roleId } = config.params;
  const role = roles.find((_role) => _role.id === roleId);

  return [200, { role }];
});
