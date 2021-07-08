const stripe = Stripe('<%= stripe_pk %>');
const orderBtn = document.getElementById('order-btn');
orderBtn.addEventListener('click', function() {
    stripe.redirectToCheckout({
        sessionId: '<%= sessionId %>',
    });
});