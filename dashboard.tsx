"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import { AuthProvider, useAuth } from "./contexts/auth-context";
import { Login } from "./components/login";
import { Button } from "@/components/ui/button";
import { LogOut, Search, Plus, ExternalLink } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Image from "next/image";

import {
  createUser,
  deleteUser,
  getAllUsers,
  runAutomations,
  updateUser,
} from "./services/services";
import { useRouter } from "next/navigation";
import DriveAuthentication from "./components/DriveAuthentication";

function DashboardContent() {
  const { logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    site_url: "",
    business_name: "",
    address: "",
    gbp_id: "",
  });
  const [errors, setErrors] = useState({
    site_url: "",
    business_name: "",
    address: "",
    gbp_id: "",
  });
  const [sampleBusinesses, setSampleBusinesses] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const hasFetched = useRef(false);
  const router = useRouter();

  const STATUS_ENUM = {
    NOT_STARTED: 'NOT Started',
    QUEUED: 'Queued',
    IN_PROGRESS: 'InProgress',
    SUCCESSFUL: 'Successful'
  }

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchData = async () => {
      try {
        // console.log("Domain:::", process.env.NEXT_PUBLIC_DOMAIN);
        const response = await getAllUsers();
        // const result = await response.json();
        // console.log("Result is cooked:::", response.data);
        // sampleBusinesses = await result.data
        if (response.data) setSampleBusinesses(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Filter businesses based on search term
  const filteredBusinesses = sampleBusinesses.filter((business: any) =>
    business?.business_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredBusinesses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBusinesses = filteredBusinesses.slice(startIndex, endIndex);

  // Reset to first page when search changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onUserDelete = async (id: number, indexToRemove: number) => {
    const isSuccessfullyDeleted = await deleteUser(id);
    if ((isSuccessfullyDeleted.success = true)) {
      setSampleBusinesses((prevItems: any) => {
        const newItems = [...prevItems]; // clone to avoid mutating state directly
        newItems.splice(indexToRemove, 1); // remove 1 item at the index
        return newItems;
      });
    } else {
      throw new Error("Failed to delete user");
    }
  };

  const onRunAutomation = async (id: number,clientName:string) => {
    alert(`Automation workflow has begun for ${clientName}`);
    router.push('/')
    const isAutomatedSuccessfully = await runAutomations(id);
    console.log("isAutomated success:::", isAutomatedSuccessfully);
    return;
  };

  const validateForm = () => {
    const newErrors = {
      site_url: "",
      business_name: "",
      address: "",
      gbp_id: "",
    };

    // URL validation
    if (!formData.site_url) {
      newErrors.site_url = "URL is required";
    } else {
      try {
        // Auto-prepend https:// if no protocol is provided
        let urlToValidate = formData.site_url;
        if (
          !urlToValidate.startsWith("http://") &&
          !urlToValidate.startsWith("https://")
        ) {
          urlToValidate = "https://" + urlToValidate;
        }
        new URL(urlToValidate);
      } catch {
        newErrors.site_url =
          "Please enter a valid URL (e.g., example.com or https://example.com)";
      }
    }

    if (!formData.business_name.trim()) {
      newErrors.business_name = "Business name is required";
    } else if (formData.business_name.trim().length < 2) {
      newErrors.business_name = "Business name must be at least 2 characters";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    } else if (formData.address.trim().length < 5) {
      newErrors.address = "Please enter a complete address";
    }

    if (!formData.gbp_id.trim()) {
      newErrors.gbp_id = "GBP ID is required";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleProgressTextColor = (progressStatus: string) => {
    // console.log("status progress:::",progressStatus)
    switch (progressStatus) {
      case "Not Started":
        return "black";
      case 'InProgress':
        return "blue";
      case "Queued":
        return "orange";
      case "Successful":
        return "green";
      case "Failed":
        return "red";
      default:
        return "black";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Auto-prepend https:// if no protocol is provided before saving
    let finalUrl = formData.site_url;
    if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      finalUrl = "https://" + finalUrl;
    }

    const finalFormData = {
      ...formData,
      site_url: finalUrl,
    };
    console.log("Create User:::", finalFormData);
    const user = await createUser(finalFormData);
    if(user?.props?.length > 0) {
    //   setIsModalOpen(false);
    // setFormData({
    //   site_url: "",
    //   business_name: "",
    //   address: "",
    //   gbp_id: "",
    // });
    // setErrors({
    //   site_url: "",
    //   business_name: "",
    //   address: "",
    //   gbp_id: "",
    // });
      alert("User Creation Failed!\nPlease provide a valid and unique GMBS ID!")
      return;
    }
    console.log("User on creation:::", user);
    setSampleBusinesses([user.data, ...sampleBusinesses]);

    console.log("Form submitted:", finalFormData);
    setIsModalOpen(false);
    setFormData({
      site_url: "",
      business_name: "",
      address: "",
      gbp_id: "",
    });
    setErrors({
      site_url: "",
      business_name: "",
      address: "",
      gbp_id: "",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Image
                src="/jumper-logo.png"
                alt="Jumper Media"
                width={200}
                height={46}
                className="h-8 sm:h-10 w-auto"
              />
            </div>

            {/* Logout Button */}
            <Button
              variant="outline"
              onClick={logout}
              className="flex items-center space-x-1 sm:space-x-2 bg-transparent text-xs sm:text-sm px-2 sm:px-4"
            >
              <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <DriveAuthentication />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Clients
          </h1>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by business name..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 sm:w-64"
              />
            </div>

            {/* Add Client Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Client
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] mx-4 sm:mx-0">
                <DialogHeader>
                  <DialogTitle>Add New Client</DialogTitle>
                  <DialogDescription>
                    Enter the client details below to add them to your
                    dashboard.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="url">URL</Label>
                      <Input
                        id="site_url"
                        type="url"
                        placeholder="https://example.com"
                        value={formData.site_url}
                        onChange={(e) =>
                          handleInputChange("site_url", e.target.value)
                        }
                        className={errors.site_url ? "border-red-500" : ""}
                      />
                      {errors.site_url && (
                        <span className="text-sm text-red-500">
                          {errors.site_url}
                        </span>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="businessName">Business Name</Label>
                      <Input
                        id="business_name"
                        placeholder="Enter business name"
                        value={formData.business_name}
                        onChange={(e) =>
                          handleInputChange("business_name", e.target.value)
                        }
                        className={errors.business_name ? "border-red-500" : ""}
                      />
                      {errors.business_name && (
                        <span className="text-sm text-red-500">
                          {errors.business_name}
                        </span>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        placeholder="Enter business address"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        className={errors.address ? "border-red-500" : ""}
                      />
                      {errors.address && (
                        <span className="text-sm text-red-500">
                          {errors.address}
                        </span>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="gbpId">GBP ID</Label>
                      <Input
                        id="gbp_id"
                        placeholder="Enter 20-digit Google Business Profile ID"
                        value={formData.gbp_id}
                        onChange={(e) =>
                          handleInputChange("gbp_id", e.target.value)
                        }
                        className={errors.gbp_id ? "border-red-500" : ""}
                      />
                      {errors.gbp_id && (
                        <span className="text-sm text-red-500">
                          {errors.gbp_id}
                        </span>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
                    >
                      Add Client
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Mobile Card View for small screens, Table for larger screens */}
        <div className="block sm:hidden">
          {/* Mobile Card Layout */}
          <div className="space-y-4">
            {currentBusinesses.length > 0 ? (
              currentBusinesses.map((business: any) => (
                <div
                  key={business.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-lg">{business.name}</h3>
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={business.reportUrl}
                        className="inline-flex items-center text-xs"
                      >
                        View Report
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </a>
                    </Button>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">
                        Address:
                      </span>
                      <p className="mt-1">{business.address}</p>
                    </div>

                    <div>
                      <span className="font-medium text-muted-foreground">
                        Website:
                      </span>
                      <a
                        href={business.site_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mt-1 text-blue-600 hover:text-blue-800 underline break-all"
                      >
                        {business.site_url}
                      </a>
                    </div>

                    <div>
                      <span className="font-medium text-muted-foreground">
                        GBP ID:
                      </span>
                      <p className="mt-1 font-mono text-xs break-all">
                        {business.gbp_id}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8 border rounded-lg">
                {searchTerm
                  ? "No businesses found matching your search."
                  : "No businesses added yet."}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block border rounded-lg">
          <Table className="">
            <TableHeader>
              <TableRow>
                <TableHead className="border-b w-[200px] lg:w-[250px]">
                  Business Name
                </TableHead>
                <TableHead className="border-b w-[200px] lg:w-[300px]">
                  Address
                </TableHead>
                <TableHead className="border-b w-[180px] lg:w-[200px]">
                  Site URL
                </TableHead>
                <TableHead className="border-b w-[150px] lg:w-[180px]">
                  GBP ID
                </TableHead>
                <TableHead className="border-b w-[100px] lg:w-[120px]">
                  Automation Workflow Action
                </TableHead>
                <TableHead className="border-b w-[100px] lg:w-[120px]">
                  Workflow Status
                </TableHead>
                <TableHead className="border-b w-[100px] lg:w-[120px]">
                  Results
                </TableHead>
                <TableHead className="border-b w-[100px] lg:w-[120px]">
                  Row Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentBusinesses.length > 0 ? (
                currentBusinesses.map((business: any, index: number) => (
                  <TableRow
                    key={business.id}
                    className="border-b last:border-b-0"
                  >
                    <TableCell className="font-medium truncate">
                      {business.business_name}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground truncate">
                      {business.address}
                    </TableCell>
                    <TableCell>
                      <a
                        href={business.site_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline text-sm truncate block"
                      >
                        {business.site_url}
                      </a>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground truncate">
                      {business.gbp_id}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                          onRunAutomation(business.id,business.business_name);
                        }}
                        disabled={business.actions == (STATUS_ENUM.IN_PROGRESS) || business.actions == (STATUS_ENUM.QUEUED)}
                      >
                        Start
                      </Button>
                    </TableCell>
                    <TableCell>
                      <h4
                        style={{
                          color: handleProgressTextColor(business.actions),
                        }}
                      >
                        {business.actions}
                      </h4>
                    </TableCell>
                    <TableCell>
                      { business.audit_link ?
                        (<a
                          href={business.audit_link}
                          target="blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline text-sm truncate block"
                        >
                          {`${business.business_name} Report`}
                        </a>) : (<span>No link available</span>)
                      }
                    </TableCell>
                    <TableCell className="flex">
                      <Button
                        variant="destructive"
                        size="default"
                        className="mx-3"
                        onClick={() => onUserDelete(business.id, index)}
                        disabled={business.actions == (STATUS_ENUM.IN_PROGRESS) || business.actions == (STATUS_ENUM.QUEUED)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-8"
                  >
                    {searchTerm
                      ? "No businesses found matching your search."
                      : "No businesses added yet."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Responsive Pagination */}
        <div className="mt-6 flex justify-center h-10">
          {filteredBusinesses.length > itemsPerPage && (
            <Pagination>
              <PaginationContent className="flex-wrap gap-1">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={`${
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    } text-xs sm:text-sm px-2 sm:px-3`}
                  />
                </PaginationItem>

                {/* Show fewer page numbers on mobile */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    if (totalPages <= 5) return true;
                    if (page === 1 || page === totalPages) return true;
                    if (Math.abs(page - currentPage) <= 1) return true;
                    return false;
                  })
                  .map((page, index, array) => (
                    <PaginationItem key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-2 text-muted-foreground">...</span>
                      )}
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                        isActive={currentPage === page}
                        className="text-xs sm:text-sm px-2 sm:px-3"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages)
                        setCurrentPage(currentPage + 1);
                    }}
                    className={`${
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    } text-xs sm:text-sm px-2 sm:px-3`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </main>
    </div>
  );
}

function AuthenticatedApp() {
  const { isAuthenticated, login } = useAuth();
  const [loginError, setLoginError] = useState("");

  const handleLogin = (password: string) => {
    const success = login(password);
    if (!success) {
      setLoginError("Incorrect password. Please try again.");
    } else {
      setLoginError("");
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} error={loginError} />;
  }

  return <DashboardContent />;
}

export default function ClientDashboard() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}
