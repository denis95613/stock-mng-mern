import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'src/store';
import {
  Card,
  CardHeader,
  Divider,
  Grid,
  Typography,
  TextField,
  CircularProgress,
  Button,
  Box,
  Autocomplete,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { setSell } from 'src/slices/sell';
import { getProducts } from 'src/slices/product';
// import { setStock } from 'src/slices/stock';
import Results from './Results';

function AdditionalInfo() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const sell = useSelector((state) => state.sell.item);
  const products = useSelector((state) => state.product.items);
  const stocks = useSelector((state) => state.stock.items);
  // const stock = useSelector((state) => state.stock.item);
  const [curItem, setCurItem] = useState({
    stock: {},
    product: {},
    amount: 0,
    purchase_price: 0,
    regular_price: 0,
    sale_price: 0
  });

  const deleteItem = (index) => {
    console.log(index);
    dispatch(
      setSell({
        ...sell,
        items: sell.items.filter((_, i) => i !== index)
      })
    );
  };

  const updateItem = (index) => {
    console.log(index);
    const item = sell.items.filter((_, i) => i === index)[0] || {};
    console.log(item, index, '*********');
    setCurItem(item);
  };

  useEffect(() => {
    if (products.length === 0) dispatch(getProducts());
  }, []);

  return (
    <>
      <Card>
        <CardHeader title={t('Additional Informations')} />
        <Divider />
        <Box
          sx={{
            p: 3
          }}
        >
          <Formik
            initialValues={curItem}
            validationSchema={Yup.object().shape({
              // reference_no: Yup.string()
              //   .max(255)
              //   .required(t('The reference no field is required'))
            })}
            onSubmit={async (
              values,
              { resetForm, setErrors, setStatus, setSubmitting }
            ) => {
              try {
                values = {
                  ...values,
                  product: values.stock.product
                    ? values.stock.product._id
                    : undefined,
                  shop: values.stock.shop ? values.stock.shop._id : undefined
                };
                let tmps = sell.items;
                if (tmps) tmps = [...tmps, values];
                else tmps = [values];
                dispatch(
                  setSell({
                    ...sell,
                    items: tmps
                  })
                );
                resetForm();
                setStatus({ success: true });
                setSubmitting(false);
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
                      <Grid item xs={4}>
                        <Autocomplete
                          id="stock"
                          name="stock"
                          options={stocks}
                          getOptionLabel={(option) =>
                            option.product
                              ? option.product.name + ' - ' + option.shop.name
                              : ''
                          }
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
                              label={t('Select product')}
                              onChange={handleChange}
                              value={values.stock}
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <TextField
                          error={Boolean(touched.amount && errors.amount)}
                          fullWidth
                          helperText={touched.amount && errors.amount}
                          type="number"
                          label={t('Amount')}
                          name="amount"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.amount}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <TextField
                          error={Boolean(
                            touched.purchase_price && errors.purchase_price
                          )}
                          fullWidth
                          helperText={
                            touched.purchase_price && errors.purchase_price
                          }
                          type="number"
                          label={t('Purchase price')}
                          name="purchase_price"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.purchase_price}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <TextField
                          error={Boolean(
                            touched.regular_price && errors.regular_price
                          )}
                          fullWidth
                          helperText={
                            touched.regular_price && errors.regular_price
                          }
                          type="number"
                          label={t('Regular price')}
                          name="regular_price"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.regular_price}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <TextField
                          error={Boolean(
                            touched.sale_price && errors.sale_price
                          )}
                          fullWidth
                          helperText={touched.sale_price && errors.sale_price}
                          type="number"
                          label={t('Sale price')}
                          name="sale_price"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.sale_price}
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
                    marginTop: 10
                    // top: -40,
                    // zIndex: 900
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
                    {t(`${sell._id ? 'Update' : 'Add'}`)}
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        </Box>
        {/* <Divider /> */}
        <Grid container style={{ marginBotton: 20 }}>
          <Grid item xs={12}>
            <Accordion
              sx={{ padding: 0 }}
              expanded={sell.items && sell.items.length > 0}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography style={{ color: '#5569ff' }}>
                  Product items
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Results
                  items={sell.items}
                  updateItem={updateItem}
                  deleteItem={deleteItem}
                />
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </Card>
    </>
  );
}

export default AdditionalInfo;
