export const getTwoLongestNames = (namesStr: string) => {
  let namesArray = namesStr.split(" ");
  namesArray.sort((a, b) => b.length - a.length);
  let longestNames = namesArray.slice(0, 2);
  return longestNames.join(" ");
};
