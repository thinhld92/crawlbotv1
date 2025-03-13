// src/services/standardPriceService.js
const { Op } = require('sequelize');
const priceCache = require('../utils/priceCache');
const StandardPrice = require('../models/StandardPrice');
const { crawlPrice } = require('../utils/priceCrawl');

class StandardPriceService {
  async create(data) {
    try {
      data.createdAt = new Date();
      priceCache.setLatestStandardPrice(data);
      const newPrice = await StandardPrice.create(data, { logging: false });
      setImmediate(() => {
        crawlPrice();
      });
      return { status: 'success', message: "Created Standard Price", id: newPrice.id };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async cleanupRecords() {
    try {
      const thresholdMinutes = parseInt(process.env.CLEANUP_THRESHOLD) || 3; // Lấy từ .env, mặc định 3 phút
      const thresholdTime = new Date(Date.now() - thresholdMinutes * 60 * 1000); // Chuyển thành thời gian
      const deletedCount = await StandardPrice.destroy({
        where: {
          createdAt: {
            [Op.lt]: thresholdTime,
          },
        },
      });
      console.log(`Cleanup hoàn tất: Đã xóa ${deletedCount} bản ghi StandardPrice cũ hơn ${thresholdMinutes} phút`);
      return deletedCount;
    } catch (error) {
      console.error('Lỗi khi cleanup StandardPrice:', error);
      throw error;
    }
  }
}

// Export instance của class
module.exports = new StandardPriceService();