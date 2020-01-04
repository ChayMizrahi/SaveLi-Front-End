import { Category } from '../Model/Category';

export function sortByName(categories: Category[]) {
    categories.sort((a, b) => {
        if (a.name > b.name) {
            return 1;
        } else if (b.name > a.name) {
            return -1;
        } else {
            return 0
        }
    })
}

export function sortByDes(categories: Category[]) {
    categories.sort((a, b) => {
        if (a.description > b.description) {
            return 1;
        } else if (b.description > a.description) {
            return -1;
        } else {
            return 0
        }
    })
}

export function sortByUesdTotle(categories: Category[]) {
    let array =  categories.sort((a, b) => {
        return b.usedTotal - a.usedTotal;
    })
    if(JSON.stringify(array) === JSON.stringify(categories) ){
        categories.reverse();
    }
    
}


export function sortByType(categories: Category[]) {
    categories.sort((a, b) => {
        if (a.type > b.type) {
            return 1;
        } else if (b.type > a.type) {
            return -1;
        } else {
            return 0
        }
    })
}

export function sortByActive(categories: Category[]) {
    categories.sort((a, b) => {
        if (a.active > b.active) {
            return 1;
        } else if (b.active > a.active) {
            return -1;
        } else {
            return 0
        }
    })
}


