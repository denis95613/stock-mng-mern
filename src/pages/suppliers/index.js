import { useState, useEffect, forwardRef } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Avatar,
  Box,
  Slide,
  Grid,
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
import DatePicker from '@mui/lab/DatePicker';
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
  getSuppliers,
  addSupplier,
  updateSupplier,
  deleteSupplier
} from 'src/slices/supplier';
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

function ManagementSuppliers() {
  const dispatch = useDispatch();
  const suppliers = useSelector((state) => state.supplier.items);

  useEffect(() => {
    dispatch(getSuppliers());
  }, []);

  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);

  const [supplier, setSupplier] = useState({
    contact_id: '',
    bus_name: '',
    name: '',
    email: '',
    tax_num: '',
    pay_term: 0,
    opening_balance: 0,
    advance_balance: 0,
    added_on: undefined,
    address: '',
    mobile: ''
  });

  const handleCreateSupplierOpen = () => {
    setSupplier({
      contact_id: '',
      bus_name: '',
      name: '',
      email: '',
      tax_num: '',
      pay_term: 0,
      opening_balance: 0,
      advance_balance: 0,
      added_on: undefined,
      address: '',
      mobile: ''
    });
    setOpen(true);
  };
  const handleUpdatedSupplierOpen = (supplier) => {
    setSupplier(supplier);
    setOpen(true);
  };

  const handleCreateSupplierClose = () => {
    setSupplier({
      contact_id: '',
      bus_name: '',
      name: '',
      email: '',
      tax_num: '',
      pay_term: 0,
      opening_balance: 0,
      advance_balance: 0,
      added_on: undefined,
      address: '',
      mobile: ''
    });
    setOpen(false);
  };

  const handleCreateSupplierSuccess = () => {
    enqueueSnackbar(
      t(
        `The supplier was ${supplier._id ? 'updated' : 'created'} successfully`
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

    setSupplier({
      contact_id: '',
      bus_name: '',
      name: '',
      email: '',
      tax_num: '',
      pay_term: 0,
      opening_balance: 0,
      advance_balance: 0,
      added_on: undefined,
      address: '',
      mobile: ''
    });
    setOpen(false);
  };

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const handleConfirmDelete = (supplier) => {
    setSupplier(supplier);
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setSupplier({
      contact_id: '',
      bus_name: '',
      name: '',
      email: '',
      tax_num: '',
      pay_term: 0,
      opening_balance: 0,
      advance_balance: 0,
      added_on: undefined,
      address: '',
      mobile: ''
    });
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = () => {
    dispatch(deleteSupplier(supplier._id));
    setSupplier({
      contact_id: '',
      bus_name: '',
      name: '',
      email: '',
      tax_num: '',
      pay_term: 0,
      opening_balance: 0,
      advance_balance: 0,
      added_on: undefined,
      address: '',
      mobile: ''
    });
    setOpenConfirmDelete(false);

    enqueueSnackbar(t('The supplier has been removed'), {
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
        <title>Suppliers - Management</title>
      </Helmet>
      <PageTitleWrapper>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>
              {t('Suppliers Management')}
            </Typography>
            <Typography variant="subtitle2">
              {t(
                'All aspects related to the suppliers can be managed from this page'
              )}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              sx={{
                mt: { xs: 2, sm: 0 }
              }}
              onClick={handleCreateSupplierOpen}
              variant="contained"
              startIcon={<AddTwoToneIcon fontSize="small" />}
            >
              {t('Create supplier')}
            </Button>
          </Grid>
        </Grid>
        <Dialog
          fullWidth
          maxWidth="md"
          open={open}
          onClose={handleCreateSupplierClose}
        >
          <DialogTitle
            sx={{
              p: 3
            }}
          >
            <Typography variant="h4" gutterBottom>
              {t(`${supplier._id ? 'Update' : 'Add new'} supplier`)}
            </Typography>
            <Typography variant="subtitle2">
              {t(
                'Fill in the fields below to create or update a supplier to the site'
              )}
            </Typography>
          </DialogTitle>
          <Formik
            initialValues={supplier}
            validationSchema={Yup.object().shape({
              contact_id: Yup.string()
                .max(255)
                .required(t('The contact ID field is required')),
              name: Yup.string()
                .max(255)
                .required(t('The name field is required')),
              email: Yup.string()
                .max(255)
                .required(t('The email field is required')),
              address: Yup.string()
                .max(255)
                .required(t('The address field is required')),
              mobile: Yup.string()
                .max(255)
                .required(t('The mobile field is required'))
            })}
            onSubmit={async (
              values,
              { resetForm, setErrors, setStatus, setSubmitting }
            ) => {
              try {
                if (values._id) dispatch(updateSupplier(values));
                else dispatch(addSupplier(values));
                resetForm();
                setStatus({ success: true });
                setSubmitting(false);
                handleCreateSupplierSuccess();
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
                          <TextField
                            error={Boolean(
                              touched.contact_id && errors.contact_id
                            )}
                            fullWidth
                            helperText={touched.contact_id && errors.contact_id}
                            label={t('Supplier contact ID')}
                            name="contact_id"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.contact_id}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            error={Boolean(touched.bus_name && errors.bus_name)}
                            fullWidth
                            helperText={touched.bus_name && errors.bus_name}
                            label={t('Supplier business name')}
                            name="bus_name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.bus_name}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            error={Boolean(touched.name && errors.name)}
                            fullWidth
                            helperText={touched.name && errors.name}
                            label={t('Supplier name')}
                            name="name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.name}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            error={Boolean(touched.email && errors.email)}
                            fullWidth
                            helperText={touched.email && errors.email}
                            label={t('Supplier email')}
                            name="email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.email}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            error={Boolean(touched.tax_num && errors.tax_num)}
                            fullWidth
                            helperText={touched.tax_num && errors.tax_num}
                            label={t('Supplier tax number')}
                            name="tax_num"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.tax_num}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            inputProps={{
                              inputMode: 'numeric',
                              pattern: '[0-9]*'
                            }}
                            error={Boolean(touched.pay_term && errors.pay_term)}
                            fullWidth
                            helperText={touched.pay_term && errors.pay_term}
                            label={t('Supplier pay term')}
                            name="pay_term"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.pay_term}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            inputProps={{
                              inputMode: 'numeric',
                              pattern: '[0-9]*'
                            }}
                            error={Boolean(
                              touched.opening_balance && errors.opening_balance
                            )}
                            fullWidth
                            helperText={
                              touched.opening_balance && errors.opening_balance
                            }
                            label={t('Supplier opening balance')}
                            name="opening_balance"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.opening_balance}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            inputProps={{
                              inputMode: 'numeric',
                              pattern: '[0-9]*'
                            }}
                            error={Boolean(
                              touched.advance_balance && errors.advance_balance
                            )}
                            fullWidth
                            helperText={
                              touched.advance_balance && errors.advance_balance
                            }
                            label={t('Supplier advance balance')}
                            name="advance_balance"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.advance_balance}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <DatePicker
                            value={values.added_on}
                            onChange={(date) => {
                              setFieldValue('added_on', date);
                            }}
                            renderInput={(params) => (
                              <TextField
                                fullWidth
                                placeholder={t('Added on')}
                                {...params}
                              />
                            )}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            error={Boolean(touched.address && errors.address)}
                            fullWidth
                            helperText={touched.address && errors.address}
                            label={t('Supplier address')}
                            name="address"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.address}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            error={Boolean(touched.mobile && errors.mobile)}
                            fullWidth
                            helperText={touched.mobile && errors.mobile}
                            label={t('Supplier mobile')}
                            name="mobile"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.mobile}
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
                  <Button color="secondary" onClick={handleCreateSupplierClose}>
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
                    {t(`${supplier._id ? 'Update' : 'Add'} supplier`)}
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
                'Are you sure you want to permanently delete this supplier account'
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
            suppliers={suppliers}
            handleUpdatedSupplierOpen={handleUpdatedSupplierOpen}
            handleConfirmDelete={handleConfirmDelete}
          />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

export default ManagementSuppliers;
