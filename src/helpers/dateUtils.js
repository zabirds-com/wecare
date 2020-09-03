
export function convertFrequencyToNumber(prequency) {
  switch (prequency) {
    case 'Monthly':
      return 12;
    case 'Quarterly':
      return 4;
    case 'Half Yearly':
      return 2;
    default:
      return 1;
  }
}