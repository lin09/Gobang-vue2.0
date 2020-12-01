/**
 * <Modal
 *   v-model="showModal"     // 显示/隐藏
 *   :closable="false"       // 是否显示右上角的关闭按钮。默认true
 *   :maskClosable="false"   // 是否允许点击遮罩层关闭。默认true
 *   width="400px"           // 弹窗宽度。默认450px
 *   title="标题"            // 标题
 *   okText="确定"           // 确定按钮
 *   @ok="handleOk"          // 点击确定的回调
 *   cancelText="取消"       // 取消按钮
 *   @cancel="handleCancel"  // 点击取消的回调
 *   @visibleChange="handleVisibleChange"    // 显示状态发生变化时触发，返回值 true / false
 * >内容</
 */
<template>
  <div v-show="visible" class="modal" @click="handleMask">
    <div class="modal-content" :style="contentStyle" @click.stop>
      <div v-if="title" class="modal-header">
        {{ title }}
        <div v-if="closable" class="modal-close" @click="close">X</div>
      </div>

      <div class="modal-body">
        <slot></slot>
      </div>

      <div v-if="okText || cancelText" class="modal-footer">
        <button v-if="okText" class="btn btn-primary" @click="ok">{{ okText }}</button>
        <button v-if="cancelText" class="btn" @click="cancel">{{ cancelText }}</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Modal',
    props: {
      value: {
        type: Boolean,
        default: false
      },
      closable: {
        type: Boolean,
        default: true
      },
      maskClosable: {
        type: Boolean,
        default: true
      },
      title: {
        type: String,
        default: ''
      },
      width: {
        type: String,
        default: '450px',
      },
      okText: {
        type: String,
        default: ''
      },
      cancelText: {
        type: String,
        default: ''
      },
    },
    data () {
      return {
        visible: this.value,
        contentStyle: {
          width: this.width
        }
      };
    },
    watch: {
      value (val) {
        this.visible = val;
      },
      visible (val) {
        this.$emit('visibleChange', val);
      },
    },
    methods: {
      close () {
        this.visible = false;
        this.$emit('input', false);
        this.$emit('cancel');
      },
      handleMask () {
        if (this.maskClosable) {
          this.close();
        }
      },
      ok () {
        this.$emit('ok');
      },
      cancel () {
        this.close();
      }
    }
  };
</script>

<style lang="stylus" scoped>
.modal {
  position: fixed;
  z-index: 4100;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 50px 0;
  width: 100vw;
  height: 100vh;
  overflow: auto;
  background: rgba(0, 0, 0, .3);
}

.modal-content {
  width: 450px;
  border-radius: 5px;
  overflow: hidden;
}

.modal-header {
  position: relative;
  border-bottom: 1px solid #d8d8d8;
  line-height: 45px;
  text-align: center;
  color: #333;
  background: #fff;
}

.modal-close {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  width: 45px;
  height: 45px;
  justify-content: center;
  align-items: center;
  z-index: 4101;
  cursor: pointer;
}

.modal-body {
  padding: 10px;
  background: #fff;
}

.modal-footer {
  display: flex;
  border-top: 1px solid #d8d8d8;

  .btn {
    display: flex;
    flex: 1 1 50%;
    margin: 0;
    border: 0;
    padding: 0;
    justify-content: center;
    align-items: center;
    line-height: 40px;
    background-color: transparent;
  }

  .btn-primary {
    border-radius: 0 0 0 5px;
    color: #fff;
    background-color: #01b3f0;
  }
}
</style>
