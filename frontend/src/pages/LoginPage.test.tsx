import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';

jest.mock('../services/api');

describe('LoginPage', () => {
  it('renders the login page', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    expect(screen.getByLabelText(/نام کاربری/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/رمز عبور/i)).toBeInTheDocument();
  });

  it('shows an error message when login fails', async () => {
    // Mock the api call to simulate a failed login
    const api = require('../services/api').default;
    api.post.mockImplementation(() =>
      Promise.reject({
        response: {
          data: { message: 'نام کاربری یا رمز عبور اشتباه است' },
        },
      })
    );

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/نام کاربری/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/رمز عبور/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /ورود/i }));

    expect(await screen.findByText(/نام کاربری یا رمز عبور اشتباه است/i)).toBeInTheDocument();
  });
});
