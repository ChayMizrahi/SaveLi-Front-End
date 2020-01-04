
/**
 * The function accepts a type of action as an argument, and returns its value in Hebrew  
 * @param type must be enum of action type.
 */
export function actionTypeFormEnglishToHebrew(type: string) {
    if (type == 'EXPENSE') return "הוצאה";
    if (type == 'INCOME') return "הכנסה";
}

/**
 * The function accepts Boolean value as an argument, and returns active or inactive in Hebrew respectively
 * @param value mest be true or fulse.
 */
export function activeOrInactiveFormEnglishToHebrew(value: boolean) {
    if (value) return "פעיל";
    if (!value) return "לא פעיל";

}