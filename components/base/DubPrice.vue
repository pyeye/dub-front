<template>
  <div class="price">
    <slot name="oldPrice">
      <span class="price-old" v-if="specialPrice">
        {{ formatPrice(regularPrice) }} &#x20bd;
      </span>
    </slot>

    <slot name="specialPrice">
      <span class="price-special" v-if="specialPrice">
        {{ formatPrice(specialPrice) }} &#x20bd;
      </span>
    </slot>

    <slot name="regularPrice">
      <span class="price-regular"  v-if="!specialPrice">
        {{ formatPrice(regularPrice) }} &#x20bd;
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
  methods: {
    formatPrice(price) {
      const [intPart, decimalPart] = price.split('.');
      return decimalPart === '00' ? intPart : price;
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
  font-family: $accent_font;
  font-size: 28px;
  font-weight: 300;
  letter-spacing: 0px;
  line-height: 36px;
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
</style>
