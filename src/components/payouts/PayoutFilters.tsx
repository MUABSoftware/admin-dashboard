import { Card } from "@src/components/ui/card";
import { Input } from "@src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@src/components/ui/select";
import { useState } from "react";

interface PayoutFiltersProps {
  onDateRangeChange: (startDate: string, endDate: string) => void;
}

export function PayoutFilters({ onDateRangeChange }: PayoutFiltersProps) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleDateChange = (type: "start" | "end", value: string) => {
    if (type === "start") {
      setStartDate(value);
    } else {
      setEndDate(value);
    }
    onDateRangeChange(type === "start" ? value : startDate, type === "end" ? value : endDate);
  };

  return (
    <Card className="p-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Search Business</label>
          <Input placeholder="Search by name or ID..." />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Status</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not-sent">Not Sent</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="sending">Sending</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="received">Received</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Location</label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="us">United States</SelectItem>
              <SelectItem value="eu">Europe</SelectItem>
              <SelectItem value="asia">Asia</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">Date Range</label>
          <div className="grid grid-cols-2 gap-2">
            <Input 
              type="date" 
              value={startDate}
              onChange={(e) => handleDateChange("start", e.target.value)}
              placeholder="Start Date"
            />
            <Input 
              type="date" 
              value={endDate}
              onChange={(e) => handleDateChange("end", e.target.value)}
              placeholder="End Date"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}