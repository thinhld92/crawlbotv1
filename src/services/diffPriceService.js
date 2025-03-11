// services/diffPriceService.js
const { Op } = require('sequelize');
const priceCache = require('../utils/priceCache');
const DiffPrice = require('../models/DiffPrice');
const { crawlPrice, checkCrawlPrice } = require('../utils/priceCrawl');

class DiffPriceService {
  async create(data) {
    try {
      data.createdAt = new Date();
      priceCache.setLatestDiffPrice(data);

      const newPrice = await DiffPrice.create(data, { logging: false });

      setImmediate(() => {
        crawlPrice();
      });

      return { status: 'success', message: "Created Diff Price", id: newPrice.id };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async checkCrawl() {
    const latestDiffPrice = priceCache.getLatestDiffPrice();
    const previousDiffPriceTime = priceCache.getPreviousDiffPriceTime();
    if(!latestDiffPrice || !previousDiffPriceTime
      || latestDiffPrice.createdAt.getTime() - previousDiffPriceTime < process.env.TIME_STABLE) return false;
    return true;
  }

  async cleanupRecords() {
    try {
      const thresholdMinutes = parseInt(process.env.CLEANUP_THRESHOLD) || 3; // Lấy từ .env, mặc định 3 phút
      const thresholdTime = new Date(Date.now() - thresholdMinutes * 60 * 1000); // Chuyển thành thời gian
      const deletedCount = await DiffPrice.destroy({
        where: {
          createdAt: {
            [Op.lt]: thresholdTime,
          },
        },
      });
      console.log(`Cleanup hoàn tất: Đã xóa ${deletedCount} bản ghi DiffPrice cũ hơn ${thresholdMinutes} phút`);
      return deletedCount;
    } catch (error) {
      console.error('Lỗi khi cleanup DiffPrice:', error);
      throw error;
    }
  }
}

// Export instance của class
module.exports = new DiffPriceService();