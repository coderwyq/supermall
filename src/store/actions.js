import {
  ADD_COUNTER,
  ADD_TO_CART
} from "./mutations-types";

export default{
  addCar(context, payload){
    return new Promise((resolve, reject) => {
      // mutations唯一的目的就是修改state中状态
      // mutations中的每个方法尽可能的事件比较单一一点
      // 1.查找之前数组中是否有该商品
      let oldProduct = context.state.carList.find(item => item.iid === payload.iid)
      // 2.判断oldProduct
      if(oldProduct) {
        // oldProduct.count += 1
        context.commit(ADD_COUNTER,oldProduct)
        resolve('当前商品数量加+1')
      } else {
        payload.count = 1
        context.commit(ADD_TO_CART, payload)
        resolve('添加到购物车成功')
      }
    })
  }
}
