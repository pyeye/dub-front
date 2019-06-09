<template>
  <div class="btn-group">
    <li @click="toggleMenu()" class="dropdown-toggle" v-if="selectedOption.name !== undefined">
      {{ selectedOption.name }}
      <span class="caret"></span>
    </li>

    <li @click="toggleMenu()" class="dropdown-toggle" v-if="selectedOption.name === undefined">
      {{placeholderText}}
      <span class="caret"></span>
    </li>

    <ul class="dropdown-menu" v-if="showMenu">
      <li v-for="(option, index) in options" :key="index">
        <a href="javascript:void(0)" @click="updateOption(option)">{{ option.name }}</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'DubSelect',
  data() {
    return {
      selectedOption: {
        name: '',
      },
      showMenu: false,
      placeholderText: 'Please select an item',
    };
  },
  props: {
    options: {
      type: [Array, Object],
    },
    selected: {},
    placeholder: [String],
  },

  mounted() {
    this.selectedOption = this.selected;
    if (this.placeholder) {
      this.placeholderText = this.placeholder;
    }
  },

  methods: {
    updateOption(option) {
      this.selectedOption = option;
      this.showMenu = false;
      this.$emit('updateOption', this.selectedOption);
    },

    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-group {
  min-width: 160px;
  position: relative;
  display: inline-block;
  vertical-align: middle;
}
.btn-group a:hover {
  text-decoration: none;
}

.dropdown-toggle {
  color: $text_color;
  font-size: 14px;
  font-weight: 600;
  opacity: 0.7;
  min-width: 160px;
  padding: 0 6px 4px 6px;
  text-transform: none;
  border: 0;
  background-image: linear-gradient(#009688, #009688), linear-gradient(#d2d2d2, #d2d2d2);
  background-size: 0 2px, 100% 1px;
  background-repeat: no-repeat;
  background-position: center bottom, center calc(100% - 1px);
  background-color: transparent;
  transition: background 0s ease-out;
  float: none;
  box-shadow: none;
  border-radius: 0;
}
.dropdown-toggle:hover {
  cursor: pointer;
  background-image: linear-gradient($primary_color, $primary_color),
    linear-gradient($primary_color, $primary_color);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  float: left;
  min-width: 160px;
  list-style: none;
  font-size: 14px;
  text-align: left;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  background-clip: padding-box;
}

.dropdown-menu > li > a {
  padding: 8px 16px;
  display: block;
  clear: both;
  font-weight: normal;
  line-height: 1.6;
  color: $text_color;
  font-size: 14px;
  font-weight: 600;
  opacity: 0.7;
  white-space: nowrap;
  text-decoration: none;
}
.dropdown-menu > li > a:hover {
  background: $primary_color;
}

.dropdown-menu > li {
  overflow: hidden;
  width: 100%;
  position: relative;
  margin: 0;
}

.caret {
  display: relative;
  width: 0;
  position: relative;
  top: 10px;
  height: 0;
  margin-left: 8px;
  vertical-align: middle;
  border-top: 4px dashed;
  border-top: 4px solid \9;
  border-right: 4px solid transparent;
  border-left: 4px solid transparent;
  float: right;
}

li {
  list-style: none;
}
</style>
