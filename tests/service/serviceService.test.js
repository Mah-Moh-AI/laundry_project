const ServiceService = require("../../src/services/serviceService");
const serviceRepository = require("../../src/repositories/serviceRepository");
const serviceService = require("../../src/services/serviceService");

describe("serviceService", () => {
  let mockServiceRepository;

  beforeEach(() => {
    mockServiceRepository = {
      getAllServices: jest.fn(),
      createService: jest.fn(),
      getService: jest.fn(),
      updateService: jest.fn(),
      deleteService: jest.fn(),
    };

    serviceRepository.getAllServices = mockServiceRepository.getAllServices;
    serviceRepository.createService = mockServiceRepository.createService;
  });

  describe("getAllService", () => {
    it("should call serviceRepository.getAllServices with default query", async () => {
      const queryString = {
        /* your data object */
      };
      await serviceService.getAllServices(queryString);
      expect(mockServiceRepository.getAllServices).toHaveBeenCalledWith(
        /* expected query object */
        {
          where: {},
          order: [["createdAt", "DESC"]],
          attributes: null,
          offset: 0,
          limit: 10,
        }
      );
    });

    it("should return empty array if serviceRepository.getAllServices resolves with no services", async () => {
      mockServiceRepository.getAllServices.mockResolvedValue([]);
      const services = await serviceService.getAllServices({});
      expect(services).toEqual([]);
    });

    it("should return services when serviceRepository.getAllServices resolves", async () => {
      const expectedServices = [
        { id: 1, name: "Service 1" },
        { id: 2, name: "Service 2" },
      ];
      mockServiceRepository.getAllServices.mockResolvedValue(expectedServices);

      const services = await serviceService.getAllServices({});
      expect(services).toEqual(expectedServices);
    });
    // Add more tests for getAllServices if needed
  });

  describe("createService", () => {
    it("should call serviceRepository.createService with correct data", async () => {
      const data = {
        /* your data object */
        clothesTypeId: "1",
        servicePreferenceId: "2",
        serviceOptionId: "3",
        deliveryTypeId: "4",
        servicePrice: "5.5",
      };
      await serviceService.createService(data);
      expect(mockServiceRepository.createService).toHaveBeenCalledWith(
        /* expected data object */ data
      );
    });

    it("should throw an error when serviceRepository.createService rejects", async () => {
      const data = {
        /* your data object */
      };
      const errorMessage = "Error creating service";
      mockServiceRepository.createService.mockRejectedValue(
        new Error(errorMessage)
      );

      await expect(serviceService.createService(data)).rejects.toThrowError(
        errorMessage
      );
    });

    // Add more tests for createService if needed
  });
});
