// import { products } from "./products"

export let cart = JSON.parse(localStorage.getItem('cart'))

if(!cart){

  cart = [
    
    {
        productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        image: "images/products/intermediate-composite-basketball.jpg",
        name: "Black and Gray Athletic Cotton Socks - 6 Pairs",
        priceCents: 1090,
        quantity: 2,
        deliveryId: '1',

    },
    {
        productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        image: "images/products/adults-plain-cotton-tshirt-2-pack-teal.jpg",
        name: "Intermediate Size Basketball",
        priceCents: 2095,
        quantity: 1,
        deliveryId: '1',
    }
  ]

}



export function saveToStorage(){
  localStorage.setItem('cart', JSON.stringify(cart))
}



// add to cart function
export function addToCart(button, quantity){

  let cartAlreadyExist
              
        cart.forEach((currentCart)=>{
            
          if(currentCart.productId === button.dataset.productId){        
            currentCart.quantity += quantity
            cartAlreadyExist = true
          }
                        
        })        

        if(!cartAlreadyExist){
          
          cart.push({
            productId: button.dataset.productId,
            quantity: quantity,
            deliveryId: '1',
          })
        }
        saveToStorage()
}

export function removeFromCart(cartId){
  
  
    const newCart = []
    cart.forEach((currentCart)=>{
        if(cartId !== currentCart.productId)
            newCart.push(currentCart)
    })

    cart = newCart
    saveToStorage()
    
   
  
}

export function updateCheckoutItemQuantity(){
  let itemQuantity = JSON.parse(localStorage.getItem('itemQuantity'))
  itemQuantity = 0
  cart.forEach((currentCart)=> {
    itemQuantity++
  })
  
  localStorage.setItem('itemQuantity', JSON.stringify(itemQuantity))

  return itemQuantity
}


// update the cart quantity function

export let cartQuantity = JSON.parse(localStorage.getItem('cartQuantity'))

export function updateCartQuantity(){
  cartQuantity = 0
  cart.forEach((currentCart)=>{
    cartQuantity += currentCart.quantity
  })
  localStorage.setItem('cartQuantity',JSON.stringify(cartQuantity))
}

// update order item quantity from chechout page
export function updateItemQuantity(matchingProduct){
  
  
  
}

 