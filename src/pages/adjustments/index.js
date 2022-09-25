import { useState, useEffect, forwardRef } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Avatar,
  Box,
  Slide,
  Grid,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Zoom,
  Typography,
  TextField,
  CircularProgress,
  Button,
  styled
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'src/store';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {
  getStocks,
  addStock,
  updateStock,
  deleteStock,
  setStock
} from 'src/slices/stock';
import { getShops } from 'src/slices/shop';
import { getStores } from 'src/slices/store';
import { getProducts } from 'src/slices/product';
import Results from './Results';

const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
      }
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

function ManagementStocks() {
  const dispatch = useDispatch();
  const stock = useSelector((state) => state.stock.item);
  const stocks = useSelector((state) => state.stock.items);
  const shops = useSelector((state) => state.shop.items);
  const stores = useSelector((state) => state.store.items);
  const products = useSelector((state) => state.product.items);

  useEffect(() => {
    dispatch(getStocks());
    if (shops.length === 0) dispatch(getShops());
    if (stores.length === 0) dispatch(getStores());
    if (products.length === 0) dispatch(getProducts());
  }, []);

  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);

  const handleCreateStockOpen = () => {
    dispatch(setStock({}));
    setOpen(true);
  };
  const handleUpdatedStockOpen = (st) => {
    dispatch(setStock(st));
    setOpen(true);
  };

  const handleCreateStockClose = () => {
    setOpen(false);
  };

  const handleCreateStockSuccess = () => {
    enqueueSnackbar(
      t(`The stock was ${stock._id ? 'updated' : 'created'} successfully`),
      {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      }
    );
    setOpen(false);
  };

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const handleConfirmDelete = (st) => {
    dispatch(setStock(st));
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = () => {
    dispatch(deleteStock(stock._id));
    setOpenConfirmDelete(false);
    enqueueSnackbar(t('The stock has been removed'), {
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
      <Helmet>
        <title>Stocks - Management</title>
      </Helmet>
      <PageTitleWrapper>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>
              {t('Stocks Management')}
            </Typography>
            <Typography variant="subtitle2">
              {t(
                'All aspects related to the stocks can be managed from this page'
              )}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              sx={{
                mt: { xs: 2, sm: 0 }
              }}
              onClick={handleCreateStockOpen}
              variant="contained"
              startIcon={<AddTwoToneIcon fontSize="small" />}
            >
              {t('Create stock')}
            </Button>
          </Grid>
        </Grid>
        <Dialog
          fullWidth
          maxWidth="md"
          open={open}
          onClose={handleCreateStockClose}
        >
          <DialogTitle
            sx={{
              p: 3
            }}
          >
            <Typography variant="h4" gutterBottom>
              {t(`${stock._id ? 'Update' : 'Add new'} stock`)}
            </Typography>
            <Typography variant="subtitle2">
              {t(
                'Fill in the fields below to create or update a stock to the site'
              )}
            </Typography>
          </DialogTitle>
          <Formik
            initialValues={stock}
            validationSchema={Yup.object().shape({
              // name: Yup.string()
              //   .max(255)
              //   .required(t('The name field is required'))
            })}
            onSubmit={async (
              values,
              { resetForm, setErrors, setStatus, setSubmitting }
            ) => {
              try {
                if (values._id) dispatch(updateStock(values));
                else dispatch(addStock(values));
                resetForm();
                setStatus({ success: true });
                setSubmitting(false);
                handleCreateStockSuccess();
              } catch (err) {
                setStatus({ success: false });
                setErrors({ submit: err.message });
                setSubmitting(false);
              }
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              setFieldValue,
              isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <DialogContent
                  dividers
                  sx={{
                    p: 3
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} lg={12}>
                      <Grid container spacing={3}>
                        <Grid item xs={6}>
                          <Autocomplete
                            id="shop"
                            name="shop"
                            options={shops}
                            getOptionLabel={(option) => option.name || ''}
                            value={values.shop}
                            groupBy={(option) => option.state}
                            onChange={(e, newValue) =>
                              setFieldValue('shop', newValue)
                            }
                            renderInput={(params) => (
                              <TextField
                                fullWidth
                                {...params}
                                label={t('Select shop')}
                                onChange={handleChange}
                                value={values.shop}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Autocomplete
                            id="store"
                            name="store"
                            options={stores}
                            getOptionLabel={(option) => option.name || ''}
                            value={values.store}
                            groupBy={(option) => option.state}
                            onChange={(e, newValue) =>
                              setFieldValue('store', newValue)
                            }
                            renderInput={(params) => (
                              <TextField
                                fullWidth
                                {...params}
                                label={t('Select store')}
                                onChange={handleChange}
                                value={values.store}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Autocomplete
                            id="product"
                            name="product"
                            options={products}
                            getOptionLabel={(option) => option.name || ''}
                            value={values.product}
                            groupBy={(option) => option.state}
                            onChange={(e, newValue) =>
                              setFieldValue('product', newValue)
                            }
                            renderInput={(params) => (
                              <TextField
                                fullWidth
                                {...params}
                                label={t('Select product')}
                                onChange={handleChange}
                                value={values.product}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            error={Boolean(touched.skucode && errors.skucode)}
                            fullWidth
                            helperText={touched.skucode && errors.skucode}
                            label={t('SKU code')}
                            name="skucode"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.skucode}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            error={Boolean(touched.quantity && errors.quantity)}
                            fullWidth
                            type="number"
                            helperText={touched.quantity && errors.quantity}
                            label={t('Quantity')}
                            name="quantity"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.quantity}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            error={Boolean(
                              touched.limit_quantity && errors.limit_quantity
                            )}
                            fullWidth
                            type="number"
                            helperText={
                              touched.limit_quantity && errors.limit_quantity
                            }
                            label={t('Limit quantity')}
                            name="limit_quantity"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.limit_quantity}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            error={Boolean(
                              touched.purchase_price && errors.purchase_price
                            )}
                            fullWidth
                            type="number"
                            helperText={
                              touched.purchase_price && errors.purchase_price
                            }
                            label={t('Purchase price')}
                            name="purchase_price"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.purchase_price}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            error={Boolean(
                              touched.regular_price && errors.regular_price
                            )}
                            fullWidth
                            type="number"
                            helperText={
                              touched.regular_price && errors.regular_price
                            }
                            label={t('Regular price')}
                            name="regular_price"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.regular_price}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            error={Boolean(
                              touched.sale_price && errors.sale_price
                            )}
                            fullWidth
                            type="number"
                            helperText={touched.sale_price && errors.sale_price}
                            label={t('Sale price')}
                            name="sale_price"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.sale_price}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            error={Boolean(touched.discount && errors.discount)}
                            fullWidth
                            type="number"
                            helperText={touched.discount && errors.discount}
                            label={t('Discount')}
                            name="discount"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.discount}
                            variant="outlined"
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions
                  sx={{
                    p: 3
                  }}
                >
                  <Button color="secondary" onClick={handleCreateStockClose}>
                    {t('Cancel')}
                  </Button>
                  <Button
                    type="submit"
                    startIcon={
                      isSubmitting ? <CircularProgress size="1rem" /> : null
                    }
                    disabled={Boolean(errors.submit) || isSubmitting}
                    variant="contained"
                  >
                    {t(`${stock._id ? 'Update' : 'Add'} stock`)}
                  </Button>
                </DialogActions>
              </form>
            )}
          </Formik>
        </Dialog>
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
                py: 4,
                px: 6
              }}
              variant="h3"
            >
              {t(
                'Are you sure you want to permanently delete this stock account'
              )}
              ?
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
      </PageTitleWrapper>
      <Grid
        sx={{
          px: 4
        }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={4}
      >
        <Grid item xs={12}>
          <Results
            stocks={stocks}
            handleUpdatedStockOpen={handleUpdatedStockOpen}
            handleConfirmDelete={handleConfirmDelete}
          />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

export default ManagementStocks;
