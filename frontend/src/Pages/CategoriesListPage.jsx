import React, { useState, useEffect, useCallback } from 'react';
// import { Link } from 'react-router-dom'; // Not strictly needed if edit/view is within this page/modals
import apiClient from '../services/apiClient'; // Your configured Axios instance
import { useAuth } from '../context/AuthContext'; // To check for admin role

const PAGE_SIZE = 10; // How many categories to show per page

function CategoriesListPage() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // The actual term used for API calls

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);

  // --- Modal States & Data ---
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const [showEditModal, setShowEditModal] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null); // Stores { id, name }
  const [editingCategoryName, setEditingCategoryName] = useState('');

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null); // Stores { id, name }

  const { user, isAuthenticated } = useAuth(); // Get current user for admin checks

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    // It's good practice to clear previous messages before a new fetch
    // setError(''); 
    // setSuccessMessage('');
    try {
      const params = new URLSearchParams();
      if (searchQuery) {
        // Assuming your backend supports searching categories by name via a 'search' query param
        params.append('search', searchQuery); 
      }
      params.append('page', currentPage.toString());
      params.append('pageSize', PAGE_SIZE.toString());

      const response = await apiClient.get(`/categories?${params.toString()}`);
      
      setCategories(response.data.categories || []);
      setTotalCategories(response.data.totalCategories || 0);
      setTotalPages(response.data.totalPages || 0);

    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err.response?.data?.message || 'Failed to fetch categories. Please try again later.');
      setCategories([]); // Clear categories on error
      setTotalPages(0);
      setTotalCategories(0);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, currentPage]); // Re-fetch when searchQuery or currentPage changes

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]); // fetchCategories is memoized by useCallback

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setCurrentPage(1); // Reset to page 1 for a new search
    setSearchQuery(searchTerm);
    setError(''); // Clear error on new search
    setSuccessMessage('');
  };

  // --- Add Modal Functions ---
  const openAddModal = () => {
    setNewCategoryName(''); // Clear previous input
    setShowAddModal(true);
    setError(''); // Clear errors when opening modal
    setSuccessMessage('');
  };
  const closeAddModal = () => setShowAddModal(false);

  const handleAddCategory = async (event) => {
    event.preventDefault();
    if (!newCategoryName.trim()) {
      setError("Category name cannot be empty.");
      return;
    }
    setError(''); // Clear previous errors
    try {
      const response = await apiClient.post('/categories', { name: newCategoryName });
      setSuccessMessage(`Category "${response.data.name}" created successfully.`);
      closeAddModal();
      fetchCategories(); // Refresh the list
    } catch (err) {
      console.error("Error creating category:", err);
      setError(err.response?.data?.message || 'Failed to create category.');
    }
  };
  
  // --- Edit Modal Functions ---
  const openEditModal = (category) => {
    setCategoryToEdit(category);
    setEditingCategoryName(category.name); // Pre-fill with current name
    setShowEditModal(true);
    setError(''); // Clear errors when opening modal
    setSuccessMessage('');
  };
  const closeEditModal = () => {
    setShowEditModal(false);
    setCategoryToEdit(null);
  };

  const handleEditCategory = async (event) => {
    event.preventDefault();
    if (!editingCategoryName.trim() || !categoryToEdit) {
      setError("Category name cannot be empty.");
      return;
    }
    setError('');
    try {
      const response = await apiClient.put(`/categories/${categoryToEdit.id}`, { name: editingCategoryName });
      setSuccessMessage(`Category "${response.data.name}" updated successfully.`);
      closeEditModal();
      fetchCategories(); // Refresh the list
    } catch (err) {
      console.error("Error updating category:", err);
      setError(err.response?.data?.message || 'Failed to update category.');
    }
  };

  // --- Delete Modal Functions ---
  const openDeleteModal = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
    setError('');
    setSuccessMessage('');
  };
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    setError('');
    try {
      await apiClient.delete(`/categories/${categoryToDelete.id}`);
      setSuccessMessage(`Category "${categoryToDelete.name}" deleted successfully.`);
      closeDeleteModal();
      // If on the last page and it becomes empty after delete, navigate to previous page
      if (categories.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1); // This will trigger fetchCategories
      } else {
        fetchCategories(); // Re-fetch categories for the current page
      }
    } catch (err) {
      console.error("Error deleting category:", err);
      setError(err.response?.data?.message || `Failed to delete category "${categoryToDelete.name}".`);
      // Optionally keep modal open on error: closeDeleteModal();
    }
  };

  // --- Pagination Handlers ---
  const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
  const handlePreviousPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
  const handleGoToPage = (pageNumber) => setCurrentPage(pageNumber);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    // Logic for displaying a limited set of page numbers (e.g., 1 ... 5 6 7 ... 10)
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) { // if current page is 1, 2, or 3
        endPage = Math.min(totalPages, 5);
    }
    if (currentPage > totalPages - 3 && totalPages > 5) { // if current page is near the end
        startPage = Math.max(1, totalPages - 4);
    }

    if (startPage > 1) {
        pageNumbers.push(<button key="1" onClick={() => handleGoToPage(1)} style={{ margin: '0 5px' }}>1</button>);
        if (startPage > 2) {
            pageNumbers.push(<span key="start-ellipsis" style={{ margin: '0 5px' }}>...</span>);
        }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handleGoToPage(i)}
          disabled={i === currentPage}
          style={{ fontWeight: i === currentPage ? 'bold' : 'normal', margin: '0 5px' }}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pageNumbers.push(<span key="end-ellipsis" style={{ margin: '0 5px' }}>...</span>);
        }
        pageNumbers.push(<button key={totalPages} onClick={() => handleGoToPage(totalPages)} style={{ margin: '0 5px' }}>{totalPages}</button>);
    }
    return pageNumbers;
  };

  // Initial loading state for the whole page
  if (isLoading && categories.length === 0 && !error) {
    return <div>Loading categories...</div>;
  }

  return (
    <div>
      <h2>Manage Categories</h2>

      <form onSubmit={handleSearchSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search categories by name..."
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ marginRight: '10px', padding: '8px', minWidth: '250px' }}
        />
        <button type="submit" style={{ padding: '8px 15px' }}>Search</button>
      </form>

      {isAuthenticated && user?.role === 'ADMIN' && (
        <button onClick={openAddModal} style={{ marginBottom: '20px', padding: '10px 15px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Add New Category
        </button>
      )}

      {successMessage && <p style={{ color: 'green', backgroundColor: '#e6ffed', border: '1px solid #b7ebc9', padding: '10px', borderRadius: '4px' }}>{successMessage}</p>}
      {/* Display general page error only if no modal is active, to avoid duplicate error messages */}
      {error && !showAddModal && !showEditModal && !showDeleteModal && <p style={{ color: 'red', backgroundColor: '#ffe6e6', border: '1px solid #ffb3b3', padding: '10px', borderRadius: '4px'  }}>{error}</p>}
      
      {isLoading && <p>Loading more categories...</p>} 
      {!isLoading && categories.length === 0 && (
        <div>No categories found {searchQuery && `for "${searchQuery}"`}.</div>
      )}

      {categories.length > 0 && (
        <>
          <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                {isAuthenticated && user?.role === 'ADMIN' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  {isAuthenticated && user?.role === 'ADMIN' && (
                    <td>
                      <button onClick={() => openEditModal(category)} style={{ marginRight: '10px', padding: '5px 10px' }}>Edit</button>
                      <button onClick={() => openDeleteModal(category)} style={{ padding: '5px 10px', color: 'red', backgroundColor: 'white', border: '1px solid red' }}>Delete</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          
          {totalPages > 1 && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                Previous
              </button>
              {renderPageNumbers()}
              <button onClick={handleNextPage} disabled={currentPage === totalPages || totalPages === 0}>
                Next
              </button>
              <p>Page {currentPage} of {totalPages} (Total categories: {totalCategories})</p>
            </div>
          )}
        </>
      )}

      {/* Add Category Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '400px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
            <h3>Add New Category</h3>
            <form onSubmit={handleAddCategory}>
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="newCategoryName" style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
                <input type="text" id="newCategoryName" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} required style={{ width: 'calc(100% - 16px)', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
              {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
              <div style={{ textAlign: 'right' }}>
                <button type="button" onClick={closeAddModal} style={{ marginRight: '10px', padding: '8px 15px' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 15px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '4px' }}>Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditModal && categoryToEdit && (
        <div style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '8px', width: '400px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
            <h3>Edit Category: "{categoryToEdit.name}"</h3>
            <form onSubmit={handleEditCategory}>
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="editingCategoryName" style={{ display: 'block', marginBottom: '5px' }}>New Name:</label>
                <input type="text" id="editingCategoryName" value={editingCategoryName} onChange={(e) => setEditingCategoryName(e.target.value)} required style={{ width: 'calc(100% - 16px)', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }} />
              </div>
              {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
              <div style={{ textAlign: 'right' }}>
                <button type="button" onClick={closeEditModal} style={{ marginRight: '10px', padding: '8px 15px' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 15px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '4px' }}>Update Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && categoryToDelete && (
        <div style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '8px', textAlign: 'center', width: '400px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
            <h3>Confirm Deletion</h3>
            <p style={{margin: '20px 0'}}>Are you sure you want to delete category: "{categoryToDelete.name}"?</p>
            {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
            <div style={{ marginTop: '20px' }}>
              <button type="button" onClick={closeDeleteModal} style={{ marginRight: '10px', padding: '8px 15px' }}>Cancel</button>
              <button onClick={handleConfirmDelete} style={{ padding: '8px 15px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '4px' }}>Confirm Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoriesListPage;