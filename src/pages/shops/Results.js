import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
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
import EditIcon from '@mui/icons-material/Edit';
import BulkActions from './BulkActions';
import SearchTwoToneIcon from '@mui/icons-material/Edit';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { setShop } from 'src/slices/shop';

const applyFilters = (shops, query, filters) => {
  return shops.filter((shop) => {
    let matches = true;

    if (query) {
      const properties = ['name', 'location'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (shop[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && shop[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};

const applyPagination = (shops, page, limit) => {
  return shops.slice(page * limit, page * limit + limit);
};

const Results = ({ shops, handleUpdatedShopOpen, handleConfirmDelete }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedItems, setSelectedShops] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [filters] = useState({
    shop: null
  });

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSelectAllShops = (event) => {
    setSelectedShops(event.target.checked ? shops.map((shop) => shop._id) : []);
  };

  const handleSelectOneshop = (_event, shopId) => {
    if (!selectedItems.includes(shopId)) {
      setSelectedShops((prevSelected) => [...prevSelected, shopId]);
    } else {
      setSelectedShops((prevSelected) =>
        prevSelected.filter((id) => id !== shopId)
      );
    }
  };

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const goShopDetail = (shop) => {
    dispatch(setShop(shop));
    return navigate(`/${location.pathname.split('/')[1]}/single`);
  };

  const filteredShops = applyFilters(shops, query, filters);
  const paginatedShops = applyPagination(filteredShops, page, limit);
  const selectedBulkActions = selectedItems.length > 0;
  const selectedSomeShops =
    selectedItems.length > 0 && selectedItems.length < shops.length;
  const selectedAllShops = selectedItems.length === shops.length;

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

          {paginatedShops.length === 0 ? (
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
                {t("We couldn't find any shops matching your search criteria")}
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
                          checked={selectedAllShops}
                          indeterminate={selectedSomeShops}
                          onChange={handleSelectAllShops}
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
                    {paginatedShops.map((shop) => {
                      const isshopSelected = selectedItems.includes(shop._id);
                      return (
                        <TableRow
                          hover
                          key={shop._id}
                          selected={isshopSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isshopSelected}
                              onChange={(event) =>
                                handleSelectOneshop(event, shop._id)
                              }
                              value={isshopSelected}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography>{shop.contact_id}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              fontWeight="bold"
                              style={{ cursor: 'pointer' }}
                              onClick={() => goShopDetail(shop)}
                            >
                              {shop.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{shop.added_on}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{shop.location}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{shop.mobile}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography noWrap>
                              <Tooltip title={t('Edit')} arrow>
                                <IconButton
                                  onClick={() => handleUpdatedShopOpen(shop)}
                                  color="primary"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={t('Delete')} arrow>
                                <IconButton
                                  onClick={() => handleConfirmDelete(shop)}
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
                  count={filteredShops.length}
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
  shops: PropTypes.array.isRequired,
  handleUpdatedShopOpen: PropTypes.func.isRequired,
  handleConfirmDelete: PropTypes.func.isRequired
};

Results.defaultProps = {
  shops: []
};

export default Results;
