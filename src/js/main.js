function getCombinations(arr, n) {
  let result = [];
  function backtrack(tempList, remaining, start) {
    if (remaining === 0) {
      result.push([...tempList]);
      return;
    }
    if (remaining < 0) {
      return;
    }
    for (let i = start; i < arr.length; i++) {
      if (tempList.includes(arr[i])) {
        continue;
      }
      tempList.push(arr[i]);
      backtrack(tempList, remaining - arr[i], i + 1);
      tempList.pop();
    }
  }
  backtrack([], n, 0);
  return Array.from(new Set(result.map(JSON.stringify)), JSON.parse);
}
