"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  Grid,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  TextField,
  Select,
  MenuItem,
  TablePagination,
  CircularProgress,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import { BarChart, Bar, XAxis, YAxis, Tooltip as ChartTooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import debounce from "lodash/debounce";
import request from "@src/config/axios";
import { useTheme } from "@mui/system";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@src/components/ui/dropdown-menu";
import { MoreVertical, Ban, Trash2 } from "lucide-react";

type Post = {
  _id: string;
  title: string;
  userId: string;
  postType: string;
  numOfLikes: number;
  numOfComments: number;
  // Add more fields as needed
  createdAt: string;
  // If you have report count, add it here, e.g.:
  reportCount?: number;
  status: string;
};

const PostsManagementPage = () => {
  const theme = useTheme();
  const history = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [order, setOrder] = useState("desc");
  const [sortBy, setSortBy] = useState("createdAt");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [matchedRecord, setMatchedRecord] = useState(0);

  const [openDialog, setOpenDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchPosts();
  }, [page, limit, order, sortBy, searchTerm]);

  const fetchPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const params: any = { searchTerm,
        sortBy,
        order,
        page,
        limit,
      };

      const { data } = await request.get("/posts", {
        params,
      });
      console.log(data);
      setPosts(data.data);
      setTotalCount(data.totalCount);
      setMatchedRecord(data.matched);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setPage(0);
    }, 500),
    []
  );

  const openDeleteDialog = (postId: string) => {
    setPostToDelete(postId);
    setOpenDialog(true);
  };

  const closeDeleteDialog = () => {
    setOpenDialog(false);
    setPostToDelete(null);
  };

  const handleDeletePost = async () => {
    if (postToDelete) {
      try {
        await request.delete(`/posts/${postToDelete}`);
        setPage(0);
        await fetchPosts();
        setSnackbarMessage("Post successfully deleted!");
        setOpenSnackbar(true);
      } catch (err: any) {
        setError("Failed to delete post: " + err.message);
      } finally {
        closeDeleteDialog();
      }
    }
  };

  const handleUpdatePostStatus = async (postId: string, newStatus: string) => {
    try {
      await request.patch(`/posts/${postId}/status`, { status: newStatus });
      const updatedPosts = posts.map((post: any) => 
        post._id === postId ? {...post, status: newStatus} : post
      );
      setPosts(updatedPosts);
      setSnackbarMessage(`Post status updated to ${newStatus}`);
      setOpenSnackbar(true);
    } catch (err: any) {
      setError("Failed to update post status: " + err.message);
    }
  };

  const formatRelativeDate = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const viewPost = (postId: string) => {
    history.push(`/posts/${postId}`);
  };

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSortChange = (event: any) => {
    setSortBy(event.target.value);
    setPage(0);
  };

  const handleOrderChange = () => {
    setOrder(order === "desc" ? "asc" : "desc");
    setPage(0);
  };

  const getFilteredPosts = useCallback(() => {
    switch (filterStatus) {
      case 'approved':
        return posts.filter((post: Post) => post.status === 'approved');
      case 'in-review':
        return posts.filter((post: Post) => post.status === 'in-review');
      case 'rejected':
        return posts.filter((post: Post) => post.status === 'rejected');
      case 'deleted':
        return posts.filter((post: Post) => post.status === 'deleted');
      default:
        return posts;
    }
  }, [posts, filterStatus]);

  return (
    <div className="mx-auto p-8">
    <div className="space-y-2 mb-4">
      <h1 className="text-3xl font-bold tracking-tight">Posts Management</h1>
      <p className="text-muted-foreground">
        Manage and monitor all posts in the platform
      </p>
    </div>
    <Box sx={{ padding: 0 }}>
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <Button
          variant={filterStatus === 'all' ? 'contained' : 'outlined'}
          onClick={() => setFilterStatus('all')}
          className="topButtonSize"
        >
          All Posts {posts.length}
        </Button>
        <Button
          variant={filterStatus === 'approved' ? 'contained' : 'outlined'}
          onClick={() => setFilterStatus('approved')}
          className="topButtonSize"
        >
          Approved Posts {posts.filter((p: Post) => p.status === 'approved').length}
        </Button>
        <Button
          variant={filterStatus === 'in-review' ? 'contained' : 'outlined'}
          onClick={() => setFilterStatus('in-review')}
          className="topButtonSize"
        >
          In Review Posts {posts.filter((p: Post) => p.status === 'in-review').length}
        </Button>
        <Button
          variant={filterStatus === 'rejected' ? 'contained' : 'outlined'}
          onClick={() => setFilterStatus('rejected')}
          className="topButtonSize"
        >
          Rejected Posts {posts.filter((p: Post) => p.status === 'rejected').length}
        </Button>
        <Button
          variant={filterStatus === 'deleted' ? 'contained' : 'outlined'}
          onClick={() => setFilterStatus('deleted')}
          className="topButtonSize"
        >
          Deleted Posts {posts.filter((p: Post) => p.status === 'deleted').length}
        </Button>
      </Box>
      <Card variant="outlined" sx={{ minHeight: "100vh", padding: 0, borderRadius: 2,border: "1px solid #e0e0e0" }}>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", padding: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ textAlign: "center", padding: 4 }}>
            {error}
          </Typography>
        ) : getFilteredPosts().length === 0 ? (
          <Box sx={{ textAlign: "center", padding: 4 }}>
            <Typography variant="h6">No posts available</Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your filters or search criteria.
            </Typography>
          </Box>
        ) : (
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <Table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-1 border-gray-200">
              <TableHead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <TableRow>
                  <TableCell scope="col">Post Title</TableCell>
                  <TableCell scope="col">Post Owner</TableCell>
                  <TableCell scope="col" className="text-center-important">Account Type</TableCell>
                  <TableCell scope="col">Likes Count</TableCell>
                  <TableCell scope="col">Comments Count</TableCell>
                  <TableCell scope="col">Report Count</TableCell>
                  <TableCell scope="col">Posted on</TableCell>
                  <TableCell scope="col">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getFilteredPosts().map((post: any) => (
                  <TableRow key={post._id} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                    <TableCell sx={{ cursor: "pointer", maxWidth: "200px" }} onClick={() => viewPost(post._id)}>
                      <Typography variant="body2">{post.title}</Typography>
                    </TableCell>
                    <TableCell>{post.userId?.name || 'Unknown User'}</TableCell>
                    <TableCell className="text-center-important">{post.userId?.accountType || 'Unknown Account Type'}</TableCell>
                    <TableCell className="text-center-important">{post.numOfLikes}</TableCell>
                    <TableCell className="text-center-important">{post.numOfComments}</TableCell>
                    <TableCell className="text-center-important">{post.reportCount ?? 0}</TableCell>
                    <TableCell>{formatRelativeDate(post.createdAt)}</TableCell>
                    <TableCell className="text-center-important">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <IconButton size="small">
                            <MoreVertical className="h-4 w-4" />
                          </IconButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" style={{ backgroundColor: '#fff' }}>
                          <DropdownMenuItem onClick={() => handleUpdatePostStatus(post._id, 'approved')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check-big mr-2 h-4 w-4 text-green-500"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdatePostStatus(post._id, 'in-review')}>
                            <Ban className="mr-2 h-4 w-4 text-red-500" />
                            Pending Review
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdatePostStatus(post._id, 'rejected')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-x-circle mr-2 h-4 w-4 text-red-500"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                            Reject
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openDeleteDialog(post._id)}>
                            <Trash2 className="mr-2 h-4 w-4 text-red-500" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <Dialog open={openDialog} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this post?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeletePost}
            color="error"
          >
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
};

export default PostsManagementPage;