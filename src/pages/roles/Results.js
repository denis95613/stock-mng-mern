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
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import EditIcon from '@mui/icons-material/Edit';
import BulkActions from './BulkActions';
import SearchTwoToneIcon from '@mui/icons-material/Edit';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';

const applyFilters = (roles, query, filters) => {
  return roles.filter((role) => {
    let matches = true;

    if (query) {
      const properties = ['name', 'description'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (role[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && role[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};

const applyPagination = (roles, page, limit) => {
  return roles.slice(page * limit, page * limit + limit);
};

const Results = ({ roles, handleUpdatedRoleOpen, handleConfirmDelete }) => {
  const [selectedItems, setSelectedRoles] = useState([]);
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [filters] = useState({
    role: null
  });

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSelectAllRoles = (event) => {
    setSelectedRoles(event.target.checked ? roles.map((role) => role._id) : []);
  };

  const handleSelectOneRole = (_event, roleId) => {
    if (!selectedItems.includes(roleId)) {
      setSelectedRoles((prevSelected) => [...prevSelected, roleId]);
    } else {
      setSelectedRoles((prevSelected) =>
        prevSelected.filter((id) => id !== roleId)
      );
    }
  };

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const filteredRoles = applyFilters(roles, query, filters);
  const paginatedRoles = applyPagination(filteredRoles, page, limit);
  const selectedBulkActions = selectedItems.length > 0;
  const selectedSomeRoles =
    selectedItems.length > 0 && selectedItems.length < roles.length;
  const selectedAllRoles = selectedItems.length === roles.length;
  const [toggleView] = useState('table_view');

  return (
    <>
      {toggleView === 'table_view' && (
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
                placeholder={t('Search by name or description')}
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
          {paginatedRoles.length === 0 ? (
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
                {t("We couldn't find any roles matching your search criteria")}
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
                          checked={selectedAllRoles}
                          indeterminate={selectedSomeRoles}
                          onChange={handleSelectAllRoles}
                        />
                      </TableCell>
                      <TableCell>{t('Role')}</TableCell>
                      <TableCell>{t('Description')}</TableCell>
                      <TableCell align="center">{t('Actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedRoles.map((role) => {
                      const isRoleSelected = selectedItems.includes(role._id);
                      return (
                        <TableRow
                          hover
                          key={role._id}
                          selected={isRoleSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isRoleSelected}
                              onChange={(event) =>
                                handleSelectOneRole(event, role._id)
                              }
                              value={isRoleSelected}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight="bold">
                              {role.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{role.description}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography noWrap>
                              <Tooltip title={t('Edit')} arrow>
                                <IconButton
                                  onClick={() => handleUpdatedRoleOpen(role)}
                                  color="primary"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={t('Delete')} arrow>
                                <IconButton
                                  onClick={() => handleConfirmDelete(role)}
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
                  count={filteredRoles.length}
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
      )}
    </>
  );
};

Results.propTypes = {
  roles: PropTypes.array.isRequired,
  handleUpdatedRoleOpen: PropTypes.func.isRequired,
  handleConfirmDelete: PropTypes.func.isRequired
};

Results.defaultProps = {
  roles: []
};

export default Results;
