export const toImperial = (inches: number, precision = 1) => {
  const feet = Math.floor(inches / 12);
  const remainingInches = inches % 12;
  return `${feet}' ${remainingInches.toFixed(precision)}"`;
};

export const toMetric = (inches: number, precision = 1) => {
  const cm = inches * 2.54;
  return `${cm.toFixed(precision)} cm`;
};
