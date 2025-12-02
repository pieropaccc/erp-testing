import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() { await this.page.goto('/login'); }

  async login(email: string, pass: string) {
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Contraseña').fill(pass);
    await this.page.getByRole('button', { name: /Acceder|Iniciando/ }).click();
  }

  async getErrorMessage(): Promise<string | null> {
    const errorElement = this.page.locator('p.text-red-500');
    if (await errorElement.isVisible()) {
      return await errorElement.textContent();
    }
    return null;
  }
}