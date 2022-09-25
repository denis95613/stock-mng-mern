// import React, { useState, useCallback } from 'react';
import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'src/store';
import { useLocation, useNavigate } from 'react-router';
import {
  ListItemText,
  // Avatar,
  Box,
  Typography,
  FormControlLabel,
  Button,
  Switch,
  Divider,
  Grid,
  ListItem,
  List,
  CardHeader,
  // Alert,
  Card,
  TextField,
  Autocomplete
  // styled
  // useTheme
} from '@mui/material';
// import PropTypes from 'prop-types';
import { setProduct, addProduct, updateProduct } from 'src/slices/product';
import Dropzone from 'react-dropzone';
import { useTranslation } from 'react-i18next';
// import CloudUploadTwoToneIcon from '@mui/icons-material/CloudUploadTwoTone';
// import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
// import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
// import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';

// const DotLegend = styled('span')(
//   ({ theme }) => `
//     border-radius: 22px;
//     width: ${theme.spacing(1.5)};
//     height: ${theme.spacing(1.5)};
//     display: inline-block;
//     margin-right: ${theme.spacing(0.5)};
// `
// );

// const BoxUploadWrapper = styled(Box)(
//   ({ theme }) => `
//     border-radius: ${theme.general.borderRadius};
//     padding: ${theme.spacing(2)};
//     background: ${theme.colors.alpha.black[5]};
//     border: 1px dashed ${theme.colors.alpha.black[30]};
//     outline: none;
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//     justify-content: center;
//     transition: ${theme.transitions.create(['border', 'background'])};

//     &:hover {
//       background: ${theme.colors.alpha.white[50]};
//       border-color: ${theme.colors.primary.main};
//     }
// `
// );

// const AvatarWrapper = styled(Avatar)(
//   ({ theme }) => `
//     background: transparent;
//     color: ${theme.colors.primary.main};
//     width: ${theme.spacing(7)};
//     height: ${theme.spacing(7)};
// `
// );

// const AvatarSuccess = styled(Avatar)(
//   ({ theme }) => `
//     background: ${theme.colors.success.light};
//     width: ${theme.spacing(7)};
//     height: ${theme.spacing(7)};
// `
// );

// const AvatarDanger = styled(Avatar)(
//   ({ theme }) => `
//     background: ${theme.colors.error.light};
//     width: ${theme.spacing(7)};
//     height: ${theme.spacing(7)};
// `
// );

function Sidebar() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  // const theme = useTheme();
  const dispatch = useDispatch();
  const product = useSelector((state) => state.product.item);
  const categories = useSelector((state) => state.category.items);
  const [file, setFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState('');
  const [isPreviewAvailable, setIsPreviewAvailable] = useState(false);

  const save = () => {
    dispatch(
      setProduct({
        ...product,
        isDeleted: false,
        isPublished: true
      })
    );
    if (product._id)
      dispatch(updateProduct({ ...product, category: product.category._id }));
    else dispatch(addProduct({ ...product, category: product.category._id }));
  };

  const draft = () => {
    dispatch(
      setProduct({
        ...product,
        isDeleted: true
      })
    );
    if (product._id) dispatch(updateProduct(product));
    else dispatch(addProduct(product));
  };

  const preview = () => {
    return navigate(
      `/${location.pathname.split('/')[1]}/single/${product._id}`
    );
  };

  const goCategory = () => {
    return navigate('/categories/list');
  };

  const virtualProduct = () => {
    dispatch(
      setProduct({
        ...product,
        isPublished: !product.isPublished,
        isDeleted: !product.isPublished ? false : product.isDeleted
      })
    );
    if (product._id) dispatch(updateProduct(product));
  };

  const handleOnSubmit = async () => {
    // const handleOnSubmit = async (event) => {
    // event.preventDefault();

    try {
      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        await axios.post('/api/file/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        console.log('Please select a file to add.');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onDrop = (files) => {
    const [uploadedFile] = files;
    setFile(uploadedFile);

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewSrc(fileReader.result);
    };
    fileReader.readAsDataURL(uploadedFile);
    setIsPreviewAvailable(uploadedFile.name.match(/\.(jpeg|jpg|png)$/));
  };

  // const {
  //   acceptedFiles,
  //   isDragActive,
  //   isDragAccept,
  //   isDragReject,
  //   getRootProps,
  //   getInputProps
  // } = useDropzone({
  //   accept: {
  //     'image/png': ['.png'],
  //     'image/jpeg': ['.jpg']
  //   }
  // });

  // const files = acceptedFiles.map((file, index) => (
  //   <ListItem disableGutters component="div" key={index}>
  //     <ListItemText primary={file.name} />
  //     <b>{file.size} bytes</b>
  //     <Divider />
  //   </ListItem>
  // ));

  return (
    <Box>
      <Card
        sx={{
          m: 3
        }}
      >
        <Divider />
        <Box p={2}>
          <FormControlLabel
            control={<Switch color="primary" checked={product.isPublished} />}
            label={t('Virtual Product')}
            onChange={() => virtualProduct()}
          />
        </Box>
        <Divider />
        <List
          dense
          sx={{
            p: 2
          }}
        >
          <ListItem disableGutters>
            <ListItemText
              sx={{
                width: 110,
                flex: 'initial'
              }}
              primary={t('Status')}
            />
            <b>Draft</b>
          </ListItem>
          <ListItem disableGutters>
            <ListItemText
              sx={{
                width: 110,
                flex: 'initial'
              }}
              primary={t('Visibility')}
            />
            <b>Visible</b>
          </ListItem>
          <ListItem disableGutters>
            <ListItemText
              sx={{
                width: 110,
                flex: 'initial'
              }}
              primary={
                <>
                  <Typography
                    variant="body1"
                    sx={{
                      pt: 0.5,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {/* <DotLegend
                      style={{ background: theme.colors.success.main }}
                    />
                    {t('SEO Score')} */}
                  </Typography>
                </>
              }
            />
            {/* <b>{t('Good')}</b> */}
          </ListItem>
        </List>
        <Divider />
        <Box p={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                size="small"
                color="primary"
                disabled={!product._id}
                onClick={() => preview()}
              >
                {t('Preview')}
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                variant="outlined"
                size="small"
                color="primary"
                disabled={!product._id || product.isDeleted}
                onClick={() => draft()}
              >
                {t('Save draft')}
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth variant="contained" onClick={() => save()}>
                {product._id ? t('Edit') : t('Publish now')}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Card>
      <Card
        sx={{
          m: 3
        }}
      >
        <CardHeader
          action={
            <Button
              size="small"
              variant="outlined"
              onClick={() => goCategory()}
            >
              {t('Add category')}
            </Button>
          }
          title={t('Categories')}
        />
        <Divider />
        <Box p={2}>
          <Autocomplete
            id="category"
            name="category"
            options={categories}
            getOptionLabel={(option) => option.parent + ' - ' + option.name}
            value={product.category}
            groupBy={(option) => option.state}
            onChange={(e, newValue) =>
              dispatch(setProduct({ ...product, category: newValue }))
            }
            renderInput={(params) => (
              <TextField
                fullWidth
                {...params}
                label={t('Select category')}
                onChange={(newValue) =>
                  dispatch(setProduct({ ...product, category: newValue }))
                }
                value={product.category}
              />
            )}
          />
        </Box>
      </Card>
      <Card
        sx={{
          m: 3
        }}
      >
        <CardHeader title={t('Product Images')} />
        <Divider />
        {/* <Box p={2}>
          <BoxUploadWrapper {...getRootProps()}>
            <input {...getInputProps()} />
            {isDragAccept && (
              <>
                <AvatarSuccess variant="rounded">
                  <CheckTwoToneIcon />
                </AvatarSuccess>
                <Typography
                  sx={{
                    mt: 2
                  }}
                >
                  {t('Drop the files to start uploading')}
                </Typography>
              </>
            )}
            {isDragReject && (
              <>
                <AvatarDanger variant="rounded">
                  <CloseTwoToneIcon />
                </AvatarDanger>
                <Typography
                  sx={{
                    mt: 2
                  }}
                >
                  {t('You cannot upload these file types')}
                </Typography>
              </>
            )}
            {!isDragActive && (
              <>
                <AvatarWrapper variant="rounded">
                  <CloudUploadTwoToneIcon />
                </AvatarWrapper>
                <Typography
                  sx={{
                    mt: 2
                  }}
                >
                  {t('Drag & drop files here')}
                </Typography>
              </>
            )}
          </BoxUploadWrapper>
        </Box>
        {files.length > 0 && (
          <>
            <Divider />
            <Box p={2}>
              <Alert
                sx={{
                  py: 0
                }}
                severity="success"
              >
                {t('You have uploaded')} <b>{files.length}</b> {t('files')}!
              </Alert>
              <List
                disablePadding
                sx={{
                  mt: 2
                }}
                component="div"
              >
                {files}
              </List>
            </Box>
          </>
        )} */}
        <div className="upload-section">
          <Dropzone onDrop={onDrop}>
            {({ getRootProps, getInputProps }) => (
              <div {...getRootProps({ className: 'drop-zone' })}>
                <input {...getInputProps()} />
                <p>Drag and drop a file OR click here to select a file</p>
                {file && (
                  <div>
                    <strong>Selected file:</strong> {file.name}
                  </div>
                )}
              </div>
            )}
          </Dropzone>
          {previewSrc ? (
            isPreviewAvailable ? (
              <div className="image-preview">
                <img className="preview-image" src={previewSrc} alt="Preview" />
              </div>
            ) : (
              <div className="preview-message">
                <p>No preview available for this file</p>
              </div>
            )
          ) : (
            <div className="preview-message">
              <p>Image preview will be shown here after selection</p>
            </div>
          )}
        </div>
        {/* <Button variant="primary" type="button" onClick={handleOnSubmit}> */}
        <Button
          variant="primary"
          type="button"
          onClick={() => handleOnSubmit()}
        >
          Submit
        </Button>
      </Card>
    </Box>
  );
}

export default Sidebar;
