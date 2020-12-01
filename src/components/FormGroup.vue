<template>
  <div class="form-group">
    <div class="label">{{ label }}</div>
    <input
      v-if="!values"
      v-model="model"
      :type="type"
      :disabled="disabled"
      :placeholder="placeholder"
      :max="max"
      :min="min"
      @change="handleChange">

    <label v-else-if="values.length" v-for="(item, index) in values" :key="index">
      <input
        v-model="model"
        :type="type"
        :disabled="disabled"
        @change="handleChange"
        :placeholder="placeholder"
        :value="item.value"
        :checked="item.value === model">{{ item.text }}
    </label>
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
    },
    values: {
      type: Array
    },
    max: {
      type: Number
    },
    min: {
      type: Number
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
      if (this.type === 'number') {
        // 转化数字
        this.model *= 1
      }
      this.$emit('input', this.model)
    }
  }
}
</script>

<style lang="stylus" scoped>
.form-group {
  display: flex;
  align-items: center;
  padding: 10px 20px;

  .label {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-shrink: 0;
  }

  label + label {
    margin-left: 20px;
  }

  // input[type=password],  可以添加更多类型
  input[type=number],
  input[type=text] {
    display: flex;
    align-items: center;
    flex-grow: 1;
    border-radius: 4px;
    border: 1px solid #d8d8d8;
    padding: 10px;
  }
}
</style>

