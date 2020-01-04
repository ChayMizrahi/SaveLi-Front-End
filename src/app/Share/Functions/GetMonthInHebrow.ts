

export function getCurrentlyMonthInHebrew(): string {
    let today: Date = new Date();
    if (today.getMonth() == 0) return "ינואר";
    if (today.getMonth() == 1) return "פבוראר";
    if (today.getMonth() == 2) return "מרץ";
    if (today.getMonth() == 3) return "אפריל";
    if (today.getMonth() == 4) return "מאי";
    if (today.getMonth() == 5) return "יוני";
    if (today.getMonth() == 6) return "יולי";
    if (today.getMonth() == 7) return "אוגוסט";
    if (today.getMonth() == 8) return "ספטמבר";
    if (today.getMonth() == 9) return "אוקטובר";
    if (today.getMonth() == 10) return "נובמבר";
    if (today.getMonth() == 11) return "דצמבר";
}

