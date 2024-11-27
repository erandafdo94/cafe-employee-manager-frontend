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

  useEffect(() => {
    const fetchCafe = async () => {
      try {
        if (id) {
          const cafe = await cafeService.getById(id);
          setInitialValues(cafe);
        }
      } catch (error) {
        setError("Failed to fetch cafe details");
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
        if (id) {
          await cafeService.update(id, {
            ...values,
            logo: "string",
          });
          navigate("/cafes");
        }
      } catch (error) {
        setError("Failed to update cafe");
      }
    },
  });

  if (!initialValues) {
    return <Box sx={{ p: 3 }}>Loading...</Box>;
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
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
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
