import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'src/store';
import {
  Card,
  Grid,
  TextField,
  CircularProgress,
  Button,
  Zoom,
  Autocomplete
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import {
  getPurchases,
  addPurchase,
  updatePurchase,
  setPurchase
} from 'src/slices/purchase';
import { getSuppliers } from 'src/slices/supplier';
import { getProducts } from 'src/slices/product';
import { getShops } from 'src/slices/shop';

const purchaseStatus = [
  { value: 1, label: 'Received' },
  { value: 2, label: 'Pending' },
  { value: 3, label: 'Ordered' }
];

const paymentStatus = [
  { value: 1, label: 'Paid' },
  { value: 2, label: 'Due' }
];

function GeneralSection() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const purchase = useSelector((state) => state.purchase.item);
  const purchases = useSelector((state) => state.purchase.items);
  const proItems = useSelector((state) => state.purchase.proItems);
  const suppliers = useSelector((state) => state.supplier.items);
  const products = useSelector((state) => state.product.items);
  const shops = useSelector((state) => state.shop.items);

  const handleCreatePurchaseSuccess = () => {
    enqueueSnackbar(
      t(
        `The purchase was ${purchase._id ? 'updated' : 'created'} successfully`
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
  };

  useEffect(() => {
    if (purchases.length === 0) dispatch(getPurchases());
    if (suppliers.length === 0) dispatch(getSuppliers());
    if (products.length === 0) dispatch(getProducts());
    if (shops.length === 0) dispatch(getShops());
  }, []);

  return (
    <Card
      sx={{
        p: 3
      }}
    >
      <Formik
        enableReinitialize
        initialValues={purchase}
        validationSchema={Yup.object().shape({
          reference_no: Yup.string()
            .max(255)
            .required(t('The reference No field is required')),
          supplier: Yup.object().shape({
            _id: Yup.string().required('The supplier field is required')
          }),
          shop: Yup.object().shape({
            _id: Yup.string().required('The shop field is required')
          }),
          purchase_status: Yup.object().shape({
            value: Yup.string().required(
              'The purchase status field is required'
            )
          }),
          payment_status: Yup.object().shape({
            value: Yup.string().required('The payment status field is required')
          })
          // items: Yup.array()
          //   .required('The payment status field is required')
          //   .min(1)
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            console.log(values, '--------------values in purchase index');
            // const items = purchase.items;
            if (values._id)
              dispatch(updatePurchase({ ...values, items: proItems }));
            else dispatch(addPurchase({ ...values, items: proItems }));
            // resetForm();
            dispatch(setPurchase({}));
            setStatus({ success: true });
            setSubmitting(false);
            handleCreatePurchaseSuccess();
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
          isSubmitting,
          touched,
          values
        }) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={12}>
                <Grid container spacing={3}>
                  <Grid item xs={3}>
                    <TextField
                      error={Boolean(
                        touched.reference_no && errors.reference_no
                      )}
                      fullWidth
                      helperText={touched.reference_no && errors.reference_no}
                      label={t('Reference No')}
                      name="reference_no"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.reference_no}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      error={Boolean(touched.location && errors.location)}
                      fullWidth
                      helperText={touched.location && errors.location}
                      label={t('Location')}
                      name="location"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.location}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Autocomplete
                      id="supplier"
                      name="supplier"
                      options={suppliers}
                      getOptionLabel={(option) => option.name || ''}
                      value={values.supplier}
                      groupBy={(option) => option.state}
                      onChange={(e, newValue) => {
                        handleChange({
                          target: { name: 'supplier', value: newValue }
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          {...params}
                          error={Boolean(touched.supplier && errors.supplier)}
                          label={t('Supplier name')}
                          onChange={handleChange}
                          value={values.supplier}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Autocomplete
                      id="shop"
                      name="shop"
                      options={shops}
                      getOptionLabel={(option) => option.name || ''}
                      value={values.shop}
                      groupBy={(option) => option.state}
                      onChange={(e, newValue) => {
                        handleChange({
                          target: { name: 'shop', value: newValue }
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          {...params}
                          error={Boolean(touched.shop && errors.shop)}
                          label={t('Shop name')}
                          onChange={handleChange}
                          value={values.shop}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Autocomplete
                      id="purchase_status"
                      name="purchase_status"
                      options={purchaseStatus}
                      getOptionLabel={(option) => option.label || ''}
                      value={values.purchase_status}
                      groupBy={(option) => option.state}
                      onChange={(e, newValue) => {
                        handleChange({
                          target: {
                            name: 'purchase_status',
                            value: newValue
                          }
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          {...params}
                          error={Boolean(
                            touched.purchase_status && errors.purchase_status
                          )}
                          label={t('Purchase status')}
                          onChange={handleChange}
                          value={values.purchase_status}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <Autocomplete
                      id="payment_status"
                      name="payment_status"
                      options={paymentStatus}
                      getOptionLabel={(option) => option.label || ''}
                      value={values.payment_status}
                      groupBy={(option) => option.state}
                      onChange={(e, newValue) => {
                        handleChange({
                          target: {
                            name: 'payment_status',
                            value: newValue
                          }
                        });
                      }}
                      renderInput={(params) => (
                        <TextField
                          fullWidth
                          {...params}
                          error={Boolean(
                            touched.payment_status && errors.payment_status
                          )}
                          label={t('Payment status')}
                          onChange={handleChange}
                          value={values.payment_status}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      error={Boolean(
                        touched.total_amount && errors.total_amount
                      )}
                      fullWidth
                      helperText={touched.total_amount && errors.total_amount}
                      type="number"
                      label={t('Grand total')}
                      name="total_amount"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.total_amount}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <TextField
                      error={Boolean(touched.paid_amount && errors.paid_amount)}
                      fullWidth
                      helperText={touched.paid_amount && errors.paid_amount}
                      type="number"
                      label={t('Paid amount')}
                      name="paid_amount"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.paid_amount}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <div
              style={{
                position: 'relative',
                float: 'right',
                top: 20,
                marginBottom: 15,
                zIndex: 900
              }}
            >
              <Button
                type="submit"
                startIcon={
                  isSubmitting ? <CircularProgress size="1rem" /> : null
                }
                disabled={Boolean(errors.submit) || isSubmitting}
                variant="contained"
              >
                {t(`${purchase._id ? 'Update' : 'Add'} purchase`)}
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </Card>
  );
}

export default GeneralSection;
