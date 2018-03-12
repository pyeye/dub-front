<template>
<div class="main">
  <div class="label" :class="[{'label-active': isFocus || value}, {'label-focus': isFocus }]">{{ $props.placeholder }}</div>
  <div class="dub-input" :class="[{'input-focus': isFocus}]" @mouseover="isHover = true" @mouseleave="isHover = false">
      <input 
        class="input-element" 
        v-bind="$props" 
        @input="$emit('input', $event.target.value)"
        @focus="focusHandler()"
        @blur="blurHandler()"
      >
  </div>
  <div class="info">
    <slot name="info"></slot>
  </div>
  
</div>
  
  
</template>

<script>

export default {
  name: 'DubInput',
  props: {
    value: [String, Number],
    placeholder: String,
    name: String,
    id: String,
    disabled: Boolean,
    label: String,
    hasError: Boolean,
    type: {
      type: String,
      default: 'text',
    },
  },

  data: () => ({
    isHover: false,
    isFocus: false,
  }),
  methods: {
    focusHandler() {
      this.isFocus = true;
      this.$emit('focus');
    },
    blurHandler() {
      this.isFocus = false;
      this.$emit('blur');
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

input { border-style: none; background: transparent; outline: none; }
button { padding: 0; background: none; border: none; outline: none; }

.main {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 24px 0 0 0;
   

    &:hover {
      

      .dub-input:not(.input-focus):after {
        background-color:  lighten($text_color, 20%);
      }

      .label:not(.label-focus) {
        color:  lighten($text_color, 20%);
      }

    }
}

.dub-input {
    position: relative;
    display: flex;
    flex-direction: row;
    width: 100%;

    border-radius: 2px;
    padding: 0 0 6px 0;
   

    &:after {
    content: "";
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 0px;
    z-index: 999;
    height: 2px;
    background-position: 0% 0%;
    background-color:  lighten($text_color, 50%);
    background-size: 500% auto;
    transition: background-color .25s ease;
  }

  input {
        flex-grow: 1;
        color: lighten($text_color, 20%);
        font-size: 16px;
        line-height: 24px;
        vertical-align: middle;

        &::-webkit-input-placeholder {
        color: lighten($text_color, 40%);
        transition: color .25s ease;
        }

        &:focus::-webkit-input-placeholder {
          color:transparent;
        }

        &:disabled {
           color: lighten($text_color, 40%);
        }
  }
}

.info {
  font-size: 12px;
  margin-top: 6px;
  min-height: 20px;
}

.label {
  position: absolute;
  top: 24px;
  transition: top .25s ease, opacity .25s ease, color .25s ease;
  opacity: 0;
  
  // Some nice styling
  font-size: 14px;
  font-weight: 600;
  color: lighten($text_color, 40%);
  z-index: -1;

}

.label-active {
  z-index: 1;
  opacity: 1;
  top: 4px;
}

.label-focus {
  color: $primary_color;
}

.input-focus:after{
  background-color: $primary_color;
}


.error-input {
  .dub-input:after{
    background-color: $error_color !important;
  }

  .label {
    color: $error_color !important;
  }

  input::-webkit-input-placeholder {
    color: $error_color;
    transition: color .25s ease;
  }

  input:focus::-webkit-input-placeholder {
    color:transparent;
  }

  .info {
    color: $error_color;      
  }
}

</style>
