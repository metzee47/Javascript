export function formatMoney(priceCents){
    return Number((priceCents / 100).toFixed(2))
}

export function roundCurrency(currency){
    return Number(currency.toFixed(2))
}