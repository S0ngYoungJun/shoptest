document.addEventListener('DOMContentLoaded', async () => {
  const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
  const orderSummary = document.getElementById('orderSummary');

  // Fetch the cart data
  const cartResponse = await fetch('http://localhost:3000/api/cart');
  const cart = await cartResponse.json();

  // Display each item in the order summary
  cart.items.forEach(item => {
      const li = document.createElement('li');
      li.textContent = `${item.product.name} - $${item.product.price.toFixed(2)} - Quantity: ${item.quantity}`;
      orderSummary.appendChild(li);
  });

  confirmPaymentBtn.addEventListener('click', () => {
      // 여기에 결제 완료 시 수행할 동작을 추가합니다.
      // 예를 들어, 서버에 결제 요청을 보내거나 다음 화면으로 이동하는 등의 로직을 추가할 수 있습니다.
      alert('결제가 완료되었습니다. 감사합니다!');
      // 여기에 다음 화면으로 이동하는 로직을 추가하세요.
  });
});