import React from 'react';
import { TextField, Button, Grid, Typography, Paper, Link } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    name: Yup.string()
        .required('Name is required'),
    email: Yup.string()
        .email('Invalid email')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required'),
});

const initialValues = {
    name: '',
    email: '',
    password: '',
};

interface FormValues {
    name: string;
    email: string;
    password: string;
}

const RegistrationForm: React.FC = () => {

    const navigate = useNavigate();


    const handleSubmit = (values: FormValues) => {
        axios
            .post('https://mock-api.arikmpt.com/api/user/register', {
                name: values.name,
                email: values.email,
                password: values.password,
            })
            .then((response) => {
                console.log('Registration successful', response.data);
                Swal.fire({
                    icon: 'success',
                    title: 'Registration Successful',
                    text: 'You have successfully registered. You can now log in.',
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/');
                    }
                    setInterval(() => {
                        navigate('/');
                    }, 3000);
                });
            })
            .catch((error) => {
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Registration Failed',
                    text: 'An error occurred during registration. Please try again.',
                });
            });
    };



    return (
        <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '100vh' }}>
            <Grid item xs={12} sm={8} md={6}>
                <Paper elevation={3} style={{ padding: '30px' }}>
                    <Typography variant="h5" gutterBottom>
                        Registration Page
                    </Typography>
                    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                        {({ errors, touched }) => (
                            <Form>
                                <Field
                                    as={TextField}
                                    name="name"
                                    label="Name"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    error={touched.name && Boolean(errors.name)}
                                    helperText={touched.name && errors.name}
                                />
                                <Field
                                    as={TextField}
                                    name="email"
                                    label="Email"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    error={touched.email && Boolean(errors.email)}
                                    helperText={touched.email && errors.email}
                                />
                                <Field
                                    as={TextField}
                                    type="password"
                                    name="password"
                                    label="Password"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    error={touched.password && Boolean(errors.password)}
                                    helperText={touched.password && errors.password}
                                />
                                <Button type="submit" variant="contained" color="primary" fullWidth>
                                    Register
                                </Button>

                            </Form>
                        )}
                    </Formik>
                    <Typography variant="body2" gutterBottom style={{ marginTop: "10px" }}>
                        If you already have an account,
                        <Link
                            component="button"
                            variant="body2"
                            style={{ marginLeft: "5px" }}
                            onClick={() => navigate('/')}
                        >
                            Login here
                        </Link>.
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default RegistrationForm;
