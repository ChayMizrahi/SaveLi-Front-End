import { Action } from '../Model/Action';
import { MonthAndYear } from '../Model/MonthAndYear';
import { BalanceTable } from '../Model/BalanceTable';
import { Category } from '../Model/Category';
import { Row } from '../Model/Row';
import { User } from '../Model/User';
import { Division } from '../Model/Division';
import { ActionSequence } from 'selenium-webdriver';

/**
 * The function accepts an array of actions and boolean object.
 * And returns an array of the monthAndYear object containing all the dates on which action exist nt actionDate or debitDate.
 * @param byDebit if this ture the date will be by debitDate, else by action date.
 * @param actions 
 */
export function getMonthsAndYears(byDebit: boolean, actions: Action[]): MonthAndYear[] {
    let monthsAndYears: MonthAndYear[] = [];
    // עובר על כל הפעולות שהתקבלו
    for (let i = 0; i < actions.length; i++) {
        /** מגדיר בהתחלה שלא תועד החודש והשנה של הפעולה. */
        let exists: boolean = false;
        /**  מתאחל את החיפוש על פי תאריך החיוב ,במידה ו"על ידי חיוב" הוא אמת,
        * או על פי תאריך הביצוע במידה ו"על ידי חיוב" הוא שקר.*/
        let searchBy: Date;
        byDebit ? searchBy = new Date(actions[i].debitDate) : searchBy = new Date(actions[i].actionDate);
        // עובר על כל החודשים והשנים במערך ובודק אם כבר קיים תיעוד לחודש והשנה במערך.
        for (let j = 0; (j < monthsAndYears.length) && (exists == false); j++) {
            let monthAndYear = monthsAndYears[j];
            if ((monthAndYear.year == searchBy.getFullYear()) && (monthAndYear.month == searchBy.getMonth() + 1)) {
                exists = true;
            }
        }
        // אם לא קיים מוסיף על פי הנתונים של הפעולה.
        if (exists == false) {
            let monthAndYear = new MonthAndYear();
            monthAndYear.year = searchBy.getFullYear();
            monthAndYear.month = searchBy.getMonth() + 1;
            monthsAndYears.push(monthAndYear);
        }
    }
    // מחזיר מערך של חודשים ושנים ממויינים.
    return monthsAndYears.sort(function (a, b) { return (b.year + b.month) - (a.year + a.month); });
}

/**
 * הפונקציה מחזירה אובייקט מסוג טבלת מאזן עם פרטים על ההוצאות שהתקבלו על פי החודש והשנה שהתקבל כארגומנט.
 * @param byDebit מציין האם להציג את הטבלה על פי תאריך חיוב או תאריך ביצוע, אמת = חיוב, שקר = ביצוע.
 * @param year - השנה עליה נרצה לקבל את הסיכומים. 
 * @param month - החודש עליו נרצה לקבל את הסיכומים.
 * @param actions - כל פעולות שבוצעו באותה שנה וחודש ולפנייהם (הפעולות שבוצעו לפני חשובות לחישוב הממוצע).ל
 * @param allCategories - כל הקטגוריות שקיימות בבסיס הנתונים.
 * @param allUsers - כל המשתמשים שרשומים על שמו של הלקוח.
 */
export function createBalanceTable(byDebit: boolean, year: number, month: number, actions: Action[], allCategories: Category[], allUsers: User[]): BalanceTable {
    let table: BalanceTable = new BalanceTable();
    table.expenses = getRowsByTypeYearAndMonth(actions, allCategories, allUsers, 'EXPENSE', year, month, byDebit);
    table.incomes = getRowsByTypeYearAndMonth(actions, allCategories, allUsers, 'INCOME', year, month, byDebit);
    table.totalExpense = getSumRows(table.expenses, actions, allUsers, byDebit, 'EXPENSE', 'סיכום הוצאות', year, month);
    table.totalIncome = getSumRows(table.incomes, actions, allUsers, byDebit, 'INCOME', 'סיכום הכנסות', year, month);
    return table;
}

/**
 * הפונקציה מחזירה מערך של שורות טבלה על פי כל הקטגוריות שהיה בהם פעולות.
 * @param actions - כל ההפעולות שבוצעו בחודש ובשנה שהתקבלו לפניי.
 * @param categories - כל הקטגוריות שקיימות בבסיס הנתונים.
 * @param users - כל המשתמשים שרשומים על שמו של הלקוח.
 * @param type - הסוג של השורות שנרצה לקבל EXPENSE / INCOME
 * @param year - השנה שנרצה לקבל עליה מידע.
 * @param month - החודש עליו נרצה לקבל מידע.
 * @param byDebit - מציין האם להציג את המידע על פי תאריך ביצוע או תאריך חיוב. אמת = חיוב , שקר = ביצוע.
 */
function getRowsByTypeYearAndMonth(actions: Action[], categories: Category[], users: User[], type: string, year: number, month: number, byDebit: boolean): Row[] {
    let categoriesByType = getCategoryByType(categories, type);
    let rows: Row[] = [];
    categoriesByType.forEach(c => {
        let actionsByCategoryYearAndMonth = getActionsByCategoryYearAndMonth(actions, c.name, year, month, byDebit);
        if (actionsByCategoryYearAndMonth.length > 0) {
            let row: Row = new Row();
            row.actionType = c.type;
            row.category = c.name;
            row.amount = (getAmount(actionsByCategoryYearAndMonth));
            row.division = (getDivions(actionsByCategoryYearAndMonth, users));
            row.avg = getAvgByCategory(c.name, actions, year, month, byDebit);
            rows.push(row);
        }
    });
    return rows;
}

/**
 * הפונקציה מקבלת מערך של קטגוריות וסוג פעולה ומחזירה את כל הקטגוריות שסוגן  שווה אל  סוג הפעולה שהתקבל.
 * @param categories - כל הקטגוריות שרנצה למיין.
 * @param type - הסוג על פי נרצה למיין את הקטגוריות ('EXPENSE / INCOME').
 */
function getCategoryByType(categories: Category[], type: string): Category[] {
    let categoriesByType: Category[] = [];
    categories.forEach(category => {
        if (category.type == type) {
            categoriesByType.push(category);
        }
    });
    return categoriesByType;
}

/**
 * הפונקציה מקבלת מערך של פעולות ומחזירה מערך אחרת של פעולות המכיל רק את הפעולות שתואמת לשנה, חודש, קטגוריה וסוג תאריך שהתקבלו.
 * @param actions כל הפעולות אותן נרצה למיין.
 * @param category הקטגוריה על פיה נרצה למיין את הפעולות.
 * @param year השנה על פיה נרצה למיין את הפעולות.
 * @param month החודש על פיו נמיין את הפעולות.
 * @param byDebit קובע האם למיין את הפעולות על פי תאריך חיוב או תאריך ביצוע.
 */
function getActionsByCategoryYearAndMonth(actions: Action[], category: string, year: number, month: number, byDebit: boolean): Action[] {
    let customActions: Action[] = [];
    actions.forEach(action => {
        let searchBy: Date;
        byDebit ? searchBy = new Date(action.debitDate) : searchBy = new Date(action.actionDate);
        if ((action.category.name == category) && (searchBy.getFullYear() == year) && (searchBy.getMonth() + 1 == month)) {
            customActions.push(action);
        }
    });
    return customActions;
}

/**
 * הפונקציה מקבלת מערך של פעולות ומחזירה את סכום של הפעולות כשאר הסכום מעוגל ל2 ספרות אחרי הנקודה.
 * @param actions כל הפעולות שנרצה לקבל את סכומם.
 */
function getAmount(actions: Action[]): number {
    let sum: number = 0;
    actions.forEach(a => {
        sum += a.amount;
    });
    return Number(Number(sum).toFixed(2));
}

/**
 * הפונקציה מקבלת מערך של פעולות ומערך של משתמשים ומחזירה מערך של האובייקט חלוקה על פי הפעולות שהתקבלו.
 * @param actions מערך של פעולות
 * @param users מערך של משתמשים
 */
function getDivions(actions: Action[], users: User[]) {
    let divisions: Division[] = [];
    users.forEach(user => {
        let customAction: Action[] = getActionByUser(actions, user.name);
        if (customAction.length > 0) {
            let division: Division = new Division();
            division.operation = user.name;
            division.amount = (getAmount(customAction));
            divisions.push(division);
        }
    });
    return divisions;
}

/**
 * הפונקציה תחזיר מערך של פעולות שהשדה "מבצע" שלהם מכיל את השם שהתקבל כארגומנט.
 * @param actions הפעולות אותם נבדוק
 * @param name שם המשתמש על פיו יתבצע החיפוש
 */
function getActionByUser(actions: Action[], name: string): Action[] {
    let customActions: Action[] = [];
    actions.forEach(action => {
        if (action.user.name == name) {
            customActions.push(action);
        }
    });
    return customActions;
}

/**
 * הפונקציה מקבלת מערך של פעולות ומפיקה ממנו את הממצוע של הקגטוריה על פי שאר הנתונים שהתקבלו.
 * @param category הקטגוריה על פיה יתבע החיפוש
 * @param allActions כל הפעולות מהחודש והשנה שהתקבלו ואחורה מהם יתקבלו הנתונים.
 * @param year השנה על פיה יתבצע החיפוש.
 * @param month החודש על פיו יתבצע החיפוש.
 * @param byDebit מציין האם החיפוש יתבצע על פי תאריך חיוב או תאריך ביצוע.
 */
function getAvgByCategory(category: string, allActions: Action[], year: number, month: number, byDebit: boolean) {
    let actionBeforeYearMonth: Action[] = sortActionBeforeYearMonthByDebit(allActions, year, month, byDebit);
    let sumMonth: number = getMonthsAndYears(byDebit, actionBeforeYearMonth).length;
    let sumAmount: number = 0;
    actionBeforeYearMonth.forEach(a => {
        if (a.category.name == category) {
            sumAmount += a.amount;
        }
    })

    if (sumAmount == 0) {
        return 0;
    } else {
        return sumAmount / sumMonth;
    }


}

/**
 * הפונקציה ממיינן את הפעולות שהתקבלו לפי כל הפעולות שהתאריך הביצוע שלהם או החיוב 
 * (תלוי באובייקט byDebit)
 * היה לפני החודש והשנה שהתקבלו.
 * @param actions מערך של פעולות
 * @param year שנה
 * @param month חודש
 * @param byDebit מציין האם החיפוש יתבצע על פי תאריך חיוב או תאריך ביצוע.
 */
function sortActionBeforeYearMonthByDebit(actions: Action[], year: number, month: number, byDebit: boolean): Action[] {
    let costemActions: Action[] = [];
    actions.forEach(a => {
        let searchBy: Date;
        byDebit ? searchBy = new Date(a.debitDate) : searchBy = new Date(a.actionDate);
        // אם השנה של הפעולה שווה או שנה מהשנה שהתקבלה והחודש של הפעולה קטן מהחודש שהתקבל.
        if (((searchBy.getFullYear() <= year) && (searchBy.getMonth() + 1 < month)) ||
            // או השנה של הפעולה קטנה מהשנה שהתקבלה
            (searchBy.getFullYear() < year)) {
            // תוסיף את הפעולה אל הרשימה.
            costemActions.push(a);
        }
    });
    return costemActions;
}

/**
 * 
 * @param rows 
 * @param allActions 
 * @param allUsers 
 * @param byDebit 
 * @param actionType 
 * @param category 
 * @param year 
 * @param month 
 */
function getSumRows(rows: Row[], allActions: Action[], allUsers: User[], byDebit: boolean, actionType: string, category: string, year: number, month: number): Row {
    let row: Row = new Row();
    row.category = category;
    row.actionType = actionType;
    row.amount = getSumAmountOfRows(rows);
    row.avg = getSumAvgOfRows(allActions, byDebit, actionType, year, month);
    row.division = getDivions(getActionsByActionTypeYearAndMonth(allActions, byDebit, actionType, year, month), allUsers);

    return row;
}

function getSumAmountOfRows(rows: Row[]): number {
    let sum: number = 0;
    rows.forEach(r => {
        sum += r.amount;
    })
    return Number(sum.toFixed(2));
}

/**
 * הפונקציה מחזירה מספר המייצג את ממוצע סכום הפעולות שתאריך החיוב או הביצוע שלהם הוא לפני החודש שהתקבל וקטן או שווה לשנה שהתקבלה וסוג הפעולה שלהם שווה אל סוג הפעולה שהתקבל כארגומנט.
 * @param allActions - כל הפעולות מהם נמיין את הנתונים.
 * @param byDebit - קובע האם לחפש על פי תאריך חיוב או תאריך ביצוע. אמת = חיוב, שקר = ביצוע.
 * @param byType - מציין את סוג הפעולה על פיה נבחר איזה פעולות לכלול בממוצע.
 * @param year - מצייג את השנה שממנה התאריך צריך להיות קטן או שווה.
 * @param month - מייצג את החודש.
 */
function getSumAvgOfRows(allActions: Action[], byDebit: boolean, byType: string, year: number, month: number): number {
    /** מכיל את כל הפעולות שבוצעו לפני התאריך והשנה שהתקבלו כארגומנט. */
    let actionBeforeYearMonth: Action[] = sortActionBeforeYearMonthByDebit(allActions, year, month, byDebit);
    /** מכיל את כמות החודשים בהם היו פעולות לפני החודש והשנה שהתקבלו */
    let sumMonth: number = getMonthsAndYears(byDebit, actionBeforeYearMonth).length;
    /** מכיל את סכום העסקאות שבוצעו לפני התאריך שהתקבל */
    let sumAmount: number = 0;
    /** מסכם את סכום כל הפעולות שבוצעו לפני התאריך שהתקבל */
    actionBeforeYearMonth.forEach(action => {
        if (action.actionType == byType) {
            sumAmount += action.amount;
        }
    })
    return sumMonth == 0 ? 0 : Number((sumAmount / sumMonth).toFixed(2))
}


function getActionsByActionTypeYearAndMonth(allActions: Action[], byDebit: boolean, actionType: string, year: number, month: number): Action[] {
    let searchBy: Date;
    let customAction: Action[] = [];
    allActions.forEach(a => {
        byDebit ? searchBy = new Date(a.debitDate) : searchBy = new Date(a.actionDate);
        if ((searchBy.getFullYear() == year) && (searchBy.getMonth() + 1 == month) && (a.actionType == actionType)) {
            customAction.push(a);
        }
    });
    return customAction;
}

