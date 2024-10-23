import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine, ChevronDown, Pencil, Eye, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "react-hot-toast";
import FormAddDepot from "./FormAddDepot";
import AdminProductDetail from "./AdminProductDetail";
import FormAddProduct from "./FormAddProduct";
import AddStockProduct from "./AddStockProduct";
import readXlsxFile from "read-excel-file";
import axios from "axios";

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
};

const TableProduct = ({ productData, categories, tags, types, brands }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [productToDelete, setProductToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleTagSelect = (tagId) => {
    setSelectedTag(tagId);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        setSelectedFile(file);
        setErrorMessage("");
      } else {
        setSelectedFile(null);
        setErrorMessage("Only .xlsx files are allowed");
      }
    }
  };

  // const handleImportClick = () => {
  //   if (selectedFile) {
  //     readXlsxFile(selectedFile).then((rows) => {
  //       const headers = rows[0];
  //       const data = rows.slice(1).map((row) => {
  //         let product = {};
  //         headers.forEach((header, index) => {
  //           let value = row[index];
  //           if (header === "images" && typeof value === "string") {
  //             value = value.includes("--") ? value.split("--").map((url) => url.trim()) : [value.trim()];
  //           }
  //           product[header] = value;
  //         });
  //         return product;
  //       });
  //       fetch("http://localhost:9999/api/product/import", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ products: data }),
  //       })
  //         .then((response) => response.json())
  //         .then(() => {
  //           toast.success("Products imported successfully");
  //           setTimeout(() => {
  //             window.location.reload();
  //           }, 2000);
  //         })
  //         .catch((error) => {
  //           console.error("Error importing products:", error);
  //           toast.error("Failed to import products");
  //         });
  //     });
  //   } else {
  //     toast.error("No file selected");
  //   }
  // };

  // const handleImportClick = () => {
  //   if (selectedFile) {
  //     readXlsxFile(selectedFile).then((rows) => {
  //       const headers = rows[0];
  //       const data = rows.slice(1).map((row) => {
  //         let product = {};
  //         let imagesArray = [];
  //         headers.forEach((header, index) => {
  //           let value = row[index];
  //           if (header.startsWith("image") && typeof value === "string") {
  //             imagesArray.push(value.trim());
  //           } else {
  //             product[header] = value;
  //           }
  //         });
  //         if (imagesArray.length > 0) {
  //           product["images"] = imagesArray.join("--");
  //         }
  //         return product;
  //       });
  //       fetch("http://localhost:9999/api/product/import", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ products: data }),
  //       })
  //         .then((response) => response.json())
  //         .then(() => {
  //           toast.success("Products imported successfully");
  //           setTimeout(() => {
  //             window.location.reload();
  //           }, 2000);
  //         })
  //         .catch((error) => {
  //           console.error("Error importing products:", error);
  //           toast.error("Failed to import products");
  //         });
  //     });
  //   } else {
  //     toast.error("No file selected");
  //   }
  // };

  const handleImportClick = () => {
    if (selectedFile) {
      readXlsxFile(selectedFile).then((rows) => {
        const headers = rows[0];
        const data = rows.slice(1).map((row) => {
          let product = {};
          let imagesArray = [];

          headers.forEach((header, index) => {
            let value = row[index];
            if (header.startsWith("image") && typeof value === "string") {
              imagesArray.push(value.trim());
            } else {
              product[header] = value;
            }
          });

          if (imagesArray.length > 0) {
            product["images"] = imagesArray;
          }

          return product;
        });
        // log data
        console.log(data);

        fetch("http://localhost:9999/api/product/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ products: data }),
        })
          .then((response) => response.json())
          .then(() => {
            toast.success("Products imported successfully");
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          })
          .catch((error) => {
            console.error("Error importing products:", error);
            toast.error("Failed to import products");
          });
      });
    } else {
      toast.error("No file selected");
    }
  };

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      fetch(`http://localhost:9999/api/product/${productToDelete}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then(() => {
          toast.success("Product deleted successfully");
          setProductToDelete(null);
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        })
        .catch((error) => {
          console.error("Error deleting product:", error);
          toast.error("Failed to delete product");
        });
    }
  };

  const handleStatusUpdate = (productId, newStatus) => {
    axios
      .put(`http://localhost:9999/api/product/status/${productId}`, { status: newStatus })
      .then(() => {
        toast.success("Product status updated successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      })
      .catch((error) => {
        console.error("Error updating product status:", error);
        toast.error("Failed to update product status");
      });
  };

  const fetchProductDetails = (productId) => {
    axios
      .get(`http://localhost:9999/api/product/get-detail-product/${productId}`)
      .then((response) => {
        setSelectedProduct(response.data);
        setDialogOpen(true);
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
        toast.error("Failed to fetch product details");
      });
  };

  const filteredProducts = productData.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) && (selectedCategory ? product.category === selectedCategory : true) && (selectedTag ? product.tag === selectedTag : true),
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleChangePage = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

  const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-4">
      <div className="flex items-center justify-start space-x-4 mb-4">
        <input type="text" placeholder="Search by product name" value={searchTerm} onChange={handleSearchChange} className="px-4 py-2 border rounded-lg w-full sm:w-1/2 lg:w-1/3" />
        {/* import file */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <p>Import</p>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Import Product</DialogTitle>
              <DialogDescription>Import product from excel file</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col justify-center items-center">
              <input type="file" className="border border-gray-300 rounded-md p-2" onChange={handleFileChange} accept=".xlsx" />
              {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
              <Button variant="outline" className="ml-4 mt-2" onClick={handleImportClick} disabled={!selectedFile}>
                Import
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        {/* ========================= ADD PRODUCT ========================= */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <p>Add Product</p>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Product</DialogTitle>
              <DialogDescription>Add new product</DialogDescription>
            </DialogHeader>
            <FormAddProduct />
          </DialogContent>
        </Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none bg-white hover:bg-gray-50 text-gray-800 py-1 px-2 border border-gray-200 rounded shadow">
            {categories.find((category) => category._id === selectedCategory)?.name || "Category"}
            <ChevronDown size={18} color="#c8c8cf" className="inline-block ml-2" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="flex items-center">Category</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem key="all" onClick={() => handleCategorySelect("")}>
              All
            </DropdownMenuItem>
            {categories.map((category) => (
              <DropdownMenuItem key={category._id} onClick={() => handleCategorySelect(category._id)}>
                {category.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none bg-white hover:bg-gray-50 text-gray-800 py-1 px-2 border border-gray-200 rounded shadow">
            {tags.find((tag) => tag._id === selectedTag)?.name || "Tag"}
            <ChevronDown size={18} color="#c8c8cf" className="inline-block ml-2" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="flex items-center">Tag</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem key="all" onClick={() => handleTagSelect("")}>
              All
            </DropdownMenuItem>
            {tags.map((tag) => (
              <DropdownMenuItem key={tag._id} onClick={() => handleTagSelect(tag._id)}>
                {tag.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tag</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentProducts.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{truncateText(product.title, 20)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{categories.find((category) => category._id === product.category)?.name || "N/A"}</td>
                <td className="px-6 py-4 whitespace-nowrap">{tags.find((tag) => tag._id === product.tag)?.name || "N/A"}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{product.stock}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{product.price} vnd</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.availabilityStatus === "In Stock" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {product.availabilityStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{product.createdAt ? format(parseISO(product.createdAt), "HH:mm:ss dd-MM-yyyy") : "N/A"}</div>
                </td>
                <td className="px-6 py-4 text-sm font-medium flex items-center">
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <button
                        className="bg-white hover:bg-gray-50 text-[#7D4600] hover:text-indigo-900 py-1 px-2 border border-gray-200 rounded shadow"
                        onClick={() => fetchProductDetails(product._id)}
                      >
                        <Eye className="h-5 w-5 hover:opacity-85" />
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Product Details</DialogTitle>
                        <DialogDescription>View details of: {selectedProduct && selectedProduct.title}</DialogDescription>
                      </DialogHeader>
                      <hr />
                      {selectedProduct && (
                        <div className="grid grid-cols-2 gap-4">
                          {/* Information */}
                          <div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="font-bold">
                                <p>Title:</p>
                                <p>Description:</p>
                                <p>Category:</p>
                                <p>Tag:</p>
                                <p>Stock:</p>
                                <p>Price:</p>
                                <p>Availability Status:</p>
                                <p>Created At:</p>
                              </div>
                              <div>
                                <p className="truncate">{selectedProduct.title}</p>
                                <p className="truncate">{selectedProduct.description}</p>
                                <p className="truncate">{selectedProduct.category.name}</p>
                                <p className="truncate">{selectedProduct.tag.name}</p>
                                <p>{selectedProduct.stock}</p>
                                <p>{selectedProduct.price} vnd</p>
                                {selectedProduct.availabilityStatus === "InActive" ? (
                                  <p className="text-red-500 italic font-semibold">InActive</p>
                                ) : (
                                  <p className="text-green-500 italic font-semibold">{selectedProduct.availabilityStatus}</p>
                                )}
                                <p>{selectedProduct.createdAt ? format(parseISO(selectedProduct.createdAt), "HH:mm:ss dd-MM-yyyy") : "N/A"}</p>
                              </div>
                            </div>
                            {/* Stock Details */}
                            <div>
                              <strong>Stock Details:</strong>
                              {selectedProduct.stockDetails.length > 0 ? (
                                <table className="table-auto border-collapse border border-gray-300 mt-2">
                                  <thead>
                                    <tr>
                                      <th className="border border-gray-300 p-2">Color</th>
                                      {selectedProduct.stockDetails[0].details.map((detail) => (
                                        <th key={detail.size} className="border border-gray-300 p-2">
                                          Size {detail.size}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {selectedProduct.stockDetails.map((stockDetail) => (
                                      <tr key={stockDetail._id}>
                                        <td
                                          className="border border-gray-300 p-2"
                                          style={{
                                            backgroundColor: stockDetail.colorCode,
                                            color: "#fff",
                                            textAlign: "center",
                                          }}
                                        ></td>
                                        {stockDetail.details.map((detail) => (
                                          <td key={detail._id} className="border border-gray-300 p-2 text-center">
                                            {detail.quantity}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              ) : (
                                <p className="text-sm text-red-500 italic mt-2">The product is not currently in stock!</p>
                              )}
                            </div>
                          </div>
                          {/* Thumbnail */}
                          <div className="flex items-center justify-center">
                            <div>
                              <img src={selectedProduct.thumbnail} alt={selectedProduct.title} className="w-44 h-44 object-cover rounded-lg" />
                              <p className="text-xs flex justify-center">
                                <i>-- Thumbnail --</i>
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger className="ml-4 bg-white hover:bg-gray-50 text-[#6E44FF] hover:text-indigo-900 py-1 px-2 border border-gray-200 rounded shadow">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Pencil className="h-5 w-5 opacity-55 hover:opacity-85" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit Price</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Product Price</DialogTitle>
                        <DialogDescription>Add new price for: {product.title}</DialogDescription>
                      </DialogHeader>
                      <AddStockProduct productDataById={product} />
                    </DialogContent>
                  </Dialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        className="ml-4 bg-white hover:bg-gray-50 text-[#bd4131] hover:text-indigo-900 py-1 px-2 border border-gray-200 rounded shadow"
                        onClick={() => handleDeleteClick(product._id)}
                      >
                        <Trash2 className="h-5 w-5 hover:opacity-85" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone. This will permanently delete the product.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  {/* import depot */}
                  <Dialog>
                    <DialogTrigger className="ml-4 bg-white hover:bg-gray-50 text-[#FB5012] hover:text-indigo-900 py-1 px-2 border border-gray-200 rounded shadow">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <ArrowDownToLine className="h-5 w-5 opacity-55 hover:opacity-85" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Import Depot</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </DialogTrigger>
                    <DialogContent className="w-auto h-auto">
                      <DialogHeader>
                        <DialogTitle>Add Depot</DialogTitle>
                        <DialogDescription>Add new depot for this product</DialogDescription>
                      </DialogHeader>
                      <FormAddDepot productDataById={product} />
                    </DialogContent>
                  </Dialog>
                  {product.availabilityStatus === "In Stock" && (
                    <button
                      className="ml-4 bg-white hover:bg-gray-50 text-red-600 hover:text-red-900 py-1 px-2 border border-gray-200 rounded shadow"
                      onClick={() => handleStatusUpdate(product._id, "InActive")}
                    >
                      <p className="text-sm">InActive</p>
                    </button>
                  )}
                  {(product.availabilityStatus === "Sold Out" || product.availabilityStatus === "InActive") && (
                    <button
                      className=" ml-4 bg-white hover:bg-gray-50 text-green-600 hover:text-green-900 py-1 px-2 border border-gray-200 rounded shadow"
                      onClick={() => handleStatusUpdate(product._id, "In Stock")}
                    >
                      <p className="text-xs">In Stock</p>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
        <span>
          {" "}
          Showing {currentProducts.length} of {filteredProducts.length} data{" "}
        </span>
        <div className="flex space-x-1">
          <button onClick={() => handleChangePage(currentPage - 1)} disabled={currentPage === 1} className="px-2 py-1 border rounded">
            Previous
          </button>
          {[...Array(totalPages).keys()].map((page) => (
            <button key={page + 1} onClick={() => handleChangePage(page + 1)} className={`px-2 py-1 border rounded ${currentPage === page + 1 ? "bg-blue-500 text-white" : ""}`}>
              {page + 1}
            </button>
          ))}
          <button onClick={() => handleChangePage(currentPage + 1)} disabled={currentPage === totalPages} className="px-2 py-1 border rounded">
            Next
          </button>
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="itemsPerPage" className="mr-2">
          Items per page:
        </label>
        <select id="itemsPerPage" value={itemsPerPage} onChange={handleItemsPerPageChange} className="p-2 border rounded">
          <option value={8}>8</option>
          <option value={16}>16</option>
          <option value={30}>30</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
};

export default TableProduct;
