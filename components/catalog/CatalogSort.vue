<template>
  <div class="catalog-sort">
    <div class="sort-label">Сортировать по:</div>
    <div class="sort-items" v-for="option in options" :key="option.code" >
      <dub-sort-item
        :sort-active="active"
        :sort-option="option"
        @change-direction="changeHandler($event, option)"
      ></dub-sort-item>
    </div>
  </div>
</template>

<script>
import DubSortItem from '@/components/base/DubSortItem';

export default {
  name: 'CatalogSort',
  props: {
    options: {
      type: Array,
    },
    active: {
      type: Object,
    },
  },
  components: {
    DubSortItem,
  },
  data: () => ({}),
  methods: {
    changeHandler(e, option) {
      this.$emit('change-sort', { ...option, direction: e });
    },
  },
};
</script>

<style lang="scss" scoped>
.catalog-sort {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      justify-content: flex-end,
    ),
    webkit ms
  );
  margin: 4px 0;
}
.sort-label {
  color: $text_color;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0.16px;
  margin-right: 8px;
}
.sort-items {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );
}
</style>
