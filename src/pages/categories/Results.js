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

const applyFilters = (categories, query, filters) => {
  return categories.filter((category) => {
    let matches = true;

    if (query) {
      const properties = ['name', 'parent'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (category[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && category[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};

const applyPagination = (categories, page, limit) => {
  return categories.slice(page * limit, page * limit + limit);
};

const Results = ({
  categories,
  handleUpdatedCategoryOpen,
  handleConfirmDelete
}) => {
  const [selectedItems, setSelectedCategories] = useState([]);
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState('');
  const [filters] = useState({
    category: null
  });

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handleSelectAllCategories = (event) => {
    setSelectedCategories(
      event.target.checked ? categories.map((category) => category._id) : []
    );
  };

  const handleSelectOneCategory = (_event, categoryId) => {
    if (!selectedItems.includes(categoryId)) {
      setSelectedCategories((prevSelected) => [...prevSelected, categoryId]);
    } else {
      setSelectedCategories((prevSelected) =>
        prevSelected.filter((id) => id !== categoryId)
      );
    }
  };

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const filteredCategories = applyFilters(categories, query, filters);
  const paginatedCategories = applyPagination(filteredCategories, page, limit);
  const selectedBulkActions = selectedItems.length > 0;
  const selectedSomeCategories =
    selectedItems.length > 0 && selectedItems.length < categories.length;
  const selectedAllCategories = selectedItems.length === categories.length;

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
                placeholder={t('Search by parent or name')}
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

          {paginatedCategories.length === 0 ? (
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
                  "We couldn't find any categories matching your search criteria"
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
                          checked={selectedAllCategories}
                          indeterminate={selectedSomeCategories}
                          onChange={handleSelectAllCategories}
                        />
                      </TableCell>
                      <TableCell>{t('Parent')}</TableCell>
                      <TableCell>{t('Name')}</TableCell>
                      <TableCell>{t('Description')}</TableCell>
                      <TableCell align="center">{t('Actions')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedCategories.map((category) => {
                      const isCategorieselected = selectedItems.includes(
                        category._id
                      );
                      return (
                        <TableRow
                          hover
                          key={category._id}
                          selected={isCategorieselected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isCategorieselected}
                              onChange={(event) =>
                                handleSelectOneCategory(event, category._id)
                              }
                              value={isCategorieselected}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography>{category.parent}</Typography>
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight="bold">
                              {category.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography>{category.description}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography noWrap>
                              <Tooltip title={t('Edit')} arrow>
                                <IconButton
                                  onClick={() =>
                                    handleUpdatedCategoryOpen(category)
                                  }
                                  color="primary"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={t('Delete')} arrow>
                                <IconButton
                                  onClick={() => handleConfirmDelete(category)}
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
                  count={filteredCategories.length}
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
  categories: PropTypes.array.isRequired,
  handleUpdatedCategoryOpen: PropTypes.func.isRequired,
  handleConfirmDelete: PropTypes.func.isRequired
};

Results.defaultProps = {
  categories: []
};

export default Results;
