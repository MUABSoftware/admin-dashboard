"use client";
import { useState } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Breadcrumbs,
  Link as MuiLink,
  CardContent,
  Snackbar,
  Alert,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

// Mock data - replace with actual API call
const mockComment = {
  id: 1,
  content: "This is a great post! I really enjoyed reading it and learning from the insights shared. The author has done an excellent job explaining complex concepts in a simple way.",
  author: "John Doe",
  date: "2024-03-15",
  post: {
    id: 1,
    title: "Introduction to React Hooks",
  },
};

export default function CommentDetails({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleDelete = () => {
    // Implement delete logic here
    console.log("Deleting comment:", params.id);
    setDeleteDialogOpen(false);
    setSnackbarMessage("Comment successfully deleted!");
    setOpenSnackbar(true);
    setTimeout(() => {
      router.push("/comments");
    }, 1000);
  };

  const handlePrevious = () => {
    // Implement navigation to previous comment
    const prevId = parseInt(params.id) - 1;
    if (prevId > 0) {
      router.push(`/comments/${prevId}`);
    }
  };

  const handleNext = () => {
    // Implement navigation to next comment
    const nextId = parseInt(params.id) + 1;
    router.push(`/comments/${nextId}`);
  };

  return (
    <div className="mx-auto p-6">
      <div className="space-y-2 mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Comment Details</h1>
        <p className="text-muted-foreground">
          View and manage comment information
        </p>
      </div>

      <Box sx={{ padding: 0 }}>
        {/* Navigation Bar */}
        <Card
          variant="outlined"
          sx={{
            marginBottom: 3,
            padding: 1,
            borderRadius: 1,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Breadcrumbs>
              <Link href="/comments" passHref>
                <MuiLink component="span" color="inherit">
                  Comments
                </MuiLink>
              </Link>
              <Typography color="text.primary">Comment Details</Typography>
            </Breadcrumbs>
            <Box>
              <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={handlePrevious}
                sx={{ mr: 1 }}
              >
                Previous
              </Button>
              <Button
                variant="outlined"
                endIcon={<ArrowForward />}
                onClick={handleNext}
                sx={{ mr: 1 }}
              >
                Next
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<Trash2 className="h-4 w-4" />}
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete
              </Button>
            </Box>
          </Box>
        </Card>

        {/* Comment Content */}
        <Card variant="outlined" sx={{ borderRadius: 1 }}>
          <CardContent>
            <div className="grid gap-6">
              <div className="flex flex-col space-y-2">
                <Typography variant="subtitle2" color="text.secondary">
                  Comment Content
                </Typography>
                <Typography variant="body1" className="text-gray-900">
                  {mockComment.content}
                </Typography>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col space-y-2">
                  <Typography variant="subtitle2" color="text.secondary">
                    Author
                  </Typography>
                  <Typography variant="body1" className="text-gray-900">
                    {mockComment.author}
                  </Typography>
                </div>

                <div className="flex flex-col space-y-2">
                  <Typography variant="subtitle2" color="text.secondary">
                    Date Posted
                  </Typography>
                  <Typography variant="body1" className="text-gray-900">
                    {new Date(mockComment.date).toLocaleDateString('en-GB')}
                  </Typography>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <Typography variant="subtitle2" color="text.secondary">
                  Related Post
                </Typography>
                <Link href={`/posts/${mockComment.post.id}`} passHref>
                  <MuiLink className="text-blue-600 hover:text-blue-800">
                    {mockComment.post.title}
                  </MuiLink>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Comment</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this comment? This action cannot be undone.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
          <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: "100%" }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </div>
  );
} 