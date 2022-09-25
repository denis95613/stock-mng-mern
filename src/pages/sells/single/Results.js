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
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from 'react-i18next';
import BulkActions from './BulkActions';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';

const applyFilters = (items, query) => {
  return items.filter((item) => {
    let matches = true;

    if (query) {
      const properties = ['name'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (item[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    return matches;
  });
};

const applyPagination = (items, page, limit) => {
  return items.slice(page * limit, page * limit + limit);
};

const Results = ({ items, updateItem, deleteItem }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [selectedItems, setSelectedItems] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [query, setQuery] = useState('');

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSelectAllItems = (event) => {
    setSelectedItems(event.target.checked ? items.map((item) => item._id) : []);
  };

  const handleSelectOneitem = (event, itemId) => {
    if (!selectedItems.includes(itemId)) {
      setSelectedItems((prevSelected) => [...prevSelected, itemId]);
    } else {
      setSelectedItems((prevSelected) =>
        prevSelected.filter((_id) => _id !== itemId)
      );
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const filteredItems = applyFilters(items, query);
  const paginatedItems = applyPagination(filteredItems, page, limit);
  const selectedBulkActions = selectedItems.length > 0;
  const selectedSomeItems =
    selectedItems.length > 0 && selectedItems.length < items.length;
  const selectedAllItems = selectedItems.length === items.length;
  const mobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <>
      <Card>
        <Box display="flex" alignItems="center">
          {selectedBulkActions && (
            <Box flex={1} p={2}>
              <BulkActions />
            </Box>
          )}
          {!selectedBulkActions && (
            <Box
              flex={1}
              p={2}
              display={{ xs: 'block', md: 'flex' }}
              alignItems="center"
              justifyContent="space-between"
            >
              <Box
                sx={{
                  mb: { xs: 2, md: 0 }
                }}
              >
                <TextField
                  size="small"
                  fullWidth={mobile}
                  onChange={handleQueryChange}
                  value={query}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchTwoToneIcon />
                      </InputAdornment>
                    )
                  }}
                  placeholder={t('Search by product name...')}
                />
              </Box>
              <TablePagination
                component="div"
                count={filteredItems.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[5, 10, 15]}
              />
            </Box>
          )}
        </Box>
        <Divider />
        {paginatedItems.length === 0 ? (
          <Typography
            sx={{
              py: 10
            }}
            variant="h3"
            fontWeight="normal"
            color="text.secondary"
            align="center"
          >
            {t("We couldn't find any products matching your search criteria")}
          </Typography>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedAllItems}
                        indeterminate={selectedSomeItems}
                        onChange={handleSelectAllItems}
                      />
                    </TableCell>
                    <TableCell>{t('Product name')}</TableCell>
                    <TableCell>{t('Amount')}</TableCell>
                    <TableCell>{t('Regular price')}</TableCell>
                    <TableCell>{t('Sale price')}</TableCell>
                    <TableCell align="center">{t('Actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedItems.map((item, index) => {
                    const isitemselected = selectedItems.includes(item._id);
                    return (
                      <TableRow hover key={index} selected={isitemselected}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isitemselected}
                            onChange={(event) =>
                              handleSelectOneitem(event, item._id)
                            }
                            value={isitemselected}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography>
                            {item.product ? item.product.name : ''}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{item.amount}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{item.regular_price}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{item.sale_price}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography noWrap>
                            <Tooltip title={t('Edit')} arrow>
                              <IconButton
                                onClick={() => updateItem(index)}
                                color="primary"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
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
            <Box p={2}>
              <TablePagination
                component="div"
                count={filteredItems.length}
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
    </>
  );
};

Results.propTypes = {
  items: PropTypes.array.isRequired,
  updateItem: PropTypes.func.isRequired,
  deleteItem: PropTypes.func.isRequired
};

Results.defaultProps = {
  items: []
};

export default Results;
