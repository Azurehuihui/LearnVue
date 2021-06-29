import vnode from './vnode'
import createElement from './createElement'
import patchVnode from './patchVnode'


/**
 * 计算两个节点是否为同一节点，是 精细化比较并上树， 不是 暴力删除并插入新的节点
 * @param {object} oldVnode 
 * @param {object} newVnode 
 */
export default function patch(oldVnode, newVnode) {
  // 判断传入的第一个参数是 DOM 节点 还是虚拟节点
  if (oldVnode.sel == "" || oldVnode.sel == undefined) {
      // 说明是DOM节点，此时要包装成虚拟节点
      oldVnode = vnode(
          oldVnode.tagName.toLowerCase(),  // sel
          {},  // data
          [],  // chhildren
          undefined, // text
          oldVnode // elm
      );
  }
  // 此时新旧节点都是虚拟节点了
  // 判断 oldVnode 和 newVnode 是不是同一个节点
  if (oldVnode.key === newVnode.key && oldVnode.sel === newVnode.sel) {
      console.log("是同一个节点， 需要精细化比较");
      patchVnode(oldVnode, newVnode);
  } else {
      // 不是同一个节点， 暴力插入新节点，删除旧节点
      console.log("不是同一个节点， 暴力插入新节点，删除旧节点");
      // 创建 新虚拟节点 为 DOM 节点
      let newVnodeElm = createElement(newVnode);
      console.log("newElm", newVnodeElm)
      // 获取旧 虚拟节点的真正DOM节点
      let oldVnodeElm = oldVnode.elm;
      // 判断newVnodeElm是否存在
      if (newVnodeElm) {
          // 插入 新节点 到旧节点之前
          oldVnodeElm.parentNode.insertBefore(newVnodeElm, oldVnodeElm);
      }
      // 删除旧节点
      oldVnodeElm.parentNode.removeChild(oldVnodeElm);
  }
}