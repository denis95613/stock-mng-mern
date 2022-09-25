import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'src/store';
import { Helmet } from 'react-helmet-async';
import { Grid } from '@mui/material';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import Footer from 'src/components/Footer';
import PageHeader from './PageHeader';
import ProductResults from './ProductResults';
import StockResults from './StockResults';
import { getProducts } from 'src/slices/product';
import { getStocksByShop } from 'src/slices/stock';

function ManagementShopSingle() {
  const dispatch = useDispatch();
  const shop = useSelector((state) => state.shop.item);
  const products = useSelector((state) => state.product.items);
  const stocks = useSelector((state) => state.stock.items);

  useEffect(() => {
    if (products) dispatch(getProducts());
    dispatch(getStocksByShop);
  }, []);

  return (
    <>
      <Helmet>
        <title>{shop.name + ' - Shops Management'}</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader shop={shop} />
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
        <Grid item xs={6}>
          <ProductResults products={products} />
        </Grid>
        <Grid item xs={6}>
          <StockResults stocks={stocks} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

export default ManagementShopSingle;
