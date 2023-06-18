// function LCS(X, Y) {
//   let m = X.length;
//   let n = Y.length;
//   let L = Array(m + 1)
//     .fill()
//     .map(() => Array(n + 1).fill(0));

//   for (let i = 0; i <= m; i++) {
//     for (let j = 0; j <= n; j++) {
//       if (i == 0 || j == 0) L[i][j] = 0;
//       else if (X[i - 1] == Y[j - 1]) L[i][j] = L[i - 1][j - 1] + 1;
//       else L[i][j] = Math.max(L[i - 1][j], L[i][j - 1]);
//     }
//   }
//   console.log(L);
//   return L[m][n];
// }

// let X = "ABCBDAB";
// let Y = "BDCAB";
// console.log("Length of LCS is ", LCS(X, Y));

// function LCS(X, Y) {
//   let m = X.length;
//   let n = Y.length;
//   const dp = Array(m + 1)
//     .fill(0)
//     .map(() => Array(n + 1).fill(0));

//   for (let i = 1; i <= m; i++) {
//     for (let j = 1; j <= n; j++) {
//       if (i === 0 || j === 0) {
//         dp[i][j] = 0;
//       } else if (X[i - 1] == Y[j - 1]) {
//         dp[i][j] = dp[i - 1][j - 1] + 1;
//       } else {
//         // dp[i][j] = dp[i - 1][j - 1];
//         dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
//       }
//     }
//   }

//   return dp[m][n];
// }

// let X = "ABCBDAB";
// let Y = "BDCAB";
// console.log("Length of LCS is ", LCS(X, Y));

// function knapsackProblem(weights, values, maxWeight) {
//   const dp = Array(values.length + 1)
//     .fill(0)
//     .map(() => Array(maxWeight + 1).fill(0));

//   for (let i = 1; i <= values.length; i++) {
//     for (let w = 1; w <= maxWeight; w++) {
//       if (weights[i - 1] <= w) {
//         dp[i][w] = Math.max(
//           values[i - 1] + dp[i - 1][w - weights[i - 1]],
//           dp[i - 1][w]
//         );
//       } else {
//         dp[i][w] = dp[i - 1][w];
//       }
//     }
//   }

//   return dp[values.length][maxWeight];
// }

// const weights = [2, 3, 4, 5];
// const values = [3, 4, 5, 6];
// const maxWeight = 5;

// console.log(knapsackProblem(weights, values, maxWeight));

// console.log(knapsackProblem([5, 10, 15, 20], [20, 15, 10, 5], 100));

// function knapsack(sackMaxSack, weights, values) {
//   const dp = Array(values.length + 1)
//     .fill(0)
//     .map(() => Array(sackMaxSack + 1).fill(0));

//   for (let i = 1; i <= values.length; i++) {
//     for (let w = 1; w <= sackMaxSack; w++) {
//       if (weights[i - 1] <= w) {
//         dp[i][w] = Math.max(
//           values[i - 1] + dp[i - 1][w - weights[i - 1]],
//           dp[i - 1][w]
//         );
//       } else {
//         dp[i][w] = dp[i - 1][w];
//       }
//     }
//   }

//   console.log(dp);

//   return dp[values.length][sackMaxSack];
// }

// console.log(knapsack(100, [20, 35, 50, 15], [15, 50, 20, 10]));

// function knapsack(maxWeight, weights, values) {
//   const Arr = Array(values.length + 1)
//     .fill(0)
//     .map(() => Array(maxWeight + 1).fill(0));

//   for (let i = 1; i <= values.length; i++) {
//     for (let w = 1; w <= maxWeight; w++) {
//       if (weights[i - 1] <= w) {
//         Arr[i][w] = Math.max(
//           values[i - 1] + Arr[i - 1][w - weights[i - 1]],
//           Arr[i - 1][w]
//         );
//       } else {
//         Arr[i][w] = Arr[i - 1][w];
//       }
//     }
//   }
//   return Arr[values.length][maxWeight];
// }

// console.log(knapsack(100, [20, 35, 50, 15], [15, 50, 20, 10]));

// function solution(matrix_sizes) {
//   const n = matrix_sizes.length;
//   let m = Array.from(Array(n + 1), () => new Array(n + 1).fill(0));
//   let p = Array(n + 1).fill(0);

//   for (let i = 0; i < n; i++) {
//     p[i] = matrix_sizes[i][0];
//     p[i + 1] = matrix_sizes[i][1];
//   }

//   for (let L = 2; L < n + 1; L++) {
//     for (let i = 1; i < n - L + 2; i++) {
//       let j = i + L - 1;
//       m[i][j] = Number.MAX_SAFE_INTEGER;
//       for (let k = i; k < j; k++) {
//         let q = m[i][k] + m[k + 1][j] + p[i - 1] * p[k] * p[j];
//         if (q < m[i][j]) {
//           m[i][j] = q;
//         }
//       }
//     }
//   }
//   return m[1][n];
// }

// console.log(
//   solution([
//     [5, 3],
//     [3, 10],
//     [10, 6],
//   ])
// ); // Output: 270

// function solution(matrix_sizes) {
//   const n = matrix_sizes.length;
//   let m = Array(matrix_sizes.length + 1)
//     .fill(0)
//     .map(() => Array(matrix_sizes.length + 1).fill(0));
//   let p = Array(n + 1).fill(0);

//   for (let i = 0; i < n; i++) {
//     p[i] = matrix_sizes[i][0];
//     p[i + 1] = matrix_sizes[i][1];
//   }

//   for (let L = 2; L < n + 1; L++) {
//     for (let i = 1; i < n - L + 2; i++) {
//       let j = i + L - 1;
//       m[i][j] = Number.MAX_SAFE_INTEGER;
//       for (let k = i; k < j; k++) {
//         let q = m[i][k] + m[k + 1][j] + p[i - 1] * p[k] * p[j];
//         if (q < m[i][j]) {
//           m[i][j] = q;
//         }
//       }
//     }
//   }

//   return m[1][n];
// }

// console.log(
//   solution([
//     [5, 3],
//     [3, 10],
//     [10, 6],
//   ])
// ); // Output: 270

// function solution(coinTypes, m) {
//   let n = coinTypes.length;
//   let dp = Array(m + 1).fill(Infinity); // 큰 값으로 초기화된 dp 테이블 생성
//   dp[0] = 0; // dp[0]은 0으로 설정

//   for (let i = 0; i < n; i++) {
//     // 각 동전에 대해서
//     for (let j = coinTypes[i]; j <= m; j++) {
//       // 해당 동전으로 만들 수 있는 모든 금액에 대해서

//       dp[j] = Math.min(dp[j], dp[j - coinTypes[i]] + 1); // 해당 금액을 만드는 최소 동전 개수 갱신
//     }
//   }

//   // 만약 m을 만들 수 없는 경우
//   if (dp[m] === Infinity) {
//     return -1; // -1 반환
//   } else {
//     return dp[m]; // 그렇지 않은 경우, m을 만드는 최소 동전 개수 반환
//   }
// }
// ------------------------------------
// function solution(coinTypes, m) {
//   let n = coinTypes.length;
//   let dp = Array(m + 1).fill(Infinity);
//   dp[0] = 0; // dp[0]은 0으로 설정

//   for (let i = 0; i < n; i++) {
//     for (let j = coinTypes[i]; j <= m; j++) {
//       dp[j] = Math.min(dp[j], dp[j - coinTypes[i]] + 1);
//     }
//   }

//   if (dp[m] === Infinity) {
//     return -1;
//   } else {
//     return dp[m];
//   }
// }

// let coinTypes = [1, 2, 5];
// let m = 15;

// console.log(solution(coinTypes, m)); // 3 출력

// 이 문제는 계단의 가장 상단에 도달하는 방법의 수를 찾는 것입니다.
// 한 번에 한 계단 또는 두 계단을 오를 수 있습니다.

// function climbStairs (n){

//   // 5 만들기 문제
//   // 1과 2를 사용해서 5를 만드는 방법은 몇가지 일까?
//   // ex) 1,1,1,1,1 , 2,2,1 ...

// }

// console.log(climbStairs(5));  // Output: 8

// 배열 내에서 가장 긴 증가하는 부분 수열의 길이를 찾는 문제입니다.

// function lengthOfLIS(nums) {
//   if (nums.length == 0) return 0;
//   let dp = new Array(nums.length).fill(1);
//   let maxans = 1;
//   for (let i = 0; i < dp.length; i++) {
//     for (let j = 0; j < i; j++) {
//       if (nums[i] > nums[j]) {
//         console.log(`first i = ${i} [${nums[i]}], j = ${j} [${nums[j]}]`);
//         dp[i] = Math.max(dp[i], dp[j] + 1);
//         console.log(dp);
//       }
//     }
//     maxans = Math.max(maxans, dp[i]);
//   }
//   return maxans;
// }

// console.log(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18])); // Output: 4

// 도로와 장애물:

// 이 문제는 2D 격자에서 장애물을 피해 목적지까지 도달하는 방법의 수를 찾는 것입니다.
// 여기서 장애물이 있는 곳으로는 이동할 수 없습니다.

// function uniquePathsWithObstacles(ob) {

// }

// console.log(
//   uniquePathsWithObstacles([
//     [0, 0, 0],
//     [0, 1, 0],
//     [0, 0, 0],
//   ])
// ); // Output: 2

// function uniquePathsWithObstacles(obstacleGrid) {
//   let m = obstacleGrid.length;
//   let n = obstacleGrid[0].length;
//   if (obstacleGrid[0][0] === 1) return 0;

//   obstacleGrid[0][0] = 1;

//   for (let i = 1; i < m; i++) {
//     obstacleGrid[i][0] =
//       obstacleGrid[i][0] === 0 && obstacleGrid[i - 1][0] === 1 ? 1 : 0;
//   }

//   for (let j = 1; j < n; j++) {
//     obstacleGrid[0][j] =
//       obstacleGrid[0][j] === 0 && obstacleGrid[0][j - 1] === 1 ? 1 : 0;
//   }
//   console.log(obstacleGrid);
//   for (let i = 1; i < m; i++) {
//     for (let j = 1; j < n; j++) {
//       if (obstacleGrid[i][j] === 0) {
//         obstacleGrid[i][j] = obstacleGrid[i - 1][j] + obstacleGrid[i][j - 1];
//       } else {
//         obstacleGrid[i][j] = 0;
//       }
//     }
//   }

//   return obstacleGrid[m - 1][n - 1];
// }

// console.log(
//   uniquePathsWithObstacles([
//     [0, 0, 0, 0, 0],
//     [0, 1, 0, 1, 0],
//     [0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0],
//     [0, 0, 0, 0, 0],
//   ])
// );

// 이 문제는 주어진 수를 합이 주어진 수와 같게 만들 수 있는 덧셈 방법의 수를 찾는 것입니다.

// function combinationSum4(nums, target) {
//   let dp = new Array(target + 1).fill(0);
//   dp[0] = 1;

//   for (let i = 1; i <= target; i++) {
//     for (let num of nums) {
//       if (i >= num) {
//         console.log(i);
//         dp[i] += dp[i - num];
//       }
//     }
//   }
//   console.log(dp);
//   return dp[target];
// }

// console.log(combinationSum4([1, 2, 3], 4)); // Output: 7

function solution(coinTypes, m) {
  let length = coinTypes.length;

  let arr = Array(m + 1).fill(Infinity);
  arr[0] = 0;

  for (let i = 0; i < length; i++) {
    // 각 동전에 대해서
    for (let j = coinTypes[i]; j <= m; j++) {
      // 해당 동전으로 만들 수 있는 모든 금액에 대해서
      arr[j] = Math.min(arr[j], arr[j - coinTypes[i]] + 1);
    }
  }

  if (arr[m] === Infinity) {
    return -1; // -1 반환
  } else {
    return arr[m]; // 그렇지 않은 경우, m을 만드는 최소 동전 개수 반환
  }
}

let coinTypes = [1, 2, 5];
let m = 15;

console.log(solution(coinTypes, m)); // 3 출력
