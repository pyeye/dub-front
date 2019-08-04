<template>
  <div class="price">
    <slot name="oldPrice">
      <span class="price-old" v-if="specialPrice">
        {{ regularPrice }} &#x20bd;
      </span>
    </slot>

    <slot name="specialPrice">
      <span class="price-special" v-if="specialPrice">
        {{ specialPrice }} &#x20bd;
      </span>
    </slot>

    <slot name="regularPrice">
      <span class="price-regular"  v-if="!specialPrice">
        {{ regularPrice }} &#x20bd;
      </span>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'DubPrice',
  props: {
    regularPrice: {
      type: String,
      default: null,
    },
    specialPrice: {
      type: String,
      default: null,
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.column {
  @include prefix(
    (
      display: flex,
      flex-direction: column,
    ),
    webkit ms
  );
}
.price {
  @include prefix(
    (
      align-self: flex-end,
    ),
    webkit ms
  );
  padding-top: 8px;
  font-family: 'Roboto', sans-serif;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.032em;
  line-height: 28px;
}
.price-special {
  color: #e83841;
}
.price-old {
  align-self: flex-end;
  text-decoration: line-through;
  font-size: 14px;
  line-height: 14px;
  opacity: 0.6;
  margin-right: 6px;
}
.price-regular {
  opacity: 0.7;
}
</style>
