export function DisplayAvg(avg:number){
    if(avg == 0){
        return "0"
    }else{
        return Number(avg).toFixed(2);
    }
}
