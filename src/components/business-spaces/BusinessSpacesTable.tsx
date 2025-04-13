"use client";
import { useEffect, useState } from "react";
import {
  Ban, Check, List,
  // X 
} from "lucide-react";
import { Button } from "@src/components/ui/button";
import request from "@src/config/axios";
import { Provider, useDispatch, useSelector } from "react-redux";
import { setBusinessSpaces } from "@src/components/store/Businessspaceslice";
import { AppDispatch, RootState, store } from "@src/components/store/store";
// import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@src/components/ui/pagination";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@src/components/ui/table";
import { Badge } from "@src/components/ui/badge";
import { BusinessSpaceActions } from "./BusinessSpaceActions";
import { statusColor } from "@src/utils";

export function BusinessSpacesTable() {
  return <Provider store={store}>
    <BusinessSpacesTables />
  </Provider>
}
export function BusinessSpacesTables() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState<'approved' | 'all' | 'stop' | 'reject'>('all');
  const itemsPerPage = 10;
  const [selectedBusinesses, setSelectedBusinesses] = useState<string[]>([]);


  const dispatch = useDispatch<AppDispatch>();
  const businessSpaces = useSelector((state: RootState) => state.businessSpace.businessSpaces);
  const [totalBusiness, setTotalBusiness] = useState(0);

  useEffect(() => {
    console.log(businessSpaces);
    if (businessSpaces.length > 0) {
      console.log(businessSpaces);
      setBusinessSpaces(businessSpaces);
    }

  }, []);

  useEffect(() => {
    console.log('Current statuses:', businessSpaces.map(b => b.status));
  }, [businessSpaces]);

  const displayedBusinesses = activeTab === 'approved'
    ? businessSpaces.filter(business => business.status === 'ACTIVE')
    : activeTab === 'stop'
      ? businessSpaces.filter(business => business.status === 'INACTIVE')
      : activeTab === 'reject'
        ? businessSpaces.filter(business => business.status === 'PENDING')
        : businessSpaces;
  const fetchBusinessSpaces = async () => {
    try {
      const response = await request.get(`/business?limit=${itemsPerPage}&page=${page}`);
      console.log(response.data);
      setTotalBusiness(response.data.totalCount);

      dispatch(setBusinessSpaces(response.data.data));

      setTotalPages(response.data.totalPages);
    }
    catch (error) {
      console.error("Error fetching business spaces:", error);
    }
  };

  useEffect(() => {
    fetchBusinessSpaces();
  }, [page]);

  // const router = useRouter();

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedBusinesses(displayedBusinesses.map(b => b.businessId || ''));
    } else {
      setSelectedBusinesses([]);
    }
  };

  const handleSelectBusiness = (businessId: string) => {
    setSelectedBusinesses(prev => {
      if (prev.includes(businessId)) {
        return prev.filter(id => id !== businessId);
      } else {
        return [...prev, businessId];
      }
    });
  };

  // Bulk approve function
  const handleBulkApprove = async () => {

    // try {
    //   for (const businessId of selectedBusinesses) {
    //     const business = businessSpaces.find(b => b.businessId === businessId);
    //     if (business && !business.verified) {
    //       await request.put(`/business/${business._id}/verify`);
    //     }
    //   }
    //   await fetchBusinessSpaces();
    //   setSelectedBusinesses([]);
    // } catch (error) {
    //   console.error("Error bulk approving businesses:", error);
    // }
  };

  const handleBulkReject = async () => {
    // try {
    //   for (const businessId of selectedBusinesses) {
    //     const business = businessSpaces.find(b => b.businessId === businessId);
    //     if (business && !business.verified) {
    //       await request.put(`/business/${business._id}/reject`);
    //     }
    //   }
    //   await fetchBusinessSpaces();
    //   setSelectedBusinesses([]);
    // } catch (error) {
    //   console.error("Error bulk rejecting businesses:", error);
    // }
  };
  const handleBulkStop = async () => {
    console.log(selectedBusinesses);
  }


  return (
    <div className="space-y-4">
      <div className="flex space-x-2 mb-4 justify-between">
        <div>

          <Button
            className={`bg-blue-500 text-white px-4 me-2 py-2 rounded-md ${activeTab === 'all' ? 'bg-blue-500' : 'bg-blue-200 text-black'}`}
            onClick={() => {
              setActiveTab('all');
              setSelectedBusinesses([]);
            }}
            variant={activeTab === 'all' ? 'default' : 'outline'}
          >
            <List className=" h-4 w-4" />
            All Business {totalBusiness}

          </Button>
          <Button
            className={`bg-blue-500  px-4 py-2 me-2 rounded-md ${activeTab === 'stop' ? 'bg-red-500 text-white' : 'bg-blue-200 text-black'}`}
            onClick={() => {
              setActiveTab('stop');
              setSelectedBusinesses([]);
            }}

            variant={activeTab === 'stop' ? 'default' : 'outline'}
          >
            <Ban className=" h-4 w-4" />
            Stoped Business {
              <span className="">
                {
                  businessSpaces.filter(business => business.status === 'INACTIVE').length
                }
              </span>
            }
          </Button>
          <Button
            className={`bg-blue-500 text-white px-4 py-2 me-2 rounded-md ${activeTab === 'approved' ? 'bg-green-500 text-white' : 'bg-blue-200 text-black'}`}
            onClick={() => {
              setActiveTab('approved');
              setSelectedBusinesses([]);
            }}
            variant={activeTab === 'approved' ? 'default' : 'outline'}
          >
            <Check className=" h-4 w-4" />
            Approved Business {
              <span className="">
                {
                  businessSpaces.filter(business => business.status === 'ACTIVE').length
                }
              </span>
            }
          </Button>

          <Button
            className={`bg-blue-500 text-white px-4 py-2   rounded-md ${activeTab === 'reject' ? 'bg-red-500 text-white' : 'bg-blue-200 text-black'}`}
            onClick={() => {
              setActiveTab('reject');
              setSelectedBusinesses([]);
            }}
            variant={activeTab === 'reject' ? 'default' : 'outline'}
          >
            <Ban className=" h-4 w-4" />

            Rejected Business
            {
              <span className="">
                {
                  businessSpaces.filter(business => 
                    business.status === 'PENDING' || business.status === 'REJECTED'
                  ).length
                }
              </span>
            }
          </Button>
        </div>
        {
          selectedBusinesses && selectedBusinesses.length > 0 && (

            <div className="flex space-x-2 ">

              {
                activeTab != 'approved' && (
                  <Button onClick={handleBulkApprove} variant="default" className="bg-blue-500 text-white">
                    Approved
                  </Button>
                )
              }
              {
                activeTab != 'reject' && (
                  <Button onClick={handleBulkReject} variant="destructive" className="bg-red-500 text-white">
                    Reject
                  </Button>
                )
              }
              {
                activeTab != 'stop' && (
                  <Button onClick={handleBulkStop} variant="destructive" className="bg-red-500 text-white">
                    Stop
                  </Button>
                )
              }
            </div>
          )
        }

      </div>

      <div className="rounded-md border">
        <Table style={{ backgroundColor: "#fff" }}>
          <TableHeader>
            <TableRow>
              <TableHead>
                <span className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 mr-2"
                    checked={selectedBusinesses.length === displayedBusinesses.length && displayedBusinesses.length > 0}
                    onChange={handleSelectAll}
                  />
                  Business ID
                </span>
              </TableHead>
              <TableHead>Legal Name</TableHead>
              <TableHead>Trade Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedBusinesses.map((business) => (
              console.log(business),
              <TableRow key={business.businessId}>
                <TableCell className="font-medium">
                  <span className="flex items-center">
                    <input
                      type="checkbox"
                      className="w-4 h-4 mr-2"
                      checked={selectedBusinesses.includes(business.businessId || '')}
                      onChange={() => handleSelectBusiness(business.businessId || '')}
                    />
                    <a href={`/business-spaces/${business._id}`} className="text-blue-500 hover:underline">
                      {business.businessId}
                    </a>
                  </span>
                </TableCell>
                <TableCell>
                  {business.legalName}
                </TableCell>
                <TableCell>{business.tradeName || '-'}</TableCell>
                <TableCell>{business.category}</TableCell>
                <TableCell>
                  <Badge className={statusColor(business.status)}>
                    {business.status === 'PENDING' ? 'REJECTED' : business.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>{`${business.address.city}, ${business.address.country}`}</TableCell>
                <TableCell>{business.createdAt}</TableCell>
                <TableCell className="text-right">
                  <BusinessSpaceActions business={business} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <Button
              variant="ghost"
              className="gap-1 pl-2.5"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <PaginationPrevious className="h-4 me-2 w-4" />
            </Button>
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => setPage(page)}
                isActive={page === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <Button
              variant="ghost"
              className="gap-1 pr-2.5"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              <PaginationNext className="h-4 w-4" />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>

    </div>
  );
}