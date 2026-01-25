// Business Logic Flaw 漏洞示例文件

// 示例 1: 价格操纵漏洞
export function businessLogicFlawExample1() {
  // 危险：允许客户端指定价格
  function purchaseItem(clientData) {
    // 危险：直接使用客户端提供的价格
    const { itemId, quantity, price } = clientData;
    
    // 危险：没有在服务器端验证价格
    const totalPrice = price * quantity;
    
    // 扣款逻辑
    processPayment(totalPrice);
    
    // 发货逻辑
    shipItem(itemId, quantity);
    
    return { success: true, message: 'Purchase completed' };
  }
  
  function processPayment(amount) {
    console.log(`Processing payment of ${amount}`);
  }
  
  function shipItem(itemId, quantity) {
    console.log(`Shipping ${quantity} of item ${itemId}`);
  }
  
  return purchaseItem;
}

// 示例 2: 数量绕过漏洞
export function businessLogicFlawExample2() {
  const inventory = {
    'item1': { name: 'Premium Widget', price: 100, available: 10 }
  };
  
  // 危险：没有正确验证购买数量
  function buyItem(itemId, quantity) {
    const item = inventory[itemId];
    
    // 危险：只检查库存是否大于0，而不是是否足够
    if (!item || item.available <= 0) {
      return { success: false, message: 'Item not available' };
    }
    
    // 危险：没有检查数量是否超过可用库存
    if (quantity > item.available) {
      // 危险：这里应该阻止购买，但没有
      console.log(`Warning: Requested ${quantity}, only ${item.available} available`);
    }
    
    // 危险：仍然处理订单，即使数量超出库存
    item.available -= quantity;
    
    return { 
      success: true, 
      message: `Purchased ${quantity} of ${item.name}`, 
      totalCost: item.price * quantity 
    };
  }
  
  return buyItem;
}

// 示例 3: 状态转换漏洞
export function businessLogicFlawExample3() {
  // 危险：状态转换没有适当验证
  class Order {
    constructor() {
      this.status = 'created'; // 初始状态
      this.allowedTransitions = {
        'created': ['paid', 'cancelled'],
        'paid': ['shipped', 'refunded'],
        'shipped': ['delivered', 'returned'],
        'delivered': ['returned', 'reviewed'],
        'cancelled': [], // 不能从取消状态转换到其他状态
        'refunded': [],
        'returned': ['refunded', 'exchange'],
        'exchange': ['shipped'], // 交换商品后重新发货
        'reviewed': []
      };
    }
    
    // 危险：没有验证状态转换是否合法
    setStatus(newStatus) {
      // 危险：直接设置新状态，没有验证是否允许这种转换
      this.status = newStatus;
      return { success: true, message: `Status changed to ${newStatus}` };
    }
    
    // 更安全的方法应该是这样：
    safeSetStatus(newStatus) {
      // 检查当前状态下是否允许转换到新状态
      const allowed = this.allowedTransitions[this.status];
      if (allowed && allowed.includes(newStatus)) {
        this.status = newStatus;
        return { success: true, message: `Status changed to ${newStatus}` };
      } else {
        return { 
          success: false, 
          message: `Cannot transition from ${this.status} to ${newStatus}` 
        };
      }
    }
  }
  
  return Order;
}

// 示例 4: 优惠券滥用漏洞
export function businessLogicFlawExample4() {
  const coupons = {
    'SAVE10': { discount: 10, usageLimit: 100, usedCount: 0 },
    'FREESHIP': { discount: 0, freeShipping: true, usageLimit: 50, usedCount: 0 }
  };
  
  // 危险：优惠券验证逻辑不完整
  function applyCoupon(order, couponCode) {
    const coupon = coupons[couponCode];
    
    if (!coupon) {
      return { success: false, message: 'Invalid coupon' };
    }
    
    // 危险：没有检查是否超过使用限制
    if (coupon.usedCount >= coupon.usageLimit) {
      // 危险：应该阻止使用，但可能没有正确检查
      console.log(`Coupon ${couponCode} has exceeded usage limit`);
    }
    
    // 危险：没有检查用户是否可以多次使用同一优惠券
    coupon.usedCount++;
    
    // 应用折扣
    order.discount = coupon.discount;
    if (coupon.freeShipping) {
      order.shippingCost = 0;
    }
    
    return { 
      success: true, 
      message: 'Coupon applied', 
      order 
    };
  }
  
  return applyCoupon;
}

// 示例 5: 时间窗口漏洞
export function businessLogicFlawExample5() {
  // 危险：限时抢购逻辑存在漏洞
  function flashSalePurchase(userId, productId) {
    const saleStartTime = new Date('2023-12-25T10:00:00Z');
    const saleEndTime = new Date('2023-12-25T12:00:00Z');
    const currentTime = new Date();
    
    // 危险：只检查当前时间，没有防重放攻击
    if (currentTime < saleStartTime || currentTime > saleEndTime) {
      return { success: false, message: 'Flash sale not active' };
    }
    
    // 危险：没有检查用户是否已经购买过（每个用户限购一件）
    const userPurchaseRecord = getUserPurchaseRecord(userId, productId);
    if (userPurchaseRecord && userPurchaseRecord.count > 0) {
      // 这部分逻辑可能被绕过
    }
    
    // 危险：没有使用分布式锁或其他机制防止并发购买
    const purchaseResult = processPurchase(userId, productId);
    
    return purchaseResult;
  }
  
  function getUserPurchaseRecord(userId, productId) {
    // 获取用户购买记录的模拟函数
    return { count: 0 };
  }
  
  function processPurchase(userId, productId) {
    // 处理购买的模拟函数
    return { success: true, message: 'Purchase successful' };
  }
  
  return flashSalePurchase;
}