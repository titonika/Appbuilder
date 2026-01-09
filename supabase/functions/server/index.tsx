import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-96e43c16/health", (c) => {
  return c.json({ status: "ok" });
});

// Export data to Google Sheets
app.post("/make-server-96e43c16/export-to-sheets", async (c) => {
  try {
    const { accessToken, spreadsheetId, data } = await c.req.json();

    if (!accessToken || !spreadsheetId || !data) {
      console.log("Export error: Missing required parameters");
      return c.json({ 
        success: false,
        error: "Missing required parameters: accessToken, spreadsheetId, or data" 
      }, 400);
    }

    // Prepare data for Google Sheets
    const sheetData = [];
    
    // Add header
    sheetData.push([
      "Месяц",
      "Тип",
      "Валюта",
      "Категория",
      "Сумма",
      "Описание",
      "Дата",
    ]);

    // Add transaction data
    let transactionCount = 0;
    Object.entries(data.monthHistory).forEach(([month, monthData]: [string, any]) => {
      monthData.transactions.forEach((transaction: any) => {
        sheetData.push([
          month,
          transaction.type,
          transaction.currency,
          transaction.category,
          transaction.amount,
          transaction.description,
          new Date(transaction.date).toLocaleDateString(),
        ]);
        transactionCount++;
      });
    });

    // Add balances sheet data
    const balancesData = [["Месяц", "USD", "EUR", "CRYPTO"]];
    Object.entries(data.monthHistory).forEach(([month, monthData]: [string, any]) => {
      balancesData.push([
        month,
        monthData.currencyBalances.usd,
        monthData.currencyBalances.eur,
        monthData.currencyBalances.crypto,
      ]);
    });

    // Update transactions sheet
    const transactionsResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Transactions!A1:G${sheetData.length}?valueInputOption=RAW`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: sheetData,
        }),
      }
    );

    if (!transactionsResponse.ok) {
      const error = await transactionsResponse.text();
      console.log("Transactions sheet update error:", error);
      return c.json({ 
        success: false,
        error: `Failed to update Transactions sheet. Check: 1) Access token is valid 2) Sheet has 'Transactions' tab 3) You have edit permissions. Error: ${error}` 
      }, 500);
    }

    // Update balances sheet
    const balancesResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Balances!A1:D${balancesData.length}?valueInputOption=RAW`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: balancesData,
        }),
      }
    );

    if (!balancesResponse.ok) {
      const error = await balancesResponse.text();
      console.log("Balances sheet update error:", error);
      return c.json({ 
        success: false,
        error: `Failed to update Balances sheet. Check: 1) Sheet has 'Balances' tab 2) You have edit permissions. Error: ${error}` 
      }, 500);
    }

    console.log(`Export successful: ${transactionCount} transactions, ${balancesData.length - 1} months`);
    return c.json({ 
      success: true, 
      message: "Data exported successfully",
      transactionsCount: transactionCount,
      monthsCount: balancesData.length - 1,
    });
  } catch (error) {
    console.log("Export error:", error);
    return c.json({ 
      success: false,
      error: `Export failed: ${error.message}` 
    }, 500);
  }
});

// Import data from Google Sheets
app.post("/make-server-96e43c16/import-from-sheets", async (c) => {
  try {
    const { accessToken, spreadsheetId } = await c.req.json();

    if (!accessToken || !spreadsheetId) {
      console.log("Import error: Missing required parameters");
      return c.json({ 
        success: false,
        error: "Missing required parameters: accessToken or spreadsheetId" 
      }, 400);
    }

    // Fetch transactions data
    const transactionsResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Transactions!A2:G`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!transactionsResponse.ok) {
      const error = await transactionsResponse.text();
      console.log("Transactions fetch error:", error);
      return c.json({ 
        success: false,
        error: `Failed to fetch Transactions sheet. Check: 1) Access token is valid 2) Sheet has 'Transactions' tab. Error: ${error}` 
      }, 500);
    }

    const transactionsData = await transactionsResponse.json();

    // Fetch balances data
    const balancesResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Balances!A2:D`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!balancesResponse.ok) {
      const error = await balancesResponse.text();
      console.log("Balances fetch error:", error);
      return c.json({ 
        success: false,
        error: `Failed to fetch Balances sheet. Check: Sheet has 'Balances' tab. Error: ${error}` 
      }, 500);
    }

    const balancesData = await balancesResponse.json();

    // Process the data
    const monthHistory: any = {};

    // Process balances
    if (balancesData.values) {
      balancesData.values.forEach((row: any[]) => {
        const [month, usd, eur, crypto] = row;
        if (!monthHistory[month]) {
          monthHistory[month] = {
            transactions: [],
            currencyBalances: { usd: 0, eur: 0, crypto: 0 },
            currencyNotes: { usd: [], eur: [], crypto: [] },
          };
        }
        monthHistory[month].currencyBalances = {
          usd: parseFloat(usd) || 0,
          eur: parseFloat(eur) || 0,
          crypto: parseFloat(crypto) || 0,
        };
      });
    }

    // Process transactions
    if (transactionsData.values) {
      transactionsData.values.forEach((row: any[], index: number) => {
        const [month, type, currency, category, amount, description, dateStr] = row;
        if (!monthHistory[month]) {
          monthHistory[month] = {
            transactions: [],
            currencyBalances: { usd: 0, eur: 0, crypto: 0 },
            currencyNotes: { usd: [], eur: [], crypto: [] },
          };
        }
        monthHistory[month].transactions.push({
          id: `imported-${Date.now()}-${index}`,
          type,
          currency,
          category,
          amount: parseFloat(amount) || 0,
          description,
          date: new Date(dateStr).toISOString(),
        });
      });
    }

    console.log(`Import successful: ${Object.keys(monthHistory).length} months`);
    return c.json({
      success: true,
      message: "Data imported successfully",
      monthHistory,
    });
  } catch (error) {
    console.log("Import error:", error);
    return c.json({ 
      success: false,
      error: `Import failed: ${error.message}` 
    }, 500);
  }
});

Deno.serve(app.fetch);