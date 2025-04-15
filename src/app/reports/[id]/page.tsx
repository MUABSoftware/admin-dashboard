"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  CircularProgress,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import request from "@src/config/axios";
import { formatDistanceToNow } from "date-fns";

interface CommentReport {
  _id: string;
  comment: {
    content: string;
    author: {
      _id: string;
      name: string;
      profilePic?: string;
    };
  };
  reports: Array<{
    _id: string;
    userId: {
      _id: string;
      name: string;
      profilePic?: string;
    };
    reason: string;
    status: string;
    createdAt: string;
  }>;
  totalReports: number;
}

export default function ReportDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportType = searchParams.get("type");
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const reportId = window.location.pathname.split("/").pop();
        const response = await request.get(`/reports/${reportId}?type=${reportType}`);
        setReport(response.data);
      } catch (err) {
        setError("Failed to fetch report details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportType]);

  const handleDeleteComment = async () => {
    try {
      await request.delete(`/comments/${report?.comment._id}`);
      router.push("/reports");
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !report) {
    return (
      <Box p={3}>
        <Typography color="error">{error || "Report not found"}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        {reportType === "comment" ? "Comment" : "Report"} Details
      </Typography>

      {reportType === "comment" && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Comment Content
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {report.comment.content}
            </Typography>

            <Typography variant="h6" gutterBottom>
              Comment Author
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body1">
                {report.comment.author.name}
              </Typography>
              <Chip
                label={`ID: ${report.comment.author._id}`}
                size="small"
                variant="outlined"
              />
            </Box>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Reports ({report.totalReports})
            </Typography>
            {reportType === "comment" && (
              <Button
                variant="contained"
                color="error"
                onClick={handleDeleteComment}
              >
                Delete Comment
              </Button>
            )}
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Reporter</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Reported At</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {report.reports.map((report: any) => (
                  <TableRow key={report._id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography>{report.userId.name}</Typography>
                        <Chip
                          label={`ID: ${report.userId._id}`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </TableCell>
                    <TableCell>{report.reason}</TableCell>
                    <TableCell>
                      <Chip
                        label={report.status}
                        color={
                          report.status === "pending"
                            ? "warning"
                            : report.status === "in_progress"
                            ? "info"
                            : "success"
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {formatDistanceToNow(new Date(report.createdAt), {
                        addSuffix: true,
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}