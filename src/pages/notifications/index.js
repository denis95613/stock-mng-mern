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
  Checkbox,
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
  getNotifications,
  addNotification,
  updateNotification,
  deleteNotification
} from 'src/slices/notification';
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

function ManagementNotifications() {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notification.items);

  useEffect(() => {
    dispatch(getNotifications());
  }, []);

  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);

  const [notification, setNotification] = useState({
    title: '',
    content: '',
    isRead: false
  });

  const handleCreateNotificationOpen = () => {
    setNotification({
      title: '',
      content: '',
      isRead: false
    });
    setOpen(true);
  };
  const handleUpdatedNotificationOpen = (notification) => {
    setNotification(notification);
    setOpen(true);
  };

  const handleCreateNotificationClose = () => {
    setNotification({
      title: '',
      content: '',
      isRead: false
    });
    setOpen(false);
  };

  const handleCreateNotificationsuccess = () => {
    enqueueSnackbar(
      t(
        `The notification was ${
          notification._id ? 'updated' : 'created'
        } successfully`
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

    setNotification({
      title: '',
      content: ''
    });
    setOpen(false);
  };

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const handleConfirmDelete = (notification) => {
    setNotification(notification);
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setNotification({
      title: '',
      content: '',
      isRead: false
    });
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = () => {
    dispatch(deleteNotification(notification._id));
    setNotification({
      title: '',
      content: '',
      isRead: false
    });
    setOpenConfirmDelete(false);

    enqueueSnackbar(t('The notification has been removed'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
  };

  const updateStatus = (note) => {
    console.log(note, '=----------note');
    dispatch(updateNotification({ ...note, isRead: !note.isRead }));
  };

  return (
    <>
      <Helmet>
        <title>Notifications - Management</title>
      </Helmet>
      <PageTitleWrapper>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>
              {t('Notification Management')}
            </Typography>
            <Typography variant="subtitle2">
              {t(
                'All aspects related to the notifications can be managed from this page'
              )}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              sx={{
                mt: { xs: 2, sm: 0 }
              }}
              onClick={handleCreateNotificationOpen}
              variant="contained"
              startIcon={<AddTwoToneIcon fontSize="small" />}
            >
              {t('Create notification')}
            </Button>
          </Grid>
        </Grid>
        <Dialog
          fullWidth
          maxWidth="md"
          open={open}
          onClose={handleCreateNotificationClose}
        >
          <DialogTitle
            sx={{
              p: 3
            }}
          >
            <Typography variant="h4" gutterBottom>
              {t(`${notification._id ? 'Update' : 'Add new'} notification`)}
            </Typography>
            <Typography variant="subtitle2">
              {t(
                'Fill in the fields below to create or update a notification to the site'
              )}
            </Typography>
          </DialogTitle>
          <Formik
            initialValues={notification}
            validationSchema={Yup.object().shape({
              title: Yup.string()
                .max(255)
                .required(t('The title field is required'))
            })}
            onSubmit={async (
              values,
              { resetForm, setErrors, setStatus, setSubmitting }
            ) => {
              try {
                if (values._id) dispatch(updateNotification(values));
                else dispatch(addNotification(values));
                resetForm();
                setStatus({ success: true });
                setSubmitting(false);
                handleCreateNotificationsuccess();
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
                            error={Boolean(touched.title && errors.title)}
                            fullWidth
                            helperText={touched.title && errors.title}
                            label={t('Title')}
                            name="title"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.title}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            error={Boolean(touched.content && errors.content)}
                            fullWidth
                            helperText={touched.content && errors.content}
                            label={t('Content')}
                            name="content"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.content}
                            variant="outlined"
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Checkbox
                            defaultChecked={values.isRead}
                            onClick={() =>
                              setFieldValue('isRead', !values.isRead)
                            }
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
                  <Button
                    color="secondary"
                    onClick={handleCreateNotificationClose}
                  >
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
                    {t(`${notification._id ? 'Update' : 'Add'} notification`)}
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
                'Are you sure you want to permanently delete this notification account'
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
            notifications={notifications}
            handleUpdatedNotificationOpen={handleUpdatedNotificationOpen}
            handleConfirmDelete={handleConfirmDelete}
            updateStatus={updateStatus}
          />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

export default ManagementNotifications;
