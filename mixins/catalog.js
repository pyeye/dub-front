import debounce from '@/plugins/utils/debounce';

export default {
  data: () => ({
    filters: {
      sfacets: [],
      nfacets: [],
      tags: [],
      page: {
        total: 1,
        current: 1,
        size: 24,
      },
      sort: {
        by: {
          name: 'названию (А-Я)',
          value: 'name-asc',
        },
        options: [],
      },
    },
  }),
  created() {
    const { query } = this.$route;
    this.filters = this.getFilters(query);
  },
  computed: {
    debounceSliderHandler() {
      return debounce(this.sliderHandler, 500);
    },
    debounceUpdateQuery() {
      return debounce(this.updateQuery, 500);
    },
  },
  methods: {
    encodeTags(tags) {
      const encodedTags = tags.map(tag => tag.pk);
      return encodedTags.length === 0 ? [] : encodedTags.join();
    },
    encodeSFacet(facets) {
      const facetsQuery = {};
      const encodedFacets = [];
      facets.forEach(facet => {
        if (facet.facetSlug in facetsQuery === false) {
          facetsQuery[facet.facetSlug] = [];
        }
        facetsQuery[facet.facetSlug].push(facet.pk);
      });
      Object.keys(facetsQuery).forEach(key => {
        const codes = facetsQuery[key].join(',');
        const str = `${key}:${codes}`;
        encodedFacets.push(str);
      });
      return encodedFacets;
    },
    encodeNFacet(facets) {
      const encodedFacets = [];
      facets.forEach(facet => {
        const [minVal, maxVal] = facet.value;
        if (minVal !== facet.stats.min || maxVal !== facet.stats.max) {
          const str = `${facet.slug}:${minVal}-${maxVal}`;
          encodedFacets.push(str);
        }
      });
      return encodedFacets;
    },
    decodeTags(queryTags) {
      if (queryTags === undefined) {
        return [];
      }
      const decodedTags = [];
      const tagsCodes = queryTags.split(',').map(Number);
      tagsCodes.forEach(tagCode => {
        const tag = this.tags.find(t => t.pk === tagCode);
        const decodedTag = {
          name: tag.name,
          pk: tag.pk,
        };
        decodedTags.push(decodedTag);
      });
      return decodedTags;
    },
    decodeSFacets(queryFacets) {
      let decodedFacets = [];
      if (queryFacets === undefined) {
        return [];
      }

      if (Array.isArray(queryFacets)) {
        queryFacets.forEach(queryFacet => {
          const decodedFacet = this.decodeSFacet(queryFacet);
          decodedFacets = decodedFacets.concat(decodedFacet);
        });
      } else {
        decodedFacets = this.decodeSFacet(queryFacets);
      }
      return decodedFacets;
    },
    decodeSFacet(queryFacet) {
      const [slug, strCodes] = queryFacet.split(':');
      const codes = strCodes.split(',').map(Number);
      const facet = this.facets.sfacets.find(f => f.slug === slug);
      const values = facet.values.filter(v => codes.includes(v.pk));
      return values.map(value => ({
        facetSlug: facet.slug,
        facetName: facet.name,
        pk: value.pk,
        name: value.name,
        count: value.count,
      }));
    },
    decodeNFacets(queryFacets) {
      const { nfacets } = this.facets;
      const decodedFacets = nfacets.map(nfacet => ({
        slug: nfacet.slug,
        name: nfacet.name,
        suffix: nfacet.suffix,
        stats: {
          min: nfacet.stats.min,
          max: nfacet.stats.max,
        },
        value: [nfacet.stats.min, nfacet.stats.max],
      }));

      if (typeof queryFacets !== 'undefined') {
        if (Array.isArray(queryFacets)) {
          queryFacets.forEach(queryFacet => {
            const [slug, stats] = queryFacet.split(':');
            const [minVal, maxVal] = stats.split('-').map(Number);
            const facetIndex = decodedFacets.findIndex(facet => facet.slug === slug);
            decodedFacets[facetIndex].value = [minVal, maxVal];
          });
        } else {
          const [slug, stats] = queryFacets.split(':');
          const [minVal, maxVal] = stats.split('-').map(Number);
          const facetIndex = decodedFacets.findIndex(facet => facet.slug === slug);
          decodedFacets[facetIndex].value = [minVal, maxVal];
        }
      }

      return decodedFacets;
    },
    getFilters(query) {
      const defaultFilters = this.filters;
      const sfacets = this.decodeSFacets(query.sfacets);
      const nfacets = this.decodeNFacets(query.nfacets);
      const tags = this.decodeTags(query.tags);

      const { page } = defaultFilters;
      if (query.page !== undefined) {
        page.current = Number(query.page);
      }
      page.total = Math.ceil(this.totalProducts / page.size);

      const { sort } = defaultFilters;
      sort.options = [
        { name: 'цене (по возрастанию)', value: 'price-asc' },
        { name: 'цене (по убыванию)', value: 'price-desc' },
        { name: 'названию (А-Я)', value: 'name-asc' },
        { name: 'названию (Я-А)', value: 'name-desc' },
      ];
      if (query.sort !== undefined) {
        const queryOption = sort.options.find(option => option.value === query.sort);
        sort.by = queryOption;
      }

      return {
        sfacets,
        nfacets,
        tags,
        page,
        sort,
      };
    },
    async updateQuery() {
      const query = Object.assign({}, this.$route.query);
      const { category } = this.$route.params;
      query.sfacets = this.encodeSFacet(this.filters.sfacets);
      query.nfacets = this.encodeNFacet(this.filters.nfacets);
      query.tags = this.encodeTags(this.filters.tags);
      this.$router.push({ query });
      const [products, facets, tags] = await Promise.all([
        this.$api.getProducts({ category, query }),
        this.$api.getFacets({ category, query }),
        this.$api.getTags({ category, query }),
      ]);
      this.tags = tags;
      this.products = products.items;
      this.totalProducts = products.total;
      this.facets = facets;
    },
    async sliderHandler(payload) {
      const { value, nfacet } = payload;
      const nfacetIndex = this.filters.nfacets.findIndex(n => n.slug === nfacet.slug);
      this.filters.nfacets[nfacetIndex].value = value;
      await this.updateQuery();
    },
    async numberHandler(payload) {
      const { value, nfacet, type } = payload;
      const [minVal, maxVal] = nfacet.value;
      const nfacetIndex = this.filters.nfacets.findIndex(n => n.slug === nfacet.slug);
      if (type === 'min') {
        this.filters.nfacets[nfacetIndex].value = [Number(value), maxVal];
      } else {
        this.filters.nfacets[nfacetIndex].value = [minVal, Number(value)];
      }
      await this.debounceUpdateQuery();
    },
    async tagHandler(tag) {
      const index = this.filters.tags.findIndex(t => t.pk === tag.pk);
      if (index === -1) {
        this.filters.tags.push(tag);
      } else {
        this.filters.tags.splice(index, 1);
      }
      await this.updateQuery();
    },
    async paginationHandler(e) {
      this.filters.page.current = e;
      const query = Object.assign({}, this.$route.query);
      const { category } = this.$route.params;
      query.sfacets = this.encodeSFacet(this.filters.sfacets);
      query.nfacets = this.encodeNFacet(this.filters.nfacets);
      query.tags = this.encodeTags(this.filters.tags);
      query.page = this.filters.page.current;
      this.$router.push({ query });
      const products = await this.$api.getProducts({ category, query });
      this.products = products.items;
      this.totalProducts = products.total;
    },
    async selectHandler(e) {
      this.filters.sort.by = e;
      const query = Object.assign({}, this.$route.query);
      const { category } = this.$route.params;
      query.sfacets = this.encodeSFacet(this.filters.sfacets);
      query.nfacets = this.encodeNFacet(this.filters.nfacets);
      query.tags = this.encodeTags(this.filters.tags);
      query.sort = this.filters.sort.by.value;
      this.$router.push({ query });
      const products = await this.$api.getProducts({ category, query });
      this.products = products.items;
      this.totalProducts = products.total;
    },
    async checkboxHandler(payload) {
      const sfacetIndex = this.filters.sfacets.findIndex(s => s.pk === payload.pk);
      if (sfacetIndex === -1) {
        this.filters.sfacets.push(payload);
      } else {
        this.filters.sfacets.splice(sfacetIndex, 1);
      }
      await this.updateQuery();
    },
    async deleteBadge(e) {
      if (e.filter.type === 'nfacets') {
        const index = this.filters.nfacets.findIndex(nfacet => nfacet.slug === e.filter.slug);
        const { stats } = this.filters.nfacets[index];
        this.filters.nfacets[index].value = [stats.min, stats.max];
      } else if (e.filter.type === 'sfacets') {
        const index = this.filters.sfacets.findIndex(sfacet => sfacet.slug === e.filter.slug);
        this.filters.sfacets.splice(index, 1);
      } else if (e.filter.type === 'tags') {
        const index = this.filters.tags.findIndex(tag => tag.pk === e.pk);
        this.filters.tags.splice(index, 1);
      }
      await this.updateQuery();
    },
    updateFacetValues(payload) {
      const { facet, values } = payload;
      const facetIndex = this.facets.sfacets.findIndex(sfacet => sfacet.slug === facet.slug);
      this.facets.sfacets[facetIndex].values = values;
    },
  },
};
