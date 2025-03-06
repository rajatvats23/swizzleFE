import { animate, animateChild, group, query, state, style, transition, trigger } from '@angular/animations';

/**
 * Animation definitions for table components
 * Using Angular 19's enhanced animation capabilities
 */
export const tableAnimations = {
  /**
   * Animation for expanding/collapsing row details
   */
  detailExpand: trigger('detailExpand', [
    state('collapsed', style({ 
      height: '0px', 
      minHeight: '0', 
      opacity: 0,
      visibility: 'hidden' 
    })),
    state('expanded', style({ 
      height: '*', 
      opacity: 1,
      visibility: 'visible' 
    })),
    transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
  ]),

  /**
   * Animation for fading elements in and out
   */
  fadeInOut: trigger('fadeInOut', [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('300ms ease-in', style({ opacity: 1 }))
    ]),
    transition(':leave', [
      animate('300ms ease-out', style({ opacity: 0 }))
    ])
  ]),

  /**
   * Animation for the filter drawer sliding in/out
   */
  drawerSlide: trigger('drawerSlide', [
    state('closed', style({
      transform: 'translateX(100%)'
    })),
    state('open', style({
      transform: 'translateX(0)'
    })),
    transition('closed => open', animate('225ms cubic-bezier(0.0, 0.0, 0.2, 1)')),
    transition('open => closed', animate('195ms cubic-bezier(0.4, 0.0, 1, 1)'))
  ]),

  /**
   * Animation for list items entering or leaving
   */
  listAnimation: trigger('listAnimation', [
    transition('* <=> *', [
      query(':enter', [
        style({ opacity: 0, height: 0, transform: 'translateY(-10px)' }),
        stagger(40, [
          animate('220ms ease-out', 
            style({ opacity: 1, height: '*', transform: 'translateY(0)' })
          )
        ])
      ], { optional: true }),
      query(':leave', [
        stagger(40, [
          animate('220ms ease-in', 
            style({ opacity: 0, height: 0, transform: 'translateY(-10px)' })
          )
        ])
      ], { optional: true })
    ])
  ]),

  /**
   * Animation for filter chips
   */
  chipAnimation: trigger('chipAnimation', [
    transition(':enter', [
      style({ transform: 'scale(0.8)', opacity: 0 }),
      animate('150ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
    ]),
    transition(':leave', [
      animate('150ms ease-in', style({ transform: 'scale(0.8)', opacity: 0 }))
    ])
  ]),

  /**
   * Animation for table rows
   */
  rowAnimation: trigger('rowAnimation', [
    transition(':enter', [
      style({ opacity: 0, transform: 'translateY(-10px)' }),
      animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
    ]),
    transition(':leave', [
      animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
    ])
  ]),
  
  /**
   * Animation for page transitions
   */
  pageTransition: trigger('pageTransition', [
    transition(':enter', [
      query('.table-header, .table-scroll-container, .paginator-container', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        stagger(100, [
          animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
        ])
      ], { optional: true })
    ])
  ])
};

/**
 * Helper function to stagger animations by a delay
 */
function stagger(delay: number, animation: any) {
  return group([
    query('@*', animateChild(), { optional: true }),
    query(':enter', animation, { optional: true })
  ]);
}