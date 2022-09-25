import { useEffect } from 'react';
import { useDispatch, useSelector } from 'src/store';
import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Grid } from '@mui/material';
import { getSells } from 'src/slices/sell';
import { getProducts } from 'src/slices/product';
import { getCategories } from 'src/slices/category';
import Results from './Results';

function ManagementSells() {
  const dispatch = useDispatch();
  const sells = useSelector((state) => state.sell.items);
  const products = useSelector((state) => state.product.items);
  const categories = useSelector((state) => state.category.items);

  useEffect(() => {
    if (sells.length === 0) dispatch(getSells());
    if (products.length === 0) dispatch(getProducts());
    if (categories.length === 0) dispatch(getCategories());
  }, []);

  return (
    <>
      <Helmet>
        <title>Sells - Management</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
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
          <Results sells={sells} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

export default ManagementSells;
