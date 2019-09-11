<template>
    <div></div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {}
  },
  async created () {
    const result = await this.getWeatherService()
    console.log(result)
  },
  methods: {
    ...mapActions('app', ['getWeatherService',]),
  },
}
</script>
<style lang="less" scoped>
</style>
