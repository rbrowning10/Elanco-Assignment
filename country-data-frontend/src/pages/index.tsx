// import { useState, useEffect } from 'react';
// import axios from 'axios';

// export default function Home() {
//   const [countries, setCountries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');

//   useEffect(() => {
//     const fetchCountries = async () => {
//       try {
//         const response = await axios.get('http://localhost:3001/countries');
//         setCountries(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to load countries');
//         setLoading(false);
//       }
//     };
//     fetchCountries();
//   }, []);

//   if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
//   if (error) return <p className="text-red-500">{error}</p>;

//   const filteredCountries = countries.filter((country: any) =>
//     country.name.includes(searchTerm)
//   );

//   return (
//     <div className="p-6">
//       {/* Search Input */}
//       <div className="mb-4">
//         <label className="block text-gray-700">
//           Search for a Country
//         </label>
//         <input
//           id="search"
//           type="text"
//           placeholder="Enter country name"
//           className="border border-gray-300"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       {/* Display filtered countries */}
//       <div className="grid grid-cols-4">
//         {filteredCountries.length > 0 ? (
//           filteredCountries.map((country) => (
//             <div key={country.name} className="bg-white rounded-lg shadow-md p-4">
//               {/* Accessing the flag from the 'flag' property */}
//               {country.flag ? (
//                 <img
//                   className="w-10 h-10 object-cover"
//                   src={country.flag}
//                   alt={`Flag of ${country.name}`}
//                 />
//               ) : (
//                 <p className="text-center">No Flag Available</p>
//               )}
//               <div className="mt-2 text-center">
//                 <h2>{country.name}</h2>
//                 <p>{country.region}</p>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-gray-500">No countries found.</p>
//         )}
//       </div>
//     </div>
//   );
// };

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
  const [selectedRegion, setSelectedRegion] = useState(''); // Selected region state

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

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <p className="text-red-500">{error}</p>;

  // const filteredCountries = countries.filter((country) =>
  //   country.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

   // Filter countries by search term and selected region
   const filteredCountries = countries.filter((country: any) => {
    const matchesSearchTerm = country.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion ? country.region === selectedRegion : true; // If no region selected, show all
    return matchesSearchTerm && matchesRegion;
  });

  return (
    <div className="p-6">
      {/* Search Input */}
      <div className="mb-4">
        <label className="block text-gray-700">
          Search for a Country
        </label>
        <input
          id="search"
          type="text"
          placeholder="Enter country name"
          className="border border-gray-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

            {/* Region Dropdown */}
            <div className="mb-4">
        <label className="block text-gray-700">Filter by Region</label>
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)} // Update selected region
          className="border border-gray-300"
        >
          <option value="">All Regions</option>
          <option value="Africa">Africa</option>
          <option value="Americas">Americas</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="Oceania">Oceania</option>
        </select>
      </div>

      {/* Display filtered countries */}
      <div className="grid grid-cols-4">
        {filteredCountries.length > 0 ? (
          filteredCountries.map((country) => (
            <div
              key={country.name}
              className="bg-white rounded-lg shadow-md p-4 border-2 border-black flex items-center"
            >
              {/* Flag column */}
              <div className="flex-shrink-0 flex justify-center items-center w-16 h-16">
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
              <div className="flex flex-col justify-center items-center flex-grow">
                <h2 className="text-center">{country.name}</h2>
                <p className="text-center">{country.region}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No countries found.</p>
        )}
      </div>
    </div>
  );
};

