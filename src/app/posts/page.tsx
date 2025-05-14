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
  const [limit, setLimit] = useState(20);
  const [order, setOrder] = useState("desc");
  const [sortBy, setSortBy] = useState("createdAt");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [matchedRecord, setMatchedRecord] = useState(0);

  const [openDialog, setOpenDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [filterStatus, setFilterStatus] = useState('all');
  

  const fetchPosts = async () => {
    setLoading(true);
    setSearchLoading(true);
    setError("");
    try {
      const params = {
        searchTerm: searchTerm.trim(),
        sortBy: "createdAt",
        order,
        page: page + 1,
        limit,
        status: filterStatus !== 'all' ? filterStatus : undefined
      };

      console.log('Fetching posts with params:', params);
      const { data } = await request.get("/posts", {
        params,
      });
      console.log('Search response:', { searchTerm, data });
      setPosts(data.data);
      setTotalCount(data.totalCount);
      setMatchedRecord(data.matched);
    } catch (err) {
      console.error('Search error:', err);
      setError("Failed to fetch posts");
    } finally {
      setLoading(false);
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, limit, order, sortBy, searchTerm, filterStatus]);

  const handleFilterStatusChange = (newStatus: string) => {
    console.log('Changing filter status to:', newStatus);
    setFilterStatus(newStatus);
    setPage(0);
  };

  const handleSearchChange = useCallback(
    debounce((value: string) => {
      console.log('Search term changed:', value);
      setSearchTerm(value);
      setPage(0);
    }, 300),
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
      const statusMap = {
        'active': 'active',
        'inactive': 'inactive',
        'in_review': 'in_review'
      };

      console.log('Updating post status:', {
        postId,
        newStatus,
        statusMapValue: statusMap[newStatus as keyof typeof statusMap]
      });

      const response = await request.put(`/posts/${postId}`, {
        status: statusMap[newStatus as keyof typeof statusMap]
      });

      console.log('API Response:', response.data);

      if (response.data?.success) {
        const updatedPosts = posts.map((post: any) =>
          post._id === postId ? { ...post, status: newStatus } : post
        );
        setPosts(updatedPosts);
        setSnackbarMessage(`Post status updated to ${newStatus}`);
        setOpenSnackbar(true);
        await fetchPosts();
      }
    } catch (err: any) {
      console.error('Error updating post status:', {
        error: err,
        response: err.response,
        request: err.request,
        config: err.config
      });
      const errorMessage = err.response?.data?.message || err.message;
      setError(`Failed to update post status: ${errorMessage}`);
      setSnackbarMessage(`Failed to update post status: ${errorMessage}`);
      setOpenSnackbar(true);
    }
  };

  const formatRelativeDate = (date: string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const viewPost = (postId: string) => {
    history.push(`/posts/${postId}`);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSortChange = (event: any) => {
    setSortBy(event.target.value);
    setPage(0);
  };

  const getFilteredPosts = useCallback(() => {
    switch (filterStatus) {
      case 'active':
        return posts.filter((post: Post) => post.status === 'active');
      case 'in_review':
        return posts.filter((post: Post) => post.status === 'in_review');
      case 'inactive':
        return posts.filter((post: Post) => post.status === 'inactive');
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
      <Box sx={{ display: 'flex', gap: 1, mb: 3, justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* <Button
            className="topButtonSize"
            onClick={() => {
              setOrder(order === "desc" ? "asc" : "desc");
              setPage(0);
            }}
            startIcon={order === "desc" ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
            variant="outlined"
          >
            Date: {order === "desc" ? "Newest First" : "Oldest First"}
          </Button> */}
          <Button
            variant={filterStatus === 'all' ? 'contained' : 'outlined'}
            onClick={() => handleFilterStatusChange('all')}
            className="topButtonSize"
          >
            All Posts {totalCount}
          </Button>
          <Button
            variant={filterStatus === 'active' ? 'contained' : 'outlined'}
            onClick={() => handleFilterStatusChange('active')}
            className="topButtonSize"
          >
            Approved Posts {posts.filter((p: Post) => p.status === 'active').length}
          </Button>
          <Button
            variant={filterStatus === 'in_review' ? 'contained' : 'outlined'}
            onClick={() => handleFilterStatusChange('in_review')}
            className="topButtonSize"
          >
            Pending Review {posts.filter((p: Post) => p.status === 'in_review').length}
          </Button>
          <Button
            variant={filterStatus === 'inactive' ? 'contained' : 'outlined'}
            onClick={() => handleFilterStatusChange('inactive')}
            className="topButtonSize"
          >
            Rejected Posts {posts.filter((p: Post) => p.status === 'inactive').length}
          </Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            placeholder="Search by title or owner..."
            size="small"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            InputProps={{
              startAdornment: (
                <>
                  <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
                  {searchLoading && <CircularProgress size={20} sx={{ mr: 1 }} />}
                </>
              ),
            }}
            sx={{
              width: '300px',
              '& .MuiOutlinedInput-root': {
                borderRadius: '4px',
              },
            }}
          />
        </Box>
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
                    <TableCell className="underline" sx={{ cursor: "pointer", maxWidth: "200px" }} onClick={() => viewPost(post._id)}>
                      <Typography variant="body2">{post.title}</Typography>
                    </TableCell>
                    <TableCell>{post.userId?.name || 'Unknown User'}</TableCell>
                    <TableCell className="text-center-important">{post.userId?.accountType || 'Old User'}</TableCell>
                    <TableCell className="text-center-important">{post.numOfLikes}</TableCell>
                    <TableCell className="text-center-important">{post.numOfComments}</TableCell>
                    <TableCell className="text-center-important">{post.reportCount ?? 0}</TableCell>
                    <TableCell>{new Date(post.createdAt).toLocaleDateString('en-GB')}</TableCell>
                    <TableCell className="text-center-important">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <IconButton size="small">
                            <MoreVertical className="h-4 w-4" />
                          </IconButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" style={{ backgroundColor: '#fff' }}>
                          <DropdownMenuItem onClick={() => handleUpdatePostStatus(post._id, 'active')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check-big mr-2 h-4 w-4 text-green-500"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdatePostStatus(post._id, 'in_review')}>
                            <Ban className="mr-2 h-4 w-4 text-yellow-500" />
                            Pending Review
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdatePostStatus(post._id, 'inactive')}>
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
            <TablePagination
              component="div"
              count={totalCount}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={limit}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[20, 50, 100]}
              sx={{
                borderTop: '1px solid #e0e0e0',
                backgroundColor: 'white',
              }}
            />
          </div>
        )}
      </Card>

      <Dialog open={openDialog} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this post?</Typography>
        </DialogContent>
        <DialogActions>
          <Button className="topButtonSize" onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button className="topButtonSize"
            onClick={handleDeletePost}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={error ? "error" : "success"} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
    </div>
  );
};

export default PostsManagementPage;