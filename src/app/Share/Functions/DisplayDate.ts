import { addZero } from './AddZero';

  /**
   * The function recevied date and return string that dispalays the date on the date in friendly way.
   * @param date must be date.
   */
  export function displayDate(date:Date):string{
    var d = new Date(date);
    var day = d.getDate();
    var month = d.getMonth()+1;
    var year = d.getFullYear();
    
    return addZero(year) + "-" + addZero(month) + "-" + addZero(day);
  }

  /**
   * הפונקציה מקבלת תאריך ומחזירה אותו בפורמט dd.mm.yy
   * במידה שהשנה היא בין 2001-2099 אחרת, הפורמט יהיה 
   * dd.mm.yyyy
   * @param date 
   */
  export function displayDateHebrow(date:any):string{
    var d = new Date(date);
    var day = d.getDate();
    var month = d.getMonth()+1;
    var year = d.getFullYear();
    if(year>2000 && year<2100){
      year = year-2000;
    }
    return Number(day)+"."+Number(month)+"."+Number(year);
  }

 