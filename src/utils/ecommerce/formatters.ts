// file path: src/utils/ecommerce/formatters.ts

export const valueFormatter = (value: number) => `${value.toFixed(1)}%`;
export const currencyFormatter = (value: number) => `$${value}`;
export const trillionFormatter = (value: number) => `$${value.toFixed(2)}T`;
export const billionFormatter = (value: number) => `$${value}B`;

export const formatters = {
  value: valueFormatter,
  currency: currencyFormatter,
  trillion: trillionFormatter,
  billion: billionFormatter,
} as const;