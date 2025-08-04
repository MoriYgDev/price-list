// src/pages/ClientPage.tsx
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Container, Typography, TextField, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Box, Button,
  CircularProgress, Collapse, IconButton, TableSortLabel, Alert
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import api from '../services/api';
import type { Product } from '../types';
import moment from 'jalali-moment';

import { useTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ColorModeContext } from '../ColorModeContext';
import MyLogo from '../assets/afratec asli.png';

// FIX: Get the base URL for backend static assets from an environment variable.
const BACKEND_STATIC_URL = import.meta.env.VITE_BACKEND_STATIC_URL || 'http://localhost:3001';

type Order = 'asc' | 'desc';
type SortableKeys = keyof Product | 'brand' | 'logo';

// Row Sub-Component for expandable details
const Row = (props: { product: Product }) => {
    const { product } = props;
    const [open, setOpen] = useState(false);
    const finalPrice = product.price * (1 + product.profitPercentage / 100);
    const formatPrice = (price: number) => new Intl.NumberFormat('fa-IR').format(price) + ' ریال';
    const formatDate = (date: string) => moment(date).locale('fa').format('YYYY/MM/DD');
    
    // FIX: Use the environment variable for the backend URL to make image paths correct in any environment.
    const backendUrl = BACKEND_STATIC_URL;

    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} hover onClick={() => setOpen(!open)}>
                <TableCell><IconButton aria-label="expand row" size="small">{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}</IconButton></TableCell>
                <TableCell>
                    <img
                        src={`${backendUrl}${product.logo.filePath}`}
                        alt={product.logo.name}
                        style={{
                            maxHeight: '40px',
                            maxWidth: '120px',
                            verticalAlign: 'middle'
                        }}
                    />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.brand.name}</TableCell>
                <TableCell>{product.partnerName}</TableCell>
                <TableCell>{formatDate(product.registrationDate)}</TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
                <TableCell>{formatPrice(finalPrice)}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2 }}>
                            <Typography variant="h6" gutterBottom component="div">توضیحات</Typography>
                            {product.description ? <p>{product.description}</p> : <p>توضیحات موجود نیست.</p>}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

// Main Page Component
const ClientPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<SortableKeys>('name');
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  useEffect(() => {
    setLoading(true);
    setError(null);
    api.get('/products')
       .then(response => {
         setProducts(response.data);
       })
       .catch(error => {
         console.error('Failed to fetch products:', error);
         setError('خطا در دریافت محصولات. لطفا از روشن بودن سرور اطمینان حاصل کرده و صفحه را رفرش کنید.');
       })
       .finally(() => {
         setLoading(false);
       });
  }, []);

  const handleRequestSort = (property: SortableKeys) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedAndFilteredProducts = useMemo(() => {
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.partnerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return [...filtered].sort((a, b) => {
        let valA: any;
        let valB: any;
        if (orderBy === 'brand') { valA = a.brand.name; valB = b.brand.name; }
        else if (orderBy === 'logo') { valA = a.logo.name; valB = b.logo.name; }
        else { valA = a[orderBy as keyof Product]; valB = b[orderBy as keyof Product]; }
        if (valB < valA) return order === 'asc' ? 1 : -1;
        if (valB > valA) return order === 'asc' ? -1 : 1;
        return 0;
    });
  }, [products, searchTerm, order, orderBy]);

  const renderTable = () => {
    if (loading) {
      return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
    }
    if (error) {
      return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;
    }
    if (sortedAndFilteredProducts.length === 0) {
      return (
          <Box component={Paper} sx={{ textAlign: 'center', p: 5, mt: 4 }}>
              <Typography variant="h6">محصولی برای نمایش یافت نشد.</Typography>
              <Typography>ممکن است هنوز محصولی اضافه نشده باشد یا با جستجوی شما مطابقت نداشته باشد.</Typography>
          </Box>
      );
    }
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell><TableSortLabel active={orderBy === 'logo'} direction={orderBy === 'logo' ? order : 'asc'} onClick={() => handleRequestSort('logo')}>لوگو</TableSortLabel></TableCell>
              <TableCell><TableSortLabel active={orderBy === 'name'} direction={orderBy === 'name' ? order : 'asc'} onClick={() => handleRequestSort('name')}>نام محصول</TableSortLabel></TableCell>
              <TableCell><TableSortLabel active={orderBy === 'brand'} direction={orderBy === 'brand' ? order : 'asc'} onClick={() => handleRequestSort('brand')}>برند</TableSortLabel></TableCell>
              <TableCell><TableSortLabel active={orderBy === 'partnerName'} direction={orderBy === 'partnerName' ? order : 'asc'} onClick={() => handleRequestSort('partnerName')}>نام همکار</TableSortLabel></TableCell>
              <TableCell><TableSortLabel active={orderBy === 'registrationDate'} direction={orderBy === 'registrationDate' ? order : 'asc'} onClick={() => handleRequestSort('registrationDate')}>تاریخ ثبت</TableSortLabel></TableCell>
              <TableCell><TableSortLabel active={orderBy === 'price'} direction={orderBy === 'price' ? order : 'asc'} onClick={() => handleRequestSort('price')}>قیمت</TableSortLabel></TableCell>
              <TableCell>قیمت فروش</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedAndFilteredProducts.map((product) => <Row key={product.id} product={product} />)}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
    <img src={MyLogo} alt="لوگوی افراتک" style={{ height: '160px' }} />
    <Box>
        <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <Button component={RouterLink} to="/login" variant="outlined">
            ورود ادمین
        </Button>
    </Box>
</Box>
      <Typography variant="h4" component="h1" gutterBottom>لیست قیمت محصولات</Typography>
      <TextField
        fullWidth label="جستجو..." variant="outlined" value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} sx={{ mb: 4 }}
      />
      {renderTable()}
    </Container>
  );
};

export default ClientPage;