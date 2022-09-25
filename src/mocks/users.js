import { mock } from 'src/utils/axios';

let users = [
  {
    id: '2',
    name: 'Madeline Pagac',
    avatar: '/static/images/avatars/2.jpg',
    email: 'Francis64@gmail.com',
    jobtitle: 'Internal Configuration Planner',
    username: 'Odessa_Goodwin38',
    location: 'Flaviomouth',
    role: 'cashier',
    coverImg: '/static/images/placeholders/covers/2.jpg',
    followers: '375',
    description:
      'Nunc rhoncus dui vel sem. Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci.',
    posts: '11'
  },
  {
    id: '4',
    name: 'Modesta Sauer',
    avatar: '/static/images/avatars/4.jpg',
    email: 'Susan_Wolff@hotmail.com',
    jobtitle: 'Lead Communications Consultant',
    username: 'Sincere46',
    location: 'Josieview',
    role: 'admin',
    coverImg: '/static/images/placeholders/covers/4.jpg',
    followers: '1876',
    description: 'Phasellus in felis. Donec semper sapien a libero. Nam dui.',
    posts: '362'
  },
  {
    id: '6',
    name: 'Wade Heathcote',
    avatar: '/static/images/avatars/1.jpg',
    email: 'Elissa.Ortiz50@hotmail.com',
    jobtitle: 'Regional Markets Assistant',
    username: 'Camylle.Nicolas33',
    location: 'Gaetanoside',
    role: 'cashier',
    coverImg: '/static/images/placeholders/covers/6.jpg',
    followers: '492',
    description:
      'Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.',
    posts: '38'
  }
];

mock.onGet('/api/users').reply(() => {
  return [200, { users }];
});

mock.onGet('/api/user').reply((config) => {
  const { userId } = config.params;
  const user = users.find((_user) => _user.id === userId);

  return [200, { user }];
});
