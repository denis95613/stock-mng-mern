import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Breadcrumbs,
  Box,
  Grid,
  Link,
  Typography,
  Tooltip,
  IconButton
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import PropTypes from 'prop-types';

const PageHeader = ({ shop }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    return navigate(`/${location.pathname.split('/')[1]}/list`);
  };
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Tooltip arrow placement="top" title={t('Go back')}>
            <IconButton
              onClick={handleBack}
              color="primary"
              sx={{
                p: 2,
                mr: 2
              }}
            >
              <ArrowBackTwoToneIcon />
            </IconButton>
          </Tooltip>
          <Box>
            <Typography variant="h3" component="h3" gutterBottom>
              {t('Shop Details')}
            </Typography>
            <Breadcrumbs maxItems={2} aria-label="breadcrumb">
              <Link color="inherit" href="/">
                {t('Home')}
              </Link>
              <Link component={RouterLink} color="inherit" to="/shops">
                {t('Shops')}
              </Link>
              <Typography color="text.primary">{shop.name}</Typography>
            </Breadcrumbs>
          </Box>
        </Box>
      </Grid>
      {/* <Grid item></Grid> */}
    </Grid>
  );
};

PageHeader.propTypes = {
  shop: PropTypes.object.isRequired
};

export default PageHeader;
