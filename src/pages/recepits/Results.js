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
import _ from 'lodash';
import { useTranslation } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import BulkActions from './BulkActions';
import SearchTwoToneIcon from '@mui/icons-material/Edit';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

const applyFilters = (recepits, query, filters) => {
  return recepits.filter((recepit) => {
    let matches = true;

    if (query) {
      const properties = ['name', 'location'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (recepit[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && recepit[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};

const applyPagination = (recepits, page, limit) => {
  return recepits.slice(page * limit, page * limit + limit);
};

const Results = ({
  recepits,
  handleUpdatedRecepitOpen,
  handleConfirmDelete
}) => {
  const [selectedItems, setSelectedRecepits] = useState([]);
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [filters] = useState({
    recepit: null
  });

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSelectAllRecepits = (event) => {
    setSelectedRecepits(
      event.target.checked ? recepits.map((recepit) => recepit._id) : []
    );
  };

  const handleSelectOneRecepit = (_event, recepitId) => {
    if (!selectedItems.includes(recepitId)) {
      setSelectedRecepits((prevSelected) => [...prevSelected, recepitId]);
    } else {
      setSelectedRecepits((prevSelected) =>
        prevSelected.filter((id) => id !== recepitId)
      );
    }
  };

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const filteredRecepits = applyFilters(recepits, query, filters);
  const paginatedRecepits = applyPagination(filteredRecepits, page, limit);
  const selectedBulkActions = selectedItems.length > 0;
  const selectedSomeRecepits =
    selectedItems.length > 0 && selectedItems.length < recepits.length;
  const selectedAllRecepits = selectedItems.length === recepits.length;

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

          {paginatedRecepits.length === 0 ? (
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
                  "We couldn't find any recepits matching your search criteria"
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
                          checked={selectedAllRecepits}
                          indeterminate={selectedSomeRecepits}
                          onChange={handleSelectAllRecepits}
                        />
                      </TableCell>
                      <TableCell>{t('Customer')}</TableCell>
                      <TableCell>{t('Items')}</TableCell>
                      <TableCell>{t('Total amount')}</TableCell>
                      <TableCell>{t('Paid amount')}</TableCell>
                      <TableCell>{t('Sell due')}</TableCell>
                      <TableCell>{t('Sell return due')}</TableCell>
                      <TableCell align="center">{t('Actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedRecepits.map((recepit) => {
                      const isRecepitSelected = selectedItems.includes(
                        recepit._id
                      );
                      return (
                        <TableRow
                          hover
                          key={recepit._id}
                          selected={isRecepitSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isRecepitSelected}
                              onChange={(event) =>
                                handleSelectOneRecepit(event, recepit._id)
                              }
                              value={isRecepitSelected}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography>
                              {recepit.customer ? recepit.customer.name : ''}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>
                              {_.get(recepit, 'items[0].product.name')
                                ? _.get(recepit, 'items[0].product.name') +
                                  '...'
                                : ''}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>
                              {recepit.total_amount || ''}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{recepit.paid_amount || ''}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{recepit.sell_due || ''}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>
                              {recepit.sell_return_due || ''}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography noWrap>
                              <Tooltip title={t('Edit')} arrow>
                                <IconButton
                                  onClick={() =>
                                    handleUpdatedRecepitOpen(recepit)
                                  }
                                  color="primary"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={t('Delete')} arrow>
                                <IconButton
                                  onClick={() => handleConfirmDelete(recepit)}
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
                  count={filteredRecepits.length}
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
  recepits: PropTypes.array.isRequired,
  handleUpdatedRecepitOpen: PropTypes.func.isRequired,
  handleConfirmDelete: PropTypes.func.isRequired
};

Results.defaultProps = {
  recepits: []
};

export default Results;
