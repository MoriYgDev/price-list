// src/components/NewLogoModal.tsx
import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, CircularProgress, Alert, Typography
} from '@mui/material';
import type { Logo } from '../types';
import api from '../services/api';

interface NewLogoModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (newLogo: Logo) => void;
}

export const NewLogoModal = ({ open, onClose, onSuccess }: NewLogoModalProps) => {
  const [name, setName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name || !file) {
      setError('نام لوگو و فایل تصویر الزامی است.');
      return;
    }
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('logoImage', file);

    try {
      const token = localStorage.getItem('authToken');
      // This API call now requires the 'protect' middleware on the backend
      const response = await api.post<Logo>('/lists/logos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      onSuccess(response.data); // Send the new logo back to the parent
    } catch (err: any) {
      setError(err.response?.data?.message || 'خطا در آپلود لوگو');
    } finally {
      setLoading(false);
    }
  };

  // When closing the dialog, reset the state
  const handleClose = () => {
    setName('');
    setFile(null);
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <form onSubmit={handleSubmit}>
        <DialogTitle>اضافه کردن لوگوی جدید</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              label="نام لوگو"
              type="text"
              fullWidth
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ mt: 2 }}
            >
              انتخاب فایل تصویر
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            {file && <Typography sx={{ mt: 1, textAlign: 'center' }}>{file.name}</Typography>}
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>انصراف</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'ذخیره'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};