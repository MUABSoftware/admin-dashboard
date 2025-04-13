"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  IconButton,
  InputAdornment,
  OutlinedInput,
  TablePagination,
  Checkbox,
  FormControl,
  Menu,
  MenuItem,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { Check, Clear, Close, MoreVert, Search, 
  // DeleteOutline, DeleteForever, MoreVert 
} from "@mui/icons-material";
import request from "@src/config/axios";
// import { BlocksIcon } from "lucide-react";
import BlockIcon from '@mui/icons-material/Block';
const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("name");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [search, setSearch] = useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const router = useRouter();

  
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    console.log(loading, error);

    try {
      console.log("Fetching users with params:", {
        page: page + 1,
        limit: rowsPerPage,
        sortBy,
        sort,
        search
      });
      const response = await request.get("/users", {
        params: { page: page + 1, limit: rowsPerPage, sortBy, sort, search },
      });
      console.log("API Response:", response.data);
      setUsers(response.data.data);
      setTotalCount(response.data.totalCount);
      setPage(response.data.page - 1);
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      setError("Failed to fetch users " + error.message);
      setLoading(false);
    }
  }, [page, rowsPerPage, sortBy, sort, search]);

  const handleSelectUser = (user: any) => {
    const selectedIndex = selectedUsers.indexOf(user._id);
    let newSelectedUsers: any[] = [];

    if (selectedIndex === -1) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers, user._id);
    } else if (selectedIndex === 0) {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(1));
    } else {
      newSelectedUsers = newSelectedUsers.concat(selectedUsers.slice(0, selectedIndex), selectedUsers.slice(selectedIndex + 1));
    }
    setSelectedUsers(newSelectedUsers);
  };

  useEffect(() => {
    fetchUsers();
  }, [page, sortBy, sort, search, rowsPerPage, fetchUsers]);


  const handleSort = (column: string) => {
    const isAsc = sortBy === column && sort === "asc";
    setSort(isAsc ? "desc" : "asc");
    setSortBy(column);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const clearSearch = () => setSearch("");

  const handlePageChange = (event: any, value: number) => {
    setPage(value);
  };

  const handleRowsPerPageChange = (event: any) => {
    setRowsPerPage(event.target.value as number);
    setPage(1);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, userId: string) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedUserId(userId);
  };

  const handleMenuClose = (event: React.MouseEvent) => {
    event.stopPropagation();
    setAnchorEl(null);
    setSelectedUserId(null);
  };

  const handleStatusChange = async (event: React.MouseEvent, userId: string, currentStatus: string) => {
    event.stopPropagation();
    if (selectedUserId && window.confirm("Are you sure you want to change user status?")) {
      try {
        // The new status will be the opposite of the current status
        const newStatus = currentStatus === "blocked" ? "active" : "blocked";
        
        const response = await request({
          method: 'patch',
          url: `/users/${userId}/status`,
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            status: newStatus
          }
        });
        
        console.log('user status change response:', response);
        
        setUsers(prevUsers => prevUsers.map(user => 
          user._id === selectedUserId 
            ? { ...user, status: newStatus }
            : user
        ));
        setError(null);
      } catch (error: any) {
        console.error('Status change error:', error);
        setError("Failed to change user status: " + error.message);
      }
    }
    handleMenuClose(event);
  };

  
  // const handlePermanentDelete = async (event: React.MouseEvent) => {
  //   event.stopPropagation();
  //   if (selectedUserId && window.confirm("Are you sure you want to permanently delete this user? This action cannot be undone.")) {
  //     try {
  //       await request.delete(`/users/${selectedUserId}`);
  //       fetchUsers();
  //     } catch (error: any) {
  //       setError("Failed to delete user");
  //     }
  //   }
  //   handleMenuClose(event);
  // };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
        User Management
      </Typography>

      <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between" }}>
        <FormControl sx={{ flexGrow: 1 }}>
          <OutlinedInput
            value={search}
            onChange={handleSearch}
            placeholder="Search users..."
            endAdornment={
              <InputAdornment position="end">
                {search ? (
                  <IconButton onClick={clearSearch}>
                    <Clear />
                  </IconButton>
                ) : (
                  <Search />
                )}
              </InputAdornment>
            }
            sx={{
              borderRadius: "8px",
              backgroundColor: "background.paper",
            }}
          />
        </FormControl>

        {/* Pagination */}
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Box>

      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="user table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedUsers.length === users.length}
                  indeterminate={selectedUsers.length > 0 && selectedUsers.length < users.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUsers(users.map((user) => user._id));
                    } else {
                      setSelectedUsers([]);
                    }
                  }}
                />
              </TableCell>
              <TableCell>ID</TableCell>
              <TableCell>
                <TableSortLabel
                  aria-label="Sort by name"
                  active={sortBy === "name"}
                  direction={sortBy === "name" ? sort : "asc"}
                  onClick={() => handleSort("name")}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  aria-label="Sort by email"
                  active={sortBy === "email"}
                  direction={sortBy === "email" ? sort : "asc"}
                  onClick={() => handleSort("email")}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  aria-label="Sort by phone"
                  active={sortBy === "phoneNumber"}
                  direction={sortBy === "phoneNumber" ? sort : "asc"}
                  onClick={() => handleSort("phoneNumber")}
                >
                  Phone
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  aria-label="Sort by Recommended"
                  active={sortBy === "isRecommended"}
                  direction={sortBy === "isRecommended" ? sort : "asc"}
                  onClick={() => handleSort("isRecommended")}
                >
                  Recommended
                </TableSortLabel>
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user._id}
                hover
                onClick={() => router.push(`/users/${user._id}`)}
                selected={selectedUsers.indexOf(user._id) !== -1}
                sx={{ 
                  cursor: "pointer",
                  backgroundColor: user.status === "blocked" ? "#ffebee" : "inherit",
                  '&:hover': {
                    backgroundColor: user.status === "blocked" ? "#ffcdd2" : '',
                  }
                }}
              >
                <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
                  <Checkbox checked={selectedUsers.indexOf(user._id) !== -1} onChange={() => handleSelectUser(user)} />
                </TableCell>
                <TableCell>{user._id.slice(0, 3) + "..." + user._id.slice(-3)}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>
                  {user.isRecommended ? (
                    <Check sx={{ color: "green", fontSize: 28 }} /> // Green check icon for recommended
                  ) : (
                    <Close sx={{ color: "gray", fontSize: 28 }} /> // Subtle gray close icon for not recommended
                  )}
                </TableCell>

                <TableCell>{user.status === "blocked" ? "Blocked" : "Active"}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <IconButton onClick={(e) => handleMenuOpen(e, user._id)}>
                    <MoreVert />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl) && selectedUserId === user._id}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={(e) => handleStatusChange(e, user._id, user.status)}>
                      {user.status === "blocked" ? <Check/> : <BlockIcon/>}
                      {user.status === "blocked" ? "Active" : "Block"}
                    </MenuItem>
                    {/* <MenuItem onClick={handlePermanentDelete}>
                      <DeleteForever sx={{ mr: 1 }} />
                      Permanent Delete
                    </MenuItem> */}
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UserManagement;
