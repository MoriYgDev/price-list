// src/pages/EditProductPage.tsx
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Typography, TextField, Button, Grid, CircularProgress,
    Autocomplete, Snackbar, Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { Brand, Logo, Product } from '../types';
import api from '../services/api';

// Form data shape is the same as the Add page
interface IFormInputs {
    name: string;
    partnerName: string;
    price: number;
    profitPercentage: number;
    description: string;
    imageUrl: string;
    brandName: string | null;
    logoName: string | null;
    registrationDate: Date | null;
}

const EditProductPage = () => {
    const { id } = useParams<{ id: string }>(); // Get the product ID from the URL
    const navigate = useNavigate();
    // useForm hook
    const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<IFormInputs>();

    const [brands, setBrands] = useState<string[]>([]);
    const [logos, setLogos] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: 'success' | 'error' } | null>(null);

    // This useEffect fetches the existing product data and populates the form
    useEffect(() => {
        // Fetch brands and logos for the autocomplete fields
        api.get('/lists/brands').then(res => setBrands(res.data.map((b: Brand) => b.name)));
        api.get('/lists/logos').then(res => setLogos(res.data.map((l: Logo) => l.name)));

        // Fetch the specific product's data
        api.get<Product>(`/products/${id}`)
            .then(res => {
                const product = res.data;
                // Use setValue to pre-fill the form fields
                setValue('name', product.name);
                setValue('partnerName', product.partnerName);
                setValue('price', product.price);
                setValue('profitPercentage', product.profitPercentage);
                setValue('description', product.description || '');
                setValue('imageUrl', product.imageUrl || '');
                setValue('brandName', product.brand.name);
                setValue('logoName', product.logo.name);
                setValue('registrationDate', new Date(product.registrationDate));
                setPageLoading(false); // Stop the page loading spinner
            })
            .catch(err => {
                console.error("Failed to fetch product", err);
                setSnackbar({ open: true, message: 'خطا در دریافت اطلاعات محصول', severity: 'error' });
                setPageLoading(false);
            });
    }, [id, setValue]);

    const priceValue = watch('price');
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.replace(/,/g, '');
        const numValue = parseInt(rawValue, 10);
        setValue('price', isNaN(numValue) ? 0 : numValue);
    };

    // The onSubmit function now calls PUT instead of POST
    const onSubmit = async (data: IFormInputs) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            await api.put(`/products/${id}`, data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSnackbar({ open: true, message: 'محصول با موفقیت ویرایش شد!', severity: 'success' });
            setTimeout(() => navigate('/admin'), 2000);
        } catch (error) {
            console.error('Failed to edit product', error);
            setSnackbar({ open: true, message: 'خطا در ویرایش محصول', severity: 'error' });
            setLoading(false);
        }
    };

    if (pageLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress size={60} /></Box>;
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>ویرایش محصول</Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                    {/* The form layout is identical to the AddProductPage */}
                    <Grid item xs={12} sm={6}>
                        <Controller name="name" control={control} rules={{ required: 'نام محصول الزامی است' }} render={({ field }) => <TextField {...field} label="نام محصول" fullWidth error={!!errors.name} helperText={errors.name?.message} />} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Controller name="partnerName" control={control} rules={{ required: 'نام همکار الزامی است' }} render={({ field }) => <TextField {...field} label="نام همکار" fullWidth error={!!errors.partnerName} helperText={errors.partnerName?.message} />} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <Controller
                            name="brandName"
                            control={control}
                            rules={{ required: 'برند الزامی است' }}
                            render={({ field: { onChange, value } }) => (
                                <Autocomplete
                                    freeSolo options={brands} value={value}
                                    onChange={(event, newValue) => onChange(newValue)}
                                    renderInput={(params) => (<TextField {...params} label="برند" error={!!errors.brandName} helperText={errors.brandName?.message} />)}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <Controller
                            name="logoName"
                            control={control}
                            rules={{ required: 'لوگو الزامی است' }}
                            render={({ field: { onChange, value } }) => (
                                <Autocomplete
                                    freeSolo options={logos} value={value}
                                    onChange={(event, newValue) => onChange(newValue)}
                                    renderInput={(params) => (<TextField {...params} label="لوگو" error={!!errors.logoName} helperText={errors.logoName?.message} />)}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="registrationDate" control={control} rules={{ required: 'تاریخ ثبت الزامی است' }}
                            render={({ field }) => (
                                <DatePicker
                                    {...field} label="تاریخ ثبت قیمت" sx={{ width: '100%' }}
                                    slotProps={{ textField: { error: !!errors.registrationDate, helperText: errors.registrationDate?.message, }, }}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <TextField
                        label="قیمت (ریال)"
                         value={new Intl.NumberFormat('fa-IR').format(priceValue || 0)}
                         onChange={handlePriceChange} 
                        fullWidth
                        required
                    />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Controller name="profitPercentage" control={control} render={({ field }) => <TextField {...field} label="درصد سود" type="number" fullWidth required />} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Controller name="imageUrl" control={control} render={({ field }) => <TextField {...field} label="آدرس تصویر محصول (URL)" fullWidth />} />
                    </Grid>
                    <Grid item xs={12}>
                        <Controller name="description" control={control} render={({ field }) => <TextField {...field} label="توضیحات" multiline rows={4} fullWidth />} />
                    </Grid>
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" disabled={loading}>
                            {loading ? <CircularProgress size={24} /> : 'بروزرسانی محصول'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
            {snackbar && (
                <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
                    <Alert onClose={() => setSnackbar(null)} severity={snackbar.severity} sx={{ width: '100%' }}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            )}
        </Box>
    );
};

export default EditProductPage;