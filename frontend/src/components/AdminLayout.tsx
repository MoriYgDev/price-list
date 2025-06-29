import React from 'react';
import { useNavigate, Outlet, Link as RouterLink } from 'react-router-dom';
import {
    AppBar, Toolbar, Typography, Button, Box, Drawer, List,
    ListItem, ListItemButton, ListItemIcon, ListItemText, CssBaseline
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import VisibilityIcon from '@mui/icons-material/Visibility';

import MyLogo from '../assets/afratec asli.png';

const drawerWidth = 240;

const AdminLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    const menuItems = [
        { text: 'داشبورد', icon: <DashboardIcon sx={{ ml: 1 }}/>, path: '/admin' }, // Added margin for RTL
        { text: 'اضافه کردن محصول', icon: <AddCircleOutlineIcon sx={{ ml: 1 }}/>, path: '/admin/add-product' }
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{ width: `calc(100% - ${drawerWidth}px)`, mr: `${drawerWidth}px` }} // mr for right-hand drawer
            >
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="h6" noWrap component="div">
                        پنل مدیریت
                    </Typography>
                    <Box>
                        <Button color="inherit" component={RouterLink} to="/" startIcon={<VisibilityIcon />}>
                             مشاهده سایت 
                        </Button>
                        <Button color="inherit" onClick={handleLogout} startIcon={<ExitToAppIcon />}>
                             خروج 
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="permanent"
                anchor="right" // This places the drawer on the right for RTL
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {menuItems.map((item) => (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton component={RouterLink} to={item.path}>
                                    <ListItemIcon>
                                        {item.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>

            {/* This is the main content area where the different admin pages will appear */}
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: `calc(100% - ${drawerWidth}px)` }}
            >
                <Toolbar />
                <Outlet /> {/* Child routes like AdminDashboard, AddProductPage, etc., render here */}
            </Box>
        </Box>
    );
};

export default AdminLayout;