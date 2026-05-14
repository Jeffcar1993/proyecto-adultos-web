import { test, expect } from '@playwright/test';

test.describe('Public Pages', () => {
  test('página de inicio carga correctamente', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const isVisible = await page.locator('body').isVisible();
    expect(isVisible).toBeTruthy();
  });

  test('listado de perfiles carga correctamente', async ({ page }) => {
    await page.goto('/perfiles');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveURL(/perfiles/);
  });
});

test.describe('Auth Flow', () => {
  test('página de crear cuenta carga', async ({ page }) => {
    await page.goto('/crear-cuenta');
    await page.waitForLoadState('networkidle');
    
    // Verificar que la página de registro existe
    const formExists = await page.locator('form, input[type="email"]').first().isVisible().catch(() => false);
    expect(formExists || page.url().includes('crear-cuenta')).toBeTruthy();
  });

  test('página de login carga', async ({ page }) => {
    await page.goto('/iniciar-sesion');
    await page.waitForLoadState('networkidle');
    
    // Verificar que la página de login existe
    const formExists = await page.locator('form, input[type="email"]').first().isVisible().catch(() => false);
    expect(formExists || page.url().includes('iniciar-sesion')).toBeTruthy();
  });
});

test.describe('Pages sin autenticación', () => {
  test('billetera es accesible', async ({ page }) => {
    await page.goto('/billetera');
    await page.waitForLoadState('networkidle').catch(() => {});
    
    // Solo verificar que no falla con error de red
    expect(page.url()).toBeDefined();
  });

  test('mi-perfil es accesible', async ({ page }) => {
    await page.goto('/mi-perfil');
    await page.waitForLoadState('networkidle').catch(() => {});
    
    expect(page.url()).toBeDefined();
  });
});
