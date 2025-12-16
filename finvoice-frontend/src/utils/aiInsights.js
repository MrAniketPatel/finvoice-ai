// AI-powered financial insights and predictions

// Format number in Indian currency style (₹1,00,000)
const formatIndianCurrency = (amount) => {
  const num = Math.round(amount);
  return num.toLocaleString('en-IN');
};

export const generateInsights = (transactions) => {
  if (!transactions || transactions.length === 0) {
    return {
      insights: [],
      predictions: [],
      recommendations: [],
    };
  }

  const insights = [];
  const predictions = [];
  const recommendations = [];

  // Calculate spending patterns
  const expenses = transactions.filter((t) => t.type === "expense");
  const income = transactions.filter((t) => t.type === "income");

  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);

  // Group by category
  const categorySpending = {};
  expenses.forEach((t) => {
    const cat = t.category || "Other";
    categorySpending[cat] = (categorySpending[cat] || 0) + t.amount;
  });

  // Find highest spending category
  const topCategory = Object.entries(categorySpending).sort(
    ([, a], [, b]) => b - a
  )[0];

  // INSIGHT 1: Spending Pattern
  if (topCategory) {
    const percentage = ((topCategory[1] / totalExpense) * 100).toFixed(1);
    insights.push({
      icon: "Analytics",
      title: "Top Spending Category",
      message: `${topCategory[0]} accounts for ${percentage}% of your expenses (₹${formatIndianCurrency(topCategory[1])})`,
      type: "info",
    });
  }

  // INSIGHT 2: Savings Rate
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
  if (savingsRate > 0) {
    insights.push({
      icon: savingsRate > 20 ? "Success" : "Savings",
      title: savingsRate > 20 ? "Excellent Savings Rate" : "Savings Tracker",
      message: `You're saving ${savingsRate.toFixed(1)}% of your income. ${
        savingsRate > 20 ? "Keep it up!" : "Try to reach 20%!"
      }`,
      type: savingsRate > 20 ? "success" : "warning",
    });
  } else if (savingsRate < 0) {
    insights.push({
      icon: "Warning",
      title: "Spending Alert",
      message: `You're spending ${Math.abs(savingsRate).toFixed(1)}% more than you earn. Consider reducing expenses.`,
      type: "danger",
    });
  }

  // INSIGHT 3: Unusual Spending
  if (expenses.length > 3) {
    const amounts = expenses.map((t) => t.amount);
    const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const unusualExpenses = expenses.filter((t) => t.amount > avg * 2);

    if (unusualExpenses.length > 0) {
      insights.push({
        icon: "Search",
        title: "Unusual Expenses Detected",
        message: `${unusualExpenses.length} expense${
          unusualExpenses.length > 1 ? "s" : ""
        } significantly higher than your average (₹${formatIndianCurrency(avg)})`,
        type: "info",
      });
    }
  }

  // PREDICTION 1: Next Month Spending (based on current total)
  if (expenses.length > 0) {
    // Use total expenses, not average * 30
    const predictedSpending = totalExpense;
    predictions.push({
      icon: "Forecast",
      title: "Current Month Spending",
      message: `You've spent ₹${formatIndianCurrency(predictedSpending)} so far this month`,
      confidence: expenses.length > 5 ? "High" : "Medium",
    });
  }

  // PREDICTION 2: Savings Forecast (based on actual totals)
  if (totalIncome > 0 && expenses.length > 0) {
    const currentSavings = totalIncome - totalExpense;
    const savingsRate = (currentSavings / totalIncome) * 100;
    
    predictions.push({
      icon: currentSavings > 0 ? "TrendUp" : "TrendDown",
      title: "Current Savings",
      message: `You've ${
        currentSavings > 0 ? "saved" : "overspent by"
      } ₹${formatIndianCurrency(Math.abs(currentSavings))} (${Math.abs(savingsRate).toFixed(1)}% of income)`,
      confidence: "High",
    });
  }

  // RECOMMENDATION 1: Budget Allocation
  if (totalIncome > 0) {
    const recommended = {
      needs: totalIncome * 0.5,
      wants: totalIncome * 0.3,
      savings: totalIncome * 0.2,
    };

    recommendations.push({
      icon: "Lightbulb",
      title: "50/30/20 Budget Rule",
      message: `Needs: ₹${formatIndianCurrency(recommended.needs)} | Wants: ₹${formatIndianCurrency(recommended.wants)} | Savings: ₹${formatIndianCurrency(recommended.savings)}`,
      action: "Apply Budget",
    });
  }

  // RECOMMENDATION 2: Category-specific advice
  if (topCategory && topCategory[1] > totalIncome * 0.4) {
    recommendations.push({
      icon: "Optimize",
      title: "Reduce High Spending",
      message: `Your ${topCategory[0]} spending is high. Try reducing by 10% to save ₹${formatIndianCurrency(topCategory[1] * 0.1)}/month`,
      action: "Set Goal",
    });
  }

  // RECOMMENDATION 3: Emergency Fund
  const emergencyFund = totalIncome * 6; // 6 months of income
  const currentSavings = totalIncome - totalExpense;
  if (currentSavings < emergencyFund) {
    recommendations.push({
      icon: "Shield",
      title: "Build Emergency Fund",
      message: `Aim for ₹${formatIndianCurrency(emergencyFund)} (6 months of income). You're ${((currentSavings / emergencyFund) * 100).toFixed(0)}% there.`,
      action: "Learn More",
    });
  }

  return {
    insights,
    predictions,
    recommendations,
  };
};

// Smart category suggestion based on description
export const suggestCategory = (description) => {
  const desc = description.toLowerCase();

  const categoryKeywords = {
    Food: ["food", "restaurant", "lunch", "dinner", "breakfast", "cafe", "pizza", "burger"],
    Transport: ["uber", "taxi", "bus", "train", "metro", "fuel", "petrol", "gas"],
    Shopping: ["shopping", "clothes", "amazon", "flipkart", "mall", "store"],
    Bills: ["electricity", "water", "internet", "phone", "mobile", "bill"],
    Entertainment: ["movie", "netflix", "spotify", "game", "concert", "party"],
    Health: ["doctor", "medicine", "hospital", "pharmacy", "gym", "fitness"],
    Education: ["course", "book", "tuition", "class", "school", "college"],
    Rent: ["rent", "lease", "housing"],
    Salary: ["salary", "income", "payment", "earned"],
  };

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((keyword) => desc.includes(keyword))) {
      return category;
    }
  }

  return "Other";
};

// Spending trend analysis
export const analyzeTrend = (transactions, days = 7) => {
  const now = new Date();
  const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const recentExpenses = transactions.filter(
    (t) => t.type === "expense" && new Date(t.date) > cutoff
  );

  const previousExpenses = transactions.filter(
    (t) =>
      t.type === "expense" &&
      new Date(t.date) <= cutoff &&
      new Date(t.date) > new Date(cutoff.getTime() - days * 24 * 60 * 60 * 1000)
  );

  const recentTotal = recentExpenses.reduce((sum, t) => sum + t.amount, 0);
  const previousTotal = previousExpenses.reduce((sum, t) => sum + t.amount, 0);

  if (previousTotal === 0) return { trend: "neutral", change: 0 };

  const change = ((recentTotal - previousTotal) / previousTotal) * 100;

  return {
    trend: change > 10 ? "increasing" : change < -10 ? "decreasing" : "stable",
    change: change.toFixed(1),
    message:
      change > 10
        ? `Spending up ${change.toFixed(1)}% compared to last ${days} days`
        : change < -10
        ? `Spending down ${Math.abs(change).toFixed(1)}% - Great job!`
        : `Spending is stable`,
  };
};
