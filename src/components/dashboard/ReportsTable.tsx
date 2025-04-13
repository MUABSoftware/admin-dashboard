import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@src/components/ui/table";
import { Badge } from "@src/components/ui/badge";
import { Button } from "@src/components/ui/button";
import { Eye } from "lucide-react";

interface Report {
  id: string;
  content: string;
  reporter: string;
  reason: string;
  status: "pending" | "reviewing" | "resolved";
  date: string;
}

const mockReports: Report[] = [
  {
    id: "1",
    content: "Inappropriate content in post",
    reporter: "user123",
    reason: "Harassment",
    status: "pending",
    date: "2024-02-20",
  },
  {
    id: "2",
    content: "Spam advertisement",
    reporter: "user456",
    reason: "Spam",
    status: "reviewing",
    date: "2024-02-19",
  },
  {
    id: "3",
    content: "Misleading information",
    reporter: "user789",
    reason: "Fake News",
    status: "resolved",
    date: "2024-02-18",
  },
];

const getStatusColor = (status: Report["status"]) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "reviewing":
      return "bg-blue-100 text-blue-800";
    case "resolved":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function ReportsTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Reporter</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockReports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-medium">{report.id}</TableCell>
              <TableCell>{report.content}</TableCell>
              <TableCell>{report.reporter}</TableCell>
              <TableCell>
                <Badge variant="secondary">{report.reason}</Badge>
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    report.status
                  )}`}
                >
                  {report.status}
                </span>
              </TableCell>
              <TableCell>{report.date}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}