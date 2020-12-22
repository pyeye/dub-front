<template>
  <div class="badges-row">
    <div v-for="badge in badges" :key="badge.filter.index">
      <div class="badge-item" v-if="badge.filter.type === 'nfacets'">
      <div class="badge-filter-name">{{badge.filter.name}}({{badge.suffix}}):</div>
      <div class="badge-filter-value">
          {{badge.value[0]}} - {{badge.value[1]}}
      </div>
      <dub-icon class="icon" @click.native="$emit('delete-badge', badge)"><icon-close/></dub-icon>
    </div>
    <div class="badge-item" v-else>
      <div class="badge-filter-name">{{badge.filter.name}}:</div>
      <div class="badge-filter-value">
        {{badge.name}}
      </div>
      <dub-icon class="icon" @click.native="$emit('delete-badge', badge)"><icon-close/></dub-icon>
    </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterItems',
  props: {
    filters: {
      type: Object,
      requried: true,
    },
  },
  data: () => ({
    selectedInstance: {},
  }),
  computed: {
    badges() {
      const tagsBadges = this.filters.tags.map(tag => ({
        name: tag.name,
        pk: tag.pk,
        filter: {
          name: 'Тэг',
          type: 'tags',
        },
      }));
      const sfacetsBadges = this.filters.sfacets.map(sfacet => ({
        name: sfacet.name,
        pk: sfacet.pk,
        filter: {
          name: sfacet.facetName,
          type: 'sfacets',
          slug: sfacet.facetSlug,
        },
      }));
      const nfacetsBadges = this.filters.nfacets
        .filter(
          nfacet => nfacet.value[0] !== nfacet.stats.min || nfacet.value[1] !== nfacet.stats.max
        )
        .map(filteredNFacet => ({
          name: filteredNFacet.name,
          value: filteredNFacet.value,
          suffix: filteredNFacet.suffix,
          filter: {
            name: filteredNFacet.name,
            type: 'nfacets',
            slug: filteredNFacet.slug,
          },
        }));
      const sortedBadges = []
        .concat(tagsBadges, sfacetsBadges, nfacetsBadges)
        .sort((prev, next) => {
          if (prev.name > next.name) {
            return 1;
          }
          if (prev.name < next.name) {
            return -1;
          }
          return 0;
        });
      return sortedBadges;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.badges-row {
  @include prefix(
    (
      display: flex,
      flex-direction: row,
      flex-wrap: wrap,
    ),
    webkit ms
  );

  .badge-item {
    margin-right: 16px;
    padding: 4px 8px;
    color: $text_color;
    font-size: 12px;
    font-weight: 500;
    background-color: $overlay_color;
    border: 1px solid rgba(40, 40, 40, 0.2);
    @include prefix(
      (
        display: flex,
        flex-direction: row,
        align-items: center,
      ),
      webkit ms
    );
    .badge-filter-name {
      padding-right: 8px;
    }
    .icon {
      width: 16px;
      height: 16px;
      padding-left: 6px;
      padding-bottom: 2px;
      cursor: pointer;
    }
  }
}
</style>
