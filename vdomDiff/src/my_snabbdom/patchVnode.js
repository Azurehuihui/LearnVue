import createElement from './createElement';
import updateChildren from './updateChildren'


/**
 * 精细化比较两个节点 并用newVnode 替换 oldVnode
 * @param {*} oldVnode 
 * @param {*} newVnode 
 */
export default function patchVnode(oldVnode, newVnode) {
    // 1. 判断新旧 vnode 是否是同一个对象
    if (oldVnode === newVnode) return;
    // 2. 判断 newVnode 有没有text 属性
    if (newVnode.text !== undefined &&
        (newVnode.children == undefined || newVnode.children.length === 0)) {
        // newVnode 有 text 属性
        // 2.1 判断 newVnode 与 oldVnode 的text 属性是否相同
        if (newVnode.text !== oldVnode.text) {
            // 如果newVnode中的text和oldVnode的text不同，那么直接让新text写入老elm中即可。
            // 如果oldVnode中是children，也会立即消失(相当于oldVnode中的children不需要了)
            oldVnode.elm.innerText = newVnode.text;          
        }
    } else {
        // newVnode没有text属性 有children属性
        // 2.2 判断 oldVnode 有没有 children 属性
        if (oldVnode.children !== undefined && oldVnode.children.length > 0) {
            // oldVnode有children属性， 最复杂的情况， 新老节点都有children
            updateChildren(oldVnode.elm, oldVnode.children, newVnode.children);
        } else {
            // oldVnode 没有chilren属性 说明有text； newVnode 有children属性
            // 清空oldVnode的内容
            oldVnode.elm.innerHTTML = "";
            // 遍历新的vnode的子节点，创建DOM， 上树
            for (let ch of newVnode.children) {
                let chDom = createElement(ch);
                oldVnode.elm.appendChild(chDom);
            }
        }
    }
    
}