// import { useState } from 'react';

import { Helmet } from 'react-helmet-async';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid } from '@mui/material';
import { useSelector } from 'src/store';
import Footer from 'src/components/Footer';
import PageHeader from './PageHeader';
import ProductBody from './ProductBody';

function ManagementProductSingle() {
  const product = useSelector((state) => state.product.item);

  return (
    <>
      <Helmet>
        <title>{product.name + ' - Products Management'}</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader product={product} />
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
          <ProductBody />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

export default ManagementProductSingle;
