<template>
  <dub-collapse>
    <dub-collapse-item :ref="`${facet.slug}Collapse`" v-for="facet in sfacets" :key="facet.slug">
      <div slot="header" class="collapse-title">{{facet.name}}</div>
        
      <div v-for="item in facet.values" :key="item.pk">
        <dub-check
          :value="selectedSfacets"
          :val="item"
          :label="`${item.name} (${item.count})`"
          @click.native="updateSFacets(item, facet)"
        />
      </div>
      <div
        class="show-all"
        :ref="`${facet.slug}Show`"
        @click="getAllFacetValues(facet)"
      >
        Показать все
      </div>
    </dub-collapse-item>
    
    <dub-collapse-item v-for="nfacet in nfacets" :key="nfacet.slug">
      <div slot="header" class="collapse-title">{{nfacet.name}} ({{nfacet.suffix}})</div>
      <div class="nfacet-item">
        <div class="nfacet-num-row">
          <dub-number-input
            :value="nfacet.value[0]"
            :min="nfacet.stats.min"
            :max="nfacet.stats.max"
            :step="getInterval(nfacet.stats.min, nfacet.stats.max)"
            @input="numberHandler($event, nfacet, 'min')"
          />
          <dub-number-input
            :value="nfacet.value[1]"
            :min="nfacet.stats.min"
            :max="nfacet.stats.max"
            :step="getInterval(nfacet.stats.min, nfacet.stats.max)"
            @input="numberHandler($event, nfacet, 'max')"
          />
        </div>

        <vue-slider
          class="nfacet-slider"
          :value="nfacet.value"
          :min="nfacet.stats.min"
          :max="nfacet.stats.max"
          :tooltip-placement="'bottom'"
          :lazy="true"
          :interval="getInterval(nfacet.stats.min, nfacet.stats.max)"
          @change="sliderHandler($event, nfacet)"
        ></vue-slider>
      </div>
    </dub-collapse-item>
  </dub-collapse>
</template>

<script>
import VueSlider from 'vue-slider-component/dist-css/vue-slider-component.umd.min';
import DubCollapse from '@/components/base/DubCollapse';
import DubCollapseItem from '@/components/base/DubCollapseItem';
import DubCheck from '@/components/base/DubCheck';
import DubNumberInput from '@/components/base/DubNumberInput';
import 'vue-slider-component/dist-css/vue-slider-component.css';

// import theme
import '~/assets/slider/theme.scss';

export default {
  name: 'CatalogFacets',
  components: {
    DubCollapse,
    DubCollapseItem,
    DubCheck,
    VueSlider,
    DubNumberInput,
  },
  props: {
    sfacets: {
      type: Array,
      default: () => [],
    },
    selectedSfacets: {
      type: Array,
      default: () => [],
    },
    nfacets: {
      type: Array,
      default: () => [],
    },
  },
  data: () => ({}),
  methods: {
    async getAllFacetValues(facet) {
      const { category } = this.$route.params;
      const { query } = this.$route;
      const values = await this.$api.getAllFacetValues({ category, query, facet: facet.slug });
      this.$emit('update-facet-values', { facet, values });
      this.updateCollapseComponent(facet.slug);
    },
    updateCollapseComponent(facetSlug) {
      const refKey = `${facetSlug}Collapse`;
      const showBtnRef = `${facetSlug}Show`;
      this.$refs[refKey][0].changeHeight();
      this.$refs[showBtnRef][0].style.display = 'none';
    },
    getInterval(min, max) {
      const delta = max - min;
      return delta > 10 ? 1 : 0.1;
    },
    sliderHandler(e, nfacet) {
      this.$emit('slider-selected', { value: e, nfacet });
    },
    numberHandler(e, nfacet, type) {
      this.$emit('number-selected', { value: e, nfacet, type });
    },
    updateSFacets(e, facet) {
      this.$emit('checkbox-selected', {
        facetName: facet.name,
        facetSlug: facet.slug,
        ...e,
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.collapse-title {
  position: relative;
  color: $text_color;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0px;
  line-height: 24px;
}
.show-all {
  cursor: pointer;
  color: $text_color;
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
  letter-spacing: 0.16px;
  margin-left: 34px;
  margin-top: 4px;
  &:hover {
    text-decoration: underline;
  }
}
.nfacet-item {
  padding: 6px;
}
.nfacet-slider {
  margin: 0 8px 16px 8px;
}
.nfacet-num-row {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
    ),
    webkit ms
  );
  padding-bottom: 8px;
}
</style>
