import { mock } from 'src/utils/axios';

let categories = [
  {
    id: '1',
    parent: 'food',
    name: 'cake',
    description: 'swwet cake'
  },
  {
    id: '2',
    parent: 'food',
    name: 'alcohol',
    description: 'alcohol desc'
  },
  {
    id: '2',
    parent: 'clothes',
    name: 'dress',
    description: 'woman'
  },
  {
    id: '2',
    parent: 'clothes',
    name: 'cap',
    description: 'man'
  }
];

mock.onGet('/api/categories').reply(() => {
  return [200, { categories }];
});

mock.onGet('/api/category').reply((config) => {
  const { categoryId } = config.params;
  const category = categories.find((_category) => _category.id === categoryId);

  return [200, { category }];
});
