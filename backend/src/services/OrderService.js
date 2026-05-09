const OrderRepository = require('../repositories/OrderRepository')
const ProductRepository = require('../repositories/ProductRepository')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

module.exports = {
	getOrder: async (req, res) => {
		try {
			const order =
				(await OrderRepository.getByUser(req.user)) || (await OrderRepository.addByUser(req.user))

			return res.status(200).json(order)
		} catch (error) {
			return res.status(500).json({ error: 'Internal server error' })
		}
	},

	getAllOrderDetail: async (req, res) => {
		try {
			const order =
				(await OrderRepository.getByUser(req.user)) || (await OrderRepository.addByUser(req.user))

			return res.status(200).json(await OrderRepository.getAllOrderDetailByOrder(order))
		} catch (error) {
			return res.status(500).json({ error: 'Internal server error' })
		}
	},

	addOrderDetail: async (req, res) => {
		try {
			const { productId, amount } = req.body

			const order =
				(await OrderRepository.getByUser(req.user)) || (await OrderRepository.addByUser(req.user))

			const product = await ProductRepository.getById(productId)
			if (!product) {
				return res.status(400).json({ error: 'Invalid product' })
			}

			const subtotal = amount * product.price
			// Create or update order detail based on the existance
			let orderDetail = await OrderRepository.getOrderDetailByOrderAndProduct(order, product)
			if (!orderDetail) {
				orderDetail = {
					orderId: order.id,
					productId: product.id,
					amount: amount,
					subtotal: subtotal,
				}
				await OrderRepository.addOrderDetail(orderDetail)
			} else {
				const newValue = {
					amount: orderDetail.amount + amount,
					subtotal: orderDetail.subtotal + subtotal,
				}
				await OrderRepository.updateOrderDetail(orderDetail, newValue)
			}

			// Update order
			await OrderRepository.update(order, {
				quantity: order.quantity + amount,
				total: order.total + subtotal,
			})

			return res.status(201).json({ success: 'Order successfully added' })
		} catch (error) {
			return res.status(500).json({ error: 'Internal server error' })
		}
	},

	updateOrderDetail: async (req, res) => {
		try {
			const { productId, amount } = req.body

			const [order, product] = await Promise.all([
				OrderRepository.getByUser(req.user),
				ProductRepository.getById(productId),
			])

			const orderDetail = await OrderRepository.getOrderDetailByOrderAndProduct(order, product)

			if (!orderDetail) {
				return res.status(400).json({ error: 'Invalid Product' })
			}

			const oldValue = {
				amount: orderDetail.amount,
				subtotal: orderDetail.subtotal,
			}
			const newValue = {
				amount: amount,
				subtotal: amount * product.price,
			}

			// Handle case when amount is equal to 0
			if (amount == 0) {
				await OrderRepository.deleteOrderDetail(orderDetail)
			} else {
				await OrderRepository.updateOrderDetail(orderDetail, newValue)
			}

			await OrderRepository.update(order, {
				quantity: order.quantity - oldValue.amount + newValue.amount,
				total: order.total - oldValue.subtotal + newValue.subtotal,
			})

			return res.status(200).json(await OrderRepository.getAllOrderDetailByOrder(order))
		} catch (error) {
			return res.status(500).json({ error: 'Internal server error' })
		}
	},

	deleteOrderDetail: async (req, res) => {
		try {
			const [order, product] = await Promise.all([
				OrderRepository.getByUser(req.user),
				ProductRepository.getById(req.body.productId),
			])

			const orderDetail = await OrderRepository.getOrderDetailByOrderAndProduct(order, product)
			if (orderDetail) {
				await OrderRepository.update(order, {
					quantity: order.quantity - orderDetail.amount,
					total: order.total - orderDetail.subtotal,
				})
				await OrderRepository.deleteOrderDetail(orderDetail)
			}

			return res.status(200).json(await OrderRepository.getAllOrderDetailByOrder(order))
		} catch (error) {
			return res.status(500).json({ error: 'Internal server error' })
		}
	},

	checkout: async (req, res) => {
		try {
			const order = await OrderRepository.getByUser(req.user)
			if (!order) {
				return res.status(400).json({ error: 'No active order found' })
			}
			await OrderRepository.checkout(order)
			return res.status(200).json(order)
		} catch (error) {
			return res.status(500).json({ error: 'Internal server error' })
		}
	},

	createPaymentIntent: async (req, res) => {
		try {
			const order = await OrderRepository.getByUser(req.user)
			if (!order || order.total <= 0) {
				return res.status(400).json({ error: 'No active order or cart is empty' })
			}
			const amountInCents = Math.round(order.total * 100)
			const paymentIntent = await stripe.paymentIntents.create({
				amount: amountInCents,
				currency: 'usd',
				metadata: { orderId: String(order.id), userId: String(req.user.id) },
			})
			return res.status(200).json({ clientSecret: paymentIntent.client_secret })
		} catch (error) {
			return res.status(500).json({ error: 'Failed to create payment intent' })
		}
	},
}
