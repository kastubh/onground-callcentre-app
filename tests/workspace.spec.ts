import { test, expect } from '@playwright/test';
test('dashboard and accessible lead review', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' || message.type() === 'warning') errors.push(message.text());
  });
  await page.goto('/');
  await expect(page.getByText('Good afternoon, Arvind Rajan')).toBeVisible();
  await expect(page.locator('.recharts-wrapper')).toHaveCount(2);
  await page.screenshot({ path: 'docs/screenshots/dashboard.png', fullPage: true });
  await page.getByRole('button', { name: /2 callbacks/ }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Mukunda', exact: true })).toBeVisible();
  await page.screenshot({ path: 'docs/screenshots/leads.png' });
  await page.getByRole('button', { name: 'Next page', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Priya Iyer', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.getByRole('button', { name: /2 callbacks/ })).toBeFocused();
  expect(errors).toEqual([]);
});
test('plan pagination search call wrap-up and review', async ({ page }) => {
  await page.goto('/plan/calls');
  await expect(page.getByText('Page 1 of 2')).toBeVisible();
  await page.getByRole('button', { name: 'Next page' }).click();
  await expect(page.getByText('Page 2 of 2')).toBeVisible();
  await page.getByRole('textbox', { name: 'Search leads' }).fill('nothingmatches');
  await expect(page.getByText(/No leads match/)).toBeVisible();
  await page.goto('/plan/incoming');
  await expect(page.getByText('₹81,860 in total expected value', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Call back' }).first().click();
  await expect(page.getByText('00:01')).toBeVisible();
  await page.getByRole('button', { name: 'Mute', exact: true }).click();
  await expect(page.getByText('Microphone muted')).toBeVisible();
  await page.getByRole('button', { name: 'End call' }).click();
  await page.getByLabel('Call outcome').selectOption('Quotation sent');
  await page.getByRole('button', { name: 'Save outcome' }).click();
  await expect(
    page.getByText('Your outcome “Quotation sent” is saved in this browser.'),
  ).toBeVisible();
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  await page.goto('/plan/recent');
  await page.getByRole('button', { name: /Ananya Sharma/ }).click();
  await expect(page.getByRole('heading', { name: 'Conversation review' })).toBeVisible();
});
test('calendar navigates months and highlights actual India date', async ({ page }) => {
  await page.goto('/calendar');
  await expect(page.getByRole('heading', { name: 'October 2026' })).toBeVisible();
  await page.screenshot({ path: 'docs/screenshots/calendar.png', fullPage: true });
  await page.getByRole('button', { name: 'Next month' }).click();
  await expect(page.getByRole('heading', { name: 'November 2026' })).toBeVisible();
  await page.getByRole('button', { name: 'Today', exact: true }).click();
  await expect(page.locator('.calendar-cell.today')).toHaveCount(1);
  await expect(page.locator('.calendar-cell.today')).toHaveAttribute('aria-pressed', 'true');
});
test('Pulse resolves pinned request and preserves sent messages', async ({ page }) => {
  await page.goto('/pulse');
  await expect(page.getByText('Kudos, Arvind! You’re making a difference.')).toBeVisible();
  await page.screenshot({ path: 'docs/screenshots/pulse.png', fullPage: true });
  await page.getByRole('textbox', { name: 'Search Pulse' }).fill('cross-sell');
  await expect(page.locator('.channel-tile')).toHaveCount(1);
  await page.goto('/pulse/callcentre-team');
  await expect(page.getByRole('button', { name: 'Confirmed', exact: true })).toBeVisible();
  await page.screenshot({ path: 'docs/screenshots/channel.png', fullPage: true });
  await page.getByRole('button', { name: 'Confirmed', exact: true }).click();
  await expect(page.getByText('Callback request answered.', { exact: false })).toBeVisible();
  await page
    .getByRole('textbox', { name: 'Message', exact: true })
    .fill('Ready for the next callback.');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByText('Ready for the next callback.')).toBeVisible();
  await page.reload();
  await expect(page.getByText('Ready for the next callback.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Confirmed', exact: true })).toHaveCount(0);
});
test('all routes fit phone width and mobile navigation works', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of [
    '/',
    '/plan/calls',
    '/plan/incoming',
    '/plan/recent',
    '/plan/practise',
    '/calendar',
    '/pulse',
    '/pulse/callcentre-team',
  ]) {
    await page.goto(route);
    await expect(page.locator('.skeleton')).toHaveCount(0);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
    ).toBe(true);
  }
  await page.goto('/');
  await page.getByRole('button', { name: 'Toggle navigation' }).click();
  await page.locator('.sidebar').getByRole('link', { name: 'Calendar', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Calendar', exact: true })).toBeVisible();
  await page.goto('/');
  await expect(page.getByText('Good afternoon, Arvind Rajan')).toBeVisible();
  await expect(page.locator('.recharts-wrapper')).toHaveCount(2);
  await page.screenshot({ path: 'docs/screenshots/mobile.png', fullPage: true });
});
