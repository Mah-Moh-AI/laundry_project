const { NodeCache, redis, promisify } = require("./npmPackages");

class cacheService {
  constructor(useRedis = false) {
    if (!cacheService.instance) {
      if (useRedis) {
        // redis not tested
        this.client = redis.createClient();
        this.getAsync = promisify(this.client.get).bind(this.client);
        this.setAsync = promisify(this.client.set).bind(this.client);
        this.delAsync = promisify(this.client.del).bind(this.client);
      } else {
        this.cache = new NodeCache();
      }
    }
    return cacheService.instance;
  }

  async get(key) {
    if (this.client) {
      return this.getAsync(key);
    }
    return this.cache.get(key);
  }

  async set(key, value, ttl = 0) {
    if (this.client) {
      return this.setAsync(key, value, "EX", ttl);
    }
    return this.cache.set(key, value, ttl);
  }

  async del(key) {
    if (this.client) {
      return this.delAsync(key);
    }
    return this.cache.del(key);
  }
}

module.exports = cacheService;
