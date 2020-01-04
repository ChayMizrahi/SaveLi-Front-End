/**
 * הפונקציה מקבלת מספר המייצג חודש וממירה את אותו מספר את שם החודש בעברית
 * @param month - מספר מהייצג חודש , חייב להיות בין 1-12
 */
export function getMonthInHebrewByNumber(month:number):string {
   
    if (month == 1) return "ינואר";
    if (month == 2) return  "פבוראר";
    if (month == 3) return  "מרץ";
    if (month == 4) return  "אפריל";
    if (month == 5) return  "מאי";
    if (month == 6) return  "יוני";
    if (month == 7) return  "יולי";
    if (month == 8) return  "אוגוסט";
    if (month == 9) return  "ספטמבר";
    if (month == 10) return  "אוקטובר";
    if (month == 11) return  "נובמבר";
    if (month == 12) return  "דצמבר";
}

export function convertMonthNameInHebrewToNumber(month:string):number{

    if(month == "ינואר") return 1;
    if(month == "פבוראר") return 2;
    if(month == "מרץ") return 3;
    if(month == "אפריל") return 4;
    if(month == "מאי") return 5;
    if(month == "יוני") return 6;
    if(month == "יולי") return 7;
    if(month == "אוגוסט") return 8;
    if(month == "ספטמבר") return 9;
    if(month == "אוקטובר") return 10;
    if(month == "נובמבר") return 11;
    if(month == "דצמבר") return 12;

}