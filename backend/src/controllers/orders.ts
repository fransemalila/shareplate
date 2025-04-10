import { Request, Response } from 'express';
import { Order } from '../models/order';
import { FoodListing } from '../models/foodListing';
import { User } from '../models/user';

interface AuthRequest extends Request {
  user?: any;
}

// Create new order
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { foodListingId, quantity, pickupTime, paymentMethod, notes } = req.body;

    // Find the food listing
    const foodListing = await FoodListing.findById(foodListingId);
    if (!foodListing) {
      return res.status(404).json({ message: 'Food listing not found' });
    }

    // Check if quantity is available
    if (foodListing.quantity < quantity) {
      return res.status(400).json({ message: 'Requested quantity not available' });
    }

    // Calculate total price
    const totalPrice = foodListing.price * quantity;

    // Create order
    const order = new Order({
      buyer: req.user._id,
      seller: foodListing.seller,
      foodListing: foodListingId,
      quantity,
      totalPrice,
      pickupTime,
      paymentMethod,
      notes,
    });

    // Update food listing quantity
    foodListing.quantity -= quantity;
    await foodListing.save();

    await order.save();

    // Populate seller and food listing details
    await order.populate(['seller', 'foodListing']);

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
};

// Get all orders (admin only)
export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const orders = await Order.find()
      .populate(['buyer', 'seller', 'foodListing'])
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// Get order by ID
export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate(['buyer', 'seller', 'foodListing']);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is buyer, seller, or admin
    if (
      order.buyer._id.toString() !== req.user._id.toString() &&
      order.seller._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Error fetching order' });
  }
};

// Update order status
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is seller or admin
    if (
      order.seller.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Handle status change
    if (status === 'rejected' || status === 'cancelled') {
      // Restore food listing quantity
      const foodListing = await FoodListing.findById(order.foodListing);
      if (foodListing) {
        foodListing.quantity += order.quantity;
        await foodListing.save();
      }
    }

    order.status = status;
    await order.save();

    await order.populate(['buyer', 'seller', 'foodListing']);
    res.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
};

// Cancel order
export const cancelOrder = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is buyer
    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if order can be cancelled
    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Order cannot be cancelled' });
    }

    // Restore food listing quantity
    const foodListing = await FoodListing.findById(order.foodListing);
    if (foodListing) {
      foodListing.quantity += order.quantity;
      await foodListing.save();
    }

    order.status = 'cancelled';
    await order.save();

    await order.populate(['buyer', 'seller', 'foodListing']);
    res.json(order);
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Error cancelling order' });
  }
};

// Get user's orders as buyer
export const getBuyerOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate(['seller', 'foodListing'])
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Get buyer orders error:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// Get user's orders as seller
export const getSellerOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ seller: req.user._id })
      .populate(['buyer', 'foodListing'])
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Get seller orders error:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
}; 