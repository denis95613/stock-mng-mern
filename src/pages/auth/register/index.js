import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  Container,
  // Divider,
  Link,
  // ListItemText,
  // ListItem,
  // List,
  // ListItemIcon,
  // IconButton,
  Typography,
  styled
} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import useAuth from 'src/hooks/useAuth';
import JWTRegister from './RegisterJWT';
import { useTranslation } from 'react-i18next';
// import CheckCircleOutlineTwoToneIcon from '@mui/icons-material/CheckCircleOutlineTwoTone';
// import Scrollbar from 'src/components/Scrollbar';
// import Logo from 'src/components/LogoSign';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// import ChevronRightTwoToneIcon from '@mui/icons-material/ChevronRightTwoTone';
// import ChevronLeftTwoToneIcon from '@mui/icons-material/ChevronLeftTwoTone';

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

// const CardImg = styled(Card)(
//   ({ theme }) => `
//     border-radius: 100%;
//     display: inline-flex;
//     align-items: center;
//     justify-content: center;
//     position: relative;
//     border: 11px solid ${theme.colors.alpha.trueWhite[10]};
//     transition: ${theme.transitions.create(['border'])};
//     width: ${theme.spacing(16)};
//     height: ${theme.spacing(16)};
//     margin-bottom: ${theme.spacing(3)};
// `
// );

// const SwipeIndicator = styled(IconButton)(
//   ({ theme }) => `
//         color: ${theme.colors.alpha.trueWhite[50]};
//         width: ${theme.spacing(6)};
//         height: ${theme.spacing(6)};
//         border-radius: 100px;
//         transition: ${theme.transitions.create(['background', 'color'])};

//         &:hover {
//           color: ${theme.colors.alpha.trueWhite[100]};
//           background: ${theme.colors.alpha.trueWhite[10]};
//         }
// `
// );

// const LogoWrapper = styled(Box)(
//   ({ theme }) => `
//     position: fixed;
//     left: ${theme.spacing(4)};
//     top: ${theme.spacing(4)};
// `
// );

const TypographyPrimary = styled(Typography)(
  ({ theme }) => `
      color: ${theme.colors.alpha.trueWhite[100]};
`
);

// const TypographySecondary = styled(Typography)(
//   ({ theme }) => `
//       color: ${theme.colors.alpha.trueWhite[70]};
// `
// );

// const DividerWrapper = styled(Divider)(
//   ({ theme }) => `
//       background: ${theme.colors.alpha.trueWhite[10]};
// `
// );

// const ListItemTextWrapper = styled(ListItemText)(
//   ({ theme }) => `
//       color: ${theme.colors.alpha.trueWhite[70]};
// `
// );
// const ListItemIconWrapper = styled(ListItemIcon)(
//   ({ theme }) => `
//       color: ${theme.colors.success.main};
//       min-width: 32px;
// `
// );

function Register() {
  const { method } = useAuth();
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>Register</title>
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
          <Container maxWidth="sm">
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
                  {t('Create account')}
                </Typography>
                <Typography
                  variant="h4"
                  color="text.secondary"
                  fontWeight="normal"
                  sx={{
                    mb: 3
                  }}
                >
                  {t('Fill in the fields below to sign up for an account.')}
                </Typography>
              </Box>
              {method === 'JWT' && <JWTRegister />}
              <Box mt={4}>
                <Typography
                  component="span"
                  variant="subtitle2"
                  color="text.primary"
                  fontWeight="bold"
                >
                  {t('Already have an account?')}
                </Typography>{' '}
                <Box display={{ xs: 'block', md: 'inline-block' }}>
                  <Link component={RouterLink} to="/login">
                    <b>{t('Sign in here')}</b>
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

export default Register;
