// src/utils/priceCache.js
class PriceCache {
  constructor() {
    // Khởi tạo các thuộc tính
    this.latestStandardPrice = null;       // Lưu giá trị mới nhất của StandardPrice
    this.previousStandardPriceTime = null; // Lưu thời gian createdAt cũ của StandardPrice
    this.latestDiffPrice = null;           // Lưu giá trị mới nhất của DiffPrice
    this.previousDiffPriceTime = null;     // Lưu thời gian createdAt cũ của DiffPrice
    this.latestRecommend = null;           // Lưu giá trị mới nhất của Recommend
    this.lastestDiffTime = null;
  }

  // Phương thức lưu StandardPrice vào cache
  setLatestStandardPrice(price) {
    // Lưu lại thời gian của latestStandardPrice cũ (nếu có) trước khi cập nhật
    if (this.latestStandardPrice && this.latestStandardPrice.createdAt) {
      this.previousStandardPriceTime = this.latestStandardPrice.createdAt;
    }
    this.latestStandardPrice = price;
    const currentTime = price.createdAt.getTime();
  
    // Tính khoảng cách đến previousStandardPriceTime và latestDiffPrice.createdAt
    let diffToPreviousStandard = null;
    let diffToLatestDiff = null;
  
    if (this.previousStandardPriceTime) {
      diffToPreviousStandard = currentTime - this.previousStandardPriceTime.getTime();
    }
    if (this.latestDiffPrice && this.latestDiffPrice.createdAt) {
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
  getPreviousStandardPriceTime() {
    return this.previousStandardPriceTime;
  }

  // Phương thức lưu DiffPrice vào cache
  setLatestDiffPrice(price) {
    // Lưu lại thời gian của latestDiffPrice cũ (nếu có) trước khi cập nhật
    if (this.latestDiffPrice && this.latestDiffPrice.createdAt) {
      this.previousDiffPriceTime = this.latestDiffPrice.createdAt;
    }
    this.latestDiffPrice = price;
    const currentTime = price.createdAt.getTime();
  
    // Tính khoảng cách đến previousDiffPriceTime và latestStandardPrice.createdAt
    let diffToPreviousDiff = null;
    let diffToLatestStandard = null;
  
    if (this.previousDiffPriceTime) {
      diffToPreviousDiff = currentTime - this.previousDiffPriceTime.getTime();
    }
    if (this.latestStandardPrice && this.latestStandardPrice.createdAt) {
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
  getPreviousDiffPriceTime() {
    return this.previousDiffPriceTime;
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
}

// Export một instance của class
module.exports = new PriceCache();