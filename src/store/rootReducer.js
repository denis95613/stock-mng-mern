import { combineReducers } from '@reduxjs/toolkit';
import { reducer as calendarReducer } from 'src/slices/calendar';
import { reducer as projectsBoardReducer } from 'src/slices/projects_board';
import { reducer as mailboxReducer } from 'src/slices/mailbox';
import { reducer as roleReducer } from 'src/slices/role';
import { reducer as supplierReducer } from 'src/slices/supplier';
import { reducer as customerReducer } from 'src/slices/customer';
import { reducer as shopReducer } from 'src/slices/shop';
import { reducer as storeReducer } from 'src/slices/store';
import { reducer as categoryReducer } from 'src/slices/category';
import { reducer as userReducer } from 'src/slices/user';
import { reducer as productReducer } from 'src/slices/product';
import { reducer as purchaseReducer } from 'src/slices/purchase';
import { reducer as sellReducer } from 'src/slices/sell';
import { reducer as stockReducer } from 'src/slices/stock';
import { reducer as recepitReducer } from 'src/slices/recepit';
import { reducer as transferReducer } from 'src/slices/transfer';
import { reducer as notificationReducer } from 'src/slices/notification';
import { reducer as themeReducer } from 'src/slices/theme';

const rootReducer = combineReducers({
  calendar: calendarReducer,
  projectsBoard: projectsBoardReducer,
  mailbox: mailboxReducer,
  role: roleReducer,
  supplier: supplierReducer,
  customer: customerReducer,
  shop: shopReducer,
  store: storeReducer,
  category: categoryReducer,
  user: userReducer,
  product: productReducer,
  purchase: purchaseReducer,
  sell: sellReducer,
  stock: stockReducer,
  recepit: recepitReducer,
  transfer: transferReducer,
  notification: notificationReducer,
  theme: themeReducer
});

export default rootReducer;
