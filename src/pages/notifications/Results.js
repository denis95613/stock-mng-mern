import { useState } from 'react';
// import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  Checkbox,
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
  Typography,
  Switch
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useTranslation } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import BulkActions from './BulkActions';
import SearchTwoToneIcon from '@mui/icons-material/Edit';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

const applyFilters = (notifications, query, filters) => {
  return notifications.filter((notification) => {
    let matches = true;

    if (query) {
      const properties = ['title', 'content'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (
          notification[property].toLowerCase().includes(query.toLowerCase())
        ) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && notification[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};

const applyPagination = (notifications, page, limit) => {
  return notifications.slice(page * limit, page * limit + limit);
};

const Results = ({
  notifications,
  handleUpdatedNotificationOpen,
  handleConfirmDelete,
  updateStatus
}) => {
  const [selectedItems, setSelectedNotifications] = useState([]);
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [filters] = useState({
    notification: null
  });

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSelectAllNotifications = (event) => {
    setSelectedNotifications(
      event.target.checked
        ? notifications.map((notification) => notification._id)
        : []
    );
  };

  const handleSelectOneNotification = (_event, notificationId) => {
    if (!selectedItems.includes(notificationId)) {
      setSelectedNotifications((prevSelected) => [
        ...prevSelected,
        notificationId
      ]);
    } else {
      setSelectedNotifications((prevSelected) =>
        prevSelected.filter((id) => id !== notificationId)
      );
    }
  };

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const filteredNotifications = applyFilters(notifications, query, filters);
  const paginatedNotifications = applyPagination(
    filteredNotifications,
    page,
    limit
  );
  const selectedBulkActions = selectedItems.length > 0;
  const selectedSomenotifications =
    selectedItems.length > 0 && selectedItems.length < notifications.length;
  const selectedAllNotifications =
    selectedItems.length === notifications.length;

  return (
    <>
      <Card>
        <Box p={2}>
          {!selectedBulkActions && (
            <TextField
              sx={{
                m: 0
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchTwoToneIcon />
                  </InputAdornment>
                )
              }}
              onChange={handleQueryChange}
              placeholder={t('Search by title or content')}
              value={query}
              size="small"
              fullWidth
              margin="normal"
              variant="outlined"
            />
          )}
          {selectedBulkActions && <BulkActions />}
        </Box>

        <Divider />

        {paginatedNotifications.length === 0 ? (
          <>
            <Typography
              sx={{
                py: 10
              }}
              variant="h3"
              fontWeight="normal"
              color="text.secondary"
              align="center"
            >
              {t(
                "We couldn't find any notifications matching your search criteria"
              )}
            </Typography>
          </>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedAllNotifications}
                        indeterminate={selectedSomenotifications}
                        onChange={handleSelectAllNotifications}
                      />
                    </TableCell>
                    <TableCell>{t('Title')}</TableCell>
                    <TableCell>{t('Content')}</TableCell>
                    <TableCell>{t('IsRead')}</TableCell>
                    <TableCell>{t('')}</TableCell>
                    <TableCell align="center">{t('Actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedNotifications.map((notification) => {
                    const isNotificationselected = selectedItems.includes(
                      notification._id
                    );
                    return (
                      <TableRow
                        hover
                        key={notification._id}
                        selected={isNotificationselected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isNotificationselected}
                            onChange={(event) =>
                              handleSelectOneNotification(
                                event,
                                notification._id
                              )
                            }
                            value={isNotificationselected}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography>{notification.title}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>{notification.content}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography style={{ color: 'green' }}>
                            {notification.isRead && <CheckIcon />}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Switch
                            defaultChecked={notification.isRead}
                            onClick={() => updateStatus(notification)}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Typography noWrap>
                            <Tooltip title={t('Edit')} arrow>
                              <IconButton
                                onClick={() =>
                                  handleUpdatedNotificationOpen(notification)
                                }
                                color="primary"
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={t('Delete')} arrow>
                              <IconButton
                                onClick={() =>
                                  handleConfirmDelete(notification)
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
                count={filteredNotifications.length}
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
    </>
  );
};

Results.propTypes = {
  notifications: PropTypes.array.isRequired,
  handleUpdatedNotificationOpen: PropTypes.func.isRequired,
  handleConfirmDelete: PropTypes.func.isRequired,
  updateStatus: PropTypes.func.isRequired
};

Results.defaultProps = {
  notifications: []
};

export default Results;
