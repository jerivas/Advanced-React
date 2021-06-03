/* eslint-disable react/jsx-props-no-spreading */

import { useLazyQuery } from '@apollo/client';
import { resetIdCounter, useCombobox } from 'downshift';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/router';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

const SEARCH_PRODUCTS_QUERY = gql`
  query SEARCH_PRODUCTS_QUERY($searchTerm: String!) {
    searchResults: allProducts(
      where: {
        OR: [
          { name_contains_i: $searchTerm }
          { description_contains_i: $searchTerm }
        ]
      }
    ) {
      id
      name
      photo {
        altText
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

export default function Search() {
  const router = useRouter();
  const [search, { loading, data, error }] = useLazyQuery(
    SEARCH_PRODUCTS_QUERY,
    {
      fetchPolicy: 'no-cache',
    }
  );
  const results = data?.searchResults || [];

  const searchDebounced = debounce(search, 350);
  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    getItemProps,
    highlightedIndex,
  } = useCombobox({
    items: results,
    onInputValueChange({ inputValue }) {
      searchDebounced({ variables: { searchTerm: inputValue } });
    },
    onSelectedItemChange({ selectedItem }) {
      router.push({
        pathname: `/product/${selectedItem.id}`,
      });
    },
    itemToString(item) {
      return item?.name || '';
    },
  });

  resetIdCounter();
  return (
    <SearchStyles>
      <div {...getComboboxProps()}>
        <input
          {...getInputProps({
            type: 'search',
            id: 'search',
            className: loading ? 'loading' : '',
          })}
        />
      </div>
      <DropDown {...getMenuProps()}>
        {isOpen &&
          results.map((product, i) => (
            <DropDownItem
              {...getItemProps({ item: product })}
              key={product.id}
              highlighted={i === highlightedIndex}
            >
              <img
                src={product.photo.image.publicUrlTransformed}
                alt={product.photo.altText}
                width="50"
              />
              {product.name}
            </DropDownItem>
          ))}
        {isOpen && !results.length && !loading && (
          <DropDownItem>No results found</DropDownItem>
        )}
      </DropDown>
    </SearchStyles>
  );
}
