"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Card,
  Table as MuiTable,
  TableBody as MuiTableBody,
  TableCell as MuiTableCell,
  TableContainer,
  TableHead as MuiTableHead,
  TableRow as MuiTableRow,
  Typography,
  IconButton,
  Tooltip,
  Pagination,
  CircularProgress,
  Chip,
  Tabs as MuiTabs,
  Tab,
} from "@mui/material";
import { CheckCircle, HourglassEmpty, ErrorOutline } from "@mui/icons-material";
import request from "@src/config/axios";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@src/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@src/components/ui/tabs";
import { Badge } from "@src/components/ui/badge";
import { Button } from "@src/components/ui/button";
import { 
  // Eye, 
  Flag, User, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@src/components/ui/dropdown-menu"

interface Report {
  id: string;
  reportedItemId: string;
  reportedItemType: "profile" | "post" | "digital_product";
  title: string;
  reportedBy: string[];
  reason: string[];
  status: "pending" | "in_progress" | "resolved";
  date: string;
  totalReports: number;
}

// Mock data - grouped by reported item ID
const mockReports: Report[] = [
  {
    id: "1",
    reportedItemId: "post-123",
    reportedItemType: "post",
    title: "Inappropriate marketing post",
    reportedBy: ["user123", "user456", "user789"],
    reason: ["Spam", "Misleading", "Harassment"],
    status: "pending",
    date: "2025-04-08",
    totalReports: 3,
  },
  {
    id: "2",
    reportedItemId: "profile-456",
    reportedItemType: "profile",
    title: "JaneDoe",
    reportedBy: ["user222", "user333"],
    reason: ["Fake Account", "Impersonation"],
    status: "in_progress",
    date: "2025-04-07",
    totalReports: 2,
  },
  {
    id: "3",
    reportedItemId: "digital_product-789",
    reportedItemType: "digital_product",
    title: "Misleading Course Bundle",
    reportedBy: ["user444", "user555", "user666", "user777"],
    reason: ["Copyright", "Misleading", "Scam", "Duplicate"],
    status: "resolved",
    date: "2025-04-06",
    totalReports: 4,
  },
];

const getStatusColor = (status: Report["status"]) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "in_progress":
      return "bg-blue-100 text-blue-800";
    case "resolved":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getTypeIcon = (type: Report["reportedItemType"]) => {
  switch (type) {
    case "profile":
      return <User className="h-4 w-4 mr-1" />;
    case "post":
    case "digital_product":
      return <Flag className="h-4 w-4 mr-1" />;
    default:
      return <Flag className="h-4 w-4 mr-1" />;
  }
};

const getTypeLabel = (type: Report["reportedItemType"]) => {
  switch (type) {
    case "profile":
      return "Profile";
    case "post":
      return "Post";
    case "digital_product":
      return "Digital Product";
    default:
      return type;
  }
};

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [activeTab, setActiveTab] = useState<string>("pending");

  const PAGE_SIZE = 10;

  useEffect(() => {
    fetchReports(selectedStatus);
  }, [page, selectedStatus]);

  const fetchReports = async (status: any) => {
    setLoading(true);
    try {
      const response = await request.get(`/reports/posts?page=${page}&limit=${PAGE_SIZE}&status=${status}`);
      setReports(response.data.reports);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (postId: string, status: string) => {
    try {
      await request.put(`/reports/posts/${postId}`, { status });
      fetchReports(selectedStatus);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handlePageChange = (_: any, value: any) => {
    setPage(value);
  };

  const handleTabChange = (_: any, newValue: any) => {
    setPage(1);
    setSelectedStatus(newValue);
  };

  const statusChip = (status: any) => {
    const statusColors: any = {
      pending: "warning",
      "In progress": "info",
      resolved: "success",
    };
    return (
      <Chip
        label={status}
        color={statusColors[status]}
        icon={status === "pending" ? <HourglassEmpty /> : status === "In progress" ? <ErrorOutline /> : <CheckCircle />}
        size="small"
      />
    );
  };

  const filteredReports = useMemo(() => {
    return mockReports.filter((report) => {
      if (activeTab === "all") return true;
      return report.status === activeTab;
    });
  }, [activeTab]);

  const handleViewReportDetails = (reportId: string) => {
    window.location.href = `/reports/${reportId}`;
  };

  const handleViewUserProfile = (userId: string) => {
    window.location.href = `/users/${userId}`;
  };

  const handleDeletePost = (reportId: string) => {
    console.log("Deleting post for report:", reportId);
  };

  const handleRestrictUser = (reportId: string) => {
    console.log("Restricting user for report:", reportId);
  };

  const handleBlockUser = (reportId: string) => {
    console.log("Blocking user for report:", reportId);
  };

  const handleStopProduct = (reportId: string) => {
    console.log("Stopping product for report:", reportId);
  };

  return (
    <Box>
      <Box sx={{ px: "2rem", py: "1rem" }}>
        <MuiTabs value={selectedStatus} onChange={handleTabChange} aria-label="report status filter" centered>
          <Tab label="Pending" value="pending" />
          <Tab label="In Progress" value="In progress" />
          <Tab label="Resolved" value="resolved" />
        </MuiTabs>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer elevation={0} component={Card} sx={{ marginTop: "1rem", borderRadius: "8px", padding: 0 }}>
              <MuiTable>
                <MuiTableHead>
                  <MuiTableRow>
                    <MuiTableCell>
                      <b>Date</b>
                    </MuiTableCell>
                    <MuiTableCell>
                      <b>Post Title</b>
                    </MuiTableCell>
                    <MuiTableCell>
                      <b>Total Reports</b>
                    </MuiTableCell>
                    <MuiTableCell>
                      <b>Reported By (Names)</b>
                    </MuiTableCell>
                    <MuiTableCell>
                      <b>Current Status</b>
                    </MuiTableCell>
                    <MuiTableCell>
                      <b>Actions</b>
                    </MuiTableCell>
                  </MuiTableRow>
                </MuiTableHead>
                <MuiTableBody>
                  {reports.map((report: any) => (
                    <MuiTableRow key={report._id}>
                      <MuiTableCell>{formatDistanceToNow(new Date(report.latestReportDate), { addSuffix: true })}</MuiTableCell>
                      <MuiTableCell
                        sx={{
                          "&:hover": {
                            color: "blueviolet",
                          },
                        }}
                      >
                        <Link
                          href={`/posts/${report._id}`}
                          style={{
                            textDecoration: "none",
                            color: "inherit",
                          }}
                        >
                          {report.post?.title || "No Title"}
                        </Link>
                      </MuiTableCell>
                      <MuiTableCell>{report.totalReports}</MuiTableCell>
                      <MuiTableCell>
                        {report.users.slice(0, 2).map((user: any) => (
                          <Chip
                            key={user._id}
                            label={user.name || "Unknown"}
                            variant="outlined"
                            size="small"
                            sx={{ marginRight: "5px", marginBottom: "5px" }}
                          />
                        ))}
                        {report.users.length > 2 && (
                          <Typography variant="caption" sx={{ display: "inline", marginLeft: "5px" }}>
                            +{report.users.length - 2} more
                          </Typography>
                        )}
                      </MuiTableCell>

                      <MuiTableCell>{statusChip(report.reports[0]?.status)}</MuiTableCell>
                      <MuiTableCell>
                        <Tooltip title="Mark In Progress">
                          <IconButton
                            color="primary"
                            onClick={() => updateStatus(report._id, "In progress")}
                            disabled={report.reports[0]?.status === "In progress"}
                          >
                            <HourglassEmpty />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Mark Resolved">
                          <IconButton
                            color="success"
                            onClick={() => updateStatus(report._id, "resolved")}
                            disabled={report.reports[0]?.status === "resolved"}
                          >
                            <CheckCircle />
                          </IconButton>
                        </Tooltip>
                      </MuiTableCell>
                    </MuiTableRow>
                  ))}
                </MuiTableBody>
              </MuiTable>
            </TableContainer>

            <Box display="flex" justifyContent="center" marginTop="2rem">
              <Pagination count={totalPages} page={page} onChange={handlePageChange} color="primary" />
            </Box>
          </>
        )}
      </Box>

      {/* New Design Below */}
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Reports Management</h1>
          <div className="flex gap-2">
            <Badge variant="secondary">
              Pending: {mockReports.filter(item => item.status === "pending").length}
            </Badge>
            <Badge variant="secondary">
              In Progress: {mockReports.filter(item => item.status === "in_progress").length}
            </Badge>
            <Badge variant="secondary">
              Resolved: {mockReports.filter(item => item.status === "resolved").length}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Reports</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Title/Username</TableHead>
                    <TableHead>Total Reports</TableHead>
                    <TableHead>Reported By</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{report.date}</TableCell>
                      <TableCell>
                        <div 
                          className="flex items-center cursor-pointer hover:text-primary"
                          onClick={() => handleViewReportDetails(report.id)}
                        >
                          {getTypeIcon(report.reportedItemType)}
                          {getTypeLabel(report.reportedItemType)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span 
                          className="cursor-pointer hover:text-primary hover:underline"
                          onClick={() => handleViewReportDetails(report.id)}
                        >
                          {report.title}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge>{report.totalReports}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {report.reportedBy.slice(0, 2).map((user, index) => (
                            <span 
                              key={index}
                              className="cursor-pointer hover:text-primary hover:underline"
                              onClick={() => handleViewUserProfile(user)}
                            >
                              {user}
                            </span>
                          ))}
                          {report.reportedBy.length > 2 && (
                            <span className="text-muted-foreground">
                              +{report.reportedBy.length - 2} more
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            report.status
                          )}`}
                        >
                          {report.status.replace("_", " ")}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white">
                            {report.reportedItemType === "post" && (
                              <DropdownMenuItem 
                                className="cursor-pointer hover:bg-gray-100"
                                onClick={() => handleDeletePost(report.id)}
                              >
                                Delete
                              </DropdownMenuItem>
                            )}
                            {report.reportedItemType === "profile" && (
                              <>
                                <DropdownMenuItem 
                                  className="cursor-pointer hover:bg-gray-100"
                                  onClick={() => handleRestrictUser(report.id)}
                                >
                                  Restrict
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="cursor-pointer hover:bg-gray-100"
                                  onClick={() => handleBlockUser(report.id)}
                                >
                                  Block
                                </DropdownMenuItem>
                              </>
                            )}
                            {report.reportedItemType === "digital_product" && (
                              <DropdownMenuItem 
                                className="cursor-pointer hover:bg-gray-100"
                                onClick={() => handleStopProduct(report.id)}
                              >
                                Stop
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Box>
  );
}
