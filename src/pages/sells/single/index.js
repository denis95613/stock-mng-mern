// import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PageHeader from './PageHeader';
import { Box, Grid, styled } from '@mui/material';
import AdditionalInfo from './AdditionalInfo';
import GeneralSection from './GeneralSection';

const MainContentWrapper = styled(Box)(
  () => `
  flex-grow: 1;
`
);

function ManagementProductCreate() {
  return (
    <>
      <Helmet>
        <title>Create Sell</title>
      </Helmet>
      <Box mb={3} display="flex">
        <MainContentWrapper>
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
              <Box
                mt={3}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <PageHeader />
              </Box>
            </Grid>
            <Grid item xs={12}>
              <GeneralSection />
            </Grid>
            <Grid item xs={12}>
              <AdditionalInfo />
            </Grid>
          </Grid>
        </MainContentWrapper>
      </Box>
    </>
  );
}

export default ManagementProductCreate;
