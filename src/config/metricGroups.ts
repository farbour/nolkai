export const metricGroups = {
  performance: {
    name: 'Performance',
    metrics: [
      'TACOS',
      'ACOS',
      'Conversion Rate',
      'Repeat Rate',
      '% Cross-Sell Customers',
    ],
  },
  revenue: {
    name: 'Revenue',
    metrics: [
      'Gross Revenue',
      'Net Revenue',
      'D2C Net Revenue',
      'D2C Contribution Margin',
      'Gross Margin',
      'Contribution Margin',
    ],
  },
  customer: {
    name: 'Customer Metrics',
    metrics: [
      'LTV',
      'Brand LTV',
      'CAC',
      'LTV:TCAC',
      'D2C Net AOV',
      'D2C Gross AOV',
    ],
  },
  email: {
    name: 'Email Metrics',
    metrics: [
      'Email Click Rate',
      'Email Click Through Rate',
      'Email Open Rate',
      'Email AOV',
      'Email Gross Revenue',
    ],
  },
  operations: {
    name: 'Operations',
    metrics: [
      'Landed Cost',
      'Transaction Fees',
      'Fulfillment Fees',
      'Sales Orders',
      'Returned Orders',
    ],
  },
  support: {
    name: 'Customer Support',
    metrics: [
      'Contact Rate',
      'CSAT Score',
      'AVG Response Time (hrs)',
      'Time to Close (hrs)',
    ],
  },
};

export type MetricGroupKey = keyof typeof metricGroups;