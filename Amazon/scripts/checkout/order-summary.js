import {cart, removeFromCart, updateCheckoutItemQuantity, updateCartQuantity, saveToStorage} from '../../data/cart.js'
import {formatMoney, roundCurrency} from '../../data/utils.js'
import {deliveryOptions, findMatchingOption} from '../../data/deliveryOptions.js'
import { findMatchingProduct, products } from '../../data/products.js'
import { updateOrderStatement } from './payment-summary.js'


export function renderOrderSummary(){

    let ordersHTML = ''

    cart.forEach((currentCart) =>{
    const matchingProduct = findMatchingProduct(currentCart)
    const matchingOption = findMatchingOption(currentCart)

        ordersHTML += `
        <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
        Delivery date: ${dayjs().add(matchingOption.deliveryTime,'day').format('dddd, MMMM D')}
        </div>

        <div class="cart-item-details-grid">
        <img class="product-image"
            src="../${matchingProduct.image}">

        <div class="cart-item-details">
            <div class="product-name">
            ${matchingProduct.name}
            </div>
            <div class="product-price">
            $${formatMoney(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity js-product-quantity-${matchingProduct.id}">
            <span>
                Quantity: <span class="quantity-label">${currentCart.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-quantity-link" data-product-id = "${matchingProduct.id}">
                Update
            </span>
            <span class="delete-quantity-link link-primary js-delete-quantity-link" data-product-id = "${matchingProduct.id}">
                Delete
            </span>
            </div>
        </div>

        <div class="delivery-options">
            <div class="delivery-options-title">
            Choose a delivery option:
            </div>
            ${deliveryDateOptions(matchingProduct, currentCart)}
            
        </div>
        </div>
    </div>
        `
        
    })


    document.querySelector('.js-order-summary').innerHTML = ordersHTML

    // update the checkout title quantity of items
    document.querySelector('.js-return-to-home-link').innerHTML = updateCheckoutItemQuantity() + ' items'


    function deliveryDateOptions(matchingProduct, currentCart){
  
        let html = ''
      
        deliveryOptions.forEach((option)=>{
      
          const deliveryPriceCents = 
            option.deliveryPriceCents === 0
              ? 'FREE'
              : `$${formatMoney(option.deliveryPriceCents)}`
      
          const isChecked = 
            currentCart.deliveryId === option.deliveryId
              ? 'checked'
              : ''
      
          
          html += 
          `
            <div class="delivery-option">
              <input type="radio"
                class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}" ${isChecked}>
              <div>
                <div class="delivery-option-date">
                ${dayjs().add(option.deliveryTime,'day').format('dddd, MMMM D')}
                </div>
                <div class="delivery-option-price">
                  ${deliveryPriceCents} - Shipping
                </div>
              </div>
            </div>
        `
        })
      
        return html
       
      }

    // configure update link
    document.querySelectorAll('.js-update-quantity-link')
      .forEach((updateLink)=>{
        let matchingProduct
        updateLink.addEventListener('click',()=>{

            cart.forEach((currentCart)=>{

                if(currentCart.productId === updateLink.dataset.productId)
                    matchingProduct = currentCart

            })
            document.querySelector(`.js-product-quantity-${matchingProduct.productId}`)
            .innerHTML = `
                <span>
                Quantity: <input type="number" name="new-item-quantity" class="new-item-quantity js-new-item-quantity" value = '${matchingProduct.quantity}'>
                </span>
                <span class="save-quantity-link link-primary js-save-quantity-link" data-product-id = "${matchingProduct.productId}">
                    Save
                </span>
                <span class="delete-quantity-link link-primary js-delete-quantity-link" data-product-id = "${matchingProduct.productId}">
                    Delete
                </span>
            `
            // let's configure save button link
            document.querySelectorAll('.js-save-quantity-link')
            .forEach((saveLink)=>{
                saveLink.addEventListener('click', ()=>{
                    const newItemQuantity = Number(document.querySelector(`.js-product-quantity-${matchingProduct.productId} .js-new-item-quantity`).value)

                    cart.forEach((currentCart)=>{
                        if(currentCart.productId === matchingProduct.productId){
                            if(newItemQuantity > 0){
                                currentCart.quantity = newItemQuantity
                                saveToStorage()
                                renderOrderSummary()
                            }
                            else if(newItemQuantity < 0)
                                alert(`Impossible de modifier !!! ${newItemQuantity}`)
                            else{
                                const answer = confirm('Voulez vous supprimer cet article de votre panier ?')
                                if(answer){
                                    removeFromCart(matchingProduct.productId)   
                                    updateCheckoutItemQuantity()
                                    document.querySelector('.js-return-to-home-link').innerHTML = updateCheckoutItemQuantity() + ' items'
                                    document.querySelector(`.js-cart-item-container-${matchingProduct.productId}`).remove()
                                    updateCartQuantity()
                                    updateOrderStatement()
                                }
                            }

                        }
                    })

                    

                })
            }) 

        })

        
      })

     

    // configure delete link
    document.querySelectorAll('.js-delete-quantity-link')
        .forEach((deleteLink)=>{
            let matchingProduct
            deleteLink.addEventListener('click', ()=>
            {
                cart.forEach((currentCart)=>{
                    if(currentCart.productId === deleteLink.dataset.productId)
                        matchingProduct = currentCart
                })

                // console.log(deleteLink)
                
                removeFromCart(matchingProduct.productId)   
                updateCheckoutItemQuantity()
                document.querySelector('.js-return-to-home-link').innerHTML = updateCheckoutItemQuantity() + ' items'
                document.querySelector(`.js-cart-item-container-${matchingProduct.productId}`).remove()
                updateCartQuantity()
                updateOrderStatement()
            })
        })

    // change the display's delivery date and the shipping price at the payment process if checking(radio input) is switched
    cart.forEach((currentCart)=>{

        // Pour chaque cart il ya 3 input, l'index nous permettra de localiser l'input selectionne
        let index = 1
        // matching-product nous permet de regrouper les 3 input de chaque carte
        const matchingProduct = findMatchingProduct(currentCart)
        // Voici les 3 inputs en question
        document.getElementsByName(`delivery-option-${matchingProduct.id}`)
        .forEach((input)=>{

            const currentIndex = index
            const currentProduct = matchingProduct
            input.addEventListener('click', ()=>{

            currentCart.deliveryId = `${currentIndex}`
            const newDeliveryOption = findMatchingOption(currentCart)

            document.querySelector(`.js-cart-item-container-${currentProduct.id} .delivery-date`)
            .innerHTML = `Delivery date: ${dayjs().add(newDeliveryOption.deliveryTime,'day').format('dddd, MMMM D')}`
            updateOrderStatement()
            saveToStorage()
            })

            index++

        })

            
    })


}