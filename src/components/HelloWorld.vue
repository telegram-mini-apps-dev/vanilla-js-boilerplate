<template>
  <div class="hello">
    <h2>{{ msg }}</h2>
    <p>
      This is a basic Vue 3 + Vite template.
      <br>
      Edit <code>components/HelloWorld.vue</code> to test hot module replacement.
    </p>
  </div>
</template>

<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.hello {
  margin-top: 2rem;
}

h2 {
  color: #42b983;
}

code {
  background-color: #eee;
  padding: 2px 6px;
  border-radius: 4px;
}
</style>
