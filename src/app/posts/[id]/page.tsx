"use client";
import React, { useState, useEffect } from "react";
import { Avatar, Box, Button, CardMedia, CircularProgress, Divider, Grid, Modal, Paper, Stack, Tab, Tabs, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Chart from "react-apexcharts";
import request from "@src/config/axios";
import { useParams } from "next/navigation";

const AdminPostDetails = () => {
  const [post, setPost] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mediaPage, setMediaPage] = useState(1); // Track the current page of media
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  const theme = useTheme();
  const { id } = useParams();

  useEffect(() => {
    request
      .get(`/posts/${id}`)
      .then((res) => {
        setPost(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load post details. Please try again." + err.message);
        setLoading(false);
      });
  }, [id]);

  const loadMoreMedia = () => {
    setMediaPage(mediaPage + 1);
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  const {
    title,
    description,
    media,
    isPaid,
    postFees,
    userId,
    createdAt,
    actions,
    numOfLikes,
    numOfComments,
    numOfShares,
    hashTags,
    interactionScore,
  } = post;

  const renderInteractions = (type: string, data: any[]) => (
    <DataGrid
      rows={data.map((item: any, idx: number) => ({
        id: idx,
        name: item.name || "Unknown User",
        profilePic: item.profilePic || "",
        action: type,
        timestamp: item.savedAt || new Date().toLocaleString(),
      }))}
      columns={[
        { field: "name", headerName: "Name", flex: 1 },
        {
          field: "profilePic",
          headerName: "Profile Picture",
          renderCell: (params) => (params.value ? <Avatar src={params.value} /> : "N/A"),
          width: 80,
        },
        { field: "action", headerName: "Action", flex: 1 },
        { field: "timestamp", headerName: "Timestamp", flex: 1 },
      ]}
      autoHeight
      sx={{ minHeight: 300 }}
    />
  );

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "donut",
    },
    labels: ["Likes", "Comments", "Shares", "Saves", "Purchases"],
    series: [numOfLikes, numOfComments, numOfShares, actions.saved.length, actions.purchasedBy.length],
    tooltip: {
      enabled: true,
      theme: "dark",
    },
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      {/* Post Details */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" spacing={2}>
          <Avatar src={userId.profilePic} sx={{ width: 80, height: 80 }} />
          <Stack>
            <Typography variant="h6">{title}</Typography>
            <Typography variant="body1" color="textSecondary">
              By: {userId.name} | Created At: {new Date(createdAt).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {description}
            </Typography>
          </Stack>
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Stack direction="row" spacing={2}>
          <Typography variant="body1">
            <strong>Paid Post:</strong> {isPaid ? "Yes" : "No"}
          </Typography>
          {isPaid && (
            <Typography variant="body1">
              <strong>Post Fees:</strong> ${postFees}
            </Typography>
          )}
          <Typography variant="body1">
            <strong>Interaction Score:</strong> {interactionScore}
          </Typography>
        </Stack>
        <Typography variant="body1" sx={{ mt: 1 }}>
          <strong>HashTags:</strong> {hashTags.join(", ")}
        </Typography>
      </Paper>

      {/* Media Section */}
      <Typography variant="h6" gutterBottom>
        Media
      </Typography>
      <Grid container spacing={2}>
        {media.slice(0, mediaPage * 5).map((item: string, idx: number) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <CardMedia
              component={item.endsWith(".mp4") ? "video" : "img"}
              src={item}
              controls={item.endsWith(".mp4")}
              alt={`Media ${idx + 1}`}
              sx={{
                width: "100%",
                height: 200,
                objectFit: "cover",
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
              }}
              onClick={() => {
                setSelectedMedia(item);
                setMediaModalOpen(true);
              }}
            />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ textAlign: "center", mt: 2 }}>
        {mediaPage * 5 < media.length && (
          <Button onClick={loadMoreMedia} variant="outlined">
            Load More
          </Button>
        )}
      </Box>

      {/* Media Modal */}
      <Modal
        open={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        aria-labelledby="media-modal-title"
        aria-describedby="media-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: 2,
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          {selectedMedia && (
            <CardMedia
              component={selectedMedia.endsWith(".mp4") ? "video" : "img"}
              src={selectedMedia}
              controls={selectedMedia.endsWith(".mp4")}
              alt="Media"
              sx={{
                width: "100%",
                height: "auto",
                borderRadius: 2,
              }}
            />
          )}
        </Box>
      </Modal>

      {/* Tabs for Interactions */}
      <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)} textColor="primary" indicatorColor="primary" sx={{ mt: 3 }}>
        <Tab label={`Likes (${numOfLikes})`} />
        <Tab label={`Comments (${numOfComments})`} />
        <Tab label={`Saves (${actions.saved.length})`} />
        <Tab label={`Reactions (${actions.reactions.length})`} />
        <Tab label={`Analytics`} />
      </Tabs>

      <Box sx={{ mt: 3 }}>
        {activeTab === 0 && renderInteractions("Liked", actions.likedBy)}
        {activeTab === 1 && renderInteractions("Commented", actions.commentedBy)}
        {activeTab === 2 &&
          renderInteractions(
            "Saved",
            actions.saved.map((item: any) => item.userId)
          )}
        {activeTab === 3 && renderInteractions("Reacted", actions.reactions.map((reaction: any) => reaction.userIds).flat())}
        {activeTab === 4 && (
          <Box width={"500px"}>
            <Chart options={chartOptions} series={chartOptions.series} type="donut" width="100%" />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default AdminPostDetails;
