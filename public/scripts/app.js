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
        li.innerHTML = `<span>${item.product.name} - $${item.product.price.toFixed(2)}</span> - Quantity: ${item.quantity}`;
        cartList.appendChild(li);

        total += item.product.price * item.quantity;
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
  
      if (!response.ok) {
        console.error('Server response is not OK:', response);
        return;
      }
  
      const result = await response.json();
  
      // result가 undefined인 경우 처리
      if (result === undefined) {
        console.error('Server response is undefined:', response);
        return;
      }
  
      console.log(result.message);
  
      // 장바구니 표시를 새로 고침
      const cartResponse = await fetch('http://localhost:3000/api/cart');
      const cart = await cartResponse.json();
      displayCart(cart);
    } catch (error) {
      console.error('장바구니에 추가 중 에러 발생:', error);
    }
  }

  // Function to handle checkout button click
  checkoutBtn.addEventListener('click', async () => {
    try {
      const orderResponse = await fetch('http://localhost:3000/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: [], total: 0 }), // Pass the order details as needed
      });
  
      if (!orderResponse.ok) {
        console.error('Order request failed:', orderResponse);
        return;
      }
  
      const orderResult = await orderResponse.json();
      console.log(orderResult.message);
  
      // Reset the cart after checkout
      const cartResponse = await fetch('http://localhost:3000/api/cart');
      const cart = await cartResponse.json();
      displayCart(cart);
    } catch (error) {
      console.error('Error handling checkout:', error);
    }
  })})