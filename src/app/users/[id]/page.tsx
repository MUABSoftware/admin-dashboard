"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Avatar,
  Chip,
  Paper,
  DialogContentText,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import request from "@src/config/axios";

const UserDetailView = () => {
  const router = useRouter();
  const { id } = useParams();
  const [user, setUser] = useState(Object);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // Confirmation dialog state

  // Fetch user details by ID
  useEffect(() => {
    setLoading(true);
    request
      .get(`/users/${id}`)
      .then((response) => {
        setUser(response.data.user);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch user details");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  // Displaying formatted user details
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>

      <Paper sx={{ padding: 3, marginBottom: 2 }}>
        {/* Profile Picture */}
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar src={user.profilePic} alt={user.name} sx={{ width: 120, height: 120, borderRadius: "50%" }} />
          </Grid>
          <Grid item>
            <Typography variant="h5">{user.name}</Typography>
            <Typography variant="subtitle1">{user.phoneNumber}</Typography>
            <Typography variant="subtitle2">{user.email || "No email provided"}</Typography>
            <Typography variant="subtitle2">Gender: {user.gender}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Bio Section */}
      <Paper sx={{ padding: 3, marginBottom: 2 }}>
        <Typography variant="h6" gutterBottom>
          Bio
        </Typography>
        <Typography variant="body1">{user.bio}</Typography>
      </Paper>

      {/* Categories and Interests */}
      <Paper sx={{ padding: 3, marginBottom: 2 }}>
        <Typography variant="h6" gutterBottom>
          Categories
        </Typography>
        {user.categories.length > 0 ? (
          <Box>
            {user.categories.map((category: string, index: number) => (
              <Chip key={index} label={category} sx={{ margin: 1 }} />
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No categories available.
          </Typography>
        )}
        <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
          Interests
        </Typography>
        {user.interests.length > 0 ? (
          <Box>
            {user.interests.map((interest: string, index: number) => (
              <Chip key={index} label={interest} sx={{ margin: 1 }} />
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No interests available.
          </Typography>
        )}
      </Paper>

      {/* Additional Information */}
      <Paper sx={{ padding: 3, marginBottom: 2 }}>
        <Typography variant="h6" gutterBottom>
          Additional Information
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">Date of Birth: {new Date(user.dateOfBirth).toLocaleDateString()}</Typography>
            <Typography variant="body1">Language: {user.language}</Typography>
            <Typography variant="body1">Notifications Last Seen: {new Date(user.notificationsLastSeenAt).toLocaleString()}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">Number of Followers: {user.numberOfFollowers}</Typography>
            <Typography variant="body1">Is Verified: {user.isVerified ? "Yes" : "No"}</Typography>
            <Typography variant="body1">Is Content Writer: {user.isContentWriter ? "Yes" : "No"}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Actions */}
      <Box sx={{ marginTop: 3 }}>
        <Button variant="contained" color="primary" onClick={() => router.push(`/users/${user._id}/edit`)}>
          Edit User
        </Button>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
        <DialogTitle>Confirm Changes</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to save these changes?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDialog(false)}>Cancel</Button>
          <Button color="primary" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserDetailView;
