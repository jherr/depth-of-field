export const toImperial = (inches: number, precision = 1) => {
  const feet = Math.floor(inches / 12);
  const remainingInches = inches % 12;
  return `${feet}' ${remainingInches.toFixed(precision)}"`;
};

export const toMetric = (inches: number, precision = 1) => {
  const cm = inches * 2.54;
  const cmRounded = Number(cm.toFixed(precision));
  if (Math.abs(cmRounded) >= 100) {
    const meters = cm / 100;
    return `${meters.toFixed(precision)} m`;
  }
  return `${cmRounded.toFixed(precision)} cm`;
};
