// src/pages/CafesPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import { Button, TextField, Box, Typography, IconButton } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { DeleteConfirmDialog } from "../components/DeleteConfirmDialog";
import { cafeService } from "../services/cafeService";
import { Cafe } from "../types";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import placeholderImage from "../assets/images.png";

const CafesPage: React.FC = () => {
  const navigate = useNavigate();
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);

  const columnDefs: ColDef[] = [
    {
      field: "logo",
      headerName: "Logo",
      width: 100,
      cellRenderer: (params: any) => (
        <img
          src={params.value}
          alt="café logo"
          style={{ width: "40px", height: "40px", objectFit: "cover" }}
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = placeholderImage;
          }}
        />
      ),
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      sortable: true,
      filter: true,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      width: 50,
      sortable: true,
      filter: true,
    },
    {
      field: "employeeCount",
      headerName: "Employees",
      width: 200,
      cellRenderer: (params: any) => (
        <Button
          size="small"
          variant="text"
          onClick={() => navigate(`/employees?cafeId=${params.data.id}`)}
        >
          {params.value || 0} Employees
        </Button>
      ),
    },
    {
      field: "location",
      headerName: "Location",
      flex: 0.5,
      sortable: true,
      filter: true,
    },
    {
      headerName: "Actions",
      width: 160, // Increased width
      pinned: "right", // Pin to right side
      suppressMovable: true, // Prevent column from being moved
      cellRenderer: (params: any) => (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "center", // Center the buttons
            width: "100%", // Take full width of cell
            padding: "0 8px", // Add some padding
          }}
        >
          <IconButton
            size="small"
            color="primary"
            onClick={() => navigate(`/cafes/edit/${params.data.id}`)}
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDeleteClick(params.data)}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ),
      suppressSizeToFit: true,
    },
  ];

  const defaultColDef = {
    resizable: true,
  };

  useEffect(() => {
    fetchCafes();
  }, []);

  const fetchCafes = async () => {
    try {
      const cafes = await cafeService.getAll();
      console.log("Fetched cafes:", cafes);
      setCafes(cafes); // cafes is already Cafe[]
    } catch (error) {
      console.error("Error fetching cafes:", error);
    }
  };

  const handleDeleteClick = (cafe: Cafe) => {
    setSelectedCafe(cafe);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedCafe) {
      try {
        await cafeService.delete(selectedCafe.id);
        setDeleteDialogOpen(false);
        fetchCafes();
      } catch (error) {
        console.error("Error deleting cafe:", error);
      }
    }
  };

  const filteredCafes = locationFilter
    ? cafes.filter((cafe) =>
        cafe.location.toLowerCase().includes(locationFilter.toLowerCase())
      )
    : cafes;

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5">Cafés</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/cafes/add")}
        >
          Add New Café
        </Button>
      </Box>

      <Box sx={{ p: 2 }}>
        <TextField
          label="Filter by Location"
          variant="outlined"
          size="small"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          fullWidth
        />
      </Box>

      <Box sx={{ flexGrow: 1, p: 2 }}>
        <div
          className="ag-theme-material"
          style={{ height: "100%", width: "100%" }}
        >
          <AgGridReact
            rowData={filteredCafes}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={10}
            animateRows={true}
            rowSelection="single"
            suppressRowClickSelection={true}
            suppressCellFocus={true}
          />
        </div>
      </Box>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        title="Delete Café"
        message={`Are you sure you want to delete ${selectedCafe?.name}?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </Box>
  );
};

export default CafesPage;
