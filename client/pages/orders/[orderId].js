const OrderShow = ({ order }) => {
  const msLeft = new Date(order.expiresAt) - new Date()
  return (
    <div>{msLeft / 1000} seconds until order expires</div>
  )
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query
  const { data } = await client.get(`/api/orders/${orderId}`)

  return { order: data }
}

export default OrderShow
