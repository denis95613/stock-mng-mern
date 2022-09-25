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
import DatePicker from '@mui/lab/DatePicker';
import {
  getTransfers,
  addTransfer,
  updateTransfer,
  deleteTransfer,
  setTransfer
} from 'src/slices/transfer';
import { getShops } from 'src/slices/shop';
import { getStores } from 'src/slices/store';
import { getSuppliers } from 'src/slices/supplier';
import { getCustomers } from 'src/slices/customer';
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

function ManagementTransfers() {
  const dispatch = useDispatch();
  const transfers = useSelector((state) => state.transfer.items);
  const transfer = useSelector((state) => state.transfer.item);
  const shops = useSelector((state) => state.shop.items);
  const stores = useSelector((state) => state.store.items);
  const suppliers = useSelector((state) => state.supplier.items);
  const customers = useSelector((state) => state.customer.items);
  console.log(transfer, '----transfer');

  useEffect(() => {
    if (transfers.length === 0) dispatch(getTransfers());
    if (shops.length === 0) dispatch(getShops());
    if (stores.length === 0) dispatch(getStores());
    if (suppliers.length === 0) dispatch(getSuppliers());
    if (customers.length === 0) dispatch(getCustomers());
  }, []);

  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);

  const handleCreateTransferOpen = () => {
    setOpen(true);
  };
  const handleUpdatedTransferOpen = (transfer) => {
    dispatch(setTransfer(transfer));
    setOpen(true);
  };

  const handleCreateTransferClose = () => {
    setOpen(false);
  };

  const handleCreateTransferSuccess = () => {
    enqueueSnackbar(
      t(
        `The transfer was ${transfer._id ? 'updated' : 'created'} successfully`
      ),
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

  const handleConfirmDelete = (transfer) => {
    dispatch(setTransfer(transfer));
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = () => {
    dispatch(deleteTransfer(transfer._id));
    setOpenConfirmDelete(false);

    enqueueSnackbar(t('The transfer has been removed'), {
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
        <title>Transfers - Management</title>
      </Helmet>
      <PageTitleWrapper>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>
              {t('Transfers Management')}
            </Typography>
            <Typography variant="subtitle2">
              {t(
                'All aspects related to the transfers can be managed from this page'
              )}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              sx={{
                mt: { xs: 2, sm: 0 }
              }}
              onClick={handleCreateTransferOpen}
              variant="contained"
              startIcon={<AddTwoToneIcon fontSize="small" />}
            >
              {t('Create transfer')}
            </Button>
          </Grid>
        </Grid>
        <Dialog
          fullWidth
          maxWidth="md"
          open={open}
          onClose={handleCreateTransferClose}
        >
          <DialogTitle
            sx={{
              p: 3
            }}
          >
            <Typography variant="h4" gutterBottom>
              {t(`${transfer._id ? 'Update' : 'Add new'} transfer`)}
            </Typography>
            <Typography variant="subtitle2">
              {t(
                'Fill in the fields below to create or update a transfer to the site'
              )}
            </Typography>
          </DialogTitle>
          <Formik
            initialValues={transfer}
            validationSchema={Yup.object().shape({
              // name: Yup.string()
              //   .max(255)
              //   .required(t('The name field is required')),
              // email: Yup.string()
              //   .max(255)
              //   .required(t('The email field is required')),
              // password: Yup.string()
              //   .max(255)
              //   .required(t('The password field is required'))
            })}
            onSubmit={async (
              values,
              { resetForm, setErrors, setStatus, setSubmitting }
            ) => {
              try {
                console.log(values, '--------------values in transfer index');
                if (values._id) dispatch(updateTransfer(values));
                else dispatch(addTransfer(values));
                resetForm();
                setStatus({ success: true });
                setSubmitting(false);
                handleCreateTransferSuccess();
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
              // setFieldValue,
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
                          <DatePicker
                            name="date"
                            value={values.date}
                            onChange={(newValue) => {
                              handleChange({
                                target: { name: 'date', value: newValue }
                              });
                            }}
                            renderInput={(params) => (
                              <TextField
                                fullWidth
                                placeholder={t('Select date...')}
                                {...params}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            error={Boolean(
                              touched.reference_no && errors.reference_no
                            )}
                            fullWidth
                            helperText={
                              touched.reference_no && errors.reference_no
                            }
                            label={t('Reference No')}
                            name="reference_no"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.reference_no}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Autocomplete
                            id="from_shop"
                            name="from_shop"
                            options={shops.map((s) => ({
                              _id: s._id,
                              name: s.name
                            }))}
                            getOptionLabel={(option) => option.name || ''}
                            value={values.from_shop}
                            groupBy={(option) => option.state}
                            onChange={(e, newValue) => {
                              handleChange({
                                target: { name: 'from_shop', value: newValue }
                              });
                            }}
                            renderInput={(params) => (
                              <TextField
                                fullWidth
                                {...params}
                                label={t('Shop(from)')}
                                onChange={handleChange}
                                value={values.from_shop}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Autocomplete
                            id="from_store"
                            name="from_store"
                            options={stores.map((s) => ({
                              _id: s._id,
                              name: s.name
                            }))}
                            getOptionLabel={(option) => option.name || ''}
                            value={values.from_store}
                            groupBy={(option) => option.state}
                            onChange={(e, newValue) => {
                              handleChange({
                                target: { name: 'from_store', value: newValue }
                              });
                            }}
                            renderInput={(params) => (
                              <TextField
                                fullWidth
                                {...params}
                                label={t('Store(from)')}
                                onChange={handleChange}
                                value={values.from_store}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Autocomplete
                            id="from_supplier"
                            name="from_supplier"
                            options={suppliers.map((s) => ({
                              _id: s._id,
                              name: s.name
                            }))}
                            getOptionLabel={(option) => option.name || ''}
                            value={values.from_supplier}
                            groupBy={(option) => option.state}
                            onChange={(e, newValue) => {
                              handleChange({
                                target: {
                                  name: 'from_supplier',
                                  value: newValue
                                }
                              });
                            }}
                            renderInput={(params) => (
                              <TextField
                                fullWidth
                                {...params}
                                label={t('Supplier(from)')}
                                onChange={handleChange}
                                value={values.from_supplier}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Autocomplete
                            id="to_shop"
                            name="to_shop"
                            options={shops.map((s) => ({
                              _id: s._id,
                              name: s.name
                            }))}
                            getOptionLabel={(option) => option.name || ''}
                            value={values.to_shop}
                            groupBy={(option) => option.state}
                            onChange={(e, newValue) => {
                              handleChange({
                                target: { name: 'to_shop', value: newValue }
                              });
                            }}
                            renderInput={(params) => (
                              <TextField
                                fullWidth
                                {...params}
                                label={t('Shop(to)')}
                                onChange={handleChange}
                                value={values.to_shop}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Autocomplete
                            id="to_store"
                            name="to_store"
                            options={stores.map((s) => ({
                              _id: s._id,
                              name: s.name
                            }))}
                            getOptionLabel={(option) => option.name || ''}
                            value={values.to_store}
                            groupBy={(option) => option.state}
                            onChange={(e, newValue) => {
                              handleChange({
                                target: { name: 'to_store', value: newValue }
                              });
                            }}
                            renderInput={(params) => (
                              <TextField
                                fullWidth
                                {...params}
                                label={t('Store(to)')}
                                onChange={handleChange}
                                value={values.to_store}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Autocomplete
                            id="to_customer"
                            name="to_customer"
                            options={customers.map((s) => ({
                              _id: s._id,
                              name: s.name
                            }))}
                            getOptionLabel={(option) => option.name || ''}
                            value={values.to_customer}
                            groupBy={(option) => option.state}
                            onChange={(e, newValue) => {
                              handleChange({
                                target: { name: 'to_customer', value: newValue }
                              });
                            }}
                            renderInput={(params) => (
                              <TextField
                                fullWidth
                                {...params}
                                label={t('Customer(to)')}
                                onChange={handleChange}
                                value={values.to_customer}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            error={Boolean(
                              touched.shipping_charge && errors.shipping_charge
                            )}
                            fullWidth
                            type="number"
                            helperText={
                              touched.shipping_charge && errors.shipping_charge
                            }
                            label={t('Shipping charge')}
                            name="shipping_charge"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.shipping_charge}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            error={Boolean(
                              touched.total_amount && errors.total_amount
                            )}
                            fullWidth
                            type="number"
                            helperText={
                              touched.total_amount && errors.total_amount
                            }
                            label={t('Total amount')}
                            name="total_amount"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.total_amount}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            error={Boolean(touched.note && errors.note)}
                            fullWidth
                            helperText={touched.note && errors.note}
                            label={t('Note')}
                            name="note"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.note}
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
                  <Button color="secondary" onClick={handleCreateTransferClose}>
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
                    {t(`${transfer._id ? 'Update' : 'Add'} transfer`)}
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
                'Are you sure you want to permanently delete this transfer account'
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
            transfers={transfers}
            handleUpdatedTransferOpen={handleUpdatedTransferOpen}
            handleConfirmDelete={handleConfirmDelete}
          />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

export default ManagementTransfers;
