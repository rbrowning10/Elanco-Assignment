import { useState, useEffect } from 'react';
import axios from 'axios';

// Define the interface for a Country
interface Country {
  name: string;
  flag: string;
  region: string;
}

export default function Home() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('http://localhost:3001/countries');
        // name a-z
        const sortedCountries = response.data.sort((a: any, b: any) =>
          a.name.localeCompare(b.name)
        );
        setCountries(sortedCountries);
        setLoading(false);
      } catch (err) {
        setError('Failed to load countries');
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        {/* Loading spinner */}
        <div role="status" aria-live="polite" className="loader border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  // Filter countries by search term and selected region
  const filteredCountries = countries.filter((country: any) => {
    const matchesSearchTerm = country.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion ? country.region === selectedRegion : true; // If no region selected, show all
    return matchesSearchTerm && matchesRegion;
  });

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
        {/* Search Input */}
        <div className="w-full sm:w-1/2 mb-4 sm:mb-0">
          <label htmlFor="search" className="block text-gray-700 mb-2">
            Search for a Country
          </label>
          <input
            id="search"
            type="text"
            aria-label="Search countries"
            placeholder="Enter country name"
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Region Dropdown */}
        <div className="w-full sm:w-1/2">
          <label htmlFor="region-select" className="block text-gray-700 mb-2">Filter by Region</label>
          <select
            id="region-select"
            aria-label="Select region"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Regions</option>
            <option value="Africa">Africa</option>
            <option value="Americas">Americas</option>
            <option value="Asia">Asia</option>
            <option value="Europe">Europe</option>
            <option value="Oceania">Oceania</option>
          </select>
        </div>
      </div>

      {/* Display filtered countries */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCountries.length > 0 ? (
          filteredCountries.map((country) => (
            <div
              key={country.name}
              className="bg-white rounded-lg shadow-md p-4 border-2 border-black hover:shadow-lg hover:border-blue-500 hover:scale-105 transition-transform duration-300 transform focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {/* Flag column */}
              <div className="flex-shrink-0 flex justify-center items-center w-16 h-16 mx-auto mb-4">
                {country.flag ? (
                  <img
                    className="w-full h-full object-contain"
                    src={country.flag}
                    alt={`Flag of ${country.name}`}
                  />
                ) : (
                  <p>No Flag Available</p>
                )}
              </div>

              {/* Text column (centered content) */}
              <div className="text-center">
                <h2 className="font-bold text-lg">{country.name}</h2>
                <p className="text-gray-500">{country.region}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center mt-4">
            <p className="text-gray-500">No countries found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
