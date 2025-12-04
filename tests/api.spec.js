import { test, expect, request } from '@playwright/test';

test.describe('ERP API Tests', () => {
  let apiRequest;
  let token;

  test.beforeAll(async () => {
    apiRequest = await request.newContext({
      baseURL: 'http://localhost:8000/api',
    });
  });

  test.afterAll(async () => {
    await apiRequest.dispose();
  });

  test('Login endpoint', async () => {
    const response = await apiRequest.post('/login', {
      data: {
        email: 'test@example.com',
        password: 'password',
      },
    });

    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body).toHaveProperty('token');
    token = body.token;
  });

  test.describe('Authenticated User CRUD', () => {
    let createdUserId;

    test('Get users index', async () => {
      const response = await apiRequest.get('/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(response.ok()).toBeTruthy();
      const users = await response.json();
      expect(Array.isArray(users)).toBeTruthy();
    });

    test('Create a new user', async () => {
      const response = await apiRequest.post('/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          name: 'Test User API',
          email: 'testapi@example.com',
          password: 'password123',
          role: 'admin',
          active: true,
        },
      });

      expect(response.ok()).toBeTruthy();
      const user = await response.json();
      expect(user).toHaveProperty('id');
      expect(user.name).toBe('Test User API');
      expect(user.email).toBe('testapi@example.com');
      createdUserId = user.id;
    });

    test('Get specific user', async () => {
      const response = await apiRequest.get(`/users/${createdUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(response.ok()).toBeTruthy();
      const user = await response.json();
      expect(user.id).toBe(createdUserId);
      expect(user.name).toBe('Test User API');
    });

    test('Update user', async () => {
      const response = await apiRequest.put(`/users/${createdUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          name: 'Updated Test User API',
          email: 'testapi@example.com',
          password: 'newpassword123',
          role: 'admin',
          active: false,
        },
      });

      expect(response.ok()).toBeTruthy();
      const user = await response.json();
      expect(user.name).toBe('Updated Test User API');
      expect(user.active).toBe(false);
    });

    test('Delete user', async () => {
      const response = await apiRequest.delete(`/users/${createdUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      expect(response.ok()).toBeTruthy();
    });
  });
});