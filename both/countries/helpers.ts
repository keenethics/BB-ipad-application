import { BusinessDataUnit, BusinessData } from '../data-management';
import { MarketCountries, AvailableCountries } from '../countries';

export const getNotMatchedCountries = (businessData: BusinessDataUnit[], countries: { properties: string }[]) => {
  const countriesNames = businessData.reduce((acc: string[], item: BusinessDataUnit) => {
    if (acc.indexOf(item.country) === -1) {
      acc.push(item.country);
    }
    return acc;
  }, []) as string[];

  countries.forEach((c) => {
    const names = [
      countriesNames.indexOf(c.properties['name']),
      countriesNames.indexOf(c.properties['name_long']),
      countriesNames.indexOf(c.properties['formal_en']),
      countriesNames.indexOf(c.properties['admin'])
    ];

    if (names[0] !== -1 || names[1] !== -1 || names[2] !== -1 || names[3] !== -1) {
      const index = names.filter(item => item !== -1)[0];
      countriesNames.splice(index, 1);
    }
  });

  return countriesNames;
};

export const setAvailableCountries = () => {
  const countries = (BusinessData as any).aggregate([
    { $match: { country: { $ne: 'Total' } } },
    { $group: { _id: '$country' } }
  ]) as any[];

  countries.forEach((c) => {
    AvailableCountries.insert({ name: c._id });
  });
};

export const setMarketCountries = () => {
  const marketCountries = (BusinessData as any).aggregate([
    { $match: { country: { $ne: 'Total' } } },
    { $group: { _id: '$market', countries: { $addToSet: '$country' } } }
  ]) as any[];

  marketCountries.forEach((item) => {
    if (item._id) MarketCountries.insert(item);
  });
};
