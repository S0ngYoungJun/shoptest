document.addEventListener('DOMContentLoaded', () => {
  const productList = document.getElementById('product-list');
  const cartList = document.getElementById('cart-list');
  const cartTotal = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');

  // Fetch products from the server
  fetch('http://localhost:3000/api/products')  // Update the URL with your server URL
    .then(response => response.json())
    .then(products => {
      // Display products
      displayProducts(products);

      // After displaying products, fetch the user's cart
      fetch('http://localhost:3000/api/cart')  // Update the URL with your server URL
        .then(response => response.json())
        .then(cart => {
          // Display user's cart
          displayCart(cart);
        })
        .catch(error => console.error('Error fetching cart:', error));
    })
    .catch(error => console.error('Error fetching products:', error));

    function displayProducts(products) {
      productList.innerHTML = '';
      // products가 정의되지 않았거나 null인 경우 에러 출력 후 종료
      if (!products) {
        console.error('에러: 제품 데이터가 정의되지 않았거나 null입니다.');
        return;
      }
    
      // products가 배열이 아닌 경우 배열로 변환
      if (!Array.isArray(products)) {
        products = [products];
      }
    
      products.forEach(product => {
        const li = document.createElement('li');
        li.className = 'product-item';
    
        // product.price가 정의되어 있는지 확인
        const price = product.price !== undefined ? `$${product.price.toFixed(2)}` : '가격 정보 없음';
    
        // createElement 및 appendChild를 사용하여 구조 생성
        const productInfo = document.createElement('div');
        productInfo.className = 'product-info';
        const productName = document.createElement('span');
        productName.className = 'product-name';
        productName.textContent = product.name;
        const productPrice = document.createElement('span');
        productPrice.className = 'product-price';
        productPrice.textContent = price;
        productInfo.appendChild(productName);
        productInfo.appendChild(productPrice);
    
        const addToCartBtn = document.createElement('button');
        addToCartBtn.className = 'add-to-cart-btn';
        addToCartBtn.textContent = '장바구니에 추가';
        // 클릭 이벤트를 처리하는 별도의 함수 사용
        addToCartBtn.addEventListener('click', () => {
          addToCart(product._id, product.name, product.price !== undefined ? product.price.toFixed(2) : 0);
        });
    
        li.appendChild(productInfo);
        li.appendChild(addToCartBtn);
    
        productList.appendChild(li);
      });
    }
    

    function displayCart(cart) {
      cartList.innerHTML = '';
      let total = 0;
    
      // Check if cart.items is defined before using forEach
      if (cart.items) {
        cart.items.forEach(item => {
          const li = document.createElement('li');
    
          // Check if item.product is not null before accessing its properties
          if (item.product) {
            const productName = item.product ? item.product.name || '상품명 없음' : '상품 정보 없음';
            const productPrice = item.product ? (item.product.price !== undefined ? `$${item.product.price.toFixed(2)}` : '가격 정보 없음') : '';
    
            li.innerHTML = `<span>${productName} - ${productPrice}</span> - Quantity: ${item.quantity}`;
            cartList.appendChild(li);
    
            total += (item.product.price || 0) * item.quantity;
          } else {
            // Handle the case where item.product is undefined
            li.innerHTML = '<span>상품 정보 없음</span>';
            cartList.appendChild(li);
          }
        });
      }
      cartTotal.textContent = total.toFixed(2);
    }

  // Function to add a product to the cart
      async function addToCart(productId, productName, productPrice) {
        try {
        const response = await fetch('http://localhost:3000/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId, quantity: 1 }),
        });
        console.log('Response Status:', response.status);
        if (!response.ok) {
            console.error('Server response is not OK:', response);
            return;
        }

        // result가 undefined인 경우 처리
        let responseBody;
        try {
            responseBody = await response.text();
        } catch (error) {
            console.error('Error reading response body:', error);
            return;
        }

        const result = JSON.parse(responseBody);
        console.log(result.message);

        // 장바구니 표시를 새로 고침
        const cartResponse = await fetch('http://localhost:3000/api/cart');
        const cart = await cartResponse.json();
        const existingItem = cart.items.find(item => String(item.product) === String(productId));
          if (existingItem) {
          // 상품이 이미 카트에 있는 경우 수량을 업데이트
          existingItem.quantity += 1;
          } else {
          // 새로운 상품 추가
          cart.items.push({ product: productId, quantity: 1 });
          }
          displayCart(cart);
          } catch (error) {
          console.error('장바구니에 추가 중 에러 발생:', error);
          }
        }

  // Function to handle checkout button click
  checkoutBtn.addEventListener('click', async () => {
    try {
      const cartResponse = await fetch('http://localhost:3000/api/cart');
      const cart = await cartResponse.json();
  
      const orderResponse = await fetch('http://localhost:3000/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: cart.items, total: cart.total }), // Pass the cart details to the order
      });
  
      if (!orderResponse.ok) {
        console.error('Order request failed:', orderResponse);
        return;
      }
  
      const orderResult = await orderResponse.json();
      console.log(orderResult.message);
  
      // Reset the cart after checkout
      const updatedCartResponse = await fetch('http://localhost:3000/api/cart');
      const updatedCart = await updatedCartResponse.json();
      displayCart(updatedCart);
      
      // Redirect to checkout.html
      window.location.href = '/public/checkout.html';
    } catch (error) {
      console.error('Error handling checkout:', error);
    }
  });
})