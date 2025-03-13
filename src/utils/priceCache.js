// src/utils/priceCache.js
class PriceCache {
  constructor() {
    // Khởi tạo các thuộc tính
    this.latestStandardPrice = null;       // Lưu giá trị mới nhất của StandardPrice
    this.previousStandardPrice = null; // Lưu thời gian createdAt cũ của StandardPrice
    this.latestDiffPrice = null;           // Lưu giá trị mới nhất của DiffPrice
    this.previousDiffPrice = null;     // Lưu thời gian createdAt cũ của DiffPrice
    this.latestRecommend = null;           // Lưu giá trị mới nhất của Recommend
    this.lastestDiffTime = null;
    this.lastTickTime = null;
  }

  // Phương thức lưu StandardPrice vào cache
  setLatestStandardPrice(price) {
    // Lưu lại thời gian của latestStandardPrice cũ (nếu có) trước khi cập nhật
    if (this.latestStandardPrice) {
      this.previousStandardPrice = this.latestStandardPrice;
    }
    this.latestStandardPrice = price;
    this.lastTickTime = price.createdAt.getTime();
    const currentTime = price.createdAt.getTime();
  
    // Tính khoảng cách đến previousStandardPriceTime và latestDiffPrice.createdAt
    let diffToPreviousStandard = null;
    let diffToLatestDiff = null;

    if (this.previousStandardPrice) {
      diffToPreviousStandard = currentTime - this.previousStandardPrice.createdAt.getTime();
    }
    if (this.latestDiffPrice) {
      diffToLatestDiff = currentTime - this.latestDiffPrice.createdAt.getTime();
    }
  
    // So sánh cả hai giá trị (nếu có) để tính lastestDiffTime
    if (diffToPreviousStandard !== null && diffToLatestDiff !== null) {
      this.lastestDiffTime = Math.min(diffToPreviousStandard, diffToLatestDiff);
    } else if (diffToPreviousStandard !== null) {
      this.lastestDiffTime = diffToPreviousStandard;
    } else if (diffToLatestDiff !== null) {
      this.lastestDiffTime = diffToLatestDiff;
    } else {
      this.lastestDiffTime = null;
    }
  }

  // Phương thức lấy StandardPrice từ cache
  getLatestStandardPrice() {
    return this.latestStandardPrice;
  }

  // Phương thức lấy thời gian createdAt cũ của StandardPrice
  getPreviousStandardPrice() {
    return this.previousStandardPrice;
  }

  // Phương thức lưu DiffPrice vào cache
  setLatestDiffPrice(price) {
    // Lưu lại thời gian của latestDiffPrice cũ (nếu có) trước khi cập nhật
    if (this.latestDiffPrice) {
      this.previousDiffPrice = this.latestDiffPrice;
    }
    this.latestDiffPrice = price;
    this.lastTickTime = price.createdAt.getTime();
    const currentTime = price.createdAt.getTime();
  
    // Tính khoảng cách đến previousDiffPriceTime và latestStandardPrice.createdAt
    let diffToPreviousDiff = null;
    let diffToLatestStandard = null;
  
    if (this.previousDiffPrice) {
      diffToPreviousDiff = currentTime - this.previousDiffPrice.createdAt.getTime();
    }
    if (this.latestStandardPrice) {
      diffToLatestStandard = currentTime - this.latestStandardPrice.createdAt.getTime();
    }
  
    // So sánh cả hai giá trị (nếu có) để tính lastestDiffTime
    if (diffToPreviousDiff !== null && diffToLatestStandard !== null) {
      this.lastestDiffTime = Math.min(diffToPreviousDiff, diffToLatestStandard);
    } else if (diffToPreviousDiff !== null) {
      this.lastestDiffTime = diffToPreviousDiff;
    } else if (diffToLatestStandard !== null) {
      this.lastestDiffTime = diffToLatestStandard;
    } else {
      this.lastestDiffTime = null;
    }
  }

  // Phương thức lấy DiffPrice từ cache
  getLatestDiffPrice() {
    return this.latestDiffPrice;
  }

  // Phương thức lấy thời gian createdAt cũ của DiffPrice
  getPreviousDiffPrice() {
    return this.previousDiffPrice;
  }

  // Phương thức lưu Recommend vào cache
  setLatestRecommend(recommend) {
    this.latestRecommend = recommend;
  }

  // Phương thức lấy Recommend từ cache
  getLatestRecommend() {
    return this.latestRecommend;
  }

  setLastestDiffTime(diffTime) {
    this.lastestDiffTime = diffTime;
  }

  // Phương thức lấy Recommend từ cache
  getLastestDiffTime() {
    return this.lastestDiffTime;
  }

  setLastTickTime(lastTime) {
    this.lastTickTime = lastTime;
  }

  // Phương thức lấy Recommend từ cache
  getLastTickTime() {
    return this.lastTickTime;
  }
}

// Export một instance của class
module.exports = new PriceCache();