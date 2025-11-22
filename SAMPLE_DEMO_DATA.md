# Sample Demo Data

Use this data to quickly populate your demo for a realistic presentation.

## User Profile

**Name**: Alex Johnson
**Email**: alex.demo@finvoice.ai
**Password**: Demo@123
**Occupation**: Freelancer
**Company**: AJ Digital Solutions
**Started Year**: 2022

## Sample Transactions

### Income Entries
1. **Freelance Project - Website Design**
   - Amount: ₹45,000
   - Category: Freelance Income
   - Description: Client website redesign project

2. **Freelance Project - Logo Design**
   - Amount: ₹15,000
   - Category: Freelance Income
   - Description: Brand identity design for startup

3. **Consulting Fee**
   - Amount: ₹25,000
   - Category: Consulting
   - Description: Digital marketing consultation

4. **Part-time Teaching**
   - Amount: ₹12,000
   - Category: Teaching
   - Description: Online web development course

### Expense Entries
1. **Office Rent**
   - Amount: ₹18,000
   - Category: Rent
   - Description: Monthly co-working space

2. **Groceries**
   - Amount: ₹8,500
   - Category: Food
   - Description: Monthly grocery shopping

3. **Internet & Phone**
   - Amount: ₹2,500
   - Category: Utilities
   - Description: Broadband and mobile bills

4. **Software Subscriptions**
   - Amount: ₹3,200
   - Category: Business Tools
   - Description: Adobe CC, Figma, hosting

5. **Transportation**
   - Amount: ₹4,000
   - Category: Transport
   - Description: Fuel and maintenance

6. **Client Meeting**
   - Amount: ₹1,800
   - Category: Business Expense
   - Description: Lunch meeting with client

7. **Equipment**
   - Amount: ₹12,000
   - Category: Business Investment
   - Description: New wireless mouse and keyboard

8. **Health Insurance**
   - Amount: ₹5,000
   - Category: Insurance
   - Description: Monthly health insurance premium

## Sample Payment Alerts

### Pending Alerts
1. **Office Rent Payment**
   - Amount: ₹18,000
   - Category: Rent
   - Due Date: [Set to 5 days from today]

2. **Credit Card Bill**
   - Amount: ₹15,500
   - Category: Credit Card
   - Due Date: [Set to 10 days from today]

3. **Software Renewal**
   - Amount: ₹3,200
   - Category: Subscription
   - Due Date: [Set to 15 days from today]

4. **Insurance Premium**
   - Amount: ₹5,000
   - Category: Insurance
   - Due Date: [Set to 20 days from today]

5. **Electricity Bill**
   - Amount: ₹2,800
   - Category: Utilities
   - Due Date: [Set to 7 days from today]

### Already Paid (for history)
1. **Last Month Rent**
   - Amount: ₹18,000
   - Category: Rent
   - Status: Paid

2. **Previous Credit Card Bill**
   - Amount: ₹14,200
   - Category: Credit Card
   - Status: Paid

## Expected Results After Adding All Data

**Total Income**: ₹97,000
**Total Expense**: ₹55,000
**Balance/Profit**: ₹42,000

## Demo Flow with This Data

### Step 1: Registration & Login
- Register with the profile details above
- Login successfully

### Step 2: Start with Empty Dashboard
- Show clean slate
- Explain what each section will show

### Step 3: Add Income Transactions
- Add all 4 income entries
- Show how dashboard updates in real-time
- Highlight the total income stat

### Step 4: Add Expense Transactions
- Add all 8 expense entries
- Show profit calculation
- Demonstrate different categories

### Step 5: Explore Balance Sheet
- Show all transactions
- Filter by different time periods
- Demonstrate delete functionality (delete one, then re-add it)

### Step 6: Create Payment Alerts
- Add all 5 pending alerts
- Show them appearing on dashboard
- Mark one as paid
- Show paid history

### Step 7: Update Profile
- Fill in all profile fields
- Save and show success message

### Step 8: Final Dashboard View
- Show complete overview
- Highlight all features working together
- Emphasize the value proposition

## Quick Setup Script

If you want to quickly populate data via API (advanced):

```javascript
// Run this in browser console after logging in
const token = localStorage.getItem('token');
const baseURL = 'http://localhost:5000/api';

// Add transactions
const transactions = [
  { type: 'income', amount: 45000, category: 'Freelance Income', description: 'Website design project' },
  { type: 'income', amount: 15000, category: 'Freelance Income', description: 'Logo design' },
  { type: 'expense', amount: 18000, category: 'Rent', description: 'Office rent' },
  { type: 'expense', amount: 8500, category: 'Food', description: 'Groceries' },
];

transactions.forEach(async (t) => {
  await fetch(`${baseURL}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(t)
  });
});

console.log('Demo data added!');
```

## Storytelling Tips

When adding this data during demo:

1. **Make it relatable**: "Let's say I'm a freelancer named Alex..."
2. **Explain the scenario**: "I just completed a website project for ₹45,000..."
3. **Show real-world use**: "Now I need to track my monthly expenses..."
4. **Highlight insights**: "Look, I made ₹97,000 but spent ₹55,000, so my profit is ₹42,000"
5. **Demonstrate value**: "Without this app, I'd be using spreadsheets or losing track"

## Alternative Scenarios

### For Students
- Income: Allowance, Part-time job, Scholarship
- Expenses: Books, Food, Transport, Entertainment
- Alerts: Tuition fee, Hostel rent, Phone bill

### For Employees
- Income: Salary, Bonus, Side hustle
- Expenses: Rent, EMI, Groceries, Utilities
- Alerts: Loan EMI, Credit card, Insurance

### For Business Owners
- Income: Sales, Consulting, Investments
- Expenses: Salaries, Rent, Marketing, Inventory
- Alerts: Tax payment, Vendor payments, License renewal

Choose the scenario that best fits your audience!
