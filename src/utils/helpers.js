import { format, differenceInDays, isAfter, isBefore, addDays } from 'date-fns';

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date) => {
  if (!date) return 'N/A';
  return format(new Date(date), 'dd MMM yyyy');
};

export const getLoanStatus = (loan) => {
  if (loan.status === 'paid') return 'paid';
  const today = new Date();
  const dueDate = new Date(loan.dueDate);
  if (isAfter(today, dueDate)) return 'overdue';
  if (isBefore(today, dueDate) && differenceInDays(dueDate, today) <= 7) return 'due-soon';
  return 'active';
};

export const getStatusColor = (status) => {
  const colors = {
    paid: 'green',
    overdue: 'red',
    'due-soon': 'yellow',
    active: 'blue',
    pending: 'gray',
    accepted: 'green',
    rejected: 'red',
  };
  return colors[status] || 'gray';
};

export const getRiskLevel = (borrowerStats) => {
  if (!borrowerStats) return 'low';
  const { overdueCount, totalLoans, confirmationRate, avgDelayDays } = borrowerStats;
  
  if (overdueCount > 2 || confirmationRate < 0.5 || avgDelayDays > 60) {
    return 'high';
  }
  if (overdueCount > 0 || confirmationRate < 0.8 || avgDelayDays > 30) {
    return 'medium';
  }
  return 'low';
};

export const getRiskColor = (risk) => {
  const colors = {
    low: 'green',
    medium: 'yellow',
    high: 'red',
  };
  return colors[risk] || 'gray';
};

export const calculateBorrowerStats = (loans) => {
  if (!loans || loans.length === 0) {
    return {
      totalBorrowed: 0,
      totalRepaid: 0,
      outstanding: 0,
      numberOfLoans: 0,
      overdueCount: 0,
      confirmationRate: 0,
      avgDelayDays: 0,
    };
  }

  let totalBorrowed = 0;
  let totalRepaid = 0;
  let overdueCount = 0;
  let confirmedCount = 0;
  let totalDelayDays = 0;
  let delayCount = 0;

  loans.forEach(loan => {
    totalBorrowed += loan.amount;
    if (loan.status === 'paid') {
      totalRepaid += loan.amount;
    }
    
    const status = getLoanStatus(loan);
    if (status === 'overdue') {
      overdueCount++;
    }
    
    if (loan.confirmationStatus === 'accepted') {
      confirmedCount++;
    }
    
    if (loan.status === 'paid' && loan.repaidAt) {
      const dueDate = new Date(loan.dueDate);
      const repaidDate = new Date(loan.repaidAt);
      if (isAfter(repaidDate, dueDate)) {
        const delay = differenceInDays(repaidDate, dueDate);
        totalDelayDays += delay;
        delayCount++;
      }
    }
  });

  const outstanding = totalBorrowed - totalRepaid;
  const confirmationRate = loans.length > 0 ? confirmedCount / loans.length : 0;
  const avgDelayDays = delayCount > 0 ? totalDelayDays / delayCount : 0;

  return {
    totalBorrowed,
    totalRepaid,
    outstanding,
    numberOfLoans: loans.length,
    overdueCount,
    confirmationRate,
    avgDelayDays,
  };
};

export const generateWhatsAppLink = (phone, message) => {
  // Remove any non-digit characters from phone
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

export const generateConfirmationMessage = (borrowerName, amount, date) => {
  return `Dear ${borrowerName}, you have been recorded as borrowing ${formatCurrency(amount)} on ${formatDate(date)}. Please reply "YES" to confirm this loan.`;
};

export const generateReminderMessage = (loan, daysOverdue = 0) => {
  const borrower = loan.borrowerName;
  const amount = formatCurrency(loan.amount);
  const dueDate = formatDate(loan.dueDate);
  
  if (daysOverdue > 0) {
    return `REMINDER: Loan of ${amount} to ${borrower} is overdue by ${daysOverdue} days. Due date was ${dueDate}. Please arrange repayment at earliest.`;
  }
  
  return `REMINDER: Loan of ${amount} to ${borrower} is due on ${dueDate}. Kindly repay by the due date.`;
};

export const calculateDashboardMetrics = (loans) => {
  let totalLent = 0;
  let totalOutstanding = 0;
  let overdueLoans = 0;
  let paidLoans = 0;

  loans.forEach(loan => {
    totalLent += loan.amount;
    if (loan.status === 'paid') {
      paidLoans++;
      totalOutstanding += 0;
    } else {
      totalOutstanding += loan.amount;
    }
    
    if (getLoanStatus(loan) === 'overdue') {
      overdueLoans++;
    }
  });

  const repaymentRate = totalLent > 0 ? (totalLent - totalOutstanding) / totalLent : 0;

  return {
    totalLent,
    totalOutstanding,
    overdueLoans,
    paidLoans,
    repaymentRate,
    activeLoans: loans.length - paidLoans,
  };
};