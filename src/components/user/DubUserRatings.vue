<template>
  <div class="user-ratings">
      <div class="rating-box">
        <div class="rating-header">
          <div class="header-name">Товар</div>
          <div class="header-rating">Оценка</div>
          <div class="header-actions">Операции</div>
        </div>
        <dub-user-rating-item 
          v-for="rating in ratings" 
          :key="rating.pk" 
          :rating="rating" />
      </div>
  </div>
</template>

<script>

import DubUserRatingItem from '@/components/user/DubUserRatingItem';

export default {
  name: 'DubUserRatings',
  components: {
    DubUserRatingItem,
  },
  data: () => ({
  }),
  computed: {
    ratings() {
      return this.$store.getters['user/ratings'];
    },
  },
  methods: {
  },
  created() {
    if (this.ratings.length === 0) {
      this.$store.dispatch('user/requestRatings');
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

.user-ratings {
    position: relative;
}

.rating-box {
  background-color: $upper_layer_color;
  border-radius: 2px;
  box-shadow: 0 1px 1px rgba(0,0,0,.2);
  margin-bottom: 24px;
}

.rating-header {
  width: 100%;
  padding: 16px 0;
  border-bottom: 1px solid #e6e3da;
  color: $text_color;
    font-size: 16px;
    font-weight: 600;
    opacity: .7;
    letter-spacing: -.012em;
  @include prefix((
      display: flex,
      flex-direction: row,
      align-items: center, 
  ), webkit ms);

  .header-name {    
    margin-left: 3%;
    flex: 1;
  }
    
  .header-rating {
    width: 30%;  
    text-align: center; 
  }

  .header-actions {
    width: 15%;  
    margin-right: 3%;
    text-align: center;   
  }
}


</style>
