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
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import BulkActions from './BulkActions';
import SearchTwoToneIcon from '@mui/icons-material/Edit';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
// import { format } from 'date-fns';

const applyFilters = (transfers, query, filters) => {
  return transfers.filter((transfer) => {
    let matches = true;

    if (query) {
      const properties = ['name', 'location'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (transfer[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && transfer[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};

const applyPagination = (transfers, page, limit) => {
  return transfers.slice(page * limit, page * limit + limit);
};

const Results = ({
  transfers,
  handleUpdatedTransferOpen,
  handleConfirmDelete
}) => {
  const [selectedItems, setSelectedTransfers] = useState([]);
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [filters] = useState({
    transfer: null
  });

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSelectAllTransfers = (event) => {
    setSelectedTransfers(
      event.target.checked ? transfers.map((transfer) => transfer._id) : []
    );
  };

  const handleSelectOneTransfer = (_event, transferId) => {
    if (!selectedItems.includes(transferId)) {
      setSelectedTransfers((prevSelected) => [...prevSelected, transferId]);
    } else {
      setSelectedTransfers((prevSelected) =>
        prevSelected.filter((id) => id !== transferId)
      );
    }
  };

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const filteredTransfers = applyFilters(transfers, query, filters);
  const paginatedTransfers = applyPagination(filteredTransfers, page, limit);
  const selectedBulkActions = selectedItems.length > 0;
  const selectedSomeTransfers =
    selectedItems.length > 0 && selectedItems.length < transfers.length;
  const selectedAllTransfers = selectedItems.length === transfers.length;

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
          {paginatedTransfers.length === 0 ? (
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
                {t(
                  "We couldn't find any transfers matching your search criteria"
                )}
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
                          checked={selectedAllTransfers}
                          indeterminate={selectedSomeTransfers}
                          onChange={handleSelectAllTransfers}
                        />
                      </TableCell>
                      <TableCell>{t('Date')}</TableCell>
                      <TableCell>{t('Shop(from)')}</TableCell>
                      <TableCell>{t('Store(from)')}</TableCell>
                      <TableCell>{t('Supplier(from)')}</TableCell>
                      <TableCell>{t('Shop(to)')}</TableCell>
                      <TableCell>{t('Store(to)')}</TableCell>
                      <TableCell>{t('Customer(to)')}</TableCell>
                      <TableCell>{t('Shipping charge')}</TableCell>
                      <TableCell>{t('Total amount')}</TableCell>
                      <TableCell>{t('Note')}</TableCell>
                      <TableCell align="center">{t('Actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedTransfers.map((transfer) => {
                      const isTransferSelected = selectedItems.includes(
                        transfer._id
                      );
                      return (
                        <TableRow
                          hover
                          key={transfer._id}
                          selected={isTransferSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isTransferSelected}
                              onChange={(event) =>
                                handleSelectOneTransfer(event, transfer._id)
                              }
                              value={isTransferSelected}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography>
                              {/* {format(transfer.date, 'MMMM dd yyyy')} */}
                              {transfer.date}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>
                              {_.get(transfer, 'from.shop.name') || ''}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>
                              {_.get(transfer, 'from.store.name') || ''}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>
                              {_.get(transfer, 'from.supplier.name') || ''}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>
                              {_.get(transfer, 'to.shop.name') || ''}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>
                              {_.get(transfer, 'to.store.name') || ''}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>
                              {_.get(transfer, 'to.customer.name') || ''}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>
                              {transfer.shipping_charge === 0
                                ? ''
                                : transfer.shipping_charge}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>
                              {transfer.total_amount === 0
                                ? ''
                                : transfer.total_amount}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{transfer.note || ''}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography noWrap>
                              <Tooltip title={t('Edit')} arrow>
                                <IconButton
                                  onClick={() =>
                                    handleUpdatedTransferOpen(transfer)
                                  }
                                  color="primary"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={t('Delete')} arrow>
                                <IconButton
                                  onClick={() => handleConfirmDelete(transfer)}
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
                  count={filteredTransfers.length}
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
  transfers: PropTypes.array.isRequired,
  handleUpdatedTransferOpen: PropTypes.func.isRequired,
  handleConfirmDelete: PropTypes.func.isRequired
};

Results.defaultProps = {
  transfers: []
};

export default Results;
