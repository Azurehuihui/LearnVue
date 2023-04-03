<template>
    <div id='app'>
        <h2>TODO LISTS</h2>
        <!-- 通过监听用户敲下回车@keydown.enter来同步代做事件的增加 -->
        <div>
            <input class="addInput" type="text" v-model="title" @keydown.enter="addList">
            <button v-if="toFinish<totalThings" @click="clear">清理</button>
            <span v-else>
                待办事项均为完成
            </span>
        </div>
        <!-- 通过 {{}} 来显示数据变量
             v-for 来渲染 数组
             对input输入框， 通过v-model来绑定输入数据的变化  标记输入框和数据的同步
             v-model等价于：
                <input
                    :value="searchText"
                    @input="searchText = $event.target.value"
                />
        -->
        <ul class="lists">
            <!-- 通过动态绑定class :class="{}" 由todo.done 来判断该class 要不要作用 -->
            <li v-for="todo in todolists" style="display: flex; align-items: center; justify-content: center;">
                <span :class="{done: todo.done}" style="padding-right: 10px;">{{ todo.thing }}</span>
                <input type="checkbox" class="doneCheck" name="" id="" v-model="todo.done">
            </li>
        </ul>
        <div style="display: flex; align-items: center; justify-content: center;">
            <input class="doneCheck" style="margin-right:10px;" type="checkbox" name="" id="" v-model="allDone">
            <span>{{ toFinish }} / {{ totalThings }}</span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {
            title: "",
            todolists: [{thing: 'eat', done: false}, {thing: 'sleep', done: false}],
        }
    },
    componnets: {
        
    },
    computed: {
        /* 不是直接的变量，需要计算才能得到的属性，可以通过计算属性来实现 */
        toFinish() {
            return this.todolists.filter(todo => !todo.done).length
        },
        totalThings() {
            return this.todolists.length;
        },
        /* 在 allDone 的 get 函数里，对于 allDone 会返回什么值，我们只需要判断计算属性 active 是不是 0 就可以。
           而 set 函数做到的就是，
           我们在修改 allDone，也就是前端页面切换全选框的时候(打钩或者取消打钩)，直接遍历 todos，把里面的 done 字段直接和 allDone 同步即可 */
        allDone: {
            get: function() {
                return this.toFinish === 0;
            },
            set: function(val) {
                this.todolists.forEach(todo => {console.log("val " + val); todo.done = val});
            }
        }
    },
    methods: {
        addList() {
            this.todolists.push({thing: this.title, done: false});
            this.title = '';
        },
        clear() {
            this.todolists = this.todolists.filter(todo => !todo.done);
        }
    },
    watch: {
        todolists: {
            handler(newVal, oldVal) {
                console.log(`oldVal -> newVal`);
                localStorage.setItem("todolists", JSON.stringify(this.todolists));
            },
            deep: true
        }
    },
    mounted() {
        let curTodos = localStorage.getItem("todolists");
        if (curTodos !== 'null') {
            this.todolists = JSON.parse(curTodos);
        }
    },
    unmounted() {
        localStorage.setItem("todolists", JSON.stringify(newVal));
    }
}
</script>

<style>
#app {
    max-width: 500px;
    text-align: center;
    color: black;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 20px;
}
.done {
    color: rgb(94, 96, 97);
    text-decoration: line-through;
}
.addInput {
    width: 170px;
    margin-right: 10px;
    height: 20px;
    line-height: 20px;
}
.class {
    display: flex;
    justify-content: center;
}
.doneCheck {
    width: 20px;
    height: 20px;
}
</style>