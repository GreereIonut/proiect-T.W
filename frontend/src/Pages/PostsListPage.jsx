import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Pagination from 'react-bootstrap/Pagination';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';

import './PostsListPage.css'; // Add a custom CSS file for styling

const PAGE_SIZE = 5;

function PostsListPage() {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalPosts, setTotalPosts] = useState(0);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);

    const { user, isAuthenticated } = useAuth();

    const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append('search', searchQuery);
            params.append('page', currentPage.toString());
            params.append('pageSize', PAGE_SIZE.toString());
            const response = await apiClient.get(`/posts?${params.toString()}`);
            setPosts(response.data.posts || []);
            setTotalPosts(response.data.totalPosts || 0);
            setTotalPages(response.data.totalPages || 0);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch posts.');
            setPosts([]); setTotalPages(0); setTotalPosts(0);
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery, currentPage]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const handleSearchChange = (event) => setSearchTerm(event.target.value);
    const handleSearchSubmit = (event) => {
        event.preventDefault();
        setCurrentPage(1);
        setSearchQuery(searchTerm);
        setError('');
        setSuccessMessage('');
    };

    const openDeleteModal = (post) => {
        setPostToDelete(post);
        setShowDeleteModal(true);
        setError('');
        setSuccessMessage('');
    };
    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setPostToDelete(null);
    };
    const handleConfirmDelete = async () => {
        if (!postToDelete) return;
        try {
            await apiClient.delete(`/posts/${postToDelete.id}`);
            setSuccessMessage(`Post "${postToDelete.title}" deleted successfully.`);
            closeDeleteModal();
            if (posts.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            } else {
                fetchPosts();
            }
        } catch (err) {
            setError(err.response?.data?.message || `Failed to delete post "${postToDelete.title}".`);
        }
    };

    const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
    const handlePreviousPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
    const handleGoToPage = (pageNumber) => setCurrentPage(pageNumber);

    const renderPageNumbers = () => {
        if (totalPages <= 1) return null;
        let items = [];
        items.push(
                <Pagination.Prev key="prev" onClick={handlePreviousPage} disabled={currentPage === 1} />
        );
        if (currentPage > 3) {
                items.push(<Pagination.Item key={1} onClick={() => handleGoToPage(1)}>{1}</Pagination.Item>);
                if (currentPage > 4) items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
        }
        let startPage = Math.max(1, currentPage - (currentPage > 3 ? 1 : 2));
        let endPage = Math.min(totalPages, currentPage + (currentPage < totalPages - 2 ? 1 : 2));

        for (let number = startPage; number <= endPage; number++) {
                items.push(
                        <Pagination.Item key={number} active={number === currentPage} onClick={() => handleGoToPage(number)}>
                        {number}
                        </Pagination.Item>
                );
        }
        if (currentPage < totalPages - 2) {
                if (currentPage < totalPages - 3) items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
                items.push(<Pagination.Item key={totalPages} onClick={() => handleGoToPage(totalPages)}>{totalPages}</Pagination.Item>);
        }
        items.push(
                <Pagination.Next key="next" onClick={handleNextPage} disabled={currentPage === totalPages} />
        );
        return <Pagination>{items}</Pagination>;
    };

    return (
        <Container fluid className="posts-container">
            <Row className="justify-content-center">
                <Col xs={12} className="bg-white p-4 rounded shadow-lg">
                    <h2 className="text-center mb-4">All Blog Posts</h2>
                    <Form onSubmit={handleSearchSubmit} className="mb-4">
                        <InputGroup>
                            <Form.Control
                                type="text"
                                placeholder="Search posts..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                            <Button variant="primary" type="submit">Search</Button>
                        </InputGroup>
                    </Form>

                    {successMessage && <Alert variant="success" onClose={() => setSuccessMessage('')} dismissible>{successMessage}</Alert>}
                    {error && !showDeleteModal && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

                    {isLoading && posts.length === 0 && !error && (
                        <div className="text-center my-5">
                            <div className="spinner-border text-primary mb-3" role="status" />
                            <div>Loading posts...</div>
                        </div>
                    )}

                    {posts.length === 0 && !isLoading && (
                        <Alert variant="info" className="text-center">No posts found {searchQuery && `for "${searchQuery}"`}.</Alert>
                    )}

                    {posts.length > 0 && (
                        <>
                            <Table striped bordered hover responsive className="mb-4 text-center">
                                <thead className="table-dark">
                                    <tr>
                                        <th>Title</th>
                                        <th>Author</th>
                                        <th>Category</th>
                                        <th>Created At</th>
                                        <th>Published</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {posts.map((post) => (
                                        <tr key={post.id}>
                                            <td>
                                                <Link to={`/posts/${post.id}`} className="post-title-link">{post.title}</Link>
                                            </td>
                                            <td>{post.author ? post.author.username : 'N/A'}</td>
                                            <td>{post.category ? post.category.name : 'N/A'}</td>
                                            <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                                            <td>{post.published ? 'Yes' : 'No'}</td>
                                            <td>
                                                {isAuthenticated && (user?.id === post.authorId || user?.role === 'ADMIN') && (
                                                    <>
                                                        <Button variant="outline-primary" size="sm" as={Link} to={`/posts/edit/${post.id}`} className="me-2">
                                                            Edit
                                                        </Button>
                                                        <Button variant="outline-danger" size="sm" onClick={() => openDeleteModal(post)}>
                                                            Delete
                                                        </Button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                            {totalPages > 1 && (
                                <div className="d-flex justify-content-center">
                                    {renderPageNumbers()}
                                </div>
                            )}
                            {totalPosts > 0 && <p className="text-center mt-2">Page {currentPage} of {totalPages} (Total posts: {totalPosts})</p>}
                        </>
                    )}

                    {/* Delete Confirmation Modal */}
                    <Modal show={showDeleteModal} onHide={closeDeleteModal} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Confirm Deletion</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Are you sure you want to delete the post titled: <strong>{postToDelete?.title}</strong>?</p>
                            {error && <Alert variant="danger">{error}</Alert>}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={closeDeleteModal}>Cancel</Button>
                            <Button variant="danger" onClick={handleConfirmDelete}>Confirm Delete</Button>
                        </Modal.Footer>
                    </Modal>
                </Col>
            </Row>
        </Container>
    );
}

export default PostsListPage;
