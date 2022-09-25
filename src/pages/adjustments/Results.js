import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  Checkbox,
  Divider,
  Tooltip,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import BulkActions from './BulkActions';
import SearchTwoToneIcon from '@mui/icons-material/Edit';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

const applyFilters = (stocks, query, filters) => {
  return stocks.filter((stock) => {
    let matches = true;

    if (query) {
      const properties = ['name', 'location'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (stock[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && stock[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};

const applyPagination = (stocks, page, limit) => {
  return stocks.slice(page * limit, page * limit + limit);
};

const Results = ({ stocks, handleUpdatedStockOpen, handleConfirmDelete }) => {
  const [selectedItems, setSelectedStocks] = useState([]);
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [filters] = useState({
    stock: null
  });

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSelectAllStocks = (event) => {
    setSelectedStocks(
      event.target.checked ? stocks.map((stock) => stock._id) : []
    );
  };

  const handleSelectOneStock = (_event, stockId) => {
    if (!selectedItems.includes(stockId)) {
      setSelectedStocks((prevSelected) => [...prevSelected, stockId]);
    } else {
      setSelectedStocks((prevSelected) =>
        prevSelected.filter((id) => id !== stockId)
      );
    }
  };

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const filteredStocks = applyFilters(stocks, query, filters);
  const paginatedStocks = applyPagination(filteredStocks, page, limit);
  const selectedBulkActions = selectedItems.length > 0;
  const selectedSomeStocks =
    selectedItems.length > 0 && selectedItems.length < stocks.length;
  const selectedAllStocks = selectedItems.length === stocks.length;

  const [toggleView] = useState('table_view');

  return (
    <>
      {toggleView === 'table_view' && (
        <Card>
          <Box p={2}>
            {!selectedBulkActions && (
              <TextField
                sx={{
                  m: 0
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchTwoToneIcon />
                    </InputAdornment>
                  )
                }}
                onChange={handleQueryChange}
                placeholder={t('Search by name or location')}
                value={query}
                size="small"
                fullWidth
                margin="normal"
                variant="outlined"
              />
            )}
            {selectedBulkActions && <BulkActions />}
          </Box>

          <Divider />

          {paginatedStocks.length === 0 ? (
            <>
              <Typography
                sx={{
                  py: 10
                }}
                variant="h3"
                fontWeight="normal"
                color="text.secondary"
                align="center"
              >
                {t("We couldn't find any stocks matching your search criteria")}
              </Typography>
            </>
          ) : (
            <>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedAllStocks}
                          indeterminate={selectedSomeStocks}
                          onChange={handleSelectAllStocks}
                        />
                      </TableCell>
                      <TableCell>{t('Shop name')}</TableCell>
                      <TableCell>{t('Store name')}</TableCell>
                      <TableCell>{t('Product name')}</TableCell>
                      <TableCell>{t('SKU code')}</TableCell>
                      <TableCell>{t('Quantity')}</TableCell>
                      <TableCell>{t('Purchase price')}</TableCell>
                      <TableCell>{t('Regular price')}</TableCell>
                      <TableCell>{t('Sale price')}</TableCell>
                      <TableCell>{t('Discount')}</TableCell>
                      <TableCell>{t('Limit quantity')}</TableCell>
                      <TableCell align="center">{t('Actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedStocks.map((stock) => {
                      const isStockSelected = selectedItems.includes(stock._id);
                      return (
                        <TableRow
                          hover
                          key={stock._id}
                          selected={isStockSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isStockSelected}
                              onChange={(event) =>
                                handleSelectOneStock(event, stock._id)
                              }
                              value={isStockSelected}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography>
                              {stock.shop ? stock.shop.name : ''}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>
                              {stock.store ? stock.store.name : ''}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>
                              {stock.product ? stock.product.name : ''}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{stock.skucode}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{stock.quantity}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{stock.purchase_price}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{stock.regular_price}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{stock.sale_price}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{stock.discount}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{stock.limit_quantity}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography noWrap>
                              <Tooltip title={t('Edit')} arrow>
                                <IconButton
                                  onClick={() => handleUpdatedStockOpen(stock)}
                                  color="primary"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={t('Delete')} arrow>
                                <IconButton
                                  onClick={() => handleConfirmDelete(stock)}
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
              <Box p={2}>
                <TablePagination
                  component="div"
                  count={filteredStocks.length}
                  onPageChange={handlePageChange}
                  onRowsPerPageChange={handleLimitChange}
                  page={page}
                  rowsPerPage={limit}
                  rowsPerPageOptions={[5, 10, 15]}
                />
              </Box>
            </>
          )}
        </Card>
      )}
    </>
  );
};

Results.propTypes = {
  stocks: PropTypes.array.isRequired,
  handleUpdatedStockOpen: PropTypes.func.isRequired,
  handleConfirmDelete: PropTypes.func.isRequired
};

Results.defaultProps = {
  stocks: []
};

export default Results;
