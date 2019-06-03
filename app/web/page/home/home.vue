<template>
  <h1 id="app">
    <button @click="onClick">Click!</button>
  </h1>
</template>

<script lang="ts">
import {Vue, Component} from 'vue-property-decorator';

@Component
export default class extends Vue{
  // 初始数据可以直接声明为实例的属性
  message: string = 'Hell0d44444444dddddo!'

  // 组件方法也可以直接声明为实例的方法
  onClick (): void {
    window.alert(this.message)
  }
}
</script>