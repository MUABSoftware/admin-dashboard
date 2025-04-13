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
import { MoreVertical, MessageSquare, Ban } from "lucide-react";
// import { toast } from "react-hot-toast";

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

  // const handleNotifyCreator = (post: any) => {
  //   toast.success(`Message sent to creator of post: ${post.title}`);
  // };

  return (
    <Box sx={{ padding: 3 }}>
      <Card variant="outlined" sx={{ marginBottom: 3, padding: 2 }}>
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
      </Card>



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
          <Grid item xs={12} md={3}>
            <Select fullWidth size="small" value={sortBy} onChange={handleSortChange} label="Sort By" variant="outlined">
              <MenuItem value="createdAt">Date Created</MenuItem>
              <MenuItem value="numOfLikes">Likes</MenuItem>
              <MenuItem value="numOfComments">Comments</MenuItem>
            </Select>
          </Grid>
          <Grid item>
            <Button
              size="small"
              variant="contained"
              onClick={handleOrderChange}
              startIcon={order === "desc" ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
            >
              {order === "desc" ? "Descending" : "Ascending"}
            </Button>
          </Grid>
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
          <Grid item>Match Found: {matchedRecord}</Grid>
        </Grid>
      </Card>

      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <Button
          variant={filterStatus === 'all' ? 'contained' : 'outlined'}
          onClick={() => setFilterStatus('all')}
          startIcon={<ArrowDownwardIcon />}
          sx={{
            color: filterStatus === 'all' ? '#000' : 'inherit',
            backgroundColor: filterStatus === 'all' ? '#bfdbfe !important' : 'transparent',
            '&:hover': {
              backgroundColor: filterStatus === 'all' ? '#bfdbfe !important' : 'transparent',
            }
          }}
        >
          All Posts {posts.length}
        </Button>
        <Button
          variant={filterStatus === 'approved' ? 'contained' : 'outlined'}
          onClick={() => setFilterStatus('approved')}
          sx={{
            color: filterStatus === 'approved' ? '#FFF' : 'inherit',
            backgroundColor: filterStatus === 'approved' ? '#bfdbfe' : 'transparent',
            '&:hover': {
              backgroundColor: filterStatus === 'approved' ? '#bfdbfe' : 'transparent',
            }
          }}
        >
          Approved Posts {posts.filter((p: any) => p.status === 'approved').length}
        </Button>
        <Button
          variant={filterStatus === 'in-review' ? 'contained' : 'outlined'}
          onClick={() => setFilterStatus('in-review')}
          sx={{
            color: filterStatus === 'in-review' ? '#FFF' : 'inherit',
            backgroundColor: filterStatus === 'in-review' ? '#bfdbfe' : 'transparent',
            '&:hover': {
              backgroundColor: filterStatus === 'in-review' ? '#bfdbfe' : 'transparent',
            }
          }}
        >
          In Review Posts {posts.filter((p: any) => p.status === 'in-review').length}
        </Button>
        <Button
          variant={filterStatus === 'rejected' ? 'contained' : 'outlined'}
          onClick={() => setFilterStatus('rejected')}
          sx={{
            color: filterStatus === 'rejected' ? '#FFF' : 'inherit',
            backgroundColor: filterStatus === 'rejected' ? '#bfdbfe' : 'transparent',
            '&:hover': {
              backgroundColor: filterStatus === 'rejected' ? '#bfdbfe' : 'transparent',
            }
          }}
        >
          Rejected Posts {posts.filter((p: any) => p.status === 'rejected').length}
        </Button>
        <Button
          variant={filterStatus === 'stopped' ? 'contained' : 'outlined'}
          onClick={() => setFilterStatus('stopped')}
          sx={{
            color: filterStatus === 'stopped' ? '#FFF' : 'inherit',
            backgroundColor: filterStatus === 'stopped' ? '#bfdbfe' : 'transparent',
            '&:hover': {
              backgroundColor: filterStatus === 'stopped' ? '#bfdbfe' : 'transparent',
            }
          }}
        >
          Stopped Posts {posts.filter((p: any) => p.status === 'stopped').length}
        </Button>
      </Box>
      <Card variant="outlined" sx={{ minHeight: "100vh", padding: 2, borderRadius: 1 }}>
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
          <Table>
            <TableHead>
              <TableRow>
                {/* <TableCell>checkbox</TableCell>
                <TableCell>Title</TableCell> */}
                <TableCell>Business name</TableCell>
                <TableCell align="center">Likes</TableCell>
                <TableCell align="center">Comments</TableCell>
                <TableCell>Posted on</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {getFilteredPosts().map((post: any) => (
                <TableRow key={post._id}>
                  <TableCell sx={{ cursor: "pointer", maxWidth: "200px" }} onClick={() => viewPost(post._id)}>
                    <Typography variant="body2">{post.title}</Typography>
                  </TableCell>
                  <TableCell align="center">{post.numOfLikes}</TableCell>
                  <TableCell align="center">{post.numOfComments}</TableCell>
                  <TableCell>{formatRelativeDate(post.createdAt)}</TableCell>
                  <TableCell align="center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <IconButton size="small">
                          <MoreVertical className="h-4 w-4" />
                        </IconButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" style={{ backgroundColor: '#fff' }}>
                        <DropdownMenuItem>
                          <Ban className="mr-2 h-4 w-4 text-red-500" />
                          Approve post
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Ban className="mr-2 h-4 w-4 text-red-500" />
                          In Review post
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Ban className="mr-2 h-4 w-4 text-red-500" />
                          Reject post
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Ban className="mr-2 h-4 w-4 text-red-500" />
                          Stopped post
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openDeleteDialog(post._id)}>
                          <Ban className="mr-2 h-4 w-4 text-red-500" />
                          Delete Post
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Message Creator
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
    </Box>
  );
};

export default PostsManagementPage;