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

const applyFilters = (suppliers, query, filters) => {
  return suppliers.filter((supplier) => {
    let matches = true;

    if (query) {
      const properties = ['name', 'email', 'mobile'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (supplier[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && supplier[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};

const applyPagination = (suppliers, page, limit) => {
  return suppliers.slice(page * limit, page * limit + limit);
};

const Results = ({
  suppliers,
  handleUpdatedSupplierOpen,
  handleConfirmDelete
}) => {
  const [selectedItems, setSelectedSuppliers] = useState([]);
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [filters] = useState({
    supplier: null
  });

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSelectAllSuppliers = (event) => {
    setSelectedSuppliers(
      event.target.checked ? suppliers.map((supplier) => supplier._id) : []
    );
  };

  const handleSelectOnesupplier = (_event, supplierId) => {
    if (!selectedItems.includes(supplierId)) {
      setSelectedSuppliers((prevSelected) => [...prevSelected, supplierId]);
    } else {
      setSelectedSuppliers((prevSelected) =>
        prevSelected.filter((id) => id !== supplierId)
      );
    }
  };

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const filteredSuppliers = applyFilters(suppliers, query, filters);
  const paginatedSuppliers = applyPagination(filteredSuppliers, page, limit);
  const selectedBulkActions = selectedItems.length > 0;
  const selectedSomeSuppliers =
    selectedItems.length > 0 && selectedItems.length < suppliers.length;
  const selectedAllSuppliers = selectedItems.length === suppliers.length;

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

          {paginatedSuppliers.length === 0 ? (
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
                  "We couldn't find any suppliers matching your search criteria"
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
                          checked={selectedAllSuppliers}
                          indeterminate={selectedSomeSuppliers}
                          onChange={handleSelectAllSuppliers}
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
                    {paginatedSuppliers.map((supplier) => {
                      const issupplierSelected = selectedItems.includes(
                        supplier._id
                      );
                      return (
                        <TableRow
                          hover
                          key={supplier._id}
                          selected={issupplierSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={issupplierSelected}
                              onChange={(event) =>
                                handleSelectOnesupplier(event, supplier._id)
                              }
                              value={issupplierSelected}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography>{supplier.contact_id}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{supplier.bus_name}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight="bold">
                              {supplier.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{supplier.email}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{supplier.tax_num}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{supplier.pay_term}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{supplier.opening_balance}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{supplier.advance_balance}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{supplier.added_on}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{supplier.address}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{supplier.mobile}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography noWrap>
                              <Tooltip title={t('Edit')} arrow>
                                <IconButton
                                  onClick={() =>
                                    handleUpdatedSupplierOpen(supplier)
                                  }
                                  color="primary"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={t('Delete')} arrow>
                                <IconButton
                                  onClick={() => handleConfirmDelete(supplier)}
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
                  count={filteredSuppliers.length}
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
  suppliers: PropTypes.array.isRequired,
  handleUpdatedSupplierOpen: PropTypes.func.isRequired,
  handleConfirmDelete: PropTypes.func.isRequired
};

Results.defaultProps = {
  suppliers: []
};

export default Results;
