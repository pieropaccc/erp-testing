import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login ERP', () => {

  test('Usuario puede loguearse correctamente', async ({ page }) => {
    // Add debugging
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('request', request => console.log('REQUEST:', request.url()));
    page.on('response', response => console.log('RESPONSE:', response.url(), response.status()));

    const login = new LoginPage(page);
    await login.goto();
    await login.login('test@example.com', 'password');

    await page.waitForURL('/dashboard', { timeout: 60000 });
    await expect(page.locator('h2').getByText('Dashboard')).toBeVisible();
  });

  test('Usuario no puede loguearse con credenciales incorrectas', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('wrong@example.com', 'wrongpassword');

    await page.waitForSelector('p.text-red-500');
    const errorMessage = await login.getErrorMessage();
    expect(errorMessage).toContain('Credenciales inválidas');
  });

});