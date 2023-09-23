import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import Swal from 'sweetalert2';
import { useFetchList } from './hooks';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, MenuItem, Container, Paper, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface Category {
    id?: number;
    name: string;
    is_active: boolean;
}

interface DataProfile {
    name: string;
    email: string;
}

const DashboardPage: React.FC = () => {
    const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
    const [addedRow, setAddedRow] = useState<Category | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editedRow, setEditedRow] = useState<Category | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [rowToDelete, setRowToDelete] = useState<Category | null>(null);
    const [show, setShow] = useState<boolean>(false)

    const validate = sessionStorage.getItem('userToken');
    const navigate = useNavigate();

    if (!validate) {
        navigate('/');
    }

    const { data, loading, error } = useFetchList<Category[]>({
        url: 'https://mock-api.arikmpt.com/api/category',
        method: 'GET',
        headers: {
            Authorization: `Bearer ${validate}`,
        },
    });

    const { data: dataProfile } = useFetchList<DataProfile>({
        url: 'https://mock-api.arikmpt.com/api/user/profile',
        method: 'GET',
        headers: {
            Authorization: `Bearer ${validate}`,
        },
    });

    const handleAddModal = () => {
        setAddModalOpen(true);
    }

    const handleCloseAddModal = () => {
        setAddedRow(null);
        setAddModalOpen(false);
    }

    const handleEditData = (row: Category) => {
        setEditedRow(row);
        setEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditedRow(null);
        setEditModalOpen(false);
    };

    const handleDeleteData = (row: Category) => {
        setRowToDelete(row);
        setDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setRowToDelete(null);
        setDeleteDialogOpen(false);
    };

    const handleAddCategory = () => {

        axios.post('https://mock-api.arikmpt.com/api/category/create', {
            name: addedRow?.name,
            is_active: addedRow?.is_active,
        }, { headers: { Authorization: `Bearer ${validate}` } })
            .then((response) => {
                handleCloseAddModal();
                console.log('Add successful', response.data);
                Swal.fire({
                    icon: 'success',
                    title: 'Add Successful',
                    text: 'You have successfully added a new category.',
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/dashboard')
                    }
                    setInterval(() => {
                        navigate('/dashboard')
                    }, 3000);
                });
            }).catch((error) => {
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Add Failed',
                    text: 'An error occurred during add category. Please try again.',
                })
            })
    }

    const handleDeleteCategory = () => {

        axios.delete(`https://mock-api.arikmpt.com/api/category/${rowToDelete?.id}`,
            { headers: { Authorization: `Bearer ${validate}` } })
            .then((response) => {
                handleCloseDeleteDialog();
                console.log('Delete successful', response.data);
                Swal.fire({
                    icon: 'success',
                    title: 'Delete Successful',
                    text: 'You have successfully deleted the category.',
                })
                navigate('/dashboard');
            }).catch((error) => {
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Delete Failed',
                    text: 'An error occurred during delete. Please try again.',
                });
            });
    }

    const handleUpdateCategory = () => {

        axios.put(`https://mock-api.arikmpt.com/api/category/update`, {
            id: editedRow?.id,
            name: editedRow?.name,
            is_active: editedRow?.is_active,
        }, { headers: { Authorization: `Bearer ${validate}` } })
            .then((response) => {
                handleCloseEditModal();
                console.log('Update successful', response.data);
                Swal.fire({
                    icon: 'success',
                    title: 'Update Successful',
                    text: 'You have successfully updated the category.',
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/dashboard');
                    }
                    setInterval(() => {
                        navigate('/dashboard');
                    }, 3000);
                });
            }).catch((error) => {
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Update Failed',
                    text: 'An error occurred during update. Please try again.',
                });
            });
    }

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 260 },
        { field: 'name', headerName: 'Name', width: 200 },
        {
            field: 'is_status',
            headerName: 'Status',
            width: 130,
            filterable: false,
            renderCell: (params) => (<div>{params.row.is_active ? 'Active' : 'Deactive'}</div>)
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 180,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={(e) => {
                            console.log(params.row)
                            e.stopPropagation();
                            handleEditData(params.row)
                        }}
                    >
                        Edit
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        size="small"
                        style={{ marginLeft: 10 }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteData(params.row);
                        }}
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error while fetching data...</div>
    }

    if (!validate) {
        navigate('/');
    }

    const handleLogout = () => {
        sessionStorage.removeItem('userToken');
        navigate('/');
    };

    return (
        <>
            {/* Add Modal Dialog */}
            <Dialog open={addModalOpen} onClose={handleCloseAddModal}>
                <DialogTitle>Add Row</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        style={{ margin: '10px 0' }}
                        onChange={(e) => {
                            setAddedRow((prevAddedRow) => ({
                                name: e.target.value,
                                is_active: prevAddedRow?.is_active || false,
                            }));
                        }}
                        fullWidth
                    />
                    <TextField
                        label="Status"
                        select
                        style={{ margin: '25px 0' }}
                        onChange={(e) => {
                            setAddedRow((prevAddedRow) => ({
                                name: prevAddedRow?.name || '',
                                is_active: e.target.value === 'active',
                            }));
                        }}
                        fullWidth
                    >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="deactive">Deactive</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddModal}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            handleAddCategory();
                        }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog >

            {/* Edit Modal Dialog */}
            < Dialog open={editModalOpen} onClose={handleCloseEditModal} >
                <DialogTitle>Edit Row</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        style={{ margin: '10px 0' }}
                        value={editedRow?.name || ''}
                        onChange={(e) => {
                            if (editedRow) {
                                setEditedRow({ ...editedRow, name: e.target.value });
                            }
                        }}
                        fullWidth
                    />
                    <TextField
                        label="Status"
                        select
                        style={{ margin: '25px 0' }}
                        value={editedRow?.is_active ? 'active' : 'deactive'}
                        onChange={(e) => {
                            if (editedRow) {
                                setEditedRow({ ...editedRow, is_active: e.target.value === 'active' });
                            }
                        }}
                        fullWidth
                    >
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="deactive">Deactive</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEditModal}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            handleUpdateCategory();
                        }}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog >

            {/* Delete Confirmation Dialog */}
            < Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog} >
                <DialogTitle>Delete Category</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this row?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => {
                            handleDeleteCategory();
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog >

            <Container
                sx={{
                    width: "100%",
                    height: 250,
                }}
            >
                {/* Profile Data */}
                <Paper elevation={3} style={{ padding: '20px' }} className={!show ? "bg-success text-white" : "bg-warning"}>
                    <Typography variant="h6" gutterBottom>
                        User Profile
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        Name: {dataProfile?.name}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                        Email: {dataProfile?.email}
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleAddModal}
                        style={{ margin: '10px 10px' }}
                    >
                        Add Category
                    </Button>
                    <Button
                        onClick={handleLogout}
                        style={{ margin: '30px 0' }}
                        className='bg-danger text-white'
                    >
                        Logout
                    </Button>
                </Paper>
            </Container>

            <Button
                variant="contained"
                className='mb-3'
                color={!show ? "success" : "warning"}
                size="small"
                style={{ marginLeft: 10 }}
                onClick={() => !show ? setShow(true) : setShow(false)}
            >
                {!show ? "Show" : "Hide"}
            </Button>

            {/* table */}
            {show ? <div style={{ height: 400, width: '100%' }}>
                {data ? (
                    <div className="card bg-warning">
                        <DataGrid
                            rows={data}
                            columns={columns}
                            initialState={{
                                pagination: {
                                    paginationModel: { page: 0, pageSize: 5 },
                                },
                            }}
                            style={{ backgroundColor: '#fff' }}
                            pageSizeOptions={[5, 10]}
                        />
                    </div>
                ) : (
                    <div>No data available.</div>
                )}
            </div> : ""}





        </>
    );
};

export default DashboardPage;
