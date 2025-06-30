// src/pages/EditProductPage.tsx
import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Typography, TextField, Button, Grid, CircularProgress,
    Autocomplete, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem, FormHelperText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AddIcon from '@mui/icons-material/Add';
import type { Brand, Logo, Product } from '../types';
import api from '../services/api';
import { NewLogoModal } from '../components/NewLogoModal';

// Form data shape
interface IFormInputs {
    name: string;
    partnerName: string;
    price: number | '';
    profitPercentage: number;
    description: string;
    brandName: string | null;
    logoId: number | '';
    registrationDate: Date | null;
}

const EditProductPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { control, handleSubmit, setValue, formState: { errors } } = useForm<IFormInputs>({
        defaultValues: {
            name: '',
            partnerName: '',
            price: '',
            profitPercentage: 30,
            description: '',
            brandName: null,
            logoId: '',
            registrationDate: null,
        }
    });

    const [brands, setBrands] = useState<string[]>([]);
    const [logos, setLogos] = useState<Logo[]>([]);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: 'success' | 'error' } | null>(null);

    const fetchLogos = () => {
        api.get('/lists/logos').then(res => setLogos(res.data));
    };

    useEffect(() => {
        document.title = 'افراتک | ویرایش محصول';
        api.get('/lists/brands').then(res => setBrands(res.data.map((b: Brand) => b.name)));
        fetchLogos();

        api.get<Product>(`/products/${id}`)
            .then(res => {
                const product = res.data;
                setValue('name', product.name);
                setValue('partnerName', product.partnerName);
                setValue('price', product.price);
                setValue('profitPercentage', product.profitPercentage);
                setValue('description', product.description || '');
                setValue('brandName', product.brand.name);
                setValue('logoId', product.logo.id);
                setValue('registrationDate', new Date(product.registrationDate));
                setPageLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch product", err);
                setSnackbar({ open: true, message: 'خطا در دریافت اطلاعات محصول', severity: 'error' });
                setPageLoading(false);
            });
    }, [id, setValue]);

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

    const handleNewLogoSuccess = (newLogo: Logo) => {
        fetchLogos();
        setValue('logoId', newLogo.id);
        setIsModalOpen(false);
    };

    if (pageLoading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress size={60} /></Box>;
    }

    return (
        <Box>
            <NewLogoModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleNewLogoSuccess}
            />
            <Typography variant="h4" gutterBottom>ویرایش محصول</Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
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
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                            <Controller
                                name="logoId"
                                control={control}
                                rules={{ required: 'لوگو الزامی است' }}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.logoId}>
                                        <InputLabel>لوگو</InputLabel>
                                        <Select {...field} label="لوگو">
                                            <MenuItem value=""><em>انتخاب کنید</em></MenuItem>
                                            {logos.map((logo) => (
                                                <MenuItem key={logo.id} value={logo.id}>{logo.name}</MenuItem>
                                            ))}
                                        </Select>
                                        {errors.logoId && <FormHelperText>{errors.logoId.message}</FormHelperText>}
                                    </FormControl>
                                )}
                            />
                            <Button title="افزودن لوگوی جدید" onClick={() => setIsModalOpen(true)} variant="outlined" sx={{ ml: 1, minWidth: '56px', height: '56px' }}><AddIcon /></Button>
                        </Box>
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
                        <Controller
                            name="price"
                            control={control}
                            rules={{ required: 'Price is required' }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="قیمت (ریال)"
                                    type="number"
                                    fullWidth
                                    required
                                    error={!!errors.price}
                                    helperText={errors.price?.message}
                                    onChange={e => field.onChange(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Controller name="profitPercentage" control={control} render={({ field }) => <TextField {...field} label="درصد سود" type="number" fullWidth required />} />
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