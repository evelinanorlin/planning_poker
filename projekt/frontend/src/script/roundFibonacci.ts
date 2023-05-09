export function roundFibonacci(value: number){
  const fibonaccis: number[] = [8, 5, 3, 2, 1, 0];
  const distanceFibonacci: number[] = [];

  fibonaccis.map(fibonacci => {
    const distance = Math.abs(value - fibonacci);
    distanceFibonacci.push(distance)
  })

  const min = Math.min(...distanceFibonacci);
  const minIndex = distanceFibonacci.indexOf(min);
  const roundedFibonacci = fibonaccis[minIndex];
  return roundedFibonacci;
}

