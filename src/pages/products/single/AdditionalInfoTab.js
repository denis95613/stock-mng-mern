import { Typography, Card } from '@mui/material';
import { useTranslation } from 'react-i18next';

function AdditionalInfoTab(product) {
  const { t } = useTranslation();

  return (
    <Card
      sx={{
        p: 4
      }}
    >
      <Typography variant="h4" gutterBottom>
        {t('Description')}
      </Typography>
      {product.description}
    </Card>
  );
}

export default AdditionalInfoTab;
