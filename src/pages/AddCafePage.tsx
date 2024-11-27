// src/pages/AddCafePage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  IconButton,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { cafeService } from "../services/cafeService";

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

const AddCafePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      location: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const cafeData = {
          ...values,
          logo: "string",
        };
        await cafeService.create(cafeData);
        navigate("/cafes");
      } catch (error) {
        setError("Failed to create cafe");
      }
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        setError("File size must be less than 2MB");
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleCancel = () => {
    if (formik.dirty || selectedFile) {
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
          Add New Café
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setError(null)}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {error}
          </Alert>
        )}

        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="name"
            name="name"
            label="Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
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
            onBlur={formik.handleBlur}
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
            onBlur={formik.handleBlur}
            error={formik.touched.location && Boolean(formik.errors.location)}
            helperText={formik.touched.location && formik.errors.location}
            margin="normal"
          />

          <Box sx={{ mt: 2, mb: 3 }}>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="logo-file"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="logo-file">
              <Button variant="outlined" component="span">
                Upload Logo
              </Button>
            </label>
            {selectedFile && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected file: {selectedFile.name}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button onClick={handleCancel} variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Create Café
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default AddCafePage;
