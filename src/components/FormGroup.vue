<template>
  <div class="form-group">
    <div class="label">{{ label }}</div>
    <input v-model="model" :type="type" :disabled="disabled" :placeholder="placeholder" @change="handleChange" >
  </div>
</template>

<script>
export default {
  name: 'formGroup',
  props: {
    value: {
      default: ''
    },
    label: {
      type: String
    },
    type: {
      type: String,
      default: 'text'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String
    }
    // 可添加其它属性
  },
  data () {
    return {
      model: this.value
    }
  },
  watch: {
    value (val) {
      this.model = val
    }
  },
  methods: {
    handleChange () {
      this.$emit('input', this.model)
    }
  }
}
</script>

<style lang="scss" scoped>
.form-group {
  display: flex;
  align-items: center;
  padding: 10px 20px;

  .label {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  // > input[type=password],  可以添加更多类型
  > input[type=text] {
    display: flex;
    align-items: center;
    flex-grow: 1;
    border-radius: 4px;
    border: 1px solid #d8d8d8;
    padding: 10px;
  }
}
</style>

