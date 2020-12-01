<template>
  <div class="log">
    <div class="title">记录</div>
    <div class="table" oncontextmenu="return false" @mousedown="handleTableMousedown">
      <div class="table-header">
        <div class="table-cell">序号</div>
        <div class="table-cell">日期</div>
        <div class="table-cell">对手</div>
        <div class="table-cell">比分</div>
        <div class="table-cell">局数</div>
      </div>
      <div v-for="(item, index) in logs" :key="index" class="table-row" title="右击查看更多"  @mousedown="(event) => {handleItemMousedown(event, item, index)}">
        <div class="table-cell">{{ index + 1 }}</div>
        <div class="table-cell">{{ item.date | dateFormat }}</div>
        <div class="table-cell">{{ item.user.name }} - {{ item.opponent.name }}</div>
        <div class="table-cell">{{ item.user.fraction }} - {{ item.opponent.fraction }}</div>
        <div class="table-cell">{{ item.roundNum }}</div>
      </div>
      <div v-show="isShowMenu" class="menu" :style="menuStyle" @mouseleave="isShowMenu = false">
        <div class="item" @click="handleDelete">删除</div>
        <div class="item" @click="handleDeleteAll">删除全部</div>
      </div>
    </div>
    <div class="no-data" v-if="!logs.length">没数据</div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'log',
  data () {
    return {
      menuStyle: {
        top: 0,
        left: 0
      },
      isShowMenu: false
    }
  },
  computed: mapState({
    logs: state => state.log.logs
  }),
  created () {
    window.log = this
    this.getLogs()
  },
  methods: {
    ...mapActions(['getLogs', 'delLog', 'delAllLog']),
    handleTableMousedown (event) {
      // 右击
      if (event.which === 3) {
        this.menuStyle = {
          top: event.layerY + 'px',
          left: event.layerX + 'px'
        }
      }
    },
    handleItemMousedown (event, item, index) {
      // 左击跳转
      if (event.which === 1) {
        this.$router.push({
          name: 'logDetail',
          params: { id: item.date }
        })
      }
      // 右击菜单
      else if (event.which === 3) {
        this.isShowMenu = true
        this.handleDelete.index = index
      }
    },
    handleDelete () {
      this.isShowMenu = false
      this.delLog(this.handleDelete.index)
    },
    handleDeleteAll () {
      this.delAllLog()
    }
  }
}
</script>

<style lang="stylus" scoped>
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
  position: relative;
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
  border-top: 1px solid #d8d8d8;
  background-color: white;
  cursor: pointer;

  &:hover {
    background-color: blanchedalmond;
  }
}

.menu {
  position: absolute;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  box-shadow: 1px 1px 8px black;

  .item {
    padding: 10px 20px;
    cursor: pointer;
    white-space: nowrap;

    &:hover {
      background-color: #efefef;
    }

    & + .item {
      border-top: 1px solid #d8d8d8;
    }
  }
}

.no-data {
  text-align: center;
}
</style>
