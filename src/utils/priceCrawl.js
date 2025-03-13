// src/utils/priceComparator.js
const _ = require('lodash');
const StandardPrice = require('../models/StandardPrice');
const DiffPrice = require('../models/DiffPrice');
const priceCache = require('./priceCache'); // Import priceCache
const Action = require('../constants/Action');
const recommendService = require('../services/recommendService');
const logger = require('../config/logger');


const crawlPrice = async () => {
  try {
    // Lấy StandardPrice từ cache
    if (!priceCache.getPreviousStandardPrice() || !priceCache.getPreviousDiffPrice()) {
      logger.info('Không đủ dữ liệu để so sánh giá');
      return;
    }

    let priceStandard = priceCache.getLatestStandardPrice();
    if (priceCache.getLastTickTime() == priceCache.getLatestStandardPrice().createdAt.getTime()) {
      priceStandard = priceCache.getPreviousStandardPrice()
    }

    // Lấy DiffPrice từ cache
    let priceDiff = priceCache.getLatestDiffPrice();
    if (priceCache.getLastTickTime() == priceCache.getLatestDiffPrice().createdAt.getTime()) {
      priceDiff = priceCache.getPreviousDiffPrice()
    }

    const currentTime = Date.now()
    if (!priceStandard || !priceDiff 
      || currentTime - priceStandard.createdAt.getTime() > process.env.MAX_LAST_TIME 
      || currentTime - priceDiff.createdAt.getTime() > process.env.MAX_LAST_TIME) {
        logger.info('Không đủ dữ liệu để so sánh giá');
        return;
    }

    let diff = -1;
    let closeRecommend = Action.NONE;
    // cắt lệnh sell
    if ((priceStandard.bidPrice - priceDiff.askPrice) >= process.env.CLOSE_POINT) {
        closeRecommend = Action.CLOSE_SELL;
        diff = priceStandard.bidPrice - priceDiff.askPrice;
    }

    // cắt lệnh buy
    if ((priceDiff.bidPrice - priceStandard.askPrice) >= process.env.CLOSE_POINT) {
        closeRecommend = Action.CLOSE_BUY;
        diff = priceDiff.bidPrice - priceStandard.askPrice;
    }

    // sell
    let orderRecommend = Action.NONE
    
    if ((priceDiff.bidPrice - priceStandard.askPrice) >= process.env.ENTRY_POINT) {
        orderRecommend = Action.SELL;
        diff = priceDiff.bidPrice - priceStandard.askPrice;
    }
    // buy
    if ((priceStandard.bidPrice - priceDiff.askPrice) >= process.env.ENTRY_POINT) {
        orderRecommend = Action.BUY;
        diff = priceStandard.bidPrice - priceDiff.askPrice;
    }
    
    // if (orderRecommend === Action.NONE && closeRecommend === Action.NONE) {
    //   return
    // }
    const timeDiff = priceCache.getLastestDiffTime();
    if (!timeDiff || timeDiff < process.env.TIME_STABLE) {
      return;
    }
    const data = {};
    data.createdAt = new Date();
    data.symbol = priceStandard.symbol;
    data.standardServer = priceStandard.server;
    data.diffServer = priceDiff.server;
    data.askStandardPrice = priceStandard.askPrice;
    data.bidStandardPrice = priceStandard.bidPrice;
    data.askDiffPrice = priceDiff.askPrice;
    data.bidDiffPrice = priceDiff.bidPrice;
    data.diff = diff;
    data.diffTime = Math.abs(timeDiff);
    data.orderRecommend = orderRecommend;
    data.closeRecommend = closeRecommend;
    data.brokerTime = priceStandard.brokerTime;
    await recommendService.create(data);
  } catch (error) {
    console.log(error);
    
    logger.error('Lỗi khi so sánh giá:', error);
  }
};

const checkCrawlPrice = async () => {
  try {
    // Lấy StandardPrice từ cache
    let latestStandard = priceCache.getLatestStandardPrice();
    if (!latestStandard) {
      return false;
    }
    
    // Lấy DiffPrice từ cache
    let latestDiff = priceCache.getLatestDiffPrice();
    if (!latestDiff) {
      return false;
    }
    const currentTime = Date.now()
    if (currentTime - latestStandard.createdAt.getTime() < process.env.TIME_STABLE
      || currentTime - latestDiff.createdAt.getTime() < process.env.TIME_STABLE
    ) {
      return false;
    }

    return true;
  } catch (error) {
    logger.error('Lỗi khi so sánh giá:', error);
    return false;
  }
};

// Áp dụng debounce với thời gian từ .env (mặc định 400ms)
const debouncedComparePrices = _.debounce(crawlPrice, parseInt(process.env.TIME_STABLE) || 400);

module.exports = {
  crawlPrice,         // Xuất hàm gốc nếu cần dùng trực tiếp
  checkCrawlPrice,
  debouncedComparePrices // Xuất hàm đã debounce để dùng trong services
};