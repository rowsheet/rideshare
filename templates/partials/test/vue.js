<script>
Vue.options.delimiters = ['<<','>>'];
</script>

<hr>

<div id="app">
    << message >> 
</div>

<script>
var app = new Vue({
    el: '#app',
    data: {
        message: 'Hello Vue!'
    }
})
</script>

<hr>

<div id="app-2">
     <span v-bind:title="message">
          Hover your mouse over me for a few seconds
          to see my dynamically bound title!
    </span>
</div>

<script>
var app2 = new Vue({
    el: '#app-2',
    data: {
        message: 'You loaded this page on ' + new Date().toLocaleString()
    }
})
</script>

<hr>

<div id="app-3">
    <span v-if="seen">Now you see me</span>
</div>

<script>
var app3 = new Vue({
    el: '#app-3',
    data: {
        seen: true
    }
})
</script>

<hr>

<div id="app-4">
    <ol>
        <li v-for="todo in todos">
            << todo.text >>
        </li>
    </ol>
</div>
<script>
    var app4 = new Vue({
        el: '#app-4',
        data: {
            todos: [
                { text: 'Learn JavaScript' },
                { text: 'Learn Vue' },
                { text: 'Build something awesome' }
            ]
        }
    })
</script>

<hr>

<div id="app-5">
    <p><< message >></p>
    <button v-on:click="reverseMessage">Reverse Message</button>
</div>

<script>
    var app5 = new Vue({
        el: '#app-5',
        data: {
            message: 'Hello Vue.js!'
        },
        methods: {
            reverseMessage: function () {
                this.message = this.message.split('').reverse().join('')
            }
        }
    })
</script>

<hr>

<div id="app-6">
    <p><< message >></p>
    <input v-model="message">
</div>
<script>
    var app6 = new Vue({
        el: '#app-6',
        data: {
            message: 'Hello Vue!'
        }
    })
</script>
