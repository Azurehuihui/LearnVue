import createElement from './createElement';
import patchVnode from './patchVnode';

/**
 * 
 * @param {object} parentEllm  Dom节点
 * @param {Array} olldCh oldVnode的子节点
 * @param {*} newCh  newVnode的子节点
 */
export default function updateChildren(parentElm, oldCh, newCh) {
    console.log("我是updateChildren");
    console.log(oldCh, newCh);

    // 四个指针
    // 旧前
    let oldStartIdx = 0;
    // 新前
    let newStartIdx = 0;
    // 旧后
    let oldEndIdx = oldCh.length - 1;
    // 新后
    let newEndIdx = newCh.length - 1;

    // 指针指向的4个节点
    // 旧前节点
    let oldStartVnode = oldCh[0];
    // 新前节点
    let newStartVnode = newCh[0];
    // 旧后节点
    let oldEndVnode = oldCh[oldEndIdx];
    // 新后节点
    let newEndVnode = newCh[newEndIdx];

    let keyMap = null;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        console.log("**循环中**");
        // 首先应该不是判断四种命中，而是忽略已经加了undefined标记的项
        if (oldStartVnode === null || oldCh[oldStartIdx] === undefined) {
            oldStartVnode = oldCh[++oldStartIdx];
        } else if (oldEndVnode === null || oldCh[oldEndIdx] === undefined) {
            oldEndVnode = oldCh[--oldEndIdx];
        } else if (newStartVnode === null || newCh[newStartIdx] === undefined) {
            newStartVnode = newCh[++newStartIdx];
        } else if (newEndVnode === null || newCh[newEndIdx] === undefined) {
            newEndVnode = newCh[--newEndIdx];
        } else if (checkSameVnode(oldStartVnode, newStartVnode)) {
            // 命中 新前与旧前
            console.log(" ①1 新前与旧前 命中");
            // 精细化比较两个节点 oldStartVnode 现在和 newStartVnode 一样了
            patchVnode(oldStartVnode, newStartVnode);
            // 移动指针，改变指针指向的节点， 这表示这两个节点都处理（比较）完了
            oldStartVnode = oldCh[++oldStartIdx];
            newStartVnode = newCh[++newStartIdx];
        } else if (checkSameVnode(oldEndVnode, newEndVnode)) {
            // 命中 新后与旧后
            console.log(" ②2 新后与旧后 命中");
            patchVnode(oldEndVnode, newEndVnode);
            oldEndVnode = oldCh[--oldEndIdx];
            newEndVnode = newCh[--newEndIdx];
        } else if (checkSameVnode(oldStartVnode, newEndVnode)) {
            // 命中 新后与旧前
            console.log(" ③3 新后与旧前 命中");
            patchVnode(oldStartVnode, newEndVnode);
            // 当③新后与旧前命中的时候，此时要移动节点。移动 新后（旧前） 指向的这个节点到老节点的 旧后的后面
            // 移动节点：只要插入一个已经在DOM树上 的节点，就会被移动
            parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling);
            oldStartVnode = oldCh[++oldStartIdx];
            newEndVnode = newCh[--newEndIdx];
        } else if (checkSameVnode(oldEndVnode, newStartVnode)) {
            // 命中 新前与旧后
            console.log(" ④4 新前与旧后 命中");
            patchVnode(oldEndVnode, newStartVnode);
            // 当④新前与旧后命中的时候，此时要移动节点。移动 新前（旧后） 指向的这个节点到老节点的 旧前的前面
            // 移动节点：只要插入一个已经在DOM树上的节点，就会被移动
            parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm);
            oldEndVnode = oldCh[--oldEndIdx];
            newStartVnode = newCh[++newStartIdx];
        } else {
            // 四种都没有命中
            console.log("四种都没有命中");
            // 寻找keyMap 一个映射对象， 就不用每次都遍历old对象了
            if (!keyMap) {
                // 定义一个keyMap对象, 记录的是下标
                keyMap = {};
                // 记录oldVnode中节点出现的key
                // 从oldStartIdx开始到oldEndIdx结束， 创建keyMap, 因为可能是在某次循环中出现的该现象，而不是一开始就出现了该现象
                for (let i = oldStartIdx; i <= oldEndtIdx; i++) {
                    const key = oldCh[i].key;
                    if (key !== undefined) {
                        keyMap[key] = i;
                    }
                }
            }
            console.log("ketmap", keyMap);
            // 寻找当前项 newStartIdx 在keyMap中映射的序号
            const idInOld = keyMap[newStartVnode.key];
            if (idInOld == undefined) {
                // 如果 idxInOld 是 undefined 说明是全新的项，要插入
                // 被加入的项（就是newStartVnode这项)现不是真正的DOM节点
                parentElm.insertBefore(createElement(newStartVnode), oldStartVnode.elm);
            } else {
                // 说明不是全新项， 需要移动
                const elmToMove = oldCh[idInOld];
                patchVnode(elmToMove, newStartVnode);
                // 把这项设置为undefined，表示我已经处理完这项了
                oldCh[idInOld] = undefined;
                // 移动，调用insertBefore也可以实现移动。
                parentElm.insertBefore(elmToMove.elm, oldStartVnode.elm);

            }
            newStartVnode = newCh[++newStartIdx];
        }
    }

    // 循环结束
    if (newStartIdx <= newEndIdx) {
        // 说明newVndoe还有剩余节点没有处理，所以要添加这些节点
        // // 插入的标杆
        // const before =
        //   newCh[newEndIdx + 1] === null ? null : newCh[newEndIdx + 1].elm;
        for (let i = newStartIdx; i <= newEndIdx; i++) {
            // insertBefore方法可以自动识别null，如果是null就会自动排到队尾，和appendChild一致
            console.log("old ", oldCh[oldStartIdx], newCh[newEndIdx + 1], newEndIdx);
            const before = oldCh[oldStartIdx] ? oldCh[oldStartIdx].elm : null
            // 这个地方这样子插入有问题
            parentElm.insertBefore(createElement(newCh[i]), newCh[newEndIdx + 1].elm);
        }
    } else if (oldStartIdx <= oldEndtIdx) {
        // 说明oldVnode还有剩余节点没有处理，所以要删除这些节点
        for (let i = oldStartIdx; i <= oldEndtIdx; i++) {
            if (oldCh[i]) {
                
                parentElm.removeChild(oldCh[i].elm);
            }
        }
    }

}

function checkSameVnode(a, b) {
    return a.sel === b.sel && a.key === b.key;
}