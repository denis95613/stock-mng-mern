import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Card,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  TableRow,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { useEffect } from 'react';
import { getStoresByProducts, setStockStores } from 'src/slices/stock';

const Recepits = ({ recepits }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const stores = useSelector((state) => state.stock.stores);
  console.log(stores, '--------stores');
  let requestReceipts = [];
  let _ids = '';
  requestReceipts = recepits.map((item) => {
    _ids += item.stock.product._id + ',';
    return { product: item.stock.product._id, amount: item.amount };
  });

  const deleteItem = (index) => {
    console.log(index, '-------deleteItem');
    dispatch(setStockStores(stores.filter((_, i) => i !== index)));
  };
  console.log(recepits, '----recepits');

  useEffect(() => {
    if (requestReceipts.length !== 0 && stores.length === 0)
      dispatch(getStoresByProducts(requestReceipts));
  }, [_ids]);

  return (
    <>
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('No')}</TableCell>
                <TableCell>{t('Product name')}</TableCell>
                <TableCell>{t('SKU Code')}</TableCell>
                <TableCell>{t('Amount')}</TableCell>
                <TableCell>{t('Unit price')}</TableCell>
                <TableCell>{t('Store')}</TableCell>
                <TableCell>{t('Sub Total')}</TableCell>
                <TableCell align="center">{t('Actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stores.map((item, index) => {
                return (
                  <TableRow hover key={index}>
                    <TableCell>
                      <Typography>{index + 1}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>
                        {item.product ? item.product.name : ''}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{item.skucode || ''}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{item.amount || 0}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>{item.unit_price || 0}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>
                        {item.store ? item.store.name : ''}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography>
                        {Math.round(item.amount * item.unit_price, 2)}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography noWrap>
                        <Tooltip title={t('Delete')} arrow>
                          <IconButton
                            onClick={() => deleteItem(index)}
                            color="primary"
                          >
                            <DeleteTwoToneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </>
  );
};

Recepits.propTypes = {
  recepits: PropTypes.array.isRequired
};

Recepits.defaultProps = {
  recepits: []
};

export default Recepits;
