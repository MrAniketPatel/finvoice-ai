// Parse voice input for transactions
export const parseTransactionVoice = (text) => {
  const lowerText = text.toLowerCase();
  
  // Detect type (income or expense)
  let type = 'expense'; // default
  if (lowerText.includes('income') || lowerText.includes('earned') || 
      lowerText.includes('received') || lowerText.includes('salary') ||
      lowerText.includes('payment received')) {
    type = 'income';
  }

  // Extract amount
  let amount = '';
  const amountPatterns = [
    /(\d+)\s*rupees?/i,
    /rs\.?\s*(\d+)/i,
    /₹\s*(\d+)/,
    /(\d+)\s*rs/i,
    /(\d{3,})/  // Any 3+ digit number
  ];

  for (const pattern of amountPatterns) {
    const match = text.match(pattern);
    if (match) {
      amount = match[1];
      break;
    }
  }

  // Extract category
  let category = '';
  const categories = {
    food: ['food', 'lunch', 'dinner', 'breakfast', 'restaurant', 'groceries', 'grocery'],
    rent: ['rent', 'house rent', 'office rent'],
    transport: ['transport', 'taxi', 'uber', 'ola', 'petrol', 'fuel', 'bus', 'train'],
    utilities: ['electricity', 'water', 'internet', 'phone', 'mobile', 'bill'],
    salary: ['salary', 'income', 'wage'],
    freelance: ['freelance', 'project', 'client work'],
    shopping: ['shopping', 'clothes', 'amazon', 'flipkart'],
    entertainment: ['movie', 'entertainment', 'game', 'netflix'],
    health: ['medicine', 'doctor', 'hospital', 'health'],
    education: ['education', 'course', 'book', 'tuition']
  };

  for (const [cat, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      category = cat.charAt(0).toUpperCase() + cat.slice(1);
      break;
    }
  }

  // If no category found, use a generic one
  if (!category) {
    category = type === 'income' ? 'Income' : 'Expense';
  }

  // Extract description (use original text, cleaned up)
  const description = text.replace(/rupees?|rs\.?|₹/gi, '').trim();

  return {
    type,
    amount,
    category,
    description: description.substring(0, 100) // Limit length
  };
};

// Parse voice input for alerts
export const parseAlertVoice = (text) => {
  const lowerText = text.toLowerCase();
  
  // Extract amount
  let amount = '';
  const amountPatterns = [
    /(\d+)\s*rupees?/i,
    /rs\.?\s*(\d+)/i,
    /₹\s*(\d+)/,
    /(\d+)\s*rs/i,
    /(\d{3,})/
  ];

  for (const pattern of amountPatterns) {
    const match = text.match(pattern);
    if (match) {
      amount = match[1];
      break;
    }
  }

  // Extract title/category
  let title = '';
  let category = '';
  
  const alertCategories = {
    rent: ['rent', 'house rent', 'office rent'],
    loan: ['loan', 'emi', 'installment'],
    'credit card': ['credit card', 'card payment', 'card bill'],
    utilities: ['electricity', 'water', 'internet', 'phone bill'],
    insurance: ['insurance', 'premium'],
    subscription: ['subscription', 'netflix', 'spotify', 'amazon prime']
  };

  for (const [cat, keywords] of Object.entries(alertCategories)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      category = cat.charAt(0).toUpperCase() + cat.slice(1);
      title = `${category} Payment`;
      break;
    }
  }

  if (!title) {
    title = text.substring(0, 50);
    category = 'Payment';
  }

  // Extract due date (simple patterns)
  let dueDate = '';
  const today = new Date();
  
  if (lowerText.includes('today')) {
    dueDate = today.toISOString().split('T')[0];
  } else if (lowerText.includes('tomorrow')) {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    dueDate = tomorrow.toISOString().split('T')[0];
  } else if (lowerText.includes('next week')) {
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    dueDate = nextWeek.toISOString().split('T')[0];
  } else if (lowerText.includes('next month')) {
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    dueDate = nextMonth.toISOString().split('T')[0];
  } else {
    // Default to 7 days from now
    const defaultDate = new Date(today);
    defaultDate.setDate(defaultDate.getDate() + 7);
    dueDate = defaultDate.toISOString().split('T')[0];
  }

  return {
    title,
    amount,
    category,
    dueDate
  };
};
