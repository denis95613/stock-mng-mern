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

const applyFilters = (stores, query, filters) => {
  return stores.filter((store) => {
    let matches = true;

    if (query) {
      const properties = ['name', 'location'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (store[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && store[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};

const applyPagination = (stores, page, limit) => {
  return stores.slice(page * limit, page * limit + limit);
};

const Results = ({ stores, handleUpdatedStoreOpen, handleConfirmDelete }) => {
  const [selectedItems, setSelectedStores] = useState([]);
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [filters] = useState({
    store: null
  });

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSelectAllStores = (event) => {
    setSelectedStores(
      event.target.checked ? stores.map((store) => store._id) : []
    );
  };

  const handleSelectOnestore = (_event, storeId) => {
    if (!selectedItems.includes(storeId)) {
      setSelectedStores((prevSelected) => [...prevSelected, storeId]);
    } else {
      setSelectedStores((prevSelected) =>
        prevSelected.filter((id) => id !== storeId)
      );
    }
  };

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const filteredStores = applyFilters(stores, query, filters);
  const paginatedStores = applyPagination(filteredStores, page, limit);
  const selectedBulkActions = selectedItems.length > 0;
  const selectedSomeStores =
    selectedItems.length > 0 && selectedItems.length < stores.length;
  const selectedAllStores = selectedItems.length === stores.length;

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

          {paginatedStores.length === 0 ? (
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
                {t("We couldn't find any stores matching your search criteria")}
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
                          checked={selectedAllStores}
                          indeterminate={selectedSomeStores}
                          onChange={handleSelectAllStores}
                        />
                      </TableCell>
                      <TableCell>{t('Contact ID')}</TableCell>
                      <TableCell>{t('Name')}</TableCell>
                      <TableCell>{t('Added on')}</TableCell>
                      <TableCell>{t('Location')}</TableCell>
                      <TableCell>{t('Mobile')}</TableCell>
                      <TableCell align="center">{t('Actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedStores.map((store) => {
                      const isstoreSelected = selectedItems.includes(store._id);
                      return (
                        <TableRow
                          hover
                          key={store._id}
                          selected={isstoreSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isstoreSelected}
                              onChange={(event) =>
                                handleSelectOnestore(event, store._id)
                              }
                              value={isstoreSelected}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography>{store.contact_id}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight="bold">
                              {store.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{store.added_on}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{store.location}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{store.mobile}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography noWrap>
                              <Tooltip title={t('Edit')} arrow>
                                <IconButton
                                  onClick={() => handleUpdatedStoreOpen(store)}
                                  color="primary"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={t('Delete')} arrow>
                                <IconButton
                                  onClick={() => handleConfirmDelete(store)}
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
                  count={filteredStores.length}
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
  stores: PropTypes.array.isRequired,
  handleUpdatedStoreOpen: PropTypes.func.isRequired,
  handleConfirmDelete: PropTypes.func.isRequired
};

Results.defaultProps = {
  stores: []
};

export default Results;
