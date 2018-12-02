<template>
  <div class="log">
    <div class="title">记录</div>
    <div class="table">
      <div class="table-header">
        <div class="table-cell">编号</div>
        <div class="table-cell">日期</div>
        <div class="table-cell">对手</div>
        <div class="table-cell">比分</div>
        <div class="table-cell">局数</div>
      </div>
      <router-link v-for="(item, index) in logs" :key="index" class="table-row" :to="'/log/' + item.date">
        <div class="table-cell">{{ index + 1 }}</div>
        <div class="table-cell">{{ item.date | date }}</div>
        <div class="table-cell">{{ item.user.name }} - {{ item.opponent.name }}</div>
        <div class="table-cell">{{ item.user.fraction }} - {{ item.opponent.fraction }}</div>
        <div class="table-cell">{{ item.roundNum }}</div>
      </router-link>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState, mapActions } from 'vuex'
import { LOGS } from '../constant'

export default {
  name: 'log',
  computed: mapState({
    logs: state => state.logs
  }),
  created () {
    window.log = this
    this.getLogs()
  },
  methods: {
    ...mapActions(['getLogs'])
  },
  filters: {
    date: (value, format = 'YYYY-MM-DD h:mm:ss') => {
      return moment.unix(value).format(format)
    }
  }
}
</script>

<style lang="scss" scoped>
.log {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.title {
  font-size: 24px;
  margin-bottom: 30px;
}

.table {
  display: table;
  border-collapse: collapse;
}

.table-cell {
  display: table-cell;
  padding: 10px 20px;
}

.table-header {
  display: table-header-group;
  background-color: #efefef;

  .table-cell {
    font-weight: bold;
  }
}

.table-row {
  display: table-row;
  border-top: 1px solid #666;
  background-color: white;

  &:hover {
    background-color: blanchedalmond;
  }
}

</style>
