import { useState, forwardRef } from 'react';
import { useDispatch } from 'src/store';
import { useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Slide,
  Divider,
  Tooltip,
  IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  TextField,
  Button,
  Typography,
  Dialog,
  useMediaQuery,
  useTheme,
  Zoom,
  styled
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { useTranslation } from 'react-i18next';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import BulkActions from './BulkActions';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import { useSnackbar } from 'notistack';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import { setPurchase, deletePurchase } from 'src/slices/purchase';

const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
      }
`
);

const AvatarError = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.error.lighter};
      color: ${theme.colors.error.main};
      width: ${theme.spacing(12)};
      height: ${theme.spacing(12)};

      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(45)};
      }
`
);

const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
     }
    `
);

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const applyFilters = (purchases, query) => {
  return purchases.filter((purchase) => {
    let matches = true;

    if (query) {
      const properties = ['name'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (purchase[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    return matches;
  });
};

const applyPagination = (purchases, page, limit) => {
  return purchases.slice(page * limit, page * limit + limit);
};

const Results = ({ purchases }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedItems, setSelectedPurchases] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [query, setQuery] = useState('');

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSelectAllPurchases = (event) => {
    setSelectedPurchases(
      event.target.checked ? purchases.map((purchase) => purchase._id) : []
    );
  };

  const handleSelectOnePurchase = (event, purchaseId) => {
    if (!selectedItems.includes(purchaseId)) {
      setSelectedPurchases((prevSelected) => [...prevSelected, purchaseId]);
    } else {
      setSelectedPurchases((prevSelected) =>
        prevSelected.filter((_id) => _id !== purchaseId)
      );
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const updatePurchase = (pro) => {
    dispatch(setPurchase(pro));
    return navigate(`/${location.pathname.split('/')[1]}/single`);
  };

  const filteredPurchases = applyFilters(purchases, query);
  const paginatedPurchases = applyPagination(filteredPurchases, page, limit);
  const selectedBulkActions = selectedItems.length > 0;
  const selectedSomePurchases =
    selectedItems.length > 0 && selectedItems.length < purchases.length;
  const selectedAllPurchases = selectedItems.length === purchases.length;
  const mobile = useMediaQuery(theme.breakpoints.down('md'));
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [delId, setDelId] = useState('');

  const handleConfirmDelete = (id) => {
    setDelId(id);
    setOpenConfirmDelete(true);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const handleDeleteCompleted = () => {
    dispatch(deletePurchase(delId));
    setDelId('');
    setOpenConfirmDelete(false);

    enqueueSnackbar(t('You successfully deleted the purchase'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
  };

  const purchaseOne = (pro) => {
    dispatch(setPurchase(pro));
    return navigate(`/${location.pathname.split('/')[1]}/single`);
  };

  return (
    <>
      <Card>
        <Box display="flex" alignItems="center">
          {selectedBulkActions && (
            <Box flex={1} p={2}>
              <BulkActions />
            </Box>
          )}
          {!selectedBulkActions && (
            <Box
              flex={1}
              p={2}
              display={{ xs: 'block', md: 'flex' }}
              alignItems="center"
              justifyContent="space-between"
            >
              <Box
                sx={{
                  mb: { xs: 2, md: 0 }
                }}
              >
                <TextField
                  size="small"
                  fullWidth={mobile}
                  onChange={handleQueryChange}
                  value={query}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchTwoToneIcon />
                      </InputAdornment>
                    )
                  }}
                  placeholder={t('Search by purchase name...')}
                />
              </Box>
              <TablePagination
                component="div"
                count={filteredPurchases.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[5, 10, 15]}
              />
            </Box>
          )}
        </Box>
        <Divider />
        {paginatedPurchases.length === 0 ? (
          <Typography
            sx={{
              py: 10
            }}
            variant="h3"
            fontWeight="normal"
            color="text.secondary"
            align="center"
          >
            {t("We couldn't find any purchases matching your search criteria")}
          </Typography>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedAllPurchases}
                        indeterminate={selectedSomePurchases}
                        onChange={handleSelectAllPurchases}
                      />
                    </TableCell>
                    <TableCell>{t('Reference No')}</TableCell>
                    <TableCell>{t('Location')}</TableCell>
                    <TableCell>{t('Supplier')}</TableCell>
                    <TableCell>{t('Purchase status')}</TableCell>
                    <TableCell>{t('Payment status')}</TableCell>
                    <TableCell>{t('Grand amount')}</TableCell>
                    <TableCell>{t('Paid amount')}</TableCell>
                    <TableCell>{t('Added by')}</TableCell>
                    <TableCell align="center">{t('Actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedPurchases.map((purchase) => {
                    const isPurchaseSelected = selectedItems.includes(
                      purchase._id
                    );
                    return (
                      <TableRow
                        hover
                        key={purchase._id}
                        selected={isPurchaseSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isPurchaseSelected}
                            onChange={(event) =>
                              handleSelectOnePurchase(event, purchase._id)
                            }
                            value={isPurchaseSelected}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography>{purchase.reference_no}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{purchase.location}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>
                            {purchase.supplier.name || ''}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>
                            {purchase.purchase_status
                              ? purchase.purchase_status.label
                              : ''}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>
                            {purchase.payment_status
                              ? purchase.payment_status.label
                              : ''}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{purchase.total_amount}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{purchase.paid_amount}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{purchase.added_by}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography noWrap>
                            <Tooltip title={t('View')} arrow>
                              <IconButton
                                color="primary"
                                onClick={() => purchaseOne(purchase)}
                              >
                                <LaunchTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t('Edit')} arrow>
                              <IconButton
                                onClick={() => updatePurchase(purchase)}
                                color="primary"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t('Delete')} arrow>
                              <IconButton
                                onClick={() =>
                                  handleConfirmDelete(purchase._id)
                                }
                                color="primary"
                              >
                                <DeleteTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Typography>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <Box p={2}>
              <TablePagination
                component="div"
                count={filteredPurchases.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={page}
                rowsPerPage={limit}
                rowsPerPageOptions={[5, 10, 15]}
              />
            </Box>
          </>
        )}
      </Card>
      <DialogWrapper
        open={openConfirmDelete}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={closeConfirmDelete}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          p={5}
        >
          <AvatarError>
            <CloseIcon />
          </AvatarError>

          <Typography
            align="center"
            sx={{
              pt: 4,
              px: 6
            }}
            variant="h3"
          >
            {t('Do you really want to delete this purchase')}?
          </Typography>

          <Typography
            align="center"
            sx={{
              pt: 2,
              pb: 4,
              px: 6
            }}
            fontWeight="normal"
            color="text.secondary"
            variant="h4"
          >
            {t("You won't be able to revert after deletion")}
          </Typography>

          <Box>
            <Button
              variant="text"
              size="large"
              sx={{
                mx: 1
              }}
              onClick={closeConfirmDelete}
            >
              {t('Cancel')}
            </Button>
            <ButtonError
              onClick={handleDeleteCompleted}
              size="large"
              sx={{
                mx: 1,
                px: 3
              }}
              variant="contained"
            >
              {t('Delete')}
            </ButtonError>
          </Box>
        </Box>
      </DialogWrapper>
    </>
  );
};

Results.propTypes = {
  purchases: PropTypes.array.isRequired
};

Results.defaultProps = {
  purchases: []
};

export default Results;
