import { useState, useEffect, forwardRef } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Avatar,
  Box,
  Slide,
  Grid,
  // Autocomplete,
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
  getRecepits,
  addRecepit,
  updateRecepit,
  deleteRecepit
} from 'src/slices/recepit';
import { getRoles } from 'src/slices/role';
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

function ManagementRecepits() {
  const dispatch = useDispatch();
  const recepits = useSelector((state) => state.recepit.items);
  // const roles = useSelector((state) => state.role.items);
  // const recepitRoles = roles;

  useEffect(() => {
    dispatch(getRecepits());
    dispatch(getRoles());
  }, []);

  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [recepit, setRecepit] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleCreateRecepitOpen = () => {
    setRecepit({
      name: '',
      email: '',
      password: ''
    });
    setOpen(true);
  };
  const handleUpdatedRecepitOpen = (recepit) => {
    setRecepit(recepit);
    setOpen(true);
  };

  const handleCreateRecepitClose = () => {
    setRecepit({
      name: '',
      email: '',
      password: ''
    });
    setOpen(false);
  };

  const handleCreateRecepitSuccess = () => {
    enqueueSnackbar(
      t(`The recepit was ${recepit._id ? 'updated' : 'created'} successfully`),
      {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      }
    );

    setRecepit({
      name: '',
      email: '',
      password: ''
    });
    setOpen(false);
  };

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const handleConfirmDelete = (recepit) => {
    setRecepit(recepit);
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setRecepit({
      name: '',
      email: '',
      password: ''
    });
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = () => {
    dispatch(deleteRecepit(recepit._id));
    setRecepit({
      name: '',
      email: '',
      password: ''
    });
    setOpenConfirmDelete(false);

    enqueueSnackbar(t('The recepit has been removed'), {
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
        <title>Recepits - Management</title>
      </Helmet>
      <PageTitleWrapper>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>
              {t('Recepits Management')}
            </Typography>
            <Typography variant="subtitle2">
              {t(
                'All aspects related to the recepits can be managed from this page'
              )}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              sx={{
                mt: { xs: 2, sm: 0 }
              }}
              onClick={handleCreateRecepitOpen}
              variant="contained"
              startIcon={<AddTwoToneIcon fontSize="small" />}
            >
              {t('Create recepit')}
            </Button>
          </Grid>
        </Grid>
        <Dialog
          fullWidth
          maxWidth="md"
          open={open}
          onClose={handleCreateRecepitClose}
        >
          <DialogTitle
            sx={{
              p: 3
            }}
          >
            <Typography variant="h4" gutterBottom>
              {t(`${recepit._id ? 'Update' : 'Add new'} recepit`)}
            </Typography>
            <Typography variant="subtitle2">
              {t(
                'Fill in the fields below to create or update a recepit to the site'
              )}
            </Typography>
          </DialogTitle>
          <Formik
            initialValues={recepit}
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
                console.log(values, '--------------values in recepit index');
                if (values._id) dispatch(updateRecepit(values));
                else dispatch(addRecepit(values));
                resetForm();
                setStatus({ success: true });
                setSubmitting(false);
                handleCreateRecepitSuccess();
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
                          <TextField
                            error={Boolean(touched.name && errors.name)}
                            fullWidth
                            helperText={touched.name && errors.name}
                            label={t('Recepit name')}
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
                            label={t('Recepit email')}
                            name="email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.email}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TextField
                            error={Boolean(touched.password && errors.password)}
                            fullWidth
                            helperText={touched.password && errors.password}
                            label={t('Password')}
                            name="password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.password}
                            variant="outlined"
                          />
                        </Grid>
                        {/* <Grid item xs={6}>
                          <Autocomplete
                            id="role"
                            name="role"
                            options={recepitRoles}
                            getOptionLabel={(option) => option.description}
                            value={values.role}
                            groupBy={(option) => option.state}
                            onChange={(e, newValue) => {
                              handleChange({
                                target: { name: 'role', value: newValue }
                              });
                              // setFieldValue('role', newValue);
                            }}
                            renderInput={(params) => (
                              <TextField
                                fullWidth
                                {...params}
                                label={t('recepit role')}
                                onChange={handleChange}
                                value={values.role}
                              />
                            )}
                          />
                        </Grid> */}
                      </Grid>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions
                  sx={{
                    p: 3
                  }}
                >
                  <Button color="secondary" onClick={handleCreateRecepitClose}>
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
                    {t(`${recepit._id ? 'Update' : 'Add'} recepit`)}
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
                'Are you sure you want to permanently delete this recepit account'
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
            recepits={recepits}
            handleUpdatedRecepitOpen={handleUpdatedRecepitOpen}
            handleConfirmDelete={handleConfirmDelete}
          />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

export default ManagementRecepits;
