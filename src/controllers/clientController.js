// import files
const clientService = require("../services/clientService");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const ClientDto = require("../dto/clientDto");

exports.getAllClients = catchAsync(async (req, res, next) => {
  const query = { ...req.query };
  const clients = await clientService.getAllClients(query);
  const clientsDto = clients.map((client) => new ClientDto(client));

  res.status(200).json({
    status: "success",
    length: clientsDto.length,
    data: {
      clients: clientsDto,
    },
  });
});

exports.createClient = catchAsync(async (req, res, next) => {
  const clientData = req.body;
  const client = await clientService.createClient(clientData);
  const clientDto = new ClientDto(client);

  res.status(201).json({
    status: "success",
    data: {
      client: clientDto,
    },
  });
});

exports.getClient = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const client = await clientService.getClient(id);
  const clientDto = new clientDto(client);

  if (!client) {
    throw new AppError("No client with this id", 400);
  }
  res.status(200).json({
    status: "success",
    data: {
      client: clientDto,
    },
  });
});

exports.updateClient = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const clientData = req.body;
  const message = await clientService.updateClient(id, clientData);
  res.status(204).json({
    status: "success",
    message,
  });
});

exports.deleteClient = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const message = await clientService.deleteClient(id);
  res.status(204).json({
    status: "success",
    message,
  });
});
