import { CurrencyConfig } from '../types';

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  {
    code: 'NGN',
    name: 'Nigerian Naira',
    symbol: '₦',
    rate: 1550, // 1 USD ~ 1,550 NGN
    flag: '🇳🇬',
    symbolPosition: 'prefix',
    decimalPlaces: 0,
  },
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    rate: 1.0,
    flag: '🇺🇸',
    symbolPosition: 'prefix',
    decimalPlaces: 2,
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    rate: 0.92,
    flag: '🇪🇺',
    symbolPosition: 'prefix',
    decimalPlaces: 2,
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    rate: 0.79,
    flag: '🇬🇧',
    symbolPosition: 'prefix',
    decimalPlaces: 2,
  },
  {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'CA$',
    rate: 1.36,
    flag: '🇨🇦',
    symbolPosition: 'prefix',
    decimalPlaces: 2,
  },
  {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
    rate: 1.52,
    flag: '🇦🇺',
    symbolPosition: 'prefix',
    decimalPlaces: 2,
  },
  {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    rate: 83.8,
    flag: '🇮🇳',
    symbolPosition: 'prefix',
    decimalPlaces: 0,
  },
  {
    code: 'ZAR',
    name: 'South African Rand',
    symbol: 'R',
    rate: 18.2,
    flag: '🇿🇦',
    symbolPosition: 'prefix',
    decimalPlaces: 2,
  },
  {
    code: 'KES',
    name: 'Kenyan Shilling',
    symbol: 'KSh',
    rate: 129.5,
    flag: '🇰🇪',
    symbolPosition: 'prefix',
    decimalPlaces: 0,
  },
  {
    code: 'GHS',
    name: 'Ghanaian Cedi',
    symbol: 'GH₵',
    rate: 15.6,
    flag: '🇬🇭',
    symbolPosition: 'prefix',
    decimalPlaces: 2,
  },
  {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'AED ',
    rate: 3.67,
    flag: '🇦🇪',
    symbolPosition: 'prefix',
    decimalPlaces: 2,
  },
  {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    rate: 154.5,
    flag: '🇯🇵',
    symbolPosition: 'prefix',
    decimalPlaces: 0,
  },
  {
    code: 'CNY',
    name: 'Chinese Yuan',
    symbol: '¥',
    rate: 7.24,
    flag: '🇨🇳',
    symbolPosition: 'prefix',
    decimalPlaces: 2,
  },
  {
    code: 'BRL',
    name: 'Brazilian Real',
    symbol: 'R$',
    rate: 5.48,
    flag: '🇧🇷',
    symbolPosition: 'prefix',
    decimalPlaces: 2,
  },
  {
    code: 'PHP',
    name: 'Philippine Peso',
    symbol: '₱',
    rate: 58.6,
    flag: '🇵🇭',
    symbolPosition: 'prefix',
    decimalPlaces: 0,
  },
  {
    code: 'EGP',
    name: 'Egyptian Pound',
    symbol: 'E£',
    rate: 48.5,
    flag: '🇪🇬',
    symbolPosition: 'prefix',
    decimalPlaces: 2,
  },
];

export const DEFAULT_CURRENCY = SUPPORTED_CURRENCIES[0]; // Naira or USD (defaulting to NGN or USD based on user preference)

/**
 * Converts a base USD amount into the target currency using the given exchange rate.
 */
export function convertUsd(amountUsd: number, currency: CurrencyConfig): number {
  return amountUsd * currency.rate;
}

/**
 * Converts from target currency amount back to base USD using exchange rate.
 */
export function convertToUsd(amountInCurrency: number, currency: CurrencyConfig): number {
  return currency.rate > 0 ? amountInCurrency / currency.rate : amountInCurrency;
}

/**
 * Formats a base USD amount into the target currency with proper symbol, commas, and decimals.
 */
export function formatCurrency(
  amountUsd: number,
  currency: CurrencyConfig,
  options?: { compact?: boolean; hideSymbol?: boolean }
): string {
  const converted = convertUsd(amountUsd, currency);
  const decimals = currency.decimalPlaces ?? (currency.rate > 20 ? 0 : 2);

  let formattedNumber = '';
  if (options?.compact && Math.abs(converted) >= 1_000_000) {
    formattedNumber = (converted / 1_000_000).toFixed(1) + 'M';
  } else if (options?.compact && Math.abs(converted) >= 10_000 && currency.rate > 20) {
    formattedNumber = (converted / 1_000).toFixed(0) + 'k';
  } else {
    formattedNumber = converted.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  if (options?.hideSymbol) {
    return formattedNumber;
  }

  if (currency.symbolPosition === 'suffix') {
    return `${formattedNumber} ${currency.symbol}`;
  }

  return `${currency.symbol}${formattedNumber}`;
}
