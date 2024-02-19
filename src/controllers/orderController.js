// import files
const orderService = require("../services/orderService");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const OrderDto = require("../dto/orderDto");

exports.getAllOrders = catchAsync(async (req, res, next) => {
  const query = { ...req.query };
  const orders = await orderService.getAllOrders(query);
  const ordersDto = orders.map((order) => new OrderDto(order));

  res.status(200).json({
    status: "success",
    length: ordersDto.length,
    data: {
      orders: orders,
    },
  });
});

exports.createOrder = catchAsync(async (req, res, next) => {
  const orderData = req.body;
  const order = await orderService.createOrder(orderData);
  const orderDto = new OrderDto(order);

  res.status(201).json({
    status: "success",
    data: {
      order: orderDto,
    },
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const order = await orderService.getOrder(id);
  const orderDto = new orderDto(order);

  if (!order) {
    throw new AppError("No order with this id", 400);
  }
  res.status(200).json({
    status: "success",
    data: {
      order: orderDto,
    },
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const orderData = req.body;
  const message = await orderService.updateOrder(id, orderData);
  res.status(204).json({
    status: "success",
    message,
  });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const message = await orderService.deleteOrder(id);
  res.status(204).json({
    status: "success",
    message,
  });
});
