import { Action } from '../Model/Action';

/**
 * הפונקציה מקבל פעולה שלא מוגדר אצלה תאריך החיוב, 
 * ומגדירה לה תאריך חיוב על פי הנתונים של אמצעי התשלום עליו רשומה ההוצאה.
 * @param action - פעולה ללא תאריך חיוב , אך חובה שיהיה אמצעי תשלום שכל שדותיו קיימים.
 */
export function setDebitDate(action:Action):void{
    // תאריך הביצוע של הפעולה.
    let actionDate:Date = new Date(action.actionDate);
    // יום החיוב של אמצעי התשלום.   
    let debitDay:number = action.methodPayment.debitDate;
    // איתחול תאריך החיוב לתאריך בו הפעולה בוצעה.
    let debitDate:Date = new Date(action.actionDate);
    // בדיקה : האם יום החיוב שונה מ0 - הכוונה ל לא מזומן.
    if(debitDay != 0){
        // אם יום החיוב שונה מאפס
        // נשנה את היום של התאריך החיוב ליום של יום החיוב.
        debitDate.setDate(debitDay);    
        // בדיקה: האם הפעולה בוצעה אחרי התאריך החיוב של אותו החודש 
        if(actionDate >= debitDate){
            // אם כן נשנה את החודש של תאריך החיוב לחודש הבא.
            debitDate.setMonth(debitDate.getMonth()+1);
        }
    }
    // נאתחל את תאריך החיוב של הפעולה בתאריך החיוב שהגדרנו.
    action.debitDate = debitDate;

}