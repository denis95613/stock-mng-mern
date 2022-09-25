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
import { getUsers, addUser, updateUser, deleteUser } from 'src/slices/user';
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

function ManagementUsers() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.items);
  const roles = useSelector((state) => state.role.items);
  const userRoles = roles;

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getRoles());
  }, []);

  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleCreateUserOpen = () => {
    setUser({
      name: '',
      email: '',
      password: ''
    });
    setOpen(true);
  };
  const handleUpdatedUserOpen = (user) => {
    setUser(user);
    setOpen(true);
  };

  const handleCreateUserClose = () => {
    setUser({
      name: '',
      email: '',
      password: ''
    });
    setOpen(false);
  };

  const handleCreateUserSuccess = () => {
    enqueueSnackbar(
      t(`The user was ${user._id ? 'updated' : 'created'} successfully`),
      {
        variant: 'success',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      }
    );

    setUser({
      name: '',
      email: '',
      password: ''
    });
    setOpen(false);
  };

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const handleConfirmDelete = (user) => {
    setUser(user);
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setUser({
      name: '',
      email: '',
      password: ''
    });
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = () => {
    dispatch(deleteUser(user._id));
    setUser({
      name: '',
      email: '',
      password: ''
    });
    setOpenConfirmDelete(false);

    enqueueSnackbar(t('The user has been removed'), {
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
        <title>Users - Management</title>
      </Helmet>
      <PageTitleWrapper>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>
              {t('Users Management')}
            </Typography>
            <Typography variant="subtitle2">
              {t(
                'All aspects related to the users can be managed from this page'
              )}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              sx={{
                mt: { xs: 2, sm: 0 }
              }}
              onClick={handleCreateUserOpen}
              variant="contained"
              startIcon={<AddTwoToneIcon fontSize="small" />}
            >
              {t('Create user')}
            </Button>
          </Grid>
        </Grid>
        <Dialog
          fullWidth
          maxWidth="md"
          open={open}
          onClose={handleCreateUserClose}
        >
          <DialogTitle
            sx={{
              p: 3
            }}
          >
            <Typography variant="h4" gutterBottom>
              {t(`${user._id ? 'Update' : 'Add new'} user`)}
            </Typography>
            <Typography variant="subtitle2">
              {t(
                'Fill in the fields below to create or update a user to the site'
              )}
            </Typography>
          </DialogTitle>
          <Formik
            initialValues={user}
            validationSchema={Yup.object().shape({
              name: Yup.string()
                .max(255)
                .required(t('The name field is required')),
              email: Yup.string()
                .max(255)
                .required(t('The email field is required')),
              password: Yup.string()
                .max(255)
                .required(t('The password field is required'))
            })}
            onSubmit={async (
              values,
              { resetForm, setErrors, setStatus, setSubmitting }
            ) => {
              try {
                console.log(values, '--------------values in user index');
                if (values._id) dispatch(updateUser(values));
                else dispatch(addUser(values));
                resetForm();
                setStatus({ success: true });
                setSubmitting(false);
                handleCreateUserSuccess();
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
                            label={t('User name')}
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
                            label={t('User email')}
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
                            type="password"
                            helperText={touched.password && errors.password}
                            label={t('Password')}
                            name="password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.password}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <Autocomplete
                            id="role"
                            name="role"
                            options={userRoles}
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
                                label={t('User role')}
                                onChange={handleChange}
                                value={values.role}
                              />
                            )}
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
                  <Button color="secondary" onClick={handleCreateUserClose}>
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
                    {t(`${user._id ? 'Update' : 'Add'} user`)}
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
                'Are you sure you want to permanently delete this user account'
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
            users={users}
            handleUpdatedUserOpen={handleUpdatedUserOpen}
            handleConfirmDelete={handleConfirmDelete}
          />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

export default ManagementUsers;
