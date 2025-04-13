"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Alert,
  TextField,
  Select,
  MenuItem,
  InputAdornment,
  Pagination,
  Chip,
  Tooltip,
  TableSortLabel,
  Stack,
  Toolbar,
  Paper,
  Avatar,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { IRevenueShare } from "@src/interfaces/RevenueShare";
import request from "@src/config/axios";
import { debounce } from "lodash";
import dayjs from "dayjs";

const RevenueShares: React.FC = () => {
  const [revenueShares, setRevenueShares] = useState<IRevenueShare[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("startDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const theme = useTheme(); // to access current theme (including dark mode)

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearch(query);
      setPage(1);
    }, 500),
    []
  );

  useEffect(() => {
    fetchRevenueShares();
  }, [page, search, sortBy, sortOrder]);

  const fetchRevenueShares = async () => {
    setLoading(true);
    try {
      const response = await request.get("/reports/revenueShares", {
        params: { page, search, sortBy, sortOrder },
      });
      setRevenueShares(response.data.reports);
      setTotalPages(response.data.totalPages);
    } catch (error: any) {
      setError("Failed to fetch revenue shares. Please try again later. :" + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(event.target.value);
  };

  const handleSearchClear = () => {
    setSearch("");
  };

  const handleSortChange = (field: string) => {
    const newSortOrder = sortBy === field && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(field);
    setSortOrder(newSortOrder);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Box sx={{ m: 5 }}>

      <Typography variant="h5" component="h1" gutterBottom sx={{ color: theme.palette.text.primary }}>
        Revenue Shares
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
          padding: 0,
        }}
      >
        <TextField
          label="Search User"
          value={search}
          onChange={handleSearchChange}
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: search && (
              <IconButton onClick={handleSearchClear}>
                <ClearIcon />
              </IconButton>
            ),
          }}
          sx={{
            maxWidth: 350,
            backgroundColor: theme.palette.background.paper, // Ensure input field looks good in both modes
            borderRadius: 1,
          }}
        />

        <Select value={sortBy} onChange={(e) => handleSortChange(e.target.value)} size="small" sx={{ minWidth: 150 }}>
          <MenuItem value="startDate">Start Date</MenuItem>
          <MenuItem value="amount">Amount</MenuItem>
          <MenuItem value="internalStatus">Status</MenuItem>
        </Select>
      </Toolbar>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>
                <TableSortLabel active={sortBy === "startDate"} direction={sortOrder} onClick={() => handleSortChange("startDate")}>
                  Start Date
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel active={sortBy === "endDate"} direction={sortOrder} onClick={() => handleSortChange("endDate")}>
                  End Date
                </TableSortLabel>
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell>
                <TableSortLabel active={sortBy === "amount"} direction={sortOrder} onClick={() => handleSortChange("amount")}>
                  Net Amount
                </TableSortLabel>
              </TableCell>
              <TableCell>Fees (Muab Fee)</TableCell>
              <TableCell>Payout Method</TableCell>
              <TableCell>Total Purchases</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from({ length: 10 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={7}>
                      <CircularProgress color="primary" sx={{ display: "block", margin: "0 auto" }} />
                    </TableCell>
                  </TableRow>
                ))
              : revenueShares.map((share) => (
                  <TableRow key={share._id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar src={share.userId?.profilePic || "/default-avatar.png"} sx={{ marginRight: 2 }} />
                        {share.userId?.name || "N/A"}
                      </Box>
                    </TableCell>
                    <TableCell>{dayjs(share.startDate).format("MM/DD/YYYY")}</TableCell>
                    <TableCell>{dayjs(share.endDate).format("MM/DD/YYYY")}</TableCell>
                    <TableCell>
                      <Tooltip title={share.failureReason || "No Failure"}>
                        <Chip
                          label={share.externalStatus.toUpperCase()}
                          color={share.internalStatus.toLowerCase() === "failed" ? "error" : "primary"}
                          size="small"
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell>{share.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        Fees: {share.transferFees.toFixed(2)} + {share.commissionFees.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{share.payoutMethod} </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{share.totalPurchasesAmount}</Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton color="primary">
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton color="error">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack direction="row" justifyContent="center" sx={{ mt: 3 }}>
        <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
      </Stack>
    </Box>
  );
};

export default RevenueShares;
