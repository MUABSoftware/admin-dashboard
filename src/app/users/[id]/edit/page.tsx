"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Grid, Box, Typography, MenuItem, Paper, Switch, FormControlLabel } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import request from "@src/config/axios";

const LANGUAGES = [
  { value: "EN", label: "English" },
  { value: "ARABIC", label: "Arabic" },
];

const GENDERS = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "others", label: "Others" },
  { value: "not specified", label: "Not Specified" },
];

const PAYOUT_METHODS = [
  { value: "WIRE_TRANSFER", label: "Wire Transfer" },
  { value: "PAYONEER", label: "Payoneer" },
];

const EditUserPage = () => {
  const router = useRouter();
  const { id } = useParams();
  console.log(id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (id) {
      request
        .get(`/users/${id}`)
        .then((response) => reset(response.data.user))
        .catch((error) => console.error(error));
    }
  }, [id, reset]);

  const onSubmit = async (data: unknown) => {
    try {
      await request.put(`/users/${id}`, data);
      router.push(`/admin/users/${id}`);
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: "800px", mx: "auto", mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Edit User
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          {/* Basic Info */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              defaultValue="" // Remove placeholder mixing issue
              {...register("name", { required: "Name is required" })}
              error={!!errors.name}
              helperText={errors.name?.message?.toString()}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              defaultValue=""
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message?.toString()}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              defaultValue=""
              {...register("phoneNumber")}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message?.toString()}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select fullWidth label="Gender" {...register("gender")}>
              {GENDERS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Additional Info */}
          <Grid item xs={12}>
            <TextField fullWidth label="Bio" multiline rows={4} defaultValue="" {...register("bio")} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField select fullWidth label="Language" {...register("language")}>
              {LANGUAGES.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField select fullWidth label="Default Payout Method" {...register("defaultPayoutMethod")}>
              {PAYOUT_METHODS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Toggles and Switches */}
          <Grid item xs={12} sm={6}>
            <FormControlLabel control={<Switch {...register("isVerified")} color="primary" />} label="Verified" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel control={<Switch {...register("isContentWriter")} color="primary" />} label="Content Writer" />
          </Grid>

          {/* Read-only Fields */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Number of Followers"
              value={0}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Provider"
              {...register("provider")}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Stripe Customer ID"
              {...register("customerStripeId")}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>

          {/* Profile Picture */}
          <Grid item xs={12}>
            <TextField fullWidth label="Profile Picture URL" {...register("profilePic")} helperText="Link to the user's profile picture" />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Box sx={{ textAlign: "right", mt: 2 }}>
              <Button variant="contained" color="primary" type="submit">
                Save Changes
              </Button>
              <Button variant="outlined" sx={{ ml: 2 }} onClick={() => router.back()}>
                Cancel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default EditUserPage;
