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
  // Tooltip,
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
// import { Delete } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@src/components/ui/dropdown-menu";
import { MoreVertical, MessageSquare, Ban, Trash2 } from "lucide-react";
// import { toast } from "react-hot-toast";
import { toast } from "react-toastify";


const PostsManagementPage = () => {
  const theme = useTheme();
  const history = useRouter();
  const [posts, setPosts] = useState([]);
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
  const [postToDelete, setPostToDelete] = useState(null);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  type Post = {
    _id: string;
    title: string;
    userId: string;
    postType: string;
    numOfLikes: number;
    numOfComments: number;
    createdAt: string;
    reportCount?: number;
    status: string;
  };

  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchPosts();
  }, [page, limit, order, sortBy, searchTerm]);

  const fetchPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const params: any = {
        searchTerm,
        sortBy,
        order,
        page,
        limit,
      };

      const { data } = await request.get("/posts", {
        params,
      });
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

  const openDeleteDialog = (postId: any) => {
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
        fetchPosts();
        setSnackbarMessage("Post successfully deleted!");
        setOpenSnackbar(true);
      } catch (err: any) {
        setError("Failed to delete post" + err.message);
      } finally {
        closeDeleteDialog();
      }
    }
  };

  const formatRelativeDate = (date: any) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const viewPost = (postId: any) => {
    history.push(`/posts/${postId}`);
  };

  const handleChangePage = (event: any, newPage: any) => {
    console.log({ newPage });

    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setLimit(parseInt(event.target.value, ));
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
        return posts.filter((post: any) => post.status === 'approved');
      case 'in-review':
        return posts.filter((post: any) => post.status === 'in-review');
      case 'rejected':
        return posts.filter((post: any) => post.status === 'rejected');
      case 'stopped':
        return posts.filter((post: any) => post.status === 'stopped');
      default:
        return posts;
    }
  }, [posts, filterStatus]);

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
        setPosts(updatedPosts as any);
        // setSnackbarMessage(`Post status updated to ${newStatus}`);
        toast.success(`Post status updated to ${newStatus}`);
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
      // setSnackbarMessage(`Failed to update post status: ${errorMessage}`);
      toast.error(`Failed to update post status: ${errorMessage}`);
      setOpenSnackbar(true);
    }
  };

  // const handleNotifyCreator = (post: any) => {
  //   toast.success(`Message sent to creator of post: ${post.title}`);
  // };

  return (
    <div className="mx-auto p-6">
    <div className="space-y-2 mb-4">
      <h1 className="text-3xl font-bold tracking-tight">Posts Management</h1>
      <p className="text-muted-foreground">
        Manage and monitor all posts in the platform
      </p>
    </div>
      <Box sx={{ padding: 0}}>
        {/* <Card variant="outlined" sx={{ marginBottom: 3, padding: 2 }}>
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Post Engagement Analytics
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={posts}>
              <XAxis dataKey="title" />
              <YAxis />
              <ChartTooltip />
              <Legend />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar name={"Total Likes"} dataKey="numOfLikes" fill={theme.palette.primary.main} />
              <Bar name={"Total Comments"} dataKey="numOfComments" fill={theme.palette.secondary.main} />
            </BarChart>
          </ResponsiveContainer>
        </Card> */}

        <Card
          variant="outlined"
          sx={{
            marginBottom: 3,
            padding: 1,
            borderRadius: 1,
            position: "sticky",
            top: 64,
            zIndex: 1,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Search Posts"
                onChange={(e) => handleSearchChange(e.target.value)}
                variant="outlined"
                InputProps={{
                  startAdornment: <SearchIcon sx={{ marginRight: 1 }} />,
                }}
              />
            </Grid>
            {/* <Grid item xs={12} md={3}>
              <Select fullWidth size="small" value={sortBy} onChange={handleSortChange} label="Sort By" variant="outlined">
                <MenuItem value="createdAt">Date Created</MenuItem>
                <MenuItem value="numOfLikes">Likes</MenuItem>
                <MenuItem value="numOfComments">Comments</MenuItem>
              </Select>
            </Grid> */}
            <Grid item>
              <Button
                size="small"
                variant="contained"
                onClick={handleOrderChange}
                className="bg-Table-Header-Color text-white"
                startIcon={order === "desc" ? <ArrowDownwardIcon className="text-white" /> : <ArrowUpwardIcon className="text-white" />}
              >
                <span className="text-white"> 
                {order === "desc" ? "Descending" : "Ascending"}
                </span>
              </Button>
            </Grid>
            <Grid item>
              <Button
              className="topButtonSize cursor-pointer"
            >
              All Posts {totalCount}
            </Button>
            </Grid>
            <Grid item>
              <Button
                className="topButtonSize cursor-pointer"
          >
            Approved Posts {posts.filter((p: Post) => p.status === 'active').length}
          </Button>
            </Grid>
            <Grid item>
              <Button
                className="topButtonSize cursor-pointer"
          >
            Pending Review {posts.filter((p: Post) => p.status === 'in_review').length}
          </Button>
            </Grid>
            <Grid item>
              <Button
                className="topButtonSize  cursor-pointer"
          >
            Rejected Posts {posts.filter((p: Post) => p.status === 'inactive').length}
          </Button>
            </Grid>
            {/* <Grid item>
              <TablePagination
                component="div"
                count={totalCount}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={limit}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Grid> */}
            {/* <Grid item>Match Found: {matchedRecord}</Grid> */}
          </Grid>
        </Card>

        {/* <Box sx={{ display: 'flex', gap: 1, mb: 3 }}> */}
          
          {/* <Button
            variant={filterStatus === 'all' ? 'contained' : 'outlined'}
            onClick={() => handleFilterStatusChange ('all')}
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
          </Button> */}
         
          {/* <Button
            variant={filterStatus === 'all' ? 'contained' : 'outlined'}
            onClick={() => setFilterStatus('all')}
            startIcon={<ArrowDownwardIcon className="text-white" />}
            className="bg-Table-Header-Color text-white"
          >
            <span className="text-white">All Posts {totalCount}</span>
          </Button>
          <Button
            variant={filterStatus === 'approved' ? 'contained' : 'outlined'}
            onClick={() => setFilterStatus('approved')}
            className="bg-Table-Header-Color text-white"
          >
            <span className="text-white">Approved Posts {posts.filter((p: any) => p.status === 'approved').length}</span>
          </Button>
          <Button
            variant={filterStatus === 'in-review' ? 'contained' : 'outlined'}
            onClick={() => setFilterStatus('in-review')}
            className="bg-Table-Header-Color text-white"
          >
            <span className="text-white">In Review Posts {posts.filter((p: any) => p.status === 'in-review').length}</span>
          </Button>
          <Button
            variant={filterStatus === 'rejected' ? 'contained' : 'outlined'}
            onClick={() => setFilterStatus('rejected')}
            className="bg-Table-Header-Color text-white"
          >
            <span className="text-white">Rejected Posts {posts.filter((p: any) => p.status === 'rejected').length}</span>
          </Button>
          <Button
            variant={filterStatus === 'stopped' ? 'contained' : 'outlined'}
            onClick={() => setFilterStatus('stopped')}
            className="bg-Table-Header-Color text-white"
          >
            <span className="text-white">Stopped Posts {posts.filter((p: any) => p.status === 'stopped').length}</span>
          </Button> */}
        {/* </Box> */}
        <Card variant="outlined" sx={{ minHeight: "100vh", padding: 0, borderRadius: 1 }}>
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
                {posts.map((post: any) => (
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
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleUpdatePostStatus(post._id, 'active')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-circle-check-big mr-2 h-4 w-4 text-green-500"><path d="M21.801 10A10 10 0 1 1 17 3.335"></path><path d="m9 11 3 3L22 4"></path></svg>
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleUpdatePostStatus(post._id, 'in_review')}>
                            <Ban className="mr-2 h-4 w-4 text-yellow-500" />
                            Pending Review
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleUpdatePostStatus(post._id, 'inactive')}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-x-circle mr-2 h-4 w-4 text-red-500"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
                            Reject
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer" onClick={() => openDeleteDialog(post._id)}>
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
            {/* <TablePagination
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
            /> */}
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
              onClick={() => {
                handleDeletePost();
              }}
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
            <Grid item>
              <TablePagination
                component="div"
                count={totalCount}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={limit}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Grid>
      </Box>
    </div>
  );
};

export default PostsManagementPage;