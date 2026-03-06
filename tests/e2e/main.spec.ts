import { test, expect } from '@playwright/test';

test.describe('Invoice Generation', () => {
    test('User can generate an invoice using a customizable template', async ({ page }) => {
        await page.goto('http://localhost:3000/invoices');
        await page.selectOption('select#templateSelect', 'template1');
        await page.fill('input#clientName', 'John Doe');
        await page.fill('input#jobDetails', 'Electrical Wiring');
        await page.fill('input#expenseAmount', '150.00');
        await page.click('button#generateInvoice');
        await expect(page.locator('text=Invoice generated successfully')).toBeVisible();
        await page.click('button#downloadPDF');
        await expect(page).toHaveURL(/.*\.pdf/);
    });
});

test.describe('Schedule Reminders', () => {
    test('User can set up reminders for jobs and appointments', async ({ page }) => {
        await page.goto('http://localhost:3000/schedule');
        await page.fill('input#jobName', 'Install Ceiling Light');
        await page.fill('input#appointmentDate', '2023-10-30T10:00');
        await page.check('input#reminderToggle');
        await page.click('button#setReminder');
        await expect(page.locator('text=Reminder set successfully')).toBeVisible();
    });
});

test.describe('Expense Tracking', () => {
    test('User can track expenses with simple categorization', async ({ page }) => {
        await page.goto('http://localhost:3000/expenses');
        await page.fill('input#expenseDate', '2023-10-01');
        await page.fill('input#expenseAmount', '200.00');
        await page.selectOption('select#expenseCategory', 'Materials');
        await page.click('button#addExpense');
        await expect(page.locator('text=Expense added successfully')).toBeVisible();
        await page.click('button#generateReport');
        await expect(page).toHaveURL(/.*\.csv/);
    });
});

test.describe('Client Communication Automation', () => {
    test('User can customize email templates for quotes and follow-ups', async ({ page }) => {
        await page.goto('http://localhost:3000/settings');
        await page.fill('textarea#quoteTemplate', 'Dear {clientName}, here is your quote...');
        await page.click('button#saveTemplate');
        await expect(page.locator('text=Template saved successfully')).toBeVisible();
        await page.click('button#sendAutomatedEmail');
        await expect(page.locator('text=Email sent successfully')).toBeVisible();
    });
});

test.describe('Payment Integration', () => {
    test('User can integrate payments via Stripe', async ({ page }) => {
        await page.goto('http://localhost:3000/settings');
        await page.fill('input#stripeAccount', 'test_stripe_account');
        await page.click('button#connectStripe');
        await expect(page.locator('text=Stripe account connected successfully')).toBeVisible();

        await page.goto('http://localhost:3000/invoices');
        await page.click('button#payNow');
        await expect(page.locator('text=Payment successful')).toBeVisible();
    });
});

test.describe('User Authentication', () => {
    test('User can sign up, log in securely, and reset password', async ({ page }) => {
        await page.goto('http://localhost:3000/signup');
        await page.fill('input#email', 'test@example.com');
        await page.fill('input#password', 'securepassword');
        await page.click('button#signup');
        await expect(page.locator('text=Account created successfully')).toBeVisible();

        await page.goto('http://localhost:3000/login');
        await page.fill('input#email', 'test@example.com');
        await page.fill('input#password', 'securepassword');
        await page.click('button#login');
        await expect(page.locator('text=Welcome')).toBeVisible();

        await page.click('link#logout');
        await expect(page.locator('text=Logged out successfully')).toBeVisible();

        await page.goto('http://localhost:3000/reset-password');
        await page.fill('input#email', 'test@example.com');
        await page.click('button#sendRecoveryEmail');
        await expect(page.locator('text=Recovery email sent')).toBeVisible();
    });
});