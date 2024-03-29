/**
 * 创建节点 将vnode虚拟节点创建为DOM节点
 * 是孤儿节点，不进行插入操作
 * @param {object} vnode 
 * @returns {object} domNode 返回DOM节点
 */
export default function createElement(vnode) {
    // 创建一个DOM节点，这个节点现在是孤儿节点，最后返回这个DOM节点
    let domNode = document.createElement(vnode.sel);
    // 判断该节点 是否有子节点 还是 文本节点
    if (vnode.text !== "" &&
        (vnode.children == undefined || vnode.children.length == 0)) {
        // 说明没有子节点，内部是文本
        domNode.innerText = vnode.text;
    } else if (Array.isArray(vnode.children) && vnode.children.length > 0) {
        // 说明内部是子节点，需要递归创建节点
        // 遍历vnode.children 数组
        for(let ch of vnode.children) {
            // 递归调用，创建出他的dom, 一旦调用createElement意味着创建出DOM了。 并且他的elm属性指向了创建出的dom。但是没有上树，是一个孤儿节点
            let chDom = createElement(ch);
            //上树
            domNode.appendChild(chDom);
        }
    }
    // 补充elm属性
    vnode.elm = domNode;
    return domNode;
}