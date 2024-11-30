import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import { cafeService } from "../services/cafeService";
import { Cafe } from "../types";

const validationSchema = yup.object({
  name: yup
    .string()
    .min(6, "Name must be at least 6 characters")
    .max(10, "Name must be at most 10 characters")
    .required("Name is required"),
  description: yup
    .string()
    .max(256, "Description must be at most 256 characters")
    .required("Description is required"),
  location: yup.string().required("Location is required"),
});

const EditCafePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [error, setError] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<Cafe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCafe = async () => {
      try {
        setIsLoading(true);
        if (!id) {
          setError("No cafe ID provided");
          setIsLoading(false);
          return;
        }

        const response = await cafeService.getById(id);
        console.log("API Response:", response);

        if (!response) {
          setError("No cafe data received");
          setIsLoading(false);
          return;
        }

        setInitialValues(response);
      } catch (error) {
        console.error("Error fetching cafe:", error);
        setError("Failed to fetch cafe details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCafe();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      name: initialValues?.name || "",
      description: initialValues?.description || "",
      location: initialValues?.location || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setError(null); // Clear any previous errors

        if (!id) {
          setError("No cafe ID available");
          return;
        }

        await cafeService.update(id, {
          ...values,
          logo: "string", // Include any required fields
        });

        // If we get here, the update was successful
        navigate("/cafes");
      } catch (error: any) {
        // Type as 'any' to access error properties
        console.error("Error updating cafe:", error);

        // Handle different types of errors
        if (error.response) {
          // Server responded with an error
          if (error.response.status === 404) {
            setError("Cafe not found");
          } else if (error.response.status === 400) {
            setError("Invalid cafe data");
          } else {
            setError(
              `Failed to update cafe: ${error.response.data || "Unknown error"}`
            );
          }
        } else if (error.request) {
          // Request was made but no response
          setError("No response from server");
        } else {
          // Something else went wrong
          setError("Failed to update cafe");
        }
      }
    },
  });

  if (isLoading) {
    return <Box sx={{ p: 3 }}>Loading...</Box>;
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const handleCancel = () => {
    if (formik.dirty) {
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to leave?"
        )
      ) {
        navigate("/cafes");
      }
    } else {
      navigate("/cafes");
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Edit Café
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            margin="normal"
          />

          <TextField
            fullWidth
            id="description"
            name="description"
            label="Description"
            multiline
            rows={4}
            value={formik.values.description}
            onChange={formik.handleChange}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText={formik.touched.description && formik.errors.description}
            margin="normal"
          />

          <TextField
            fullWidth
            id="location"
            name="location"
            label="Location"
            value={formik.values.location}
            onChange={formik.handleChange}
            error={formik.touched.location && Boolean(formik.errors.location)}
            helperText={formik.touched.location && formik.errors.location}
            margin="normal"
          />

          <Box
            sx={{ mt: 3, display: "flex", gap: 2, justifyContent: "flex-end" }}
          >
            <Button onClick={handleCancel} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Update Café
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default EditCafePage;
