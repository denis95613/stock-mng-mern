import React, { useEffect } from 'react';
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { setProductItem, setProductItem1 } from 'src/slices/purchase';
import { getProducts } from 'src/slices/product';
import Results from './Results';

function AdditionalInfo() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.items);
  const purchase = useSelector((state) => state.purchase.item);
  const productItem = useSelector((state) => state.purchase.proItem);
  const proItems = useSelector((state) => state.purchase.proItems);
  const proItemCount = purchase.items.length;
  console.log(productItem, proItemCount, '------proItemCount');

  const deleteItem = (item) => {
    console.log(item);
    dispatch(setProductItem(item, 2));
  };

  const updateItem = (item) => {
    console.log(item, '*********');
    dispatch(setProductItem1(item));
  };

  useEffect(() => {
    if (products.length === 0) dispatch(getProducts());
  }, []);
  console.log(purchase, productItem, '++++++++++');

  return (
    <Card>
      <CardHeader title={t('Additional Informations')} />
      <Divider />
      <Box
        sx={{
          p: 3
        }}
      >
        <Formik
          enableReinitialize
          initialValues={productItem}
          validationSchema={Yup.object().shape({
            product: Yup.object().shape({
              _id: Yup.string().required('The poroduct field is required')
            }),
            amount: Yup.number().required('The amount field is required'),
            purchase_price: Yup.number().required(
              'The purchase price field is required'
            ),
            regular_price: Yup.number().required(
              'The regualr price field is required'
            ),
            sale_price: Yup.number().required(
              'The sale price field is required'
            )
          })}
          onSubmit={async (
            values,
            { resetForm, setErrors, setStatus, setSubmitting }
          ) => {
            try {
              console.log(values, '--------vjalu');
              const mode = values.id || values.id === 0 ? 1 : 0;
              dispatch(
                setProductItem(
                  {
                    ...values,
                    id: values.id || values.id === 0 ? values.id : proItemCount
                  },
                  mode
                )
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
            setFieldValue,
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
                        id="product"
                        name="product"
                        options={products}
                        getOptionLabel={(option) => option.name || ''}
                        value={values.product}
                        groupBy={(option) => option.state}
                        onChange={(e, newValue) =>
                          setFieldValue('product', newValue)
                        }
                        // onChange={(e, newValue) => {
                        //   handleChange({
                        //     target: { name: 'product', value: newValue }
                        //   });
                        // }}
                        renderInput={(params) => (
                          <TextField
                            fullWidth
                            {...params}
                            error={Boolean(touched.product && errors.product)}
                            label={t('Select product')}
                            onChange={handleChange}
                            value={values.product}
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
                        error={Boolean(touched.sale_price && errors.sale_price)}
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
                  {t(`${values.id || values.id === 0 ? 'Update' : 'Add'} Item`)}
                </Button>
              </div>
            </form>
          )}
        </Formik>
      </Box>
      {/* <Divider /> */}
      <Grid container>
        <Grid item xs={12}>
          <Accordion sx={{ padding: 0 }} expanded={proItems.length > 0}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Product items</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Results
                items={proItems}
                updateItem={updateItem}
                deleteItem={deleteItem}
              />
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>
    </Card>
  );
}

export default AdditionalInfo;
