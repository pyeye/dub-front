<template>
  <div class="rating-product">
    <div class="product-photo">
      <div class="photo-box">
        <img class="image" :src="rating.product.main_image.thumbnail">
      </div>
    </div>
    <div class="product-name"><router-link :to="`/catalog/${rating.product.category.code}/${rating.product.pk}`"> <div class="box">{{rating.product.name}}</div> </router-link></div>
    <div class="product-rating"><div class="box"><el-rate label="Оценка" @change="ratingChangeHandler" :value="rating.rating" allow-half></el-rate></div></div>
    <div class="actions"><dub-button :active="ratingBtnActive" :disabled="ratingBtnDisabled" type="secondary" @click.native="saveRating" >сохранить</dub-button></div>
  </div>
    
</template>

<script>

export default {
  name: 'DubUserRatingItem',
  props: {
    rating: {
      required: true,
      type: Object,
    },
  },
  data: () => ({
    ratingBtnActive: false,
    ratingBtnDisabled: true,
  }),
  methods: {
    ratingChangeHandler(rating) {
      this.ratingBtnDisabled = false;
      this.$store.dispatch('user/updateRating', {
        pk: this.rating.pk,
        value: rating,
      });
    },
    saveRating() {
      this.ratingBtnActive = true;
      this.$store.dispatch('user/saveRating', {
        pk: this.rating.pk,
        value: this.rating.rating,
      }).then(() => {
        this.ratingBtnActive = false;
        this.ratingBtnDisabled = true;
        this.$notify({
          group: 'dubbel',
          title: 'Операция успешна',
          text: 'Оценка сохранена',
          type: 'success',
        });
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.rating-product {
  width: 100%;
  padding: 16px 0;
  border-bottom: 1px solid #e6e3da;
  @include prefix((
      display: flex,
      flex-direction: row,
      align-items: center, 
  ), webkit ms);

  .product-photo {
    width: 10%;
  
    .photo-box {
      text-align: center;
    }

    .image {
      height: 70px;
    }
  }

  .product-name {
    flex: 1;
    margin-left: 16px;
  }

  .product-rating {
    width: 30%; 
    text-align: center; 
  }

  .header-close {
    padding: 6px;
  }

  .actions {
    width: 15%; 
    text-align: center; 
    margin-right: 3%;
  }

  .action-icon {
    padding: 4px;
  }
}
  

.box {
    text-decoration: none;
    color: $text_color;
}

.box:hover {
    text-decoration: underline;
}

a {
    text-decoration: none;
}




</style>
