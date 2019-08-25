const defaultFilters = {
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
      label: 'названию',
      code: 'name',
      direction: 'none',
    },
    options: [{ code: 'name', label: 'названию' }, { code: 'date', label: 'дате' }],
  },
};

const decodeSFacet = (queryFacet, sfacets) => {
  const [slug, strCodes] = queryFacet.split(':');
  const codes = strCodes.split(',').map(Number);
  const facet = sfacets.find(f => f.slug === slug);
  const values = facet.values.filter(v => codes.includes(v.pk));
  return values.map(value => ({
    facetSlug: facet.slug,
    facetName: facet.name,
    pk: value.pk,
    name: value.name,
    count: value.count,
  }));
};

const decodeSFacets = (queryFacets, sfacets) => {
  let decodedFacets = [];
  if (queryFacets === undefined) {
    return [];
  }

  if (Array.isArray(queryFacets)) {
    queryFacets.forEach(queryFacet => {
      const decodedFacet = decodeSFacet(queryFacet, sfacets);
      decodedFacets = decodedFacets.concat(decodedFacet);
    });
  } else {
    decodedFacets = decodeSFacet(queryFacets, sfacets);
  }
  return decodedFacets;
};

const decodeNFacets = (queryFacets, nfacets) => {
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
};

const decodeTags = (queryTags, tags) => {
  if (queryTags === undefined || queryTags.length === 0) {
    return [];
  }
  const decodedTags = [];
  const tagsCodes = queryTags.split(',').map(Number);
  tagsCodes.forEach(tagCode => {
    const tag = tags.find(t => t.pk === tagCode);
    const decodedTag = {
      name: tag.name,
      pk: tag.pk,
    };
    decodedTags.push(decodedTag);
  });
  return decodedTags;
};

export const getFilters = (query, products, facets, tags) => {
  const decodedSfacets = decodeSFacets(query.sfacets, facets.sfacets);
  const decodedNfacets = decodeNFacets(query.nfacets, facets.nfacets);
  const decodedTags = decodeTags(query.tags, tags);

  const { page } = defaultFilters;
  if (query.page !== undefined) {
    page.current = Number(query.page);
  }
  page.total = Math.ceil(products.total / page.size);

  const { sort } = defaultFilters;
  if (query.sort !== undefined) {
    const [querySortCode, querySortDirection] = query.sort.split('-');
    const queryOption = sort.options.find(option => option.code === querySortCode);
    sort.by = { ...queryOption, direction: querySortDirection };
  }
  const filters = {
    sfacets: decodedSfacets,
    nfacets: decodedNfacets,
    tags: decodedTags,
    page,
    sort,
  };

  return { ...defaultFilters, ...filters };
};

const encodeSFacets = facets => {
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
};

const encodeNFacets = facets => {
  const encodedFacets = [];
  facets.forEach(facet => {
    const [minVal, maxVal] = facet.value;
    if (minVal !== facet.stats.min || maxVal !== facet.stats.max) {
      const str = `${facet.slug}:${minVal}-${maxVal}`;
      encodedFacets.push(str);
    }
  });
  return encodedFacets;
};

const encodeTags = tags => {
  const encodedTags = tags.map(tag => tag.pk);
  return encodedTags.length === 0 ? [] : encodedTags.join();
};

export const getQuery = filters => {
  const { sfacets, nfacets, tags } = filters;
  const encodedSfacets = encodeSFacets(sfacets);
  const encodedNfacets = encodeNFacets(nfacets);
  const encodedTags = encodeTags(tags);
  return {
    sfacets: encodedSfacets,
    nfacets: encodedNfacets,
    tags: encodedTags,
  };
};

export default {
  getFilters,
  getQuery,
};
