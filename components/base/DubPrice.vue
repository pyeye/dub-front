<template>
  <div class="price">
    <div v-if="specialPrice">
      <span class="price-old">
        {{ regularPrice }} &#x20bd;
      </span>
      <span class="price-special">
        {{ specialPrice }} &#x20bd;
      </span>
    </div>

    <div v-if="!specialPrice">
      <span class="price-regular">
        {{ regularPrice }} &#x20bd;
      </span>
    </div>
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
</style>
