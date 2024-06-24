export const deliveryOptions = [
    {
        deliveryId: '1',
        deliveryTime: '7',
        deliveryPriceCents: 0
    },
    {
        deliveryId: '2',
        deliveryTime: '3',
        deliveryPriceCents: 499
    },
    {
        deliveryId: '3',
        deliveryTime: '1',
        deliveryPriceCents: 999
    }
]

// find matching delivery option
export function findMatchingOption(currentCart){
  let matchingOption

  deliveryOptions.forEach((option)=>{
    if(currentCart.deliveryId === option.deliveryId)
      matchingOption = option
  })
  
  return matchingOption
}


