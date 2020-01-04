import { trigger, state, transition, style, animate } from '@angular/animations';

export const clickOnEntity = trigger('objectClicked', [
    state('default',
        style({
            border: '1px solid black',
            padding: '20px',
            backgroundColor: 'transparent'
        })),
    state('click',
        style({
            border: '2px solid blue',
            padding: '19px',
            backgroundColor: 'rgba(95, 52, 255, 0.86)'
        })),
    transition('default => click', [
        style({
            border: '2px solid black',
            padding: '19px'
        }),
        animate('200ms ease-out', style({
            transform: 'scale(1.025)'
        })),
        animate(200)
    ]),
    transition('click => default', [
        style({
            border: '1px solid blue',
            padding: '20px'
        }),
        animate('300ms ease-out')
    ])
])

export const showState = trigger('showStete', [
    transition(':enter', style({
        opacity : 1
    })),
    transition(':leave', animate(300, style({
        opacity:0
    })))
]);

export const leaveDown = trigger('leaveDone', [
    transition(':leave', animate(1000, style({
        opacity:0,
        transform: 'translateY(30%)',
        height: 0
    })
    ))
]); 

export const leaveRight = trigger('leaveRight', [
    transition(':leave', animate(1000, style({
        opacity:0,
        transform: 'translateX(60%)',
        height: 0
    })
    ))
]);


export const leaveLeft = trigger('leaveLeft', [
    transition(':enter', style({
        opacity : 0
    })),
    transition(':leave', animate(1000, style({
        opacity:0,
        transform: 'translateX(-30%)',
        height: 0
    })
    ))
]);

export const apperUp = trigger('apperUp', [
    transition(':enter' , [
        style({
            opacity : 0
        }),
        animate(300)
    ])
]);


/** אנמציה להופעת או הסרת אובייקט מרשימה */
export const itemList = trigger('itemList', [
    transition(':enter', [
        style({
            opacity:0,
            transform: 'translateX(-100%)'
        }),
        animate('500ms ease-out', style({
            opacity:1,
            transform:'translateX(0)'
        }))
    ]),
    transition(':leave', [
        animate('500ms ease-in', style({
            opacity:1,
            transform: 'translateX(100%)'
        }))
    ])
])