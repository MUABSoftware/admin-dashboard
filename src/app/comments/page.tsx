"use client";
import { useState } from "react";
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
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@src/components/ui/dropdown-menu";
import { MoreVertical, MessageSquare, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

const mockComments = [
  {
    id: 1,
    content: "This is a great post! I really enjoyed reading it and learning from the insights shared...",
    author: "John Doe",
    date: "2024-03-15",
    postId: 1,
    postTitle: "Introduction to React Hooks",
  },
  {
    id: 2,
    content: "Very informative article! Thanks for sharing these insights about TypeScript patterns.",
    author: "Jane Smith",
    date: "2024-03-14",
    postId: 2,
    postTitle: "Advanced TypeScript Patterns",
  },
  {
    id: 3,
    content: "The examples provided really helped me understand the concept better. Great explanation!",
    author: "Mike Johnson",
    date: "2024-03-13",
    postId: 3,
    postTitle: "Understanding Redux Toolkit",
  },
  {
    id: 4,
    content: "Could you please provide more examples of this implementation? It's quite interesting.",
    author: "Sarah Wilson",
    date: "2024-03-12",
    postId: 4,
    postTitle: "Next.js 13 Features",
  },
  {
    id: 5,
    content: "I've been using this approach in my projects and it works perfectly. Thanks!",
    author: "David Brown",
    date: "2024-03-11",
    postId: 5,
    postTitle: "React Performance Tips",
  },
  {
    id: 6,
    content: "This helped me solve a problem I've been stuck on for days. Thank you!",
    author: "Emma Davis",
    date: "2024-03-10",
    postId: 6,
    postTitle: "Debugging React Applications",
  },
  {
    id: 7,
    content: "Great explanation of complex concepts in simple terms. Very helpful!",
    author: "Alex Turner",
    date: "2024-03-09",
    postId: 7,
    postTitle: "State Management Patterns",
  },
  {
    id: 8,
    content: "The code examples are well-structured and easy to follow. Nice work!",
    author: "Lisa Anderson",
    date: "2024-03-08",
    postId: 8,
    postTitle: "CSS-in-JS Solutions",
  },
  {
    id: 9,
    content: "I found a small typo in the third paragraph. Otherwise, excellent article!",
    author: "Tom Wilson",
    date: "2024-03-07",
    postId: 9,
    postTitle: "Testing React Components",
  },
  {
    id: 10,
    content: "Looking forward to more articles in this series. Very informative!",
    author: "Rachel Green",
    date: "2024-03-06",
    postId: 10,
    postTitle: "React Design Patterns",
  },
  {
    id: 11,
    content: "The performance tips mentioned here made a significant difference in my app.",
    author: "Chris Martin",
    date: "2024-03-05",
    postId: 11,
    postTitle: "React Optimization Techniques",
  },
  {
    id: 12,
    content: "Would love to see more advanced topics covered in future posts.",
    author: "Emily White",
    date: "2024-03-04",
    postId: 12,
    postTitle: "Advanced React Patterns",
  },
  {
    id: 13,
    content: "This is exactly what I needed for my current project. Perfect timing!",
    author: "Daniel Lee",
    date: "2024-03-03",
    postId: 13,
    postTitle: "React Security Best Practices",
  },
  {
    id: 14,
    content: "The comparison between different approaches was very helpful.",
    author: "Sophie Clark",
    date: "2024-03-02",
    postId: 14,
    postTitle: "State Management Comparison",
  },
  {
    id: 15,
    content: "I implemented this solution and it works like a charm. Thanks!",
    author: "Ryan Taylor",
    date: "2024-03-01",
    postId: 15,
    postTitle: "React Authentication Patterns",
  },
  {
    id: 16,
    content: "Great article! Would be nice to see more real-world examples though.",
    author: "Hannah Baker",
    date: "2024-02-29",
    postId: 16,
    postTitle: "React Form Handling",
  },
  {
    id: 17,
    content: "The step-by-step guide was very easy to follow. Well done!",
    author: "James Wilson",
    date: "2024-02-28",
    postId: 17,
    postTitle: "React Router Implementation",
  },
  {
    id: 18,
    content: "This solved my performance issues. Thank you for sharing!",
    author: "Olivia Moore",
    date: "2024-02-27",
    postId: 18,
    postTitle: "React Lazy Loading",
  },
  {
    id: 19,
    content: "Very comprehensive guide. Bookmarking this for future reference.",
    author: "William Scott",
    date: "2024-02-26",
    postId: 19,
    postTitle: "React Testing Strategies",
  },
  {
    id: 20,
    content: "The diagrams really helped understand the flow. Great visualization!",
    author: "Emma Thompson",
    date: "2024-02-25",
    postId: 20,
    postTitle: "React Data Flow",
  },
  {
    id: 21,
    content: "This approach saved me hours of debugging. Thank you!",
    author: "Lucas Martin",
    date: "2024-02-24",
    postId: 21,
    postTitle: "Error Handling in React",
  },
  {
    id: 22,
    content: "Would love to see a follow-up article on more advanced topics.",
    author: "Grace Kelly",
    date: "2024-02-23",
    postId: 22,
    postTitle: "React Custom Hooks",
  },
  {
    id: 23,
    content: "The best explanation of this concept I've found so far.",
    author: "Nathan Brown",
    date: "2024-02-22",
    postId: 23,
    postTitle: "React Context API",
  },
  {
    id: 24,
    content: "Very practical advice. I'll definitely use this in my next project.",
    author: "Sophia Lee",
    date: "2024-02-21",
    postId: 24,
    postTitle: "React Project Structure",
  },
  {
    id: 25,
    content: "Clear and concise explanation. Exactly what I was looking for!",
    author: "Jack Robinson",
    date: "2024-02-20",
    postId: 25,
    postTitle: "React Performance Monitoring",
  },
  {
    id: 26,
    content: "The code samples are very helpful. Thanks for sharing!",
    author: "Isabella Clark",
    date: "2024-02-19",
    postId: 26,
    postTitle: "React Animation Techniques",
  },
  {
    id: 27,
    content: "This helped me understand the concept much better. Great work!",
    author: "Mason Taylor",
    date: "2024-02-18",
    postId: 27,
    postTitle: "React Server Components",
  },
  {
    id: 28,
    content: "Excellent tutorial! The examples are very practical.",
    author: "Ava Wilson",
    date: "2024-02-17",
    postId: 28,
    postTitle: "React SEO Optimization",
  },
  {
    id: 29,
    content: "I appreciate the detailed explanation of edge cases.",
    author: "Ethan Davis",
    date: "2024-02-16",
    postId: 29,
    postTitle: "React Error Boundaries",
  },
  {
    id: 30,
    content: "This is a game-changer for my current project. Thanks!",
    author: "Mia Johnson",
    date: "2024-02-15",
    postId: 30,
    postTitle: "React Code Splitting",
  },
  {
    id: 31,
    content: "Very thorough explanation. Looking forward to more articles!",
    author: "Liam Anderson",
    date: "2024-02-14",
    postId: 31,
    postTitle: "React Testing Library",
  },
  {
    id: 32,
    content: "The troubleshooting section was particularly helpful.",
    author: "Charlotte White",
    date: "2024-02-13",
    postId: 32,
    postTitle: "React Debug Tools",
  },
  {
    id: 33,
    content: "Great insights! This will improve our development workflow.",
    author: "Noah Martin",
    date: "2024-02-12",
    postId: 33,
    postTitle: "React Best Practices",
  },
  {
    id: 34,
    content: "The comparison table was very helpful in making a decision.",
    author: "Amelia Thompson",
    date: "2024-02-11",
    postId: 34,
    postTitle: "React State Solutions",
  },
  {
    id: 35,
    content: "This solved our performance bottleneck. Thank you!",
    author: "Oliver Brown",
    date: "2024-02-10",
    postId: 35,
    postTitle: "React Memory Management",
  },
  {
    id: 36,
    content: "Very well-written article. Easy to understand and implement.",
    author: "Elijah Wilson",
    date: "2024-02-09",
    postId: 36,
    postTitle: "React Component Patterns",
  },
  {
    id: 37,
    content: "The security considerations were eye-opening. Great article!",
    author: "Scarlett Davis",
    date: "2024-02-08",
    postId: 37,
    postTitle: "React Security Tips",
  },
  {
    id: 38,
    content: "This approach simplified our codebase significantly.",
    author: "Henry Clark",
    date: "2024-02-07",
    postId: 38,
    postTitle: "React Code Organization",
  },
  {
    id: 39,
    content: "The migration guide was very helpful. Smooth transition!",
    author: "Victoria Lee",
    date: "2024-02-06",
    postId: 39,
    postTitle: "React Version Migration",
  },
  {
    id: 40,
    content: "Great explanation of complex concepts. Well done!",
    author: "Sebastian Scott",
    date: "2024-02-05",
    postId: 40,
    postTitle: "React Advanced Concepts",
  },
  {
    id: 41,
    content: "The performance tips made a huge difference in our app.",
    author: "Zoe Taylor",
    date: "2024-02-04",
    postId: 41,
    postTitle: "React App Optimization",
  },
  {
    id: 42,
    content: "Very practical advice for real-world applications.",
    author: "Gabriel Martin",
    date: "2024-02-03",
    postId: 42,
    postTitle: "React Production Tips",
  },
  {
    id: 43,
    content: "The debugging techniques saved me hours of work.",
    author: "Penelope White",
    date: "2024-02-02",
    postId: 43,
    postTitle: "React Debugging Guide",
  },
  {
    id: 44,
    content: "Excellent resource for both beginners and advanced developers.",
    author: "Leo Anderson",
    date: "2024-02-01",
    postId: 44,
    postTitle: "React Development Guide",
  },
  {
    id: 45,
    content: "The code examples are very clear and well-documented.",
    author: "Luna Thompson",
    date: "2024-01-31",
    postId: 45,
    postTitle: "React Code Examples",
  },
  {
    id: 46,
    content: "This pattern solved our state management issues.",
    author: "Max Wilson",
    date: "2024-01-30",
    postId: 46,
    postTitle: "React State Patterns",
  },
  {
    id: 47,
    content: "Great article! The examples are very practical.",
    author: "Ruby Davis",
    date: "2024-01-29",
    postId: 47,
    postTitle: "React UI Patterns",
  },
  {
    id: 48,
    content: "The testing strategies improved our code quality.",
    author: "Jasper Brown",
    date: "2024-01-28",
    postId: 48,
    postTitle: "React Testing Guide",
  },
  {
    id: 49,
    content: "Very comprehensive coverage of the topic. Well done!",
    author: "Hazel Clark",
    date: "2024-01-27",
    postId: 49,
    postTitle: "React Architecture",
  },
  {
    id: 50,
    content: "This helped us modernize our legacy React application.",
    author: "Felix Martin",
    date: "2024-01-26",
    postId: 50,
    postTitle: "React Modernization",
  },
];

export default function CommentsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [order, setOrder] = useState("desc");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setLimit(parseInt(event.target.value));
    setPage(0);
  };

  const handleOrderChange = () => {
    setOrder(order === "desc" ? "asc" : "desc");
  };

  const handleDeleteClick = (id: number) => {
    setCommentToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    // Implement delete logic here
    console.log("Deleting comment:", commentToDelete);
    setDeleteDialogOpen(false);
    setCommentToDelete(null);
    setSnackbarMessage("Comment successfully deleted!");
    setOpenSnackbar(true);
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  // Get paginated data
  const getPaginatedData = () => {
    const startIndex = page * limit;
    const endIndex = startIndex + limit;
    return mockComments.slice(startIndex, endIndex);
  };

  return (
    <div className="mx-auto p-6">
      <div className="space-y-2 mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Comments Management</h1>
        <p className="text-muted-foreground">
          Manage and monitor all comments across the platform
        </p>
      </div>
      <Box sx={{ padding: 0 }}>
        <Card
          variant="outlined"
          sx={{
            marginBottom: 3,
            padding: 1,
            borderRadius: 1,
          }}
        >
          <Grid container spacing={2} alignItems="center">
            {/* <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                size="small"
                label="Search Comments"
                variant="outlined"
                InputProps={{
                  startAdornment: <SearchIcon sx={{ marginRight: 1 }} />,
                }}
              />
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
              <Button className="topButtonSize cursor-pointer">
                All Comments ({mockComments.length})
              </Button>
            </Grid>
          </Grid>
        </Card>

        <Card variant="outlined" sx={{ minHeight: "100vh", padding: 0, borderRadius: 1 }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", padding: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" sx={{ textAlign: "center", padding: 4 }}>
              {error}
            </Typography>
          ) : mockComments.length === 0 ? (
            <Box sx={{ textAlign: "center", padding: 4 }}>
              <Typography variant="h6">No comments available</Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your filters or search criteria.
              </Typography>
            </Box>
          ) : (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <Table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 border-1 border-gray-200">
                <TableHead className="text-xs text-gray-700 uppercase bg-gray-50 dark:text-gray-400">
                  <TableRow>
                    <TableCell scope="col">Comment</TableCell>
                    <TableCell scope="col">Author</TableCell>
                    <TableCell scope="col">Post</TableCell>
                    <TableCell scope="col">Posted on</TableCell>
                    <TableCell scope="col" className="text-center-important">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getPaginatedData().map((comment) => (
                    <TableRow key={comment.id} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                      <TableCell className="underline" sx={{ cursor: "pointer", maxWidth: "300px" }} onClick={() => router.push(`/comments/${comment.id}`)}>
                        <Typography variant="body2">{truncateText(comment.content)}</Typography>
                      </TableCell>
                      <TableCell>{comment.author}</TableCell>
                      <TableCell className="underline" sx={{ cursor: "pointer" }} onClick={() => router.push(`/posts/${comment.postId}`)}>
                        {comment.postTitle}
                      </TableCell>
                      <TableCell>{new Date(comment.date).toLocaleDateString('en-GB')}</TableCell>
                      <TableCell className="text-center-important">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <IconButton size="small">
                              <MoreVertical className="h-4 w-4" />
                            </IconButton>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" style={{ backgroundColor: '#fff' }}>
                            <DropdownMenuItem
                              className="cursor-pointer hover:bg-gray-100"
                              onClick={() => router.push(`/comments/${comment.id}`)}
                            >
                              <MessageSquare className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer hover:bg-gray-100"
                              onClick={() => handleDeleteClick(comment.id)}
                            >
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
                count={mockComments.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={limit}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 20, 50]}
                sx={{
                  borderTop: '1px solid #e0e0e0',
                  backgroundColor: 'white',
                }}
              />
            </div>
          )}
        </Card>

        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Comment</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this comment? This action cannot be undone.
          </DialogContent>
          <DialogActions>
            <Button className="bg-Table-Header-Color font-CustomPrimary-Color" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button className="bg-Table-Header-Color font-CustomPrimary-Color" onClick={handleDeleteConfirm} color="error" variant="contained">
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