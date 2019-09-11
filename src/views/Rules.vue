<template>
    <div class="sample-rules">
        <div
            class="stage"
            v-for="(list,index) in rule"
            :key="index"
        >
            <p class="question">{{list.question}}</p>
            <p
                class="answers"
                v-for="(item,key) in list.answers"
                :key="key"
            >{{item}}</p>
        </div>
        <p class="stage4">{{stage4}}</p>
        <p class="stage5">{{stage5}}</p>
    </div>
</template>

<script>
import rules from '@/components/rules.json'
export default {
  data () {
    return {
      rule: [],
      stage4: '',
      stage5: ''
    }
  },
  created () {
    const { rule, stage4, stage5 } = rules
    this.rule = rule
    this.stage4 = stage4
    this.stage5 = stage5
  }
}
</script>

<style lang="less" scoped>
.sample-rules {
  min-height: 200px;
  padding: 60px 40px;
  color: #000;
  text-align: left;
  .stage {
    padding-bottom: 30px;
    p.question {
      font-size: 32px;
      font-weight: 500;
      height: 48px;
      line-height: 48px;
    }
    p.answers {
      font-size: 24px;
      line-height: 38px;
      color: rgba(0, 0, 0, 0.9);
    }
  }
  p.stage4 {
    margin-top: 60px;
  }
  p.stage5 {
    margin-top: 60px;
  }
}
</style>
