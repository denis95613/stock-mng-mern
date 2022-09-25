import { useState, forwardRef } from 'react';
import { useDispatch } from 'src/store';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import numeral from 'numeral';

import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Slide,
  Divider,
  Link,
  InputAdornment,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  TextField,
  Button,
  Typography,
  Dialog,
  useMediaQuery,
  useTheme,
  Zoom,
  styled
  // Autocomplete
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import BulkActions from './BulkActions';
import { useSnackbar } from 'notistack';
import Text from 'src/components/Text';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
// import { setstock, deleteStock } from 'src/slices/stock';
import { deleteStock } from 'src/slices/stock';

const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
      }
`
);

const ImgWrapper = styled('img')(
  ({ theme }) => `
      width: ${theme.spacing(8)};
      height: auto;
`
);

const AvatarError = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.error.lighter};
      color: ${theme.colors.error.main};
      width: ${theme.spacing(12)};
      height: ${theme.spacing(12)};

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(45)};
      }
`
);

const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
     }
    `
);

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const applyFilters = (stocks, query) => {
  return stocks.filter((stock) => {
    let matches = true;

    if (query) {
      const properties = ['name'];
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

    return matches;
  });
};

const applyPagination = (stocks, page, limit) => {
  return stocks.slice(page * limit, page * limit + limit);
};

const StockResults = ({ stocks }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const location = useLocation();
  const dispatch = useDispatch();
  const [selectedItems, setSelectedStocks] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [query, setQuery] = useState('');

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSelectAllStocks = (event) => {
    setSelectedStocks(
      event.target.checked ? stocks.map((stock) => stock._id) : []
    );
  };

  const handleSelectOneStock = (event, stockId) => {
    if (!selectedItems.includes(stockId)) {
      setSelectedStocks((prevSelected) => [...prevSelected, stockId]);
    } else {
      setSelectedStocks((prevSelected) =>
        prevSelected.filter((_id) => _id !== stockId)
      );
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const filteredStocks = applyFilters(stocks, query);
  const paginatedStocks = applyPagination(filteredStocks, page, limit);
  const selectedBulkActions = selectedItems.length > 0;
  const selectedSomeStocks =
    selectedItems.length > 0 && selectedItems.length < stocks.length;
  const selectedAllStocks = selectedItems.length === stocks.length;
  const mobile = useMediaQuery(theme.breakpoints.down('md'));
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [delId, setDelId] = useState('');

  const handleConfirmDelete = (id) => {
    setDelId(id);
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = () => {
    dispatch(deleteStock(delId));
    setDelId('');
    setOpenConfirmDelete(false);

    enqueueSnackbar(t('You successfully deleted the stock'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
  };

  // const [shop,setShop]=useState({})

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
                {/* <Autocomplete
                  id="stock"
                  name="stock"
                  options={stocks}
                  getOptionLabel={(option) => option.name || ''}
                  value={values.stock}
                  groupBy={(option) => option.state}
                  onChange={(e, newValue) => {
                    handleChange({
                      target: { name: 'stock', value: newValue }
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      {...params}
                      label={t('Select stock')}
                      onChange={handleChange}
                      value={values.stock}
                    />
                  )}
                /> */}
              </Box>
            </Box>
          )}
        </Box>
        <Divider />
        {paginatedStocks.length === 0 ? (
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
                        checked={selectedAllStocks}
                        indeterminate={selectedSomeStocks}
                        onChange={handleSelectAllStocks}
                      />
                    </TableCell>
                    <TableCell>{t('Product name')}</TableCell>
                    <TableCell>{t('Price')}</TableCell>
                    <TableCell>{t('Categories')}</TableCell>
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
                          <Box display="flex" alignItems="center">
                            {/* <ImgWrapper src={stock.images[0]} /> */}
                            <ImgWrapper src={stock.imageUrl} />
                            <Box
                              pl={1}
                              sx={{
                                width: 120
                              }}
                            >
                              <Link
                                component={RouterLink}
                                to={
                                  `/${
                                    location.pathname.split('/')[1]
                                  }/single/` + stock._id
                                }
                                variant="h5"
                              >
                                {stock.name}
                              </Link>
                              <Typography variant="subtitle2" noWrap>
                                {stock.name}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography
                            sx={{
                              textDecorationLine:
                                stock.sale_price !== 0 ? 'line-through' : ''
                            }}
                          >
                            ${numeral(stock.regular_price).format(`0,0.00`)}
                          </Typography>
                          {stock.sale_price !== 0 && (
                            <Typography>
                              <Text color="error">
                                ${numeral(stock.sale_price).format(`0,0.00`)}
                              </Text>
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          categories
                          {/* {stock.categories.map((value) => {
                            return (
                              <span key={value}>
                                <Link href="#">{value}</Link>,{' '}
                              </span>
                            );
                          })} */}
                        </TableCell>
                        <TableCell align="center">
                          <Typography noWrap>
                            <Tooltip title={t('Delete')} arrow>
                              <IconButton
                                onClick={() => handleConfirmDelete(stock._id)}
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
      <DialogWrapper
        open={openConfirmDelete}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={closeConfirmDelete}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          p={5}
        >
          <AvatarError>
            <CloseIcon />
          </AvatarError>

          <Typography
            align="center"
            sx={{
              pt: 4,
              px: 6
            }}
            variant="h3"
          >
            {t('Do you really want to delete this stock')}?
          </Typography>

          <Typography
            align="center"
            sx={{
              pt: 2,
              pb: 4,
              px: 6
            }}
            fontWeight="normal"
            color="text.secondary"
            variant="h4"
          >
            {t("You won't be able to revert after deletion")}
          </Typography>

          <Box>
            <Button
              variant="text"
              size="large"
              sx={{
                mx: 1
              }}
              onClick={closeConfirmDelete}
            >
              {t('Cancel')}
            </Button>
            <ButtonError
              onClick={handleDeleteCompleted}
              size="large"
              sx={{
                mx: 1,
                px: 3
              }}
              variant="contained"
            >
              {t('Delete')}
            </ButtonError>
          </Box>
        </Box>
      </DialogWrapper>
    </>
  );
};

StockResults.propTypes = {
  stocks: PropTypes.array.isRequired
};

StockResults.defaultProps = {
  stocks: []
};

export default StockResults;
