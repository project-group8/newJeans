function LCS(X, Y) {
  let m = X.length;
  let n = Y.length;
  let L = Array(m + 1)
    .fill()
    .map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) {
    for (let j = 0; j <= n; j++) {
      if (i == 0 || j == 0) L[i][j] = 0;
      else if (X[i - 1] == Y[j - 1]) L[i][j] = L[i - 1][j - 1] + 1;
      else L[i][j] = Math.max(L[i - 1][j], L[i][j - 1]);
    }
  }
  console.log(L);
  return L[m][n];
}

let X = "ABCBDAB";
let Y = "BDCAB";
console.log("Length of LCS is ", LCS(X, Y));
