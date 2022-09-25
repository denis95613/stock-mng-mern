import React, { useEffect, useState, forwardRef } from 'react';
import { useDispatch, useSelector } from 'src/store';
import {
  Card,
  Grid,
  TextField,
  CircularProgress,
  Button,
  Zoom,
  Autocomplete,
  styled,
  Dialog,
  Slide,
  Box,
  Typography
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { getSells, addSell, updateSell, setSell } from 'src/slices/sell';
import { getCustomers } from 'src/slices/customer';
import { getProducts } from 'src/slices/product';
import { getShops } from 'src/slices/shop';
import { getStocks, getStocksByShop } from 'src/slices/stock';
import { addRecepit } from 'src/slices/recepit';
import { setRecepit } from 'src/slices/recepit';
import Recepits from './Recepits';

const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
      }
`
);

const ButtonSuccess = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.primary.main};
     color: ${theme.palette.primary.contrastText};

     &:hover {
        background: ${theme.palette.primary.dark};
     }
    `
);

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const paymentMethod = [
  { value: 1, label: 'Paypal' },
  { value: 2, label: 'Visa' },
  { value: 3, label: 'Stripe' }
];

const paymentStatus = [
  { value: 1, label: 'Paid' },
  { value: 2, label: 'Due' }
];

function GeneralSection() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const sell = useSelector((state) => state.sell.item);
  const sells = useSelector((state) => state.sell.items);
  const customers = useSelector((state) => state.customer.items);
  const products = useSelector((state) => state.product.items);
  const shops = useSelector((state) => state.shop.items);
  const stocks = useSelector((state) => state.stock.items);
  const stores = useSelector((state) => state.stock.stores);
  const recepit = useSelector((state) => state.recepit.item);
  console.log(recepit, '-------------recepit');
  const [show, setShow] = useState(false);
  const [showCheck, setShowCheck] = useState(false);
  const [recepits, setRecepits] = useState([]);
  // const [realItems, setRealItems] = useState([]);

  const handleCreateSellSuccess = () => {
    enqueueSnackbar(
      t(`The sell was ${sell._id ? 'updated' : 'created'} successfully`),
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

  const openConfirmReceipt = () => {
    setShow(true);
  };

  const closeConfirmReceipt = () => {
    setShow(false);
  };

  const openCheckReceipt = () => {
    setShow(false);
    setShowCheck(true);
  };

  const closeCheckReceipt = () => {
    setShowCheck(false);
  };

  const handleRecepitCompleted = () => {
    if (stores.length === 0) return;
    // dispatch(
    //   setRecepit({
    //     ...recepit,
    //     items: stores
    //   })
    // );
    // console.log(recepit, '---------recepit');
    dispatch(addRecepit({ ...recepit, items: stores }));
    setShow(false);
    setShowCheck(false);
    enqueueSnackbar(t('You successfully created recepit'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
  };

  const isRecepit = () => {
    let items = sell.items;
    let flag = false;
    let tmpRecepits = [];
    items = items.map((item) => {
      if (item.stock.quantity < item.amount) {
        flag = true;
        tmpRecepits.push({
          ...item,
          amount: item.amount - item.stock.quantity
        });
        return { ...item, amount: item.stock.quantity };
      }
      return item;
    });
    if (tmpRecepits.length > 0) {
      setRecepits(tmpRecepits);
    }
    // 1. recepit crud
    // 2. <Recepit recepits={recepits}/>
    // 3. shop,store sell history
    return { flag, items };
  };

  useEffect(() => {
    if (sells.length === 0) dispatch(getSells());
    if (customers.length === 0) dispatch(getCustomers());
    if (products.length === 0) dispatch(getProducts());
    if (shops.length === 0) dispatch(getShops());
    if (stocks.length === 0) dispatch(getStocks());
  }, []);

  useEffect(() => {
    console.log(sell.shop);
    if (sell.shop && sell.shop._id) dispatch(getStocksByShop(sell.shop._id));
  }, [sell.shop]);

  return (
    <>
      <Card
        sx={{
          p: 3
        }}
      >
        <Formik
          initialValues={sell}
          validationSchema={Yup.object().shape({
            // reference_no: Yup.string()
            //   .max(255)
            //   .required(t('The reference no field is required'))
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              const { flag, items } = isRecepit();
              if (flag) openConfirmReceipt();
              if (values._id) dispatch(updateSell({ ...sell, items }));
              else dispatch(addSell({ ...sell, items }));
              setStatus({ success: true });
              setSubmitting(false);
              handleCreateSellSuccess();
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
            setFieldValue,
            handleSubmit,
            isSubmitting,
            touched,
            values
          }) => (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} lg={12}>
                  <Grid container spacing={3}>
                    {/* <Grid item xs={4}>
                    <TextField
                      error={Boolean(
                        touched.invoice_no && errors.invoice_no
                      )}
                      fullWidth
                      helperText={touched.invoice_no && errors.invoice_no}
                      label={t('Invoice No')}
                      name="invoice_no"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.invoice_no}
                      variant="outlined"
                    />
                  </Grid> */}
                    <Grid item xs={4}>
                      <Autocomplete
                        id="customer"
                        name="customer"
                        options={customers}
                        getOptionLabel={(option) => option.name || ''}
                        value={values.customer}
                        groupBy={(option) => option.state}
                        onChange={(e, newValue) => {
                          dispatch(
                            setRecepit({ ...recepit, customer: newValue._id })
                          );
                          dispatch(setSell({ ...sell, customer: newValue }));
                          handleChange({
                            target: { name: 'customer', value: newValue }
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            fullWidth
                            {...params}
                            label={t('Customer name')}
                            onChange={handleChange}
                            value={values.customer}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        error={Boolean(touched.contact && errors.contact)}
                        fullWidth
                        helperText={touched.contact && errors.contact}
                        label={t('Contact')}
                        name="contact"
                        onBlur={handleBlur}
                        // onChange={handleChange}
                        onChange={(e) => {
                          dispatch(
                            setSell({ ...sell, contact: e.target.value })
                          );
                          setFieldValue('contact', e.target.value);
                        }}
                        value={values.contact}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Autocomplete
                        id="shop"
                        name="shop"
                        options={shops}
                        getOptionLabel={(option) => option.name || ''}
                        value={values.shop}
                        groupBy={(option) => option.state}
                        onChange={(e, newValue) => {
                          dispatch(
                            setRecepit({ ...recepit, shop: newValue._id })
                          );
                          dispatch(setSell({ ...sell, shop: newValue }));
                          handleChange({
                            target: { name: 'shop', value: newValue }
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            fullWidth
                            {...params}
                            label={t('Shop name')}
                            onChange={handleChange}
                            value={values.shop}
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
                          dispatch(
                            setSell({ ...sell, payment_status: newValue })
                          );
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
                            label={t('Payment status')}
                            onChange={handleChange}
                            value={values.payment_status}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Autocomplete
                        id="payment_method"
                        name="payment_method"
                        options={paymentMethod}
                        getOptionLabel={(option) => option.label || ''}
                        value={values.payment_method}
                        groupBy={(option) => option.state}
                        onChange={(e, newValue) => {
                          dispatch(
                            setSell({ ...sell, payment_method: newValue })
                          );
                          handleChange({
                            target: {
                              name: 'payment_method',
                              value: newValue
                            }
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            fullWidth
                            {...params}
                            label={t('Payment method')}
                            onChange={handleChange}
                            value={values.payment_method}
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
                        label={t('Amount')}
                        name="total_amount"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          dispatch(
                            setRecepit({
                              ...recepit,
                              total_amount: e.target.value
                            })
                          );
                          dispatch(
                            setSell({ ...sell, total_amount: e.target.value })
                          );
                          setFieldValue('total_amount', e.target.value);
                        }}
                        value={values.total_amount}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        error={Boolean(
                          touched.paid_amount && errors.paid_amount
                        )}
                        fullWidth
                        helperText={touched.paid_amount && errors.paid_amount}
                        type="number"
                        label={t('Paid')}
                        name="paid_amount"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          dispatch(
                            setRecepit({
                              ...recepit,
                              paid_amount: e.target.value
                            })
                          );
                          dispatch(
                            setSell({ ...sell, paid_amount: e.target.value })
                          );
                          setFieldValue('paid_amount', e.target.value);
                        }}
                        value={values.paid_amount}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        error={Boolean(touched.sell_due && errors.sell_due)}
                        fullWidth
                        helperText={touched.sell_due && errors.sell_due}
                        type="number"
                        label={t('Sell due')}
                        name="sell_due"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          dispatch(
                            setRecepit({ ...recepit, sell_due: e.target.value })
                          );
                          dispatch(
                            setSell({ ...sell, sell_due: e.target.value })
                          );
                          setFieldValue('sell_due', e.target.value);
                        }}
                        value={values.sell_due}
                        variant="outlined"
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        error={Boolean(
                          touched.sell_return_due && errors.sell_return_due
                        )}
                        fullWidth
                        helperText={
                          touched.sell_return_due && errors.sell_return_due
                        }
                        type="number"
                        label={t('Sell return due')}
                        name="sell_return_due"
                        onBlur={handleBlur}
                        onChange={(e) => {
                          dispatch(
                            setRecepit({
                              ...recepit,
                              sell_return_due: e.target.value
                            })
                          );
                          dispatch(
                            setSell({
                              ...sell,
                              sell_return_due: e.target.value
                            })
                          );
                          setFieldValue('sell_return_due', e.target.value);
                        }}
                        value={values.sell_return_due}
                        variant="outlined"
                      />
                    </Grid>
                    {/* <Grid item xs={3}>
                    <TextField
                      error={Boolean(
                        touched.shipping_status && errors.shipping_status
                      )}
                      fullWidth
                      helperText={
                        touched.shipping_status && errors.shipping_status
                      }
                      type="number"
                      label={t('Shipping status')}
                      name="shipping_status"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.shipping_status}
                      variant="outlined"
                    />
                  </Grid> */}
                    {/* <Grid item xs={3}>
                    <TextField
                      error={Boolean(touched.sell_note && errors.sell_note)}
                      fullWidth
                      helperText={touched.sell_note && errors.sell_note}
                      label={t('Sell note')}
                      name="sell_note"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.sell_note}
                      variant="outlined"
                    />
                  </Grid> */}
                    {/* <Grid item xs={3}>
                    <TextField
                      error={Boolean(touched.stuf_note && errors.stuf_note)}
                      fullWidth
                      helperText={touched.stuf_note && errors.stuf_note}
                      label={t('Stuf note')}
                      name="stuf_note"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.stuf_note}
                      variant="outlined"
                    />
                  </Grid> */}
                    {/* <Grid item xs={3}>
                    <TextField
                      error={Boolean(
                        touched.shipping_note && errors.shipping_note
                      )}
                      fullWidth
                      helperText={touched.shipping_note && errors.shipping_note}
                      type="number"
                      label={t('Shipping note')}
                      name="shipping_note"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.shipping_note}
                      variant="outlined"
                    />
                  </Grid> */}
                  </Grid>
                </Grid>
              </Grid>
              <div
                style={{
                  position: 'relative',
                  float: 'right',
                  top: 20,
                  marginBottom: 20,
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
                  {t(`${sell._id ? 'Update' : 'Add'} sell`)}
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </Card>
      <DialogWrapper
        open={show}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={closeConfirmReceipt}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          p={5}
        >
          <Typography
            align="center"
            sx={{
              pt: 4,
              px: 6
            }}
            variant="h3"
          >
            {t('Do you want to get receipt')}?
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
            {t('The store is out of stock')}
          </Typography>
          <div style={{ width: '100%', textAlign: 'right' }}>
            <Box>
              <Button
                variant="text"
                size="large"
                sx={{
                  mx: 1
                }}
                onClick={closeConfirmReceipt}
              >
                {t('Cancel')}
              </Button>
              <ButtonSuccess
                onClick={openCheckReceipt}
                size="large"
                sx={{
                  mx: 1,
                  px: 3
                }}
                variant="contained"
              >
                {t('Got recepit')}
              </ButtonSuccess>
            </Box>
          </div>
        </Box>
      </DialogWrapper>
      <DialogWrapper
        open={showCheck}
        maxWidth="lg"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={closeCheckReceipt}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          p={5}
        >
          <Typography
            align="center"
            sx={{
              pt: 4,
              px: 6
            }}
            variant="h3"
          >
            {t('Recepit details')}
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
            {t('The store is out of stock')}
          </Typography>
          <Recepits recepits={recepits} />
          <div style={{ marginTop: 20, textAlign: 'right', width: '100%' }}>
            <Box>
              <Button
                variant="text"
                size="large"
                sx={{
                  mx: 1
                }}
                onClick={closeCheckReceipt}
              >
                {t('Cancel')}
              </Button>
              <ButtonSuccess
                onClick={handleRecepitCompleted}
                size="large"
                sx={{
                  mx: 1,
                  px: 3
                }}
                variant="contained"
              >
                {t('Agree')}
              </ButtonSuccess>
            </Box>
          </div>
        </Box>
      </DialogWrapper>
    </>
  );
}

export default GeneralSection;
