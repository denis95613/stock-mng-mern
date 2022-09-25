import { useState } from 'react';
// import { Link as RouterLink } from 'react-router-dom';
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

const applyFilters = (customers, query, filters) => {
  return customers.filter((customer) => {
    let matches = true;

    if (query) {
      const properties = ['name', 'email', 'mobile'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (customer[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && customer[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};

const applyPagination = (customers, page, limit) => {
  return customers.slice(page * limit, page * limit + limit);
};

const Results = ({
  customers,
  handleUpdatedCustomerOpen,
  handleConfirmDelete
}) => {
  const [selectedItems, setSelectedCustomers] = useState([]);
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [filters] = useState({
    customer: null
  });

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSelectAllCustomers = (event) => {
    setSelectedCustomers(
      event.target.checked ? customers.map((customer) => customer._id) : []
    );
  };

  const handleSelectOneCustomer = (_event, customerId) => {
    if (!selectedItems.includes(customerId)) {
      setSelectedCustomers((prevSelected) => [...prevSelected, customerId]);
    } else {
      setSelectedCustomers((prevSelected) =>
        prevSelected.filter((id) => id !== customerId)
      );
    }
  };

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const filteredCustomers = applyFilters(customers, query, filters);
  const paginatedCustomers = applyPagination(filteredCustomers, page, limit);
  const selectedBulkActions = selectedItems.length > 0;
  const selectedSomeCustomers =
    selectedItems.length > 0 && selectedItems.length < customers.length;
  const selectedAllCustomers = selectedItems.length === customers.length;

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
                placeholder={t('Search by name, email or mobile')}
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

          {paginatedCustomers.length === 0 ? (
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
                  "We couldn't find any customers matching your search criteria"
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
                          checked={selectedAllCustomers}
                          indeterminate={selectedSomeCustomers}
                          onChange={handleSelectAllCustomers}
                        />
                      </TableCell>
                      <TableCell>{t('Contact ID')}</TableCell>
                      <TableCell>{t('Business name')}</TableCell>
                      <TableCell>{t('Name')}</TableCell>
                      <TableCell>{t('Email')}</TableCell>
                      <TableCell>{t('Tax number')}</TableCell>
                      <TableCell>{t('Pay term')}</TableCell>
                      <TableCell>{t('Opening balance')}</TableCell>
                      <TableCell>{t('Advance balance')}</TableCell>
                      <TableCell>{t('Added on')}</TableCell>
                      <TableCell>{t('Address')}</TableCell>
                      <TableCell>{t('Mobile')}</TableCell>
                      <TableCell align="center">{t('Actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedCustomers.map((customer) => {
                      const isCustomerselected = selectedItems.includes(
                        customer._id
                      );
                      return (
                        <TableRow
                          hover
                          key={customer._id}
                          selected={isCustomerselected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isCustomerselected}
                              onChange={(event) =>
                                handleSelectOneCustomer(event, customer._id)
                              }
                              value={isCustomerselected}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography>{customer.contact_id}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{customer.bus_name}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight="bold">
                              {customer.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{customer.email}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{customer.tax_num}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{customer.pay_term}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{customer.opening_balance}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{customer.advance_balance}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{customer.added_on}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{customer.address}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{customer.mobile}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography noWrap>
                              <Tooltip title={t('Edit')} arrow>
                                <IconButton
                                  onClick={() =>
                                    handleUpdatedCustomerOpen(customer)
                                  }
                                  color="primary"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={t('Delete')} arrow>
                                <IconButton
                                  onClick={() => handleConfirmDelete(customer)}
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
                  count={filteredCustomers.length}
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
  customers: PropTypes.array.isRequired,
  handleUpdatedCustomerOpen: PropTypes.func.isRequired,
  handleConfirmDelete: PropTypes.func.isRequired
};

Results.defaultProps = {
  customers: []
};

export default Results;
