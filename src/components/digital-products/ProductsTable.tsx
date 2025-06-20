"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@src/components/ui/table";
import { Button } from "@src/components/ui/button";
import { ProductActions } from "./ProductActions";
import { toast } from "react-toastify";
import { useState, useMemo, useEffect } from "react";
import { MongoDBConnectionDialog } from "./MongoDBConnectionDialog";
import request from "@src/config/axios";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@src/components/ui/pagination";
import { Tabs } from "@src/components/ui/tabs"
import React from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { RootState, store } from "../store/store";
import { setDigitalProducts, updateProductStatus } from "../store/businessProductSlice";
import { ArrowUpDown, Ban, Check, List } from "lucide-react";

export default interface Product {
  _id: string; 
  creator: string; 
  title: string; 
  description: string; 
  likesCount: number; 
  commentsCount: number; 
  introMedia: IntroMedia; 
  tags: string[]; 
  benefits: string[]; 
  sections: Section[]; 
  price: number; 
  category: Category[]; 
  currency: string; 
  pricingModel: string; 
  refundPolicy: string; 
  platformFees: number; 
  status: "active" | "rejected" | "stopped" | "in_review"; 
  rating: number; 
  totalReviews: number; 
  totalSales: number; 
  mediaInfo: MediaInfo; 
  analytics: Analytics; 
  isLiked: boolean; 
  createdAt: string; 
  updatedAt: string; 
  __v: number; 
}

interface IntroMedia {
  coverImage: Media; 
  video: Media; 
}

interface Media {
  name: string; 
  url: string; 
  duration?: number; 
}

interface Section {
  sectionTitle: string; 
  items: SectionItem[]; 
  _id: string; 
}

interface Category {
  name: string; 
  _id: string; 
}

interface SectionItem {
  type: string; 
  title: string; 
  description: string; 
  mediaUrl: string[]; 
  downloadable: boolean; 
  thumbnailUrl: string; 
  duration: number; 
  size: number; 
  ext: string; 
  _id: string; 
}

interface MediaInfo {
  audios: MediaCount; 
  documentsCount: number; 
  imagesCount: number; 
  videos: MediaCount; 
}

interface MediaCount {
  count: number; 
  duration: number; 
}

interface Analytics {
  views: number; 
  purchases: number; 
  conversionRate: number; 
}

const ITEMS_PER_PAGE = 30;

export function ProductsTable(){
  return <Provider store={store}>
    <ProductsTables />
  </Provider>
}

function ProductsTables() {
  const [currentTab, setCurrentTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isConnectionDialogOpen, setIsConnectionDialogOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(ITEMS_PER_PAGE);
  const [totalPages, setTotalPages] = useState(1);
  const [nextPage, setNextPage] = useState<number|null>(null);
  const [previousPage, setPreviousPage] = useState<number|null>(null);
  const dispatch = useDispatch();
  const [sortOrder, setSortOrder] = useState("desc");
  const digitalProducts = useSelector((state: RootState) => state.businessProduct.products);
  
  useEffect(() => {
    if(digitalProducts.length > 0){
      setProducts(digitalProducts);
    }
  }, [digitalProducts]);

  const fetchData = async (page = 1, tab = currentTab, order = sortOrder) => {
    try {
      let statusParam = '';
      if (tab === "approved") statusParam = "&status=active";
      else if (tab === "rejected") statusParam = "&status=rejected";
      else if (tab === "stopped") statusParam = "&status=stopped";
      else if (tab === "in_review") statusParam = "&status=in_review";
      const response = await request.get(`/product?page=${page}&limit=${ITEMS_PER_PAGE}&sortOrder=${order}${statusParam}`);
      setProducts(response.data.data);
      setTotalCount(response.data.totalCount);
      setLimit(response.data.limit);
      setTotalPages(response.data.totalPages);
      setNextPage(response.data.nextPage);
      setPreviousPage(response.data.previousPage);
      dispatch(setDigitalProducts(response.data.data));
    } catch (error) {
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchData(currentPage, currentTab, sortOrder);
    // eslint-disable-next-line
  }, [currentPage, currentTab, sortOrder]);

  const handlePreviousPage = () => {
    if (previousPage) {
      setCurrentPage(previousPage);
    }
  };

  const handleNextPage = () => {
    if (nextPage) {
      setCurrentPage(nextPage);
    }
  };

  const generateColumnsFromMongoDB = async (connectionString: string) => {
    console.log("connectionString", connectionString);
    try {
      toast.info("Analyzing MongoDB schema...");
      await new Promise(resolve => setTimeout(resolve, 1500));
      const sampleDocument =  [0];
      const columns = Object.keys(sampleDocument);
      console.log("Generated columns from MongoDB schema:", columns);
      toast.success(`Generated ${columns.length} columns from MongoDB schema`);
    } catch (error) {
      console.error("Error generating columns:", error);
      toast.error("Failed to generate columns from MongoDB schema");
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedProducts(products.map(product => product._id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectOne = (productId: string) => {
    setSelectedProducts(current => {
      if (current.includes(productId)) {
        return current.filter(id => id !== productId);
      } else {
        return [...current, productId];
      }
    });
  };

  const handleBulkApprove = async () => {
    const productsToApprove = selectedProducts.map(id => products.find(product => product._id === id));
    const productIds = productsToApprove.map(product => product?._id).filter(id => id !== undefined);
    
    console.log("productsToApprove", productsToApprove);
    console.log("ProductIds", productIds);

    try {
      const response = await request.patch("/product/approve/multiple",
         { productIds: productIds }, {
        headers: {
          "version": "3"
        }
      });
      
      console.log("API Response", response);
      
      
      if (response.status === 200) {
        toast.success(`Approved ${selectedProducts.length} products`);
        for(let i = 0; i < productIds.length; i++){
          dispatch(updateProductStatus({ productId: productIds[i], status: 'active' }));
        }
      } else {
        toast.error("Failed to approve products");
      }
    } catch (error) {
      console.error("Error approving products:", error);
      toast.error("Failed to approve products");
    }
   
    setSelectedProducts([]);
  };

  const handleBulkReject = async () => {
    const productsToReject = selectedProducts.map(id => products.find(product => product._id === id));
    const productIds = productsToReject.map(product => product?._id).filter(id => id !== undefined);
    
    console.log("productsToReject", productsToReject);
    console.log("ProductIds", productIds);

    try {
      const response = await request.patch("/product/rejected/multiple",
         { productIds: productIds }, {
        headers: {
          "version": "3"
        }
      });
      
      console.log("API Response", response);
      
      if (response.status === 200) {
        toast.success("Products rejected successfully");
      } else {
        toast.error("Failed to reject products");
      }
    } catch (error) {
      console.error("Error rejecting products:", error);
      toast.error("Failed to reject products");
    }
  };

  const handleBulkStop = async () => {
    const productsToStop = selectedProducts.map(id => products.find(product => product._id === id));
    const productIds = productsToStop.map(product => product?._id).filter(id => id !== undefined);
    
    console.log("productsToStop", productsToStop);
    console.log("ProductIds", productIds);

    try {
      const response = await request.patch("/product/stoped/multiple",
         { productIds: productIds }, {
        headers: {
          "version": "3"
        } 
      });
      
      console.log("API Response", response);
      
      if (response.status === 200) {
        toast.success("Products stopped successfully");
      } else {
        toast.error("Failed to stop products");
      }
    } catch (error) {
      console.error("Error stopping products:", error);
      toast.error("Failed to stop products");
    }
  };

  const handleSortedProductsByDate = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc"; // Toggle sort order
    setSortOrder(newSortOrder); // Update sort order state

    const sortedProducts = [...products].sort((a, b) => {
      return newSortOrder === "asc"
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setProducts(sortedProducts); // Update products state with sorted products
  };

  const formatProductId = (productId: string) => {
    const firstThree = productId.slice(0, 3);
    const lastThree = productId.slice(-3);
    return `${firstThree}...${lastThree}`;
  };

  const filteredProducts = useMemo(() => {
    if (currentTab === "approved") {
      return products.filter(product => product.status === "active");
    }
    if (currentTab === "rejected") {
      return products.filter(product => product.status === "rejected");
    }
    if (currentTab === "stopped") {
      return products.filter(product => product.status === "stopped");
    }
    if (currentTab === "in_review") {
      return products.filter(product => product.status === "in_review");
    }
    return products;
  }, [currentTab, products]);

  return (
    <div className="space-y-4">
      <Tabs defaultValue="sortedByDate" value={currentTab} onValueChange={tab => { setCurrentTab(tab); setCurrentPage(1); }}>
        <div className="flex justify-between gap-2 mb-4">
          <div>
          {/* <Button
            className={`bg-Table-Header-Color text-white me-2 rounded-md ${currentTab === 'sortedByDate' ? 'bg-Table-Header-Color' : 'bg-blue-200'}`}
            onClick={() => {
              setCurrentTab('sortedByDate');
              handleSortedProductsByDate();
            }}
            variant={currentTab === 'sortedByDate' ? 'default' : 'outline'}
          >
            <ArrowUpDown className=" h-4 w-4" />
            Sorted By Date
          </Button> */}
            
          <Button
            className={`bg-Table-Header-Color text-white me-2 rounded-md ${currentTab === 'all' ? 'bg-Table-Header-Color' : 'bg-blue-200'}`}
            onClick={() => {
              setCurrentTab('all');
              setSelectedProducts([]);
            }}
            variant={currentTab === 'all' ? 'default' : 'outline'}
          >
            <List className=" h-4 w-4" />
            All Products {totalCount}
          </Button>
          <Button
            className={`bg-Table-Header-Color text-white me-2 rounded-md ${currentTab === 'approved' ? 'bg-Table-Header-Color' : 'bg-blue-200'}`}
            onClick={() => {
              setCurrentTab('approved');
              setSelectedProducts([]);
            }}
            variant={currentTab === 'approved' ? 'default' : 'outline'}
          >
            <Check className=" h-4 w-4" />
            Approved Products {digitalProducts.filter(product => product.status === "active").length}
          </Button>
          <Button
            className={`bg-Table-Header-Color text-white me-2 rounded-md ${currentTab === 'in_review' ? 'bg-Table-Header-Color' : 'bg-blue-200'}`}
            onClick={() => {
              setCurrentTab('in_review');
              setSelectedProducts([]);
            }}
            variant={currentTab === 'in_review' ? 'default' : 'outline'}
          >
            <Ban className=" h-4 w-4" />
            In Review Products {digitalProducts.filter(product => product.status === "in_review").length}
          </Button>
          <Button
            className={`bg-Table-Header-Color text-white me-2 rounded-md ${currentTab === 'rejected' ? 'bg-Table-Header-Color' : 'bg-blue-200'}`}
            onClick={() => {
              setCurrentTab('rejected');
              setSelectedProducts([]);
            }}
            variant={currentTab === 'rejected' ? 'default' : 'outline'}
          >
            <Ban className=" h-4 w-4" />
            Rejected Products {digitalProducts.filter(product => product.status === "rejected").length}
          </Button>
          <Button
            className={`bg-Table-Header-Color text-white me-2 rounded-md ${currentTab === 'stopped' ? 'bg-Table-Header-Color' : 'bg-blue-200'}`}
            onClick={() => {
              setCurrentTab('stopped');
              setSelectedProducts([]);
            }}
            variant={currentTab === 'stopped' ? 'default' : 'outline'}
          >
            <Ban className=" h-4 w-4" />
            Stopped Products {digitalProducts.filter(product => product.status === "stopped").length}
          </Button>
          </div>
          {selectedProducts.length > 0 && (
            <div className="flex gap-2">
              {(currentTab != 'approved') && (
                <Button
                  onClick={handleBulkApprove}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Approve
                </Button>
              )}
              {(currentTab != 'rejected') && (
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={handleBulkReject}
                  variant="destructive"
                >
                  Reject
                </Button>
              )}
              {(currentTab != 'stopped') && (
                <Button
                  className="bg-red-500 hover:bg-red-600 text-white"
                  onClick={handleBulkStop}
                  variant="destructive"
                >
                  Stop
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Showing X–Y of Z results */}
        <div className="mb-2 text-sm text-gray-600">
          {totalCount > 0 && (
            <>Showing {(totalCount === 0 ? 0 : ((currentPage - 1) * limit + 1))}–{Math.min(currentPage * limit, totalCount)} of {totalCount} results</>
          )}
        </div>

        <div className="rounded-md border mt-4">
          <Table style={{ backgroundColor: '#fff' }}>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={
                        products.length > 0 &&
                        products.every(product =>
                          selectedProducts.includes(product._id)
                        )
                      }
                      onChange={handleSelectAll}
                      indeterminate={
                        selectedProducts.length > 0 &&
                        selectedProducts.length < products.length
                      }
                    />
                    ID
                  </div>
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Elements</TableHead>
                <TableHead>Customers</TableHead>
                <TableHead>Business Account</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Approved</TableHead>
                <TableHead>Sales</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => handleSelectOne(product._id)}
                      />
                      <a href={`/digitalProducts/${product._id}`} className="text-blue-500 hover:underline">{formatProductId(product._id)}</a>
                    </div>
                  </TableCell>
                  <TableCell><a href={`/digitalProducts/${product._id}`} className="text-blue-500 hover:underline">{product.title}</a></TableCell>
                  <TableCell >
                    <div>
                      <b className="me-2">Images:</b>{product.mediaInfo.imagesCount}
                    </div>
                    <div>
                       <b className="me-2">Videos:</b>{product.mediaInfo.videos.count}
                    </div>
                    <div>
                      <b className="me-2">PDFs:</b>{product.mediaInfo.documentsCount}
                    </div>
                    <div>
                      <b className="me-2">Audios:</b>{product.mediaInfo.audios.count}
                    </div> 
                  </TableCell>
                  <TableCell>{product.analytics.purchases}</TableCell>
                  <TableCell>
                    {typeof product.creator === 'object' && product.creator !== null
                      ? ((product.creator as any).email || (product.creator as any)._id || JSON.stringify(product.creator))
                      : product.creator}
                  </TableCell>
                  <TableCell> --- </TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>{product.status === "active" ? "Approved" : product.status === "rejected" ? "Rejected" : product.status === "in_review" ? "In Review" : "Stopped"}</TableCell>
                  <TableCell>{product.totalSales}</TableCell>
                  <TableCell>{product.status}</TableCell>
                  <TableCell>{new Date(product.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <ProductActions product={product} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Pagination className="mt-4">
          <PaginationContent>
            {previousPage && (
              <PaginationItem>
                <Button
                  variant="ghost"
                  className="gap-1 pl-2.5"
                  onClick={handlePreviousPage}
                >
                  <PaginationPrevious className="h-4 me-2 w-4" />
                </Button>
              </PaginationItem>
            )}
            <PaginationItem>
              <span className="px-2 py-1 text-gray-700">Page {currentPage} of {totalPages}</span>
            </PaginationItem>
            {nextPage && (
              <PaginationItem>
                <Button
                  variant="ghost"
                  className="gap-1 pr-2.5"
                  onClick={handleNextPage}
                >
                  <PaginationNext className="h-4 w-4" />
                </Button>
              </PaginationItem>
            )}
          </PaginationContent>
        </Pagination>
      </Tabs>

      <MongoDBConnectionDialog
        open={isConnectionDialogOpen}
        onOpenChange={setIsConnectionDialogOpen}
        onConnect={generateColumnsFromMongoDB}
      />
    </div>
  );
}

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  indeterminate?: boolean;
}

const Checkbox = ({ indeterminate, ...props }: CheckboxProps) => {
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate ?? false;
    }
  }, [indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className="rounded border-gray-300 text-primary focus:ring-primary"
      {...props}
    />
  );
};