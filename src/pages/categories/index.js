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
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'src/store';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import CategoryTree from 'src/components/TreeView';
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory
} from 'src/slices/category';
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

function ManagementCategories() {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.items);
  const category = useSelector((state) => state.category.item);

  useEffect(() => {
    dispatch(getCategories());
  }, []);

  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);

  // const [category, setCategory] = useState({
  //   parent: '',
  //   name: '',
  //   description: ''
  // });

  const handleCreateCategoryOpen = () => {
    // setCategory({
    //   parent: '',
    //   name: '',
    //   description: ''
    // });
    setOpen(true);
  };

  const handleUpdatedCategoryOpen = (category) => {
    // setCategory(category);
    console.log(category);
    setOpen(true);
  };

  const handleCreateCategoryClose = () => {
    // setCategory({
    //   parent: '',
    //   name: '',
    //   description: ''
    // });
    setOpen(false);
  };

  const handleCreateCategoriesuccess = () => {
    enqueueSnackbar(
      t(
        `The category was ${category._id ? 'updated' : 'created'} successfully`
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

    // setCategory({
    //   parent: '',
    //   name: '',
    //   description: ''
    // });
    setOpen(false);
  };

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);

  const handleConfirmDelete = (category) => {
    console.log(category);
    // setCategory(category);
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    // setCategory({
    //   parent: '',
    //   name: '',
    //   description: ''
    // });
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = () => {
    dispatch(deleteCategory(category._id));
    // setCategory({
    //   parent: '',
    //   name: '',
    //   description: ''
    // });
    setOpenConfirmDelete(false);

    enqueueSnackbar(t('The category has been removed'), {
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
        <title>Categories - Management</title>
      </Helmet>
      <PageTitleWrapper>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>
              {t('Categories Management')}
            </Typography>
            <Typography variant="subtitle2">
              {t(
                'All aspects related to the categories can be managed from this page'
              )}
            </Typography>
          </Grid>
          <Grid item>
            <Button
              sx={{
                mt: { xs: 2, sm: 0 }
              }}
              onClick={handleCreateCategoryOpen}
              variant="contained"
              startIcon={<AddTwoToneIcon fontSize="small" />}
            >
              {t('Create category')}
            </Button>
          </Grid>
        </Grid>
        <Dialog
          fullWidth
          maxWidth="md"
          open={open}
          onClose={handleCreateCategoryClose}
        >
          <DialogTitle
            sx={{
              p: 3
            }}
          >
            <Typography variant="h4" gutterBottom>
              {t(`${category._id ? 'Update' : 'Add new'} category`)}
            </Typography>
            <Typography variant="subtitle2">
              {t(
                'Fill in the fields below to create or update a category to the site'
              )}
            </Typography>
          </DialogTitle>
          <Grid container>
            <Grid item>
              <Formik
                enableReinitialize
                initialValues={category}
                validationSchema={Yup.object().shape({
                  // parent: Yup.string()
                  //   .max(255)
                  //   .required(t('The parent field is required')),
                  // name: Yup.string()
                  //   .max(255)
                  //   .required(t('The name field is required'))
                })}
                onSubmit={async (
                  values,
                  { resetForm, setErrors, setStatus, setSubmitting }
                ) => {
                  try {
                    if (values._id) dispatch(updateCategory(values));
                    else dispatch(addCategory(values));
                    resetForm();
                    setStatus({ success: true });
                    setSubmitting(false);
                    handleCreateCategoriesuccess();
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
                  // touched,
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
                        <Grid item xs={6} lg={6}>
                          <CategoryTree />
                        </Grid>
                        <Grid item xs={6} lg={6}>
                          <Grid container spacing={3}>
                            <Grid item xs={12}>
                              <TextField
                                // error={Boolean(
                                //   touched.child.parent && errors.child.parent
                                // )}
                                fullWidth
                                // helperText={
                                //   touched.child.parent && errors.child.parent
                                // }
                                inputProps={{ readOnly: true }}
                                label={t('Category parent')}
                                name="child.parent"
                                onBlur={handleBlur}
                                value={values.child.parent}
                                variant="outlined"
                                onChange={handleChange}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                // error={Boolean(
                                //   touched.child.name && errors.child.name
                                // )}
                                fullWidth
                                // helperText={
                                //   touched.child.name && errors.child.name
                                // }
                                label={t('Category name')}
                                name="child.name"
                                onBlur={handleBlur}
                                value={values.child.name}
                                variant="outlined"
                                onChange={handleChange}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                // error={Boolean(
                                //   touched.child.description &&
                                //     errors.child.description
                                // )}
                                fullWidth
                                // helperText={
                                //   touched.child.description &&
                                //   errors.child.description
                                // }
                                label={t('Category description')}
                                name="child.description"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.child.description}
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
                      <Button
                        color="secondary"
                        onClick={handleCreateCategoryClose}
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
                        {t(`${category._id ? 'Update' : 'Add'} category`)}
                      </Button>
                    </DialogActions>
                  </form>
                )}
              </Formik>
            </Grid>
          </Grid>
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
                'Are you sure you want to permanently delete this category account'
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
            categories={categories}
            handleUpdatedCategoryOpen={handleUpdatedCategoryOpen}
            handleConfirmDelete={handleConfirmDelete}
          />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

export default ManagementCategories;
