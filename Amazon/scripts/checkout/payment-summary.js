import {findMatchingProduct} from '../../data/products.js'
import {cart} from '../../data/cart.js'
import { formatMoney, roundCurrency } from '../../data/utils.js'
import {updateCheckoutItemQuantity} from '../../data/cart.js'
import { findMatchingOption } from '../../data/deliveryOptions.js'


export function updateOrderStatement(){
    let deliveryPrice = 0
    let itemsPrice = 0
    let totalWithoutTax = 0
    let tax 
    let totalWithTax = 0
    cart.forEach((currentCart)=>{
        let matchingOption = findMatchingOption(currentCart)
        let matchingProduct = findMatchingProduct(currentCart)
        itemsPrice += formatMoney(matchingProduct.priceCents) * currentCart.quantity
        deliveryPrice += matchingOption.deliveryPriceCents
    })
    itemsPrice = roundCurrency(itemsPrice)
    deliveryPrice = formatMoney(deliveryPrice) 
    totalWithoutTax =  roundCurrency(itemsPrice + deliveryPrice)
    tax = roundCurrency(totalWithoutTax * 0.1)
    totalWithTax = roundCurrency(totalWithoutTax + tax)

    const html = `
    
        
        <div class="payment-summary-title">
        Order Summary
        </div>

        <div class="payment-summary-row">
        <div class="js-payment-summary-items">Items (${updateCheckoutItemQuantity()}):</div>
        <div class="payment-summary-money js-payment-summary-money">
            $${itemsPrice}
        </div>
        </div>

        <div class="payment-summary-row">
        <div>Shipping &amp; handling:</div>
        <div class="payment-summary-money ">
            $${deliveryPrice}
        </div>
        </div>

        <div class="payment-summary-row subtotal-row">
        <div>Total before tax:</div>
        <div class="payment-summary-money">
            $${totalWithoutTax}
        </div>
        </div>

        <div class="payment-summary-row">
        <div>Estimated tax (10%):</div>
        <div class="payment-summary-money ">
            $${tax}
        </div>
        </div>

        <div class="payment-summary-row total-row">
        <div>Order total:</div>
        <div class="payment-summary-money ">
            $${totalWithTax}
        </div>
        </div>

        <button class="place-order-button button-primary">
        Place your order
        </button>
        
    
    `

    document.querySelector('.js-payment-summary').innerHTML =  html

}