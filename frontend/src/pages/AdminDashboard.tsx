import { Link as RouterLink } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography, Box, IconButton, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Tooltip, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../services/api';
import type { Product } from '../types'; // Use 'import type'
import moment from 'jalali-moment';

const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchProducts = () => {
    api.get('/products')
      .then(response => setProducts(response.data))
      .catch(error => {
          console.error('Failed to fetch products', error)
          setError('خطا در دریافت لیست محصولات.');
      });
  };

  // Fetch products when the component loads
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId: number) => {
    if (window.confirm('آیا از حذف این محصول اطمینان دارید؟ این عمل قابل بازگشت نیست.')) {
      try {
        const token = localStorage.getItem('authToken');
        await api.delete(`/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Refresh the product list from the state to update the UI instantly
        setProducts(currentProducts => currentProducts.filter(p => p.id !== productId));
      } catch (err) {
        console.error('Failed to delete product', err);
        alert('خطا در حذف محصول');
      }
    }
  };

  const handleEdit = (productId: number) => {
      navigate(`/admin/edit-product/${productId}`);
  };

  const formatPrice = (price: number) => new Intl.NumberFormat('fa-IR').format(price) + ' ریال';
  const formatDate = (date: string) => moment(date).locale('fa').format('YYYY/MM/DD');

  return (
    <Box>
      <Typography variant="h4" gutterBottom>مدیریت محصولات</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>نام محصول</TableCell>
              <TableCell>برند</TableCell>
              <TableCell>تاریخ ثبت</TableCell>
              <TableCell>قیمت فروش</TableCell>
              <TableCell align="center">عملیات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length > 0 ? products.map((product) => (
              <TableRow key={product.id} hover>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.brand.name}</TableCell>
                <TableCell>{formatDate(product.registrationDate)}</TableCell>
                <TableCell>{formatPrice(product.price * (1 + product.profitPercentage / 100))}</TableCell>
                <TableCell align="center">
                  <Tooltip title="ویرایش">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(product.id)}
                      >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="حذف">
                    <IconButton color="error" onClick={() => handleDelete(product.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            )) : (
                <TableRow>
                    <TableCell colSpan={5} align="center">
                        هنوز محصولی اضافه نشده است.
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminDashboard;