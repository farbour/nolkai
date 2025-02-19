// file path: src/components/analysis/ComparisonBrandSelector.tsx
import { Listbox, Transition } from '@headlessui/react';

import { Fragment } from 'react';

interface ComparisonBrandSelectorProps {
  availableBrands: string[];
  selectedBrand: string | null;
  onChange: (brand: string | null) => void;
  currentBrand: string;
}

export function ComparisonBrandSelector({
  availableBrands,
  selectedBrand,
  onChange,
  currentBrand,
}: ComparisonBrandSelectorProps) {
  const filteredBrands = availableBrands.filter(brand => brand !== currentBrand);

  return (
    <Listbox value={selectedBrand} onChange={onChange}>
      <div className="relative w-72">
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 sm:text-sm sm:leading-6">
          <span className="block truncate">
            {selectedBrand || 'Select comparison brand'}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <span className="text-gray-400 text-xs">▼</span>
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredBrands.map((brand) => (
              <Listbox.Option
                key={brand}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-green-50 text-green-900' : 'text-gray-900'
                  }`
                }
                value={brand}
              >
                {({ selected, active }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? 'font-medium' : 'font-normal'
                      }`}
                    >
                      {brand}
                    </span>
                    {selected ? (
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                          active ? 'text-green-600' : 'text-green-600'
                        }`}
                      >
                        <span className="text-sm">✓</span>
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}