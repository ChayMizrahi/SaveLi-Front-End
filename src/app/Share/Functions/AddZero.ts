    
  /**
   * Help function the get number check if his small then 10 and if is it return the number with 0 in the start.
   * Example : 2 -> 02
   * @param i 
   */
  export function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }