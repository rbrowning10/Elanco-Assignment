import { Request, Response } from 'express';
import axios from 'axios';

const REST_COUNTRIES_API = 'https://restcountries.com/v3.1/all';

// // Get all countries
// export const getCountries = async (req: Request, res: Response) => {
//     const response = await axios.get(REST_COUNTRIES_API);
//     const countries = response.data.map((country: any) => ({
//       name: country.name.common,
//       flag: country.flags.svg,
//       region: country.region,
//     }));
//     res.json(countries);

// };

// Get all countries
export const getCountries = async (req: Request, res: Response) => {
  try {
    // Call the helper function to get all countries' data
    const countries = await getCountriesInternal();
    res.json(countries);
  } catch (error) {
    // Return an error response if the data fetching fails
    res.status(500).json({ error: 'Failed to fetch countries data' });
  }
};

const getCountriesInternal = async () => {
  // Fetch all countries from the external API
  const response = await axios.get(REST_COUNTRIES_API);

  // Return object with optional chaining / property null checks
  return response.data.map((country: any) => ({
    name: country?.name?.common,    
    flag: country?.flags?.svg,      
    region: country?.region,        
  }));
};



// Get country by code
// export const getCountryByCode = async (req: Request, res: Response) => {
//   const { code } = req.params;
//     const response = await axios.get(`https://restcountries.com/v3.1/alpha/${code}`);
//     const country = response.data[0];
//     res.json({
//       name: country.name.common,
//       flag: country.flags.svg,
//       population: country.population,
//       languages: country.languages,
//       region: country.region,
//       currency: country.currencies,
//     });
// };

export const getCountryByCode = async (req: Request, res: Response) => {
  const { code } = req.params;
  
  try {
    // Get country with country code
    const response = await axios.get(`https://restcountries.com/v3.1/alpha/${code}`);
    
    // get first country from response array
    const country = response.data[0];

    // Return with safe property access
    res.json({
      name: country?.name?.common,                
      flag: country?.flags?.svg,                  
      population: country?.population,            
      languages: country?.languages,              
      region: country?.region,                    
      currency: country?.currencies,
    });
    
  } catch (error) {
    //return 500 error with msg
    res.status(500).json({ error: 'Failed to fetch country data' });
  }
};


// Filter countries by region
// export const filterCountriesByRegion = async (req: Request, res: Response) => {
//   const { region } = req.params;
//     const response = await axios.get(REST_COUNTRIES_API);
//     const countries = response.data.filter((country: any) => country.region === region);
//     res.json(countries);
// };

// Filter countries by region
export const filterCountriesByRegion = async (req: Request, res: Response) => {
  const { region } = req.params;
  
  console.log('Received Region:', region);  // Debugging: Log the region
  
  try {
    // Call getCountries method to retrieve all countries
    const allCountries = await getCountriesInternal();
    console.log('All Countries:', allCountries);  // Debugging: Log all countries
    
    // Filter the countries based on the region, using optional chaining to avoid errors
    const countries = allCountries.filter((country: any) =>
      country?.region.toLowerCase() === region.toLowerCase() // Compare in a case-insensitive way
    );

    // Return the filtered list of countries
    res.json(countries);
  } catch (error) {
    // Catch any errors and return a 500 status with an error message
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch countries data by region' });
  }
};



// Search countries
// export const searchCountries = async (req: Request, res: Response) => {
//   const { name, capital, region, timezone } = req.query;
//     const response = await axios.get(REST_COUNTRIES_API);
//     let countries = response.data;
//     if (name) {
//       countries = countries.filter((country: any) =>
//         country.name.common.toLowerCase().includes((name as string).toLowerCase())
//       );
//     }
//     if (capital) {
//       countries = countries.filter((country: any) =>
//         country.capital && country.capital[0].toLowerCase().includes((capital as string).toLowerCase())
//       );
//     }
//     if (region) {
//       countries = countries.filter((country: any) => country.region === region);
//     }
//     if (timezone) {
//       countries = countries.filter((country: any) => country.timezones.includes(timezone as string));
//     }
//     res.json(countries);
//   }

// Search countries
export const searchCountries = async (req: Request, res: Response) => {
  const { name, capital, region, timezone } = req.query;

  try {
    // Reuse the logic from getCountriesInternal to fetch all countries
    const allCountries = await getCountriesInternal();
    
    // Start with the full list of countries
    let countries = allCountries;

 // Filter countries by region if provided
    if (region) {
      // Normalize both region and data to lowercase for case-insensitive matching
      countries = countries.filter((country: any) => 
        country.region?.toLowerCase() === (region as string).toLowerCase()
      );
    }

    if (name) {
      countries = countries.filter((country: any) =>
        country?.name?.common?.toLowerCase().includes((name as string).toLowerCase())
      );
    }
    if (capital) {
      countries = countries.filter((country: any) =>
        country?.capital?.[0]?.toLowerCase().includes((capital as string).toLowerCase())
      );
    }
    if (timezone) {
      countries = countries.filter((country: any) => country?.timezones?.includes(timezone as string));
    }

    // return filtered list
    res.json(countries);
  } catch (error) {
    // Error 500 with msg
    res.status(500).json({ error: 'Failed to search countries' });
  }
};


