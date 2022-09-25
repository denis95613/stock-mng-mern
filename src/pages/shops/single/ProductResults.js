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
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import BulkActions from './BulkActions';
import { useSnackbar } from 'notistack';
import Text from 'src/components/Text';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
// import { setProduct, deleteProduct } from 'src/slices/product';
import { deleteProduct } from 'src/slices/product';

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

const applyFilters = (products, query) => {
  return products.filter((product) => {
    let matches = true;

    if (query) {
      const properties = ['name'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (product[property].toLowerCase().includes(query.toLowerCase())) {
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

const applyPagination = (products, page, limit) => {
  return products.slice(page * limit, page * limit + limit);
};

const ProductResults = ({ products }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const location = useLocation();
  const dispatch = useDispatch();
  const [selectedItems, setSelectedProducts] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [query, setQuery] = useState('');

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSelectAllProducts = (event) => {
    setSelectedProducts(
      event.target.checked ? products.map((product) => product._id) : []
    );
  };

  const handleSelectOneProduct = (event, productId) => {
    if (!selectedItems.includes(productId)) {
      setSelectedProducts((prevSelected) => [...prevSelected, productId]);
    } else {
      setSelectedProducts((prevSelected) =>
        prevSelected.filter((_id) => _id !== productId)
      );
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const filteredProducts = applyFilters(products, query);
  const paginatedProducts = applyPagination(filteredProducts, page, limit);
  const selectedBulkActions = selectedItems.length > 0;
  const selectedSomeProducts =
    selectedItems.length > 0 && selectedItems.length < products.length;
  const selectedAllProducts = selectedItems.length === products.length;
  const mobile = useMediaQuery(theme.breakpoints.down('md'));
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [delId, setDelId] = useState('');

  // const handleConfirmDelete = (id) => {
  //   setDelId(id);
  //   setOpenConfirmDelete(true);
  // };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = () => {
    dispatch(deleteProduct(delId));
    setDelId('');
    setOpenConfirmDelete(false);

    enqueueSnackbar(t('You successfully deleted the product'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
  };

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
            </Box>
          )}
        </Box>
        <Divider />
        {paginatedProducts.length === 0 ? (
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
                        checked={selectedAllProducts}
                        indeterminate={selectedSomeProducts}
                        onChange={handleSelectAllProducts}
                      />
                    </TableCell>
                    <TableCell>{t('Product name')}</TableCell>
                    <TableCell>{t('Price')}</TableCell>
                    <TableCell>{t('Categories')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedProducts.map((product) => {
                    const isProductSelected = selectedItems.includes(
                      product._id
                    );
                    return (
                      <TableRow
                        hover
                        key={product._id}
                        selected={isProductSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isProductSelected}
                            onChange={(event) =>
                              handleSelectOneProduct(event, product._id)
                            }
                            value={isProductSelected}
                          />
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            {/* <ImgWrapper src={product.images[0]} /> */}
                            <ImgWrapper src={product.imageUrl} />
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
                                  }/single/` + product._id
                                }
                                variant="h5"
                              >
                                {product.name}
                              </Link>
                              <Typography variant="subtitle2" noWrap>
                                {product.name}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography
                            sx={{
                              textDecorationLine:
                                product.sale_price !== 0 ? 'line-through' : ''
                            }}
                          >
                            ${numeral(product.regular_price).format(`0,0.00`)}
                          </Typography>
                          {product.sale_price !== 0 && (
                            <Typography>
                              <Text color="error">
                                ${numeral(product.sale_price).format(`0,0.00`)}
                              </Text>
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          categories
                          {/* {product.categories.map((value) => {
                            return (
                              <span key={value}>
                                <Link href="#">{value}</Link>,{' '}
                              </span>
                            );
                          })} */}
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
                count={filteredProducts.length}
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
            {t('Do you really want to delete this product')}?
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

ProductResults.propTypes = {
  products: PropTypes.array.isRequired
};

ProductResults.defaultProps = {
  products: []
};

export default ProductResults;
