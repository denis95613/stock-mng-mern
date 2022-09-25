import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Grid, Typography, Button } from '@mui/material';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { setPurchase } from 'src/slices/purchase';

function PageHeader() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const goCreate = () => {
    dispatch(setPurchase({}));
    return navigate(`/${location.pathname.split('/')[1]}/single`);
  };

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          {t('Purchases')}
        </Typography>
        <Typography variant="subtitle2">
          {t('Use this page to manage your purchases , the fast and easy way.')}
        </Typography>
      </Grid>
      <Grid item>
        <Button
          sx={{
            mt: { xs: 2, sm: 0 }
          }}
          variant="contained"
          startIcon={<AddTwoToneIcon fontSize="small" />}
          onClick={() => goCreate()}
        >
          {t('Create purchase')}
        </Button>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
