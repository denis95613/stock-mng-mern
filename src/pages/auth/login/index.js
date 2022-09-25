import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  Link,
  // Tooltip,
  Typography,
  Container,
  // Alert,
  styled
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import useAuth from 'src/hooks/useAuth';
import JWTLogin from './LoginJWT';

import { useTranslation } from 'react-i18next';
// import Logo from 'src/components/Logo';
// import Scrollbar from 'src/components/Scrollbar';

// const icons = {
//   JWT: '/static/images/logo/jwt.svg'
// };

const Content = styled(Box)(
  () => `
    display: flex;
    flex: 1;
    width: 100%;
`
);
const MainContent = styled(Box)(
  ({ theme }) => `
    @media (min-width: ${theme.breakpoints.values.md}px) {
      padding: 0 0 0 500px;
    }
    width: 100%;
    display: flex;
    align-items: center;
`
);

const SidebarWrapper = styled(Box)(
  ({ theme }) => `
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 500px;
  background: ${theme.colors.gradients.blue3};
`
);

const SidebarContent = styled(Box)(
  ({ theme }) => `
  display: flex;
  flex-direction: column;
  padding: ${theme.spacing(6)};
`
);

const TypographyPrimary = styled(Typography)(
  ({ theme }) => `
      color: ${theme.colors.alpha.trueWhite[100]};
`
);

// const CardImg = styled(Card)(
//   ({ theme }) => `
//     border-radius: 100%;
//     display: inline-flex;
//     align-items: center;
//     justify-content: center;
//     position: relative;
//     border: 1px solid ${theme.colors.alpha.black[10]};
//     transition: ${theme.transitions.create(['border'])};
//     position: absolute;

//     &:hover {
//       border-color: ${theme.colors.primary.main};
//     }
// `
// );

// const TypographyH1 = styled(Typography)(
//   ({ theme }) => `
//     font-size: ${theme.typography.pxToRem(33)};
// `
// );

function Login() {
  const { method } = useAuth();
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <Content>
        <SidebarWrapper
          sx={{
            display: { xs: 'none', md: 'inline-block' }
          }}
        >
          <SidebarContent>
            <TypographyPrimary
              align="center"
              variant="h3"
              sx={{
                mt: 5,
                mb: 4,
                px: 8
              }}
            >
              {t('Stock Management')}
            </TypographyPrimary>
          </SidebarContent>
        </SidebarWrapper>
        <MainContent>
          <Container
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column'
            }}
            maxWidth="sm"
            // maxWidth="md"
          >
            <Card
              sx={{
                p: 4,
                my: 4
              }}
            >
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  sx={{
                    mb: 1
                  }}
                >
                  {t('Sign in')}
                </Typography>
                <Typography
                  variant="h4"
                  color="text.secondary"
                  fontWeight="normal"
                  sx={{
                    mb: 3
                  }}
                >
                  {t('Fill in the fields below to sign into your account.')}
                </Typography>
              </Box>
              {method === 'JWT' && <JWTLogin />}
              {/* <JWTLogin /> */}
              <Box my={4}>
                <Typography
                  component="span"
                  variant="subtitle2"
                  color="text.primary"
                  fontWeight="bold"
                >
                  {t('Don’t have an account, yet?')}
                </Typography>{' '}
                <Box display={{ xs: 'block', md: 'inline-block' }}>
                  <Link component={RouterLink} to="/register">
                    <b>Sign up here</b>
                  </Link>
                </Box>
              </Box>
            </Card>
          </Container>
        </MainContent>
      </Content>
    </>
  );
}

export default Login;
