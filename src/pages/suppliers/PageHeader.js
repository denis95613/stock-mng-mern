/* eslint-disable jsx-a11y/label-has-for */
import { useState } from 'react';
// import * as Yup from 'yup';
// import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'src/store';
// import { addSupplier } from 'src/slices/supplier';

import {
  Grid,
  // Dialog,
  // DialogTitle,
  // DialogActions,
  // DialogContent,
  Zoom,
  Typography,
  // TextField,
  // CircularProgress,
  Button
} from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { useSnackbar } from 'notistack';

function PageHeader() {
  // const dispatch = useDispatch();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const handleCreateSupplierOpen = () => {
    setOpen(true);
  };

  // const handleCreateSupplierClose = () => {
  //   setOpen(false);
  // };

  // const handleCreateSupplierSuccess = () => {
  //   enqueueSnackbar(t('The supplier was created successfully'), {
  //     variant: 'success',
  //     anchorOrigin: {
  //       vertical: 'top',
  //       horizontal: 'right'
  //     },
  //     TransitionComponent: Zoom
  //   });

  //   setOpen(false);
  // };

  return (
    <>
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
      {/* <Dialog
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
            {t('Add new supplier')}
          </Typography>
          <Typography variant="subtitle2">
            {t(
              'Fill in the fields below to create and add a new supplier to the site'
            )}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            contact_id: '',
            bus_name: '',
            name: '',
            email: '',
            tax_num: '',
            pay_term: 0,
            opening_balance: 0,
            advance_balance: new Date(),
            address: '',
            mobile: ''
          }}
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
              dispatch(addSupplier(values));
              resetForm();
              setStatus({ success: true });
              setSubmitting(false);
              handleCreateSupplierSuccess();
            } catch (err) {
              console.error(err);
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
                      <Grid item xs={12} md={12} lg={12}>
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
                          error={Boolean(
                            touched.advance_balance && errors.advance_balance
                          )}
                          fullWidth
                          helperText={
                            touched.advance_balance && errors.advance_balance
                          }
                          label={t('Supplier advance balance')}
                          name="opening_balance"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.opening_balance}
                          variant="outlined"
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
                  {t('Add supplier')}
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </Dialog> */}
    </>
  );
}

export default PageHeader;
