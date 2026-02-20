const RATES_FROM_USD = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    INR: 83.1,
    CAD: 1.36,
    AUD: 1.52,
    SGD: 1.35,
    AED: 3.67,
    JPY: 150.2,
};

const supportedCurrencies = Object.keys(RATES_FROM_USD);

const normalizeCurrency = (value) => {
    const currency = String(value || 'USD').toUpperCase();
    return supportedCurrencies.includes(currency) ? currency : 'USD';
};

const fromUSD = (amountUSD, targetCurrency) => {
    const currency = normalizeCurrency(targetCurrency);
    return Number(amountUSD || 0) * RATES_FROM_USD[currency];
};

const toUSD = (amount, sourceCurrency) => {
    const currency = normalizeCurrency(sourceCurrency);
    return Number(amount || 0) / RATES_FROM_USD[currency];
};

module.exports = {
    RATES_FROM_USD,
    supportedCurrencies,
    normalizeCurrency,
    fromUSD,
    toUSD,
};
