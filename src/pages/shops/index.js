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
import { getShops, addShop, updateShop, deleteShop } from 'src/slices/shop';
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

function ManagementShops() {
  const dispatch = useDispatch();
  const shops = useSelector((state) => state.shop.items);

  useEffect(() => {
    dispatch(getShops());
  }, []);

  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);

  const [shop, setShop] = useState({
    contact_id: '',
    name: '',
    added_on: undefined,
    location: '',
    mobile: ''
  });

  const handleCreateShopOpen = () => {
    setShop({
      contact_id: '',
      name: '',
      added_on: undefined,
      location: '',
      mobile: ''
    });
    setOpen(true);
  };
  const handleUpdatedShopOpen = (shop) => {
    setShop(shop);
    setOpen(true);
  };

  const handleCreateShopClose = () => {
    setShop({
      contact_id: '',
      name: '',
      added_on: undefined,
      location: '',
      mobile: ''
    });
    setOpen(false);
  };

  const handleCreateShopSuccess = () => {
    enqueueSnackbar(
      t(`The shop was ${shop._id ? 'updated' : 'created'} successfully`),
      {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      }
    );

    setShop({
      contact_id: '',
      name: '',
      added_on: undefined,
      location: '',
      mobile: ''
    });
    setOpen(false);
  };

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const handleConfirmDelete = (shop) => {
    setShop(shop);
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setShop({
      contact_id: '',
      name: '',
      added_on: undefined,
      location: '',
      mobile: ''
    });
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = () => {
    dispatch(deleteShop(shop._id));
    setShop({
      contact_id: '',
      name: '',
      added_on: undefined,
      location: '',
      mobile: ''
    });
    setOpenConfirmDelete(false);

    enqueueSnackbar(t('The shop has been removed'), {
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
        <title>Shops - Management</title>
      </Helmet>
      <PageTitleWrapper>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>
              {t('Shops Management')}
            </Typography>
            <Typography variant="subtitle2">
              {t(
                'All aspects related to the shops can be managed from this page'
              )}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              sx={{
                mt: { xs: 2, sm: 0 }
              }}
              onClick={handleCreateShopOpen}
              variant="contained"
              startIcon={<AddTwoToneIcon fontSize="small" />}
            >
              {t('Create shop')}
            </Button>
          </Grid>
        </Grid>
        <Dialog
          fullWidth
          maxWidth="md"
          open={open}
          onClose={handleCreateShopClose}
        >
          <DialogTitle
            sx={{
              p: 3
            }}
          >
            <Typography variant="h4" gutterBottom>
              {t(`${shop._id ? 'Update' : 'Add new'} shop`)}
            </Typography>
            <Typography variant="subtitle2">
              {t(
                'Fill in the fields below to create or update a shop to the site'
              )}
            </Typography>
          </DialogTitle>
          <Formik
            initialValues={shop}
            validationSchema={Yup.object().shape({
              contact_id: Yup.string()
                .max(255)
                .required(t('The contact ID field is required')),
              name: Yup.string()
                .max(255)
                .required(t('The name field is required')),
              location: Yup.string()
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
                if (values._id) dispatch(updateShop(values));
                else dispatch(addShop(values));
                resetForm();
                setStatus({ success: true });
                setSubmitting(false);
                handleCreateShopSuccess();
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
                            label={t('Shop contact ID')}
                            name="contact_id"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.contact_id}
                            variant="outlined"
                          />
                        </Grid>

                        <Grid item xs={6}>
                          <TextField
                            error={Boolean(touched.name && errors.name)}
                            fullWidth
                            helperText={touched.name && errors.name}
                            label={t('Shop name')}
                            name="name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.name}
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
                            error={Boolean(touched.location && errors.location)}
                            fullWidth
                            helperText={touched.location && errors.location}
                            label={t('Shop location')}
                            name="location"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.location}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            error={Boolean(touched.mobile && errors.mobile)}
                            fullWidth
                            helperText={touched.mobile && errors.mobile}
                            label={t('Shop mobile')}
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
                  <Button color="secondary" onClick={handleCreateShopClose}>
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
                    {t(`${shop._id ? 'Update' : 'Add'} shop`)}
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
                'Are you sure you want to permanently delete this shop account'
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
            shops={shops}
            handleUpdatedShopOpen={handleUpdatedShopOpen}
            handleConfirmDelete={handleConfirmDelete}
          />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

export default ManagementShops;
