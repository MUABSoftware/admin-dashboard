'use client';

import React, { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  Pagination,
} from "@mui/material";
import request from "@src/config/axios";
import { format } from "date-fns";
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
import { Flag, User, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@src/components/ui/dropdown-menu"
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ReportEntry {
  reportedById: string;
  reporterName: string;
  status: "pending" | "in_progress" | "resolved";
  createdAt: string;
}

interface Resource {
  _id: string;
  title: string;
}

interface Report {
  totalReports: number;
  latestReportDate: string;
  reports: ReportEntry[];
  resource: Resource;
  type: "profile" | "post" | "digital_product" | "comment" | "user" | "||";
  resourceId: string;
  status?: "active" | "blocked";
}

const getStatusColor = (status: Report["reports"][0]["status"]) => {
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

const getTypeIcon = (type: Report["type"]) => {
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

const getTypeLabel = (type: Report["type"]) => {
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
  const [reports, setReports] = useState<Report[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);
  // const PAGE_SIZE = 10;

  const router = useRouter();

  useEffect(() => {
    fetchReports();
  }, [page, selectedStatus]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await request.get(`/reports/?page=${page}&status=${selectedStatus}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (response.data) {
        const reportsData = response.data.reports || [];
        setReports(reportsData);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (error: any) {
      setReports([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (postId: string, status: string) => {
    try {
      await request.put(`/reports/posts/${postId}`, { status });
      fetchReports();
    } catch (error) {
      // Error handling kept for functionality
    }
  };

  const handlePageChange = (_: any, value: any) => {
    setPage(value);
  };

  const handleViewReportDetails = (reportId: string) => {
    router.push(`/reports/${reportId}`);
  };

  const handleViewUserProfile = (userId: string) => {
    router.push(`/users/${userId}`);
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await request.delete(`/posts/${postId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      toast.success("Post deleted successfully", {
        duration: 3000,
        position: "top-right"
      });
      fetchReports();
    } catch (error: any) {
      console.error('Error deleting post:', error);
      toast.error("Failed to delete post: " + error.message, {
        duration: 3000,
        position: "top-right"
      });
    }
  };

  const handleRestrictUser = (reportId: string) => {
    // Implementation pending
  };

  const handleBlockUser = (reportId: string) => {
    // Implementation pending
  };

  const handleStopProduct = (reportId: string) => {
    // Implementation pending
  };

  
  const handleDeleteComment = async (commentId: string) => {
    try {
      await request.delete(`/comment/${commentId}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      toast.success("Comment deleted successfully", {
        duration: 3000,
        position: "top-right"
      });
      fetchReports();
    } catch (error: any) {
      console.error('Error deleting comment:', error);
      toast.error("Failed to delete comment: " + error.message, {
        duration: 3000,
        position: "top-right"
      });
    }
  };

  const handleTabChange = (value: string) => {
    // if (value === activeTab) return;
    console.log(value);
    setActiveTab(value);
    setPage(1);
    setSelectedStatus(value);
  };

  const handleStatusChange = async (userId: string, currentStatus: string) => {
    try {
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
      
      setReports(prevReports => prevReports.map(report => 
        report.resourceId === userId 
          ? { ...report, status: newStatus }
          : report
      ));
      setError(null);
    } catch (error: any) {
      console.error('Status change error:', error);
      setError("Failed to change user status: " + error.message);
    }
  };

  return (
    <Box>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Reports Management</h1>
          <div className="flex gap-2">
            <Badge variant="secondary">
              Total Reports: {reports.length}
            </Badge>
          </div>
        </div>

        <Tabs 
          defaultValue="pending" 
          value={activeTab} 
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="mb-4 w-full justify-start">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white"
            >
              All Reports
            </TabsTrigger>
            <TabsTrigger 
              value="pending"
              className="data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white"
            >
              Pending
            </TabsTrigger>
            <TabsTrigger 
              value="in_progress"
              className="data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white"
            >
              In Progress
            </TabsTrigger>
            <TabsTrigger 
              value="resolved"
              className="data-[state=active]:bg-[#3b82f6] data-[state=active]:text-white"
            >
              Resolved
            </TabsTrigger>
          </TabsList>

          <div className="relative">
            <TabsContent value={activeTab} className="mt-0">
              {loading ? (
                <div className="flex justify-center items-center p-8">
                  <CircularProgress />
                </div>
              ) : reports.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center border rounded-md bg-gray-50">
                  <div className="mb-3">
                    <Flag className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No Reports Found</h3>
                  <p className="text-sm text-gray-500">
                    {selectedStatus === "" 
                      ? "There are no reports available at this time."
                      : `There are no ${selectedStatus.replace("_", " ")} reports at this time.`
                    }
                  </p>
                </div>
              ) : (
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
                      {reports.map((report: Report) => (
                        <TableRow key={report.resourceId}>
                          <TableCell>
                            {report.latestReportDate ? 
                              format(new Date(report.latestReportDate), 'dd-MM-yyyy') :
                              'N/A'
                            }
                          </TableCell>
                          <TableCell>
                            <div 
                              className="flex items-center cursor-pointer hover:text-primary"
                              onClick={() => handleViewReportDetails(report.resourceId)}
                            >
                              {getTypeIcon(report.type)}
                              {getTypeLabel(report.type)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span 
                              className="cursor-pointer hover:text-primary hover:underline"
                              onClick={() => handleViewReportDetails(report.resourceId)}
                            >
                              {report.resource?.title || report.resource?.name || 'N/A'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge>{report.totalReports || 0}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {(report.reports || []).slice(0, 2).map((entry: ReportEntry, index: number) => (
                                <span 
                                  key={index}
                                  className="cursor-pointer hover:text-primary hover:underline"
                                  onClick={() => handleViewUserProfile(entry.reportedById)}
                                >
                                  {entry.reporterName || 'Anonymous'}
                                </span>
                              ))}
                              {(report.reports || []).length > 2 && (
                                <span className="text-muted-foreground">
                                  +{report.reports.length - 2} more
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                report.reports?.[0]?.status || 'pending'
                              )}`}
                            >
                              {(report.reports?.[0]?.status || 'pending').replace("_", " ")}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu modal={false}>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent 
                                align="end" 
                                className="bg-white"
                                sideOffset={5}
                              >
                                {report.type === "post" && (
                                  <DropdownMenuItem 
                                    className="cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleDeletePost(report.resourceId)}
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                )}
                                {report.type === "profile" && (
                                  <>
                                    <DropdownMenuItem 
                                      className="cursor-pointer hover:bg-gray-100"
                                      onClick={() => handleRestrictUser(report.resourceId)}
                                    >
                                      Restrict
                                    </DropdownMenuItem>
                                    <DropdownMenuItem 
                                      className="cursor-pointer hover:bg-gray-100"
                                      onClick={() => handleBlockUser(report.resourceId)}
                                    >
                                      Block
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {report.type === "digital_product" && (
                                  <DropdownMenuItem 
                                    className="cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleStopProduct(report.resourceId)}
                                  >
                                    Stop
                                  </DropdownMenuItem>
                                )}
                                {report.type === "comment" && (
                                  <DropdownMenuItem 
                                    className="cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleDeleteComment(report.resourceId)}
                                  >
                                    Delete Comment
                                  </DropdownMenuItem>
                                )}
                                {report.type === "user" && (
                                  <DropdownMenuItem 
                                    className="cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleStatusChange(report.resourceId, report.status || "active")}
                                  >
                                    {report.status === "blocked" ? "Unblock User" : "Block User"}
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
              )}
            </TabsContent>
          </div>
        </Tabs>

        {!loading && reports.length > 0 && (
          <div className="flex justify-center mt-4">
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={(_, value) => setPage(value)} 
              color="primary" 
            />
          </div>
        )}
      </div>
    </Box>
  );
}