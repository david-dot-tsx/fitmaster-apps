import { expect, test } from "@playwright/test";

test("register → login flow", async ({ page }) => {
  const email = `pw_${Date.now()}@example.com`;
  const password = "Password123!";

  // Landing page (locale-scoped app)
  await page.goto("/en");

  // Go to register from navbar
  await page.getByTestId("navbar-register-button").click();
  await expect(page).toHaveURL(/\/auth\/register/);

  // Fill mismatching passwords and assert inline error
  await page.locator("#email").fill(email);
  await page.locator("#password").fill(password);
  await page.locator("#passwordConfirmation").fill("Mismatch123!");
  await page.locator('button[type="submit"]').click();
  await expect(page.getByText("Passwords do not match")).toBeVisible();

  // Fix and submit again
  await page.locator("#passwordConfirmation").fill(password);
  await page.locator('button[type="submit"]').click();

  // Should redirect to login page after successful registration
  await expect(page).toHaveURL(/\/auth\/login/);

  // Login with the same credentials
  await page.locator("#email").fill(email);
  await page.locator("#password").fill(password);
  const loginButton = page.getByRole("button", { name: "Login" });
  await expect(loginButton).toBeEnabled();

  // WebKit can be slower to hydrate; wait for redirect concurrently with click.
  await Promise.all([
    page.waitForURL(/\/dashboard/, { timeout: 20000 }),
    loginButton.click(),
  ]);
});

