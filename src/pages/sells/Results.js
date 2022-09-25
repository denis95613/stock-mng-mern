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
import { setSell, deleteSell } from 'src/slices/sell';
import _ from 'lodash';

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

const applyFilters = (sells, query) => {
  return sells.filter((sell) => {
    let matches = true;

    if (query) {
      const properties = ['name'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (sell[property].toLowerCase().includes(query.toLowerCase())) {
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

const applyPagination = (sells, page, limit) => {
  return sells.slice(page * limit, page * limit + limit);
};

const Results = ({ sells }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedItems, setSelectedSells] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [query, setQuery] = useState('');

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSelectAllSells = (event) => {
    setSelectedSells(event.target.checked ? sells.map((sell) => sell._id) : []);
  };

  const handleSelectOneSell = (event, sellId) => {
    if (!selectedItems.includes(sellId)) {
      setSelectedSells((prevSelected) => [...prevSelected, sellId]);
    } else {
      setSelectedSells((prevSelected) =>
        prevSelected.filter((_id) => _id !== sellId)
      );
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const updateSell = (pro) => {
    dispatch(setSell(pro));
    return navigate(`/${location.pathname.split('/')[1]}/single`);
  };

  const filteredSells = applyFilters(sells, query);
  const paginatedSells = applyPagination(filteredSells, page, limit);
  const selectedBulkActions = selectedItems.length > 0;
  const selectedSomeSells =
    selectedItems.length > 0 && selectedItems.length < sells.length;
  const selectedAllSells = selectedItems.length === sells.length;
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
    dispatch(deleteSell(delId));
    setDelId('');
    setOpenConfirmDelete(false);

    enqueueSnackbar(t('You successfully deleted the sell'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
  };

  const sellOne = (pro) => {
    dispatch(setSell(pro));
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
                  placeholder={t('Search by sell name...')}
                />
              </Box>
              <TablePagination
                component="div"
                count={filteredSells.length}
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
        {paginatedSells.length === 0 ? (
          <Typography
            sx={{
              py: 10
            }}
            variant="h3"
            fontWeight="normal"
            color="text.secondary"
            align="center"
          >
            {t("We couldn't find any sells matching your search criteria")}
          </Typography>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedAllSells}
                        indeterminate={selectedSomeSells}
                        onChange={handleSelectAllSells}
                      />
                    </TableCell>
                    {/* <TableCell>{t('Invoice No')}</TableCell> */}
                    <TableCell>{t('Customer')}</TableCell>
                    <TableCell>{t('Contact')}</TableCell>
                    <TableCell>{t('Shop')}</TableCell>
                    <TableCell>{t('Payment status')}</TableCell>
                    <TableCell>{t('Payment method')}</TableCell>
                    <TableCell>{t('Amount')}</TableCell>
                    <TableCell>{t('Paid')}</TableCell>
                    <TableCell>{t('Sell due')}</TableCell>
                    <TableCell>{t('Sell retrun due')}</TableCell>
                    {/* <TableCell>{t('Shipping status')}</TableCell> */}
                    <TableCell>{t('Items')}</TableCell>
                    <TableCell>{t('Added by')}</TableCell>
                    {/* <TableCell>{t('Sell note')}</TableCell>
                    <TableCell>{t('Stuf note')}</TableCell> */}
                    {/* <TableCell>{t('Shipping note')}</TableCell> */}
                    <TableCell align="center">{t('Actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedSells.map((sell) => {
                    const isSellSelected = selectedItems.includes(sell._id);
                    return (
                      <TableRow hover key={sell._id} selected={isSellSelected}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isSellSelected}
                            onChange={(event) =>
                              handleSelectOneSell(event, sell._id)
                            }
                            value={isSellSelected}
                          />
                        </TableCell>
                        {/* <TableCell>
                          <Typography>{sell.invoice_no}</Typography>
                        </TableCell> */}
                        <TableCell>
                          <Typography>{sell.customer.name || ''}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{sell.contact}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{sell.shop.name || ''}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>
                            {sell.payment_status
                              ? sell.payment_status.label
                              : ''}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>
                            {sell.payment_method
                              ? sell.payment_method.label
                              : ''}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{sell.total_amount}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{sell.paid_amount}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{sell.sell_due}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{sell.sell_return_due}</Typography>
                        </TableCell>
                        {/* <TableCell>
                          <Typography>{sell.shipping_status}</Typography>
                        </TableCell> */}
                        <TableCell>
                          <Typography>
                            {_.get(sell, 'items[0].product.name')
                              ? _.get(sell, 'items[0].product.name') + '...'
                              : ''}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>
                            {sell.added_by ? sell.added_by.name : ''}
                          </Typography>
                        </TableCell>
                        {/* <TableCell>
                          <Typography>{sell.sell_note}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{sell.stuf_note}</Typography>
                        </TableCell> */}
                        {/* <TableCell>
                          <Typography>{sell.shipping_note}</Typography>
                        </TableCell> */}
                        <TableCell align="center">
                          <Typography noWrap>
                            <Tooltip title={t('View')} arrow>
                              <IconButton
                                color="primary"
                                onClick={() => sellOne(sell)}
                              >
                                <LaunchTwoToneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t('Edit')} arrow>
                              <IconButton
                                onClick={() => updateSell(sell)}
                                color="primary"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t('Delete')} arrow>
                              <IconButton
                                onClick={() => handleConfirmDelete(sell._id)}
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
                count={filteredSells.length}
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
            {t('Do you really want to delete this sell')}?
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
  sells: PropTypes.array.isRequired
};

Results.defaultProps = {
  sells: []
};

export default Results;
