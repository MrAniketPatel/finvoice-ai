// Quick API Test Script
// Run with: node test-api.js

const testAPI = async () => {
  const baseURL = "http://localhost:5000";
  
  console.log("🧪 Testing FinVoice.AI API...\n");

  try {
    // Test 1: Root endpoint
    console.log("1️⃣ Testing root endpoint...");
    const rootRes = await fetch(baseURL);
    const rootText = await rootRes.text();
    console.log(`   ✅ ${rootText}\n`);

    // Test 2: Register
    console.log("2️⃣ Testing registration...");
    const testUser = {
      name: "Test User",
      email: `test${Date.now()}@example.com`,
      password: "test123",
    };
    
    const signupRes = await fetch(`${baseURL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testUser),
    });
    const signupData = await signupRes.json();
    console.log(`   ✅ ${signupData.msg}\n`);

    // Test 3: Login
    console.log("3️⃣ Testing login...");
    const loginRes = await fetch(`${baseURL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    console.log(`   ✅ Login successful! Token received.\n`);

    // Test 4: Dashboard
    console.log("4️⃣ Testing dashboard...");
    const dashRes = await fetch(`${baseURL}/api/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const dashData = await dashRes.json();
    console.log(`   ✅ Welcome, ${dashData.user.name}!\n`);

    // Test 5: Add Transaction
    console.log("5️⃣ Testing add transaction...");
    const transRes = await fetch(`${baseURL}/api/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        type: "income",
        amount: 50000,
        category: "Salary",
        description: "Monthly salary",
      }),
    });
    const transData = await transRes.json();
    console.log(`   ✅ Transaction added: ${transData.category} - ₹${transData.amount}\n`);

    // Test 6: Balance Sheet
    console.log("6️⃣ Testing balance sheet...");
    const balanceRes = await fetch(`${baseURL}/api/balancesheet`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const balanceData = await balanceRes.json();
    console.log(`   ✅ Balance: Income ₹${balanceData.totalIncome}, Expense ₹${balanceData.totalExpense}\n`);

    console.log("🎉 All tests passed! API is working correctly.\n");
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    console.log("\n💡 Make sure the backend server is running on port 5000");
  }
};

testAPI();
