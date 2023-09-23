import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Error() {

  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh'
      }}
    >
      <Container maxWidth="md">
        <Typography variant="h1">
          404 Not Found
        </Typography>
        <Typography variant="h6">
          The page you’re looking for doesn’t exist.
        </Typography>
        <Button variant="contained" style={{ marginTop: "10px" }} onClick={() => navigate('/dashboard')}>Back Home</Button>
      </Container>
    </Box>
  );
}