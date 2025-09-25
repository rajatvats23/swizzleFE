import{a as je,b as Ue}from"./chunk-JE5POWI7.js";import{b as Ne}from"./chunk-T763PW3Z.js";import{a as Le}from"./chunk-MRNGONWI.js";import{d as Ge,h as $e,i as Be}from"./chunk-KUJCRXF6.js";import"./chunk-MPZJ55NE.js";import{a as Ve}from"./chunk-4NNSIX2F.js";import{h as pe}from"./chunk-X4H6S6WA.js";import{a as Ae,b as ze}from"./chunk-FNZWV5VH.js";import{a as Oe,c as Se,d as Ee}from"./chunk-SG7MWKE6.js";import{b as Pe,f as we,i as Me}from"./chunk-TFWZGPIA.js";import{a as Re}from"./chunk-MXW2SQ2E.js";import{b as ue,d as k,g as be,h as he,m as _e,p as ge,s as fe,v as ve,w as xe,x as ye,y as Ce,z as ke}from"./chunk-CG6HKZKU.js";import"./chunk-YE4XPGXQ.js";import{k as Ie,m as Te,p as Fe,q as De,u as qe}from"./chunk-QRFS6CQK.js";import{F as G,j as le,l as se,w as me}from"./chunk-24M76UXH.js";import{c as ce}from"./chunk-A2KXSCJD.js";import{$ as Y,Aa as Z,Ac as re,Ba as J,D as E,Db as M,Fa as T,Fb as b,Gb as p,Ha as F,Hb as oe,Ib as ne,Kc as de,La as X,Lb as z,Mb as R,Nb as N,Pa as ee,Rb as n,Sb as P,Ta as c,Tb as f,Wa as te,cb as O,da as Q,db as ie,ea as H,f as L,g as j,ga as I,hb as y,ja as l,kc as ae,mc as w,nb as D,nc as V,ob as C,qa as h,qb as v,ra as _,tb as g,u as U,vb as q,wa as W,wb as A,xa as K,xb as i,yb as t,zb as u}from"./chunk-Q5RHU532.js";var We=["input"],Ke=["formField"],Ze=["*"],$=class{source;value;constructor(o,e){this.source=o,this.value=e}};var Je=new I("MatRadioGroup"),Xe=new I("mat-radio-default-options",{providedIn:"root",factory:et});function et(){return{color:"accent",disabledInteractive:!1}}var tt=(()=>{class d{_elementRef=l(T);_changeDetector=l(ae);_focusMonitor=l(le);_radioDispatcher=l(Ve);_defaultOptions=l(Xe,{optional:!0});_ngZone=l(J);_renderer=l(te);_uniqueId=l(me).getId("mat-radio-");_cleanupClick;id=this._uniqueId;name;ariaLabel;ariaLabelledby;ariaDescribedby;disableRipple=!1;tabIndex=0;get checked(){return this._checked}set checked(e){this._checked!==e&&(this._checked=e,e&&this.radioGroup&&this.radioGroup.value!==this.value?this.radioGroup.selected=this:!e&&this.radioGroup&&this.radioGroup.value===this.value&&(this.radioGroup.selected=null),e&&this._radioDispatcher.notify(this.id,this.name),this._changeDetector.markForCheck())}get value(){return this._value}set value(e){this._value!==e&&(this._value=e,this.radioGroup!==null&&(this.checked||(this.checked=this.radioGroup.value===e),this.checked&&(this.radioGroup.selected=this)))}get labelPosition(){return this._labelPosition||this.radioGroup&&this.radioGroup.labelPosition||"after"}set labelPosition(e){this._labelPosition=e}_labelPosition;get disabled(){return this._disabled||this.radioGroup!==null&&this.radioGroup.disabled}set disabled(e){this._setDisabled(e)}get required(){return this._required||this.radioGroup&&this.radioGroup.required}set required(e){this._required=e}get color(){return this._color||this.radioGroup&&this.radioGroup.color||this._defaultOptions&&this._defaultOptions.color||"accent"}set color(e){this._color=e}_color;get disabledInteractive(){return this._disabledInteractive||this.radioGroup!==null&&this.radioGroup.disabledInteractive}set disabledInteractive(e){this._disabledInteractive=e}_disabledInteractive;change=new Z;radioGroup;get inputId(){return`${this.id||this._uniqueId}-input`}_checked=!1;_disabled;_required;_value=null;_removeUniqueSelectionListener=()=>{};_previousTabIndex;_inputElement;_rippleTrigger;_noopAnimations;_injector=l(W);constructor(){l(se).load(Te);let e=l(Je,{optional:!0}),r=l(X,{optional:!0}),a=l(new K("tabindex"),{optional:!0});this.radioGroup=e,this._noopAnimations=r==="NoopAnimations",this._disabledInteractive=this._defaultOptions?.disabledInteractive??!1,a&&(this.tabIndex=V(a,0))}focus(e,r){r?this._focusMonitor.focusVia(this._inputElement,r,e):this._inputElement.nativeElement.focus(e)}_markForCheck(){this._changeDetector.markForCheck()}ngOnInit(){this.radioGroup&&(this.checked=this.radioGroup.value===this._value,this.checked&&(this.radioGroup.selected=this),this.name=this.radioGroup.name),this._removeUniqueSelectionListener=this._radioDispatcher.listen((e,r)=>{e!==this.id&&r===this.name&&(this.checked=!1)})}ngDoCheck(){this._updateTabIndex()}ngAfterViewInit(){this._updateTabIndex(),this._focusMonitor.monitor(this._elementRef,!0).subscribe(e=>{!e&&this.radioGroup&&this.radioGroup._touch()}),this._ngZone.runOutsideAngular(()=>{this._cleanupClick=this._renderer.listen(this._inputElement.nativeElement,"click",this._onInputClick)})}ngOnDestroy(){this._cleanupClick?.(),this._focusMonitor.stopMonitoring(this._elementRef),this._removeUniqueSelectionListener()}_emitChangeEvent(){this.change.emit(new $(this,this._value))}_isRippleDisabled(){return this.disableRipple||this.disabled}_onInputInteraction(e){if(e.stopPropagation(),!this.checked&&!this.disabled){let r=this.radioGroup&&this.value!==this.radioGroup.value;this.checked=!0,this._emitChangeEvent(),this.radioGroup&&(this.radioGroup._controlValueAccessorChangeFn(this.value),r&&this.radioGroup._emitChangeEvent())}}_onTouchTargetClick(e){this._onInputInteraction(e),(!this.disabled||this.disabledInteractive)&&this._inputElement?.nativeElement.focus()}_setDisabled(e){this._disabled!==e&&(this._disabled=e,this._changeDetector.markForCheck())}_onInputClick=e=>{this.disabled&&this.disabledInteractive&&e.preventDefault()};_updateTabIndex(){let e=this.radioGroup,r;if(!e||!e.selected||this.disabled?r=this.tabIndex:r=e.selected===this?this.tabIndex:-1,r!==this._previousTabIndex){let a=this._inputElement?.nativeElement;a&&(a.setAttribute("tabindex",r+""),this._previousTabIndex=r,ee(()=>{queueMicrotask(()=>{e&&e.selected&&e.selected!==this&&document.activeElement===a&&(e.selected?._inputElement.nativeElement.focus(),document.activeElement===a&&this._inputElement.nativeElement.blur())})},{injector:this._injector}))}}static \u0275fac=function(r){return new(r||d)};static \u0275cmp=O({type:d,selectors:[["mat-radio-button"]],viewQuery:function(r,a){if(r&1&&(z(We,5),z(Ke,7,T)),r&2){let s;R(s=N())&&(a._inputElement=s.first),R(s=N())&&(a._rippleTrigger=s.first)}},hostAttrs:[1,"mat-mdc-radio-button"],hostVars:19,hostBindings:function(r,a){r&1&&b("focus",function(){return a._inputElement.nativeElement.focus()}),r&2&&(D("id",a.id)("tabindex",null)("aria-label",null)("aria-labelledby",null)("aria-describedby",null),v("mat-primary",a.color==="primary")("mat-accent",a.color==="accent")("mat-warn",a.color==="warn")("mat-mdc-radio-checked",a.checked)("mat-mdc-radio-disabled",a.disabled)("mat-mdc-radio-disabled-interactive",a.disabledInteractive)("_mat-animation-noopable",a._noopAnimations))},inputs:{id:"id",name:"name",ariaLabel:[0,"aria-label","ariaLabel"],ariaLabelledby:[0,"aria-labelledby","ariaLabelledby"],ariaDescribedby:[0,"aria-describedby","ariaDescribedby"],disableRipple:[2,"disableRipple","disableRipple",w],tabIndex:[2,"tabIndex","tabIndex",e=>e==null?0:V(e)],checked:[2,"checked","checked",w],value:"value",labelPosition:"labelPosition",disabled:[2,"disabled","disabled",w],required:[2,"required","required",w],color:"color",disabledInteractive:[2,"disabledInteractive","disabledInteractive",w]},outputs:{change:"change"},exportAs:["matRadioButton"],ngContentSelectors:Ze,decls:13,vars:17,consts:[["formField",""],["input",""],["mat-internal-form-field","",3,"labelPosition"],[1,"mdc-radio"],[1,"mat-mdc-radio-touch-target",3,"click"],["type","radio",1,"mdc-radio__native-control",3,"change","id","checked","disabled","required"],[1,"mdc-radio__background"],[1,"mdc-radio__outer-circle"],[1,"mdc-radio__inner-circle"],["mat-ripple","",1,"mat-radio-ripple","mat-focus-indicator",3,"matRippleTrigger","matRippleDisabled","matRippleCentered"],[1,"mat-ripple-element","mat-radio-persistent-ripple"],[1,"mdc-label",3,"for"]],template:function(r,a){if(r&1){let s=M();oe(),i(0,"div",2,0)(2,"div",3)(3,"div",4),b("click",function(m){return h(s),_(a._onTouchTargetClick(m))}),t(),i(4,"input",5,1),b("change",function(m){return h(s),_(a._onInputInteraction(m))}),t(),i(6,"div",6),u(7,"div",7)(8,"div",8),t(),i(9,"div",9),u(10,"div",10),t()(),i(11,"label",11),ne(12),t()()}r&2&&(C("labelPosition",a.labelPosition),c(2),v("mdc-radio--disabled",a.disabled),c(2),C("id",a.inputId)("checked",a.checked)("disabled",a.disabled&&!a.disabledInteractive)("required",a.required),D("name",a.name)("value",a.value)("aria-label",a.ariaLabel)("aria-labelledby",a.ariaLabelledby)("aria-describedby",a.ariaDescribedby)("aria-disabled",a.disabled&&a.disabledInteractive?"true":null),c(5),C("matRippleTrigger",a._rippleTrigger.nativeElement)("matRippleDisabled",a._isRippleDisabled())("matRippleCentered",!0),c(2),C("for",a.inputId))},dependencies:[Ie,Le],styles:[`.mat-mdc-radio-button{-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-radio-button .mdc-radio{display:inline-block;position:relative;flex:0 0 auto;box-sizing:content-box;width:20px;height:20px;cursor:pointer;will-change:opacity,transform,border-color,color;padding:calc((var(--mdc-radio-state-layer-size, 40px) - 20px)/2)}.mat-mdc-radio-button .mdc-radio:hover>.mdc-radio__native-control:not([disabled]):not(:focus)~.mdc-radio__background::before{opacity:.04;transform:scale(1)}.mat-mdc-radio-button .mdc-radio:hover>.mdc-radio__native-control:not([disabled])~.mdc-radio__background>.mdc-radio__outer-circle{border-color:var(--mdc-radio-unselected-hover-icon-color, var(--mat-sys-on-surface))}.mat-mdc-radio-button .mdc-radio:hover>.mdc-radio__native-control:enabled:checked+.mdc-radio__background>.mdc-radio__outer-circle,.mat-mdc-radio-button .mdc-radio:hover>.mdc-radio__native-control:enabled:checked+.mdc-radio__background>.mdc-radio__inner-circle{border-color:var(--mdc-radio-selected-hover-icon-color, var(--mat-sys-primary))}.mat-mdc-radio-button .mdc-radio:active>.mdc-radio__native-control:enabled:not(:checked)+.mdc-radio__background>.mdc-radio__outer-circle{border-color:var(--mdc-radio-unselected-pressed-icon-color, var(--mat-sys-on-surface))}.mat-mdc-radio-button .mdc-radio:active>.mdc-radio__native-control:enabled:checked+.mdc-radio__background>.mdc-radio__outer-circle,.mat-mdc-radio-button .mdc-radio:active>.mdc-radio__native-control:enabled:checked+.mdc-radio__background>.mdc-radio__inner-circle{border-color:var(--mdc-radio-selected-pressed-icon-color, var(--mat-sys-primary))}.mat-mdc-radio-button .mdc-radio__background{display:inline-block;position:relative;box-sizing:border-box;width:20px;height:20px}.mat-mdc-radio-button .mdc-radio__background::before{position:absolute;transform:scale(0, 0);border-radius:50%;opacity:0;pointer-events:none;content:"";transition:opacity 90ms cubic-bezier(0.4, 0, 0.6, 1),transform 90ms cubic-bezier(0.4, 0, 0.6, 1);width:var(--mdc-radio-state-layer-size, 40px);height:var(--mdc-radio-state-layer-size, 40px);top:calc(-1*(var(--mdc-radio-state-layer-size, 40px) - 20px)/2);left:calc(-1*(var(--mdc-radio-state-layer-size, 40px) - 20px)/2)}.mat-mdc-radio-button .mdc-radio__outer-circle{position:absolute;top:0;left:0;box-sizing:border-box;width:100%;height:100%;border-width:2px;border-style:solid;border-radius:50%;transition:border-color 90ms cubic-bezier(0.4, 0, 0.6, 1)}.mat-mdc-radio-button .mdc-radio__inner-circle{position:absolute;top:0;left:0;box-sizing:border-box;width:100%;height:100%;transform:scale(0, 0);border-width:10px;border-style:solid;border-radius:50%;transition:transform 90ms cubic-bezier(0.4, 0, 0.6, 1),border-color 90ms cubic-bezier(0.4, 0, 0.6, 1)}.mat-mdc-radio-button .mdc-radio__native-control{position:absolute;margin:0;padding:0;opacity:0;top:0;right:0;left:0;cursor:inherit;z-index:1;width:var(--mdc-radio-state-layer-size, 40px);height:var(--mdc-radio-state-layer-size, 40px)}.mat-mdc-radio-button .mdc-radio__native-control:checked+.mdc-radio__background,.mat-mdc-radio-button .mdc-radio__native-control:disabled+.mdc-radio__background{transition:opacity 90ms cubic-bezier(0, 0, 0.2, 1),transform 90ms cubic-bezier(0, 0, 0.2, 1)}.mat-mdc-radio-button .mdc-radio__native-control:checked+.mdc-radio__background>.mdc-radio__outer-circle,.mat-mdc-radio-button .mdc-radio__native-control:disabled+.mdc-radio__background>.mdc-radio__outer-circle{transition:border-color 90ms cubic-bezier(0, 0, 0.2, 1)}.mat-mdc-radio-button .mdc-radio__native-control:checked+.mdc-radio__background>.mdc-radio__inner-circle,.mat-mdc-radio-button .mdc-radio__native-control:disabled+.mdc-radio__background>.mdc-radio__inner-circle{transition:transform 90ms cubic-bezier(0, 0, 0.2, 1),border-color 90ms cubic-bezier(0, 0, 0.2, 1)}.mat-mdc-radio-button .mdc-radio__native-control:focus+.mdc-radio__background::before{transform:scale(1);opacity:.12;transition:opacity 90ms cubic-bezier(0, 0, 0.2, 1),transform 90ms cubic-bezier(0, 0, 0.2, 1)}.mat-mdc-radio-button .mdc-radio__native-control:disabled:not(:checked)+.mdc-radio__background>.mdc-radio__outer-circle{border-color:var(--mdc-radio-disabled-unselected-icon-color, var(--mat-sys-on-surface));opacity:var(--mdc-radio-disabled-unselected-icon-opacity, 0.38)}.mat-mdc-radio-button .mdc-radio__native-control:disabled+.mdc-radio__background{cursor:default}.mat-mdc-radio-button .mdc-radio__native-control:disabled+.mdc-radio__background>.mdc-radio__inner-circle,.mat-mdc-radio-button .mdc-radio__native-control:disabled+.mdc-radio__background>.mdc-radio__outer-circle{border-color:var(--mdc-radio-disabled-selected-icon-color, var(--mat-sys-on-surface));opacity:var(--mdc-radio-disabled-selected-icon-opacity, 0.38)}.mat-mdc-radio-button .mdc-radio__native-control:enabled:not(:checked)+.mdc-radio__background>.mdc-radio__outer-circle{border-color:var(--mdc-radio-unselected-icon-color, var(--mat-sys-on-surface-variant))}.mat-mdc-radio-button .mdc-radio__native-control:enabled:checked+.mdc-radio__background>.mdc-radio__outer-circle,.mat-mdc-radio-button .mdc-radio__native-control:enabled:checked+.mdc-radio__background>.mdc-radio__inner-circle{border-color:var(--mdc-radio-selected-icon-color, var(--mat-sys-primary))}.mat-mdc-radio-button .mdc-radio__native-control:enabled:focus:checked+.mdc-radio__background>.mdc-radio__inner-circle,.mat-mdc-radio-button .mdc-radio__native-control:enabled:focus:checked+.mdc-radio__background>.mdc-radio__outer-circle{border-color:var(--mdc-radio-selected-focus-icon-color, var(--mat-sys-primary))}.mat-mdc-radio-button .mdc-radio__native-control:checked+.mdc-radio__background>.mdc-radio__inner-circle{transform:scale(0.5);transition:transform 90ms cubic-bezier(0, 0, 0.2, 1),border-color 90ms cubic-bezier(0, 0, 0.2, 1)}.mat-mdc-radio-button.mat-mdc-radio-disabled-interactive .mdc-radio--disabled{pointer-events:auto}.mat-mdc-radio-button.mat-mdc-radio-disabled-interactive .mdc-radio--disabled .mdc-radio__native-control:not(:checked)+.mdc-radio__background>.mdc-radio__outer-circle{border-color:var(--mdc-radio-disabled-unselected-icon-color, var(--mat-sys-on-surface));opacity:var(--mdc-radio-disabled-unselected-icon-opacity, 0.38)}.mat-mdc-radio-button.mat-mdc-radio-disabled-interactive .mdc-radio--disabled:hover .mdc-radio__native-control:checked+.mdc-radio__background>.mdc-radio__inner-circle,.mat-mdc-radio-button.mat-mdc-radio-disabled-interactive .mdc-radio--disabled:hover .mdc-radio__native-control:checked+.mdc-radio__background>.mdc-radio__outer-circle,.mat-mdc-radio-button.mat-mdc-radio-disabled-interactive .mdc-radio--disabled .mdc-radio__native-control:checked:focus+.mdc-radio__background>.mdc-radio__inner-circle,.mat-mdc-radio-button.mat-mdc-radio-disabled-interactive .mdc-radio--disabled .mdc-radio__native-control:checked:focus+.mdc-radio__background>.mdc-radio__outer-circle,.mat-mdc-radio-button.mat-mdc-radio-disabled-interactive .mdc-radio--disabled .mdc-radio__native-control+.mdc-radio__background>.mdc-radio__inner-circle,.mat-mdc-radio-button.mat-mdc-radio-disabled-interactive .mdc-radio--disabled .mdc-radio__native-control+.mdc-radio__background>.mdc-radio__outer-circle{border-color:var(--mdc-radio-disabled-selected-icon-color, var(--mat-sys-on-surface));opacity:var(--mdc-radio-disabled-selected-icon-opacity, 0.38)}.mat-mdc-radio-button._mat-animation-noopable .mdc-radio__background::before,.mat-mdc-radio-button._mat-animation-noopable .mdc-radio__outer-circle,.mat-mdc-radio-button._mat-animation-noopable .mdc-radio__inner-circle{transition:none !important}.mat-mdc-radio-button .mdc-radio__background::before{background-color:var(--mat-radio-ripple-color, var(--mat-sys-on-surface))}.mat-mdc-radio-button.mat-mdc-radio-checked .mat-ripple-element,.mat-mdc-radio-button.mat-mdc-radio-checked .mdc-radio__background::before{background-color:var(--mat-radio-checked-ripple-color, var(--mat-sys-primary))}.mat-mdc-radio-button.mat-mdc-radio-disabled-interactive .mdc-radio--disabled .mat-ripple-element,.mat-mdc-radio-button.mat-mdc-radio-disabled-interactive .mdc-radio--disabled .mdc-radio__background::before{background-color:var(--mat-radio-ripple-color, var(--mat-sys-on-surface))}.mat-mdc-radio-button .mat-internal-form-field{color:var(--mat-radio-label-text-color, var(--mat-sys-on-surface));font-family:var(--mat-radio-label-text-font, var(--mat-sys-body-medium-font));line-height:var(--mat-radio-label-text-line-height, var(--mat-sys-body-medium-line-height));font-size:var(--mat-radio-label-text-size, var(--mat-sys-body-medium-size));letter-spacing:var(--mat-radio-label-text-tracking, var(--mat-sys-body-medium-tracking));font-weight:var(--mat-radio-label-text-weight, var(--mat-sys-body-medium-weight))}.mat-mdc-radio-button .mdc-radio--disabled+label{color:var(--mat-radio-disabled-label-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-mdc-radio-button .mat-radio-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:50%}.mat-mdc-radio-button .mat-radio-ripple>.mat-ripple-element{opacity:.14}.mat-mdc-radio-button .mat-radio-ripple::before{border-radius:50%}.mat-mdc-radio-button .mdc-radio>.mdc-radio__native-control:focus:enabled:not(:checked)~.mdc-radio__background>.mdc-radio__outer-circle{border-color:var(--mdc-radio-unselected-focus-icon-color, var(--mat-sys-on-surface))}.mat-mdc-radio-button.cdk-focused .mat-focus-indicator::before{content:""}.mat-mdc-radio-disabled{cursor:default;pointer-events:none}.mat-mdc-radio-disabled.mat-mdc-radio-disabled-interactive{pointer-events:auto}.mat-mdc-radio-touch-target{position:absolute;top:50%;left:50%;height:48px;width:48px;transform:translate(-50%, -50%);display:var(--mat-radio-touch-target-display, block)}[dir=rtl] .mat-mdc-radio-touch-target{left:auto;right:50%;transform:translate(50%, -50%)}
`],encapsulation:2,changeDetection:0})}return d})(),Qe=(()=>{class d{static \u0275fac=function(r){return new(r||d)};static \u0275mod=ie({type:d});static \u0275inj=H({imports:[G,Fe,tt,G]})}return d})();var S=class d{printCustomerBill(o){let e=window.open("","_blank");if(!e){alert("Please allow popups for this website to print receipts");return}let r=new Date(o.createdAt),a=r.toLocaleDateString("en-IN"),s=r.toLocaleTimeString("en-IN"),x=`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt - Order #${o.orderNumber}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 1cm;
            max-width: 10cm;
            background: white;
          }
          .receipt-header {
            text-align: center;
            border-bottom: 2px solid #009c4c;
            padding-bottom: 16px;
            margin-bottom: 20px;
          }
          .restaurant-name {
            font-size: 24px;
            font-weight: bold;
            color: #009c4c;
            margin-bottom: 8px;
          }
          .receipt-type {
            font-size: 18px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .order-info {
            display: flex;
            justify-content: space-between;
            margin: 12px 0;
            border-bottom: 1px dashed #ccc;
            padding-bottom: 12px;
          }
          .order-info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-bottom: 20px;
          }
          .info-item {
            font-size: 14px;
          }
          .info-label {
            font-weight: 600;
            color: #333;
          }
          .order-items {
            margin: 20px 0;
          }
          .item {
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid #eee;
          }
          .item:last-child {
            border-bottom: none;
          }
          .item-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 4px;
          }
          .item-name {
            font-weight: 600;
            color: #333;
            flex: 1;
          }
          .item-quantity {
            background: #009c4c;
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            margin: 0 12px;
          }
          .item-price {
            font-weight: 600;
            color: #009c4c;
            min-width: 70px;
            text-align: right;
          }
          .addon {
            padding-left: 20px;
            font-size: 13px;
            color: #666;
            margin: 2px 0;
          }
          .addon::before {
            content: "+ ";
            color: #009c4c;
            font-weight: bold;
          }
          .special-instructions {
            background: #fff8eb;
            border: 1px solid #009c4c;
            border-radius: 4px;
            padding: 8px;
            margin-top: 8px;
            font-style: italic;
            font-size: 13px;
            color: #333;
          }
          .special-instructions::before {
            content: "\u{1F4DD} ";
            margin-right: 4px;
          }
          .totals-section {
            margin-top: 24px;
            border-top: 2px solid #009c4c;
            padding-top: 16px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
            font-size: 14px;
          }
          .total-row.final {
            font-size: 18px;
            font-weight: bold;
            color: #009c4c;
            border-top: 1px solid #009c4c;
            padding-top: 12px;
            margin-top: 16px;
          }
          .footer {
            margin-top: 32px;
            text-align: center;
            border-top: 1px dashed #ccc;
            padding-top: 16px;
          }
          .thank-you {
            font-size: 16px;
            font-weight: 600;
            color: #009c4c;
            margin-bottom: 8px;
          }
          .footer-text {
            font-size: 12px;
            color: #666;
            line-height: 1.4;
          }
          
          @media print {
            body {
              max-width: none;
              margin: 0;
              padding: 0.5cm;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="receipt-header">
          <div class="restaurant-name">Restaurant Name</div>
          <div class="receipt-type">Customer Receipt</div>
        </div>
        
        <div class="order-info-grid">
          <div class="info-item">
            <div class="info-label">Order #:</div>
            <div>${o.orderNumber}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Table:</div>
            <div>${o.table.tableNumber}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Date:</div>
            <div>${a}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Time:</div>
            <div>${s}</div>
          </div>
        </div>
        
        <div class="order-items">
          ${o.items.map(m=>`
            <div class="item">
              <div class="item-header">
                <div class="item-name">${m.product.name}</div>
                <div class="item-quantity">${m.quantity}\xD7</div>
                <div class="item-price">\u20B9${(m.price*m.quantity).toFixed(2)}</div>
              </div>
              ${m.selectedAddons&&m.selectedAddons.length>0?m.selectedAddons.map(B=>`
                  <div class="addon">${B.addon.name}: ${B.subAddon.name}</div>
                `).join(""):""}
              ${m.specialInstructions?`<div class="special-instructions">${m.specialInstructions}</div>`:""}
            </div>
          `).join("")}
        </div>
        
        ${o.specialInstructions?`
          <div class="special-instructions">
            <strong>Order Notes:</strong> ${o.specialInstructions}
          </div>
        `:""}
        
        <div class="totals-section">
          <div class="total-row">
            <span>Subtotal</span>
            <span>\u20B9${o.subtotal.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>GST (18%)</span>
            <span>\u20B9${o.tax.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>Service Charge (10%)</span>
            <span>\u20B9${o.serviceCharge.toFixed(2)}</span>
          </div>
          <div class="total-row final">
            <span>Total Amount</span>
            <span>\u20B9${o.totalAmount.toFixed(2)}</span>
          </div>
        </div>
        
        <div class="footer">
          <div class="thank-you">Thank You for Dining With Us!</div>
          <div class="footer-text">
            Please visit us again<br>
            Follow us @restaurantname
          </div>
        </div>
      </body>
      </html>
    `;e.document.open(),e.document.write(x),e.document.close(),e.onload=()=>{e.print(),e.onafterprint=()=>{e.close()}}}printKitchenTicket(o){let e=window.open("","_blank");if(!e){alert("Please allow popups for this website to print kitchen tickets");return}let a=new Date(o.createdAt).toLocaleTimeString("en-IN",{hour:"2-digit",minute:"2-digit"}),s=`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Kitchen Ticket - Order #${o.orderNumber}</title>
        <style>
          body {
            font-family: 'Courier New', monospace;
            margin: 0;
            padding: 0.5cm;
            width: 8cm;
            background: white;
            font-size: 14px;
            line-height: 1.3;
          }
          .ticket-header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 12px;
            margin-bottom: 16px;
          }
          .kitchen-label {
            font-size: 20px;
            font-weight: bold;
            background: #000;
            color: white;
            padding: 8px;
            margin-bottom: 8px;
          }
          .order-info {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
            font-weight: bold;
          }
          .table-number {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            background: #000;
            color: white;
            padding: 12px;
            margin: 16px 0;
          }
          .order-details {
            margin: 20px 0;
          }
          .item {
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px dashed #000;
          }
          .item:last-child {
            border-bottom: none;
          }
          .item-header {
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 6px;
          }
          .quantity {
            background: #000;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            display: inline-block;
            margin-right: 8px;
            font-size: 14px;
          }
          .addon {
            padding-left: 20px;
            font-size: 13px;
            margin: 4px 0;
          }
          .addon::before {
            content: "\u25B8 ";
            font-weight: bold;
          }
          .special-instructions {
            background: #f0f0f0;
            border: 2px solid #000;
            padding: 12px;
            margin: 16px 0;
            font-weight: bold;
            text-transform: uppercase;
          }
          .special-instructions::before {
            content: "\u26A0\uFE0F SPECIAL: ";
            display: block;
            margin-bottom: 8px;
          }
          .footer {
            margin-top: 24px;
            text-align: center;
            border-top: 2px solid #000;
            padding-top: 12px;
          }
          .kitchen-footer {
            font-weight: bold;
            font-size: 16px;
          }
          .timestamp {
            font-size: 12px;
            margin-top: 8px;
          }
          
          @media print {
            body {
              width: 8cm;
              margin: 0;
              padding: 0.3cm;
            }
          }
        </style>
      </head>
      <body>
        <div class="ticket-header">
          <div class="kitchen-label">\u{1F373} KITCHEN ORDER</div>
          <div class="order-info">
            <div>Order #${o.orderNumber}</div>
            <div>${a}</div>
          </div>
        </div>
        
        <div class="table-number">
          TABLE ${o.table.tableNumber}
        </div>
        
        <div class="order-details">
          ${o.items.map(x=>`
            <div class="item">
              <div class="item-header">
                <span class="quantity">${x.quantity}</span>
                ${x.product.name.toUpperCase()}
              </div>
              ${x.selectedAddons&&x.selectedAddons.length>0?x.selectedAddons.map(m=>`
                  <div class="addon">${m.addon.name}: ${m.subAddon.name}</div>
                `).join(""):""}
              ${x.specialInstructions?`<div class="special-instructions">${x.specialInstructions}</div>`:""}
            </div>
          `).join("")}
        </div>
        
        ${o.specialInstructions?`
          <div class="special-instructions">
            ORDER NOTES: ${o.specialInstructions.toUpperCase()}
          </div>
        `:""}
        
        <div class="footer">
          <div class="kitchen-footer">*** KITCHEN COPY ***</div>
          <div class="timestamp">Printed: ${new Date().toLocaleString("en-IN")}</div>
        </div>
      </body>
      </html>
    `;e.document.open(),e.document.write(s),e.document.close(),e.onload=()=>{e.print(),e.onafterprint=()=>{e.close()}}}printBoth(o){this.printCustomerBill(o),setTimeout(()=>{this.printKitchenTicket(o)},1e3)}static \u0275fac=function(e){return new(e||d)};static \u0275prov=Q({token:d,factory:d.\u0275fac,providedIn:"root"})};var it=(d,o)=>o._id,ot=(d,o)=>o.addon._id;function nt(d,o){if(d&1&&(i(0,"div",5)(1,"div",7)(2,"div",8),n(3),t(),i(4,"div",9),n(5),t()(),i(6,"div",10)(7,"mat-icon",4),n(8,"schedule"),t(),i(9,"span"),n(10),t()()()),d&2){let e=p();c(3),f("Order #",e.order.orderNumber,""),c(2),f("Table ",e.order.table.tableNumber,""),c(5),P(e.getCurrentTime())}}function at(d,o){d&1&&(i(0,"div",6),u(1,"mat-spinner",11),i(2,"p"),n(3,"Loading order details..."),t()())}function rt(d,o){d&1&&n(0," \u2022 ")}function dt(d,o){if(d&1&&(i(0,"span"),n(1),y(2,rt,1,0),t()),d&2){let e=o.$implicit,r=o.$index,a=o.$count;c(),P(e.subAddon.name),c(),g(r!==a-1?2:-1)}}function ct(d,o){d&1&&n(0," \u2022 ")}function lt(d,o){if(d&1&&(i(0,"span"),n(1),t()),d&2){let e=p(2).$implicit;c(),P(e.specialInstructions)}}function st(d,o){if(d&1&&(i(0,"div",43),q(1,dt,3,2,"span",null,ot),y(3,ct,1,0)(4,lt,2,1,"span"),t()),d&2){let e=p().$implicit;c(),A(e.selectedAddons),c(2),g(e.selectedAddons!=null&&e.selectedAddons.length&&e.specialInstructions?3:-1),c(),g(e.specialInstructions?4:-1)}}function mt(d,o){if(d&1&&(i(0,"div",16)(1,"div",41)(2,"div",42),n(3),t(),y(4,st,5,2,"div",43),t(),i(5,"div",44)(6,"span",45),n(7),t(),i(8,"span",46),n(9),t()()()),d&2){let e=o.$implicit;c(3),P(e.product.name),c(),g(e.selectedAddons!=null&&e.selectedAddons.length||e.specialInstructions?4:-1),c(3),f("",e.quantity,"\xD7"),c(2),f("\u20B9",(e.price*e.quantity).toFixed(2),"")}}function pt(d,o){if(d&1){let e=M();i(0,"div",32)(1,"mat-form-field",47)(2,"mat-label"),n(3,"Card Number"),t(),i(4,"input",48),b("input",function(a){h(e);let s=p(2);return _(s.formatCardNumber(a))}),t(),i(5,"mat-icon",49),n(6,"credit_card"),t()(),i(7,"div",50)(8,"mat-form-field",51)(9,"mat-label"),n(10,"Expiry"),t(),i(11,"input",52),b("input",function(a){h(e);let s=p(2);return _(s.formatExpiry(a))}),t()(),i(12,"mat-form-field",51)(13,"mat-label"),n(14,"CVV"),t(),u(15,"input",53),t()(),i(16,"mat-form-field",47)(17,"mat-label"),n(18,"Cardholder Name"),t(),u(19,"input",54),t()()}}function ut(d,o){if(d&1&&(i(0,"div",32)(1,"div",55)(2,"div",56),n(3),t(),i(4,"div",57)(5,"div",58)(6,"mat-icon",4),n(7,"qr_code"),t(),i(8,"p"),n(9,"QR Code"),t()()(),i(10,"div",59),n(11," Scan this QR code with any UPI app to pay"),u(12,"br"),i(13,"strong"),n(14,"Payment expires in "),i(15,"span",60),n(16),t()()()()()),d&2){let e=p(2);c(3),f("\u20B9",e.order.totalAmount.toFixed(2),""),c(13),P(e.qrTimer())}}function bt(d,o){d&1&&(i(0,"div",32)(1,"mat-form-field",47)(2,"mat-label"),n(3,"Wallet Type"),t(),i(4,"mat-select",61)(5,"mat-option",62),n(6,"Select wallet..."),t(),i(7,"mat-option",63),n(8,"Paytm"),t(),i(9,"mat-option",64),n(10,"Amazon Pay"),t(),i(11,"mat-option",65),n(12,"Mobikwik"),t(),i(13,"mat-option",66),n(14,"PhonePe Wallet"),t()()(),i(15,"mat-form-field",47)(16,"mat-label"),n(17,"Mobile Number"),t(),u(18,"input",67),i(19,"mat-icon",49),n(20,"phone"),t()()())}function ht(d,o){if(d&1&&(i(0,"div",36)(1,"mat-icon",4),n(2),t(),n(3),t()),d&2){let e=p(2);C("ngClass","status-"+e.paymentStatus.type),c(2),f(" ",e.getStatusIcon(e.paymentStatus.type)," "),c(),f(" ",e.paymentStatus.message," ")}}function _t(d,o){d&1&&(i(0,"div",37),u(1,"mat-spinner",68),i(2,"span"),n(3,"Processing payment..."),t()())}function gt(d,o){if(d&1){let e=M();i(0,"div",12)(1,"div",13)(2,"h2",14),n(3,"Order Summary"),t()(),i(4,"div",15),q(5,mt,10,4,"div",16,it),t(),i(7,"div",17)(8,"div",18)(9,"span"),n(10,"Subtotal"),t(),i(11,"span"),n(12),t()(),i(13,"div",18)(14,"span"),n(15,"GST (18%)"),t(),i(16,"span"),n(17),t()(),i(18,"div",18)(19,"span"),n(20,"Service Charge (10%)"),t(),i(21,"span"),n(22),t()(),i(23,"div",19)(24,"span"),n(25,"Total Amount"),t(),i(26,"span"),n(27),t()()()(),i(28,"div",20)(29,"div",21)(30,"h2",22),n(31,"Select Payment Method"),t(),i(32,"p",23),n(33,"Choose how you'd like to pay for this order"),t()(),i(34,"form",24)(35,"div",25),b("click",function(){h(e);let a=p();return _(a.selectPaymentMethod("cash"))}),i(36,"div",26)(37,"div",27)(38,"div",28)(39,"mat-icon",4),n(40,"payments"),t()(),i(41,"div",29)(42,"h3"),n(43,"Cash Payment"),t(),i(44,"p"),n(45,"Pay with cash at the counter"),t()()(),u(46,"div",30),t()(),i(47,"div",25),b("click",function(){h(e);let a=p();return _(a.selectPaymentMethod("card"))}),i(48,"div",26)(49,"div",27)(50,"div",31)(51,"mat-icon",4),n(52,"credit_card"),t()(),i(53,"div",29)(54,"h3"),n(55,"Card Payment"),t(),i(56,"p"),n(57,"Debit/Credit card via Stripe"),t()()(),u(58,"div",30),t(),y(59,pt,20,0,"div",32),t(),i(60,"div",25),b("click",function(){h(e);let a=p();return _(a.selectPaymentMethod("upi"))}),i(61,"div",26)(62,"div",27)(63,"div",33)(64,"mat-icon",4),n(65,"qr_code"),t()(),i(66,"div",29)(67,"h3"),n(68,"UPI Payment"),t(),i(69,"p"),n(70,"Pay using UPI apps like GPay, PhonePe"),t()()(),u(71,"div",30),t(),y(72,ut,17,2,"div",32),t(),i(73,"div",25),b("click",function(){h(e);let a=p();return _(a.selectPaymentMethod("wallet"))}),i(74,"div",26)(75,"div",27)(76,"div",34)(77,"mat-icon",4),n(78,"account_balance_wallet"),t()(),i(79,"div",29)(80,"h3"),n(81,"Digital Wallet"),t(),i(82,"p"),n(83,"Paytm, Amazon Pay, other wallets"),t()()(),u(84,"div",30),t(),y(85,bt,21,0,"div",32),t()(),i(86,"div",35),y(87,ht,4,3,"div",36)(88,_t,4,0,"div",37),i(89,"button",38),b("click",function(){h(e);let a=p();return _(a.processPayment())}),i(90,"mat-icon",4),n(91,"payment"),t(),n(92),t(),i(93,"div",39)(94,"button",40),b("click",function(){h(e);let a=p();return _(a.printBill())}),i(95,"mat-icon",4),n(96,"print"),t(),n(97," Print Bill "),t(),i(98,"button",40),b("click",function(){h(e);let a=p();return _(a.splitBill())}),i(99,"mat-icon",4),n(100,"call_split"),t(),n(101," Split Bill "),t()()()()}if(d&2){let e=p();c(5),A(e.order.items),c(7),f("\u20B9",e.order.subtotal.toFixed(2),""),c(5),f("\u20B9",e.order.tax.toFixed(2),""),c(5),f("\u20B9",e.order.serviceCharge.toFixed(2),""),c(5),f("\u20B9",e.order.totalAmount.toFixed(2),""),c(7),C("formGroup",e.paymentForm),c(),v("active",e.selectedPaymentMethod()==="cash"),c(11),v("checked",e.selectedPaymentMethod()==="cash"),c(),v("active",e.selectedPaymentMethod()==="card"),c(11),v("checked",e.selectedPaymentMethod()==="card"),c(),g(e.selectedPaymentMethod()==="card"?59:-1),c(),v("active",e.selectedPaymentMethod()==="upi"),c(11),v("checked",e.selectedPaymentMethod()==="upi"),c(),g(e.selectedPaymentMethod()==="upi"?72:-1),c(),v("active",e.selectedPaymentMethod()==="wallet"),c(11),v("checked",e.selectedPaymentMethod()==="wallet"),c(),g(e.selectedPaymentMethod()==="wallet"?85:-1),c(2),g(e.paymentStatus?87:-1),c(),g(e.isProcessing?88:-1),c(),C("disabled",!e.selectedPaymentMethod()||e.isProcessing),c(3),f(" Process Payment - \u20B9",e.order.totalAmount.toFixed(2)," ")}}var He=class d{fb=l(ye);router=l(ce);snackBar=l(Re);print=l(S);selectedPaymentMethod=F(null);qrTimer=F("5:00");order=null;isLoading=!1;isProcessing=!1;paymentStatus=null;subscription=new j;qrTimerSubscription;paymentForm=this.fb.group({cardNumber:[""],cardExpiry:[""],cardCvv:[""],cardholderName:[""],walletType:[""],walletMobile:[""]});ngOnInit(){this.loadStaticOrder(),this.subscription.add(E(6e4).subscribe(()=>{}))}ngOnDestroy(){this.subscription.unsubscribe(),this.qrTimerSubscription?.unsubscribe()}loadStaticOrder(){this.order={_id:"order_123",orderNumber:"A8F2K1",table:{tableNumber:"12",_id:"table_12"},items:[{_id:"1",product:{_id:"p1",name:"Butter Chicken",price:240},quantity:2,price:240,selectedAddons:[{addon:{name:"Spice Level",_id:"a1"},subAddon:{name:"Extra Spicy",price:0,_id:"sa1"}}]},{_id:"2",product:{_id:"p2",name:"Garlic Naan",price:70},quantity:3,price:70},{_id:"3",product:{_id:"p3",name:"Basmati Rice",price:80},quantity:2,price:80},{_id:"4",product:{_id:"p4",name:"Mango Lassi",price:90},quantity:2,price:90,specialInstructions:"Less sweet"}],subtotal:1030,tax:185.4,serviceCharge:103,totalAmount:1318.4,createdAt:new Date().toISOString()}}selectPaymentMethod(o){this.selectedPaymentMethod.set(o),this.paymentStatus=null,this.resetFormValidation(),o==="upi"?this.startQrTimer():this.qrTimerSubscription?.unsubscribe()}resetFormValidation(){let o=this.selectedPaymentMethod();Object.keys(this.paymentForm.controls).forEach(e=>{this.paymentForm.get(e)?.clearValidators(),this.paymentForm.get(e)?.updateValueAndValidity()}),o==="card"?(this.paymentForm.get("cardNumber")?.setValidators([k.required]),this.paymentForm.get("cardExpiry")?.setValidators([k.required]),this.paymentForm.get("cardCvv")?.setValidators([k.required]),this.paymentForm.get("cardholderName")?.setValidators([k.required])):o==="wallet"&&(this.paymentForm.get("walletType")?.setValidators([k.required]),this.paymentForm.get("walletMobile")?.setValidators([k.required])),Object.keys(this.paymentForm.controls).forEach(e=>{this.paymentForm.get(e)?.updateValueAndValidity()})}startQrTimer(){this.qrTimerSubscription?.unsubscribe();let o=300;this.qrTimerSubscription=E(1e3).pipe(U(()=>{o--;let e=Math.floor(o/60),r=o%60;return`${e}:${r.toString().padStart(2,"0")}`}),Y(()=>o>0)).subscribe({next:e=>this.qrTimer.set(e),complete:()=>{this.paymentStatus={type:"warning",message:"QR code has expired. Please select UPI payment again to generate a new code."}}})}getCurrentTime(){return new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}formatCardNumber(o){let e=o.target,r=e.value.replace(/\s/g,"").replace(/\D/g,"");r=r.substring(0,16),r=r.replace(/(.{4})/g,"$1 ").trim(),e.value=r,this.paymentForm.get("cardNumber")?.setValue(r)}formatExpiry(o){let e=o.target,r=e.value.replace(/\D/g,"");r.length>=2&&(r=r.substring(0,2)+"/"+r.substring(2,4)),e.value=r,this.paymentForm.get("cardExpiry")?.setValue(r)}getStatusIcon(o){switch(o){case"success":return"check_circle";case"error":return"error";case"warning":return"warning";default:return"info"}}processPayment(){return L(this,null,function*(){if(!this.order||!this.selectedPaymentMethod()||this.isProcessing)return;let o=this.selectedPaymentMethod();this.isProcessing=!0,this.paymentStatus=null;try{yield new Promise(e=>setTimeout(e,2e3)),this.paymentStatus={type:"success",message:"Payment processed successfully!"},this.snackBar.open("Payment completed successfully!","Close",{duration:5e3})}catch(e){this.paymentStatus={type:"error",message:e.message||"Payment processing failed. Please try again."}}finally{this.isProcessing=!1}})}printBill(){this.order&&(this.print.printCustomerBill(this.order),this.snackBar.open("Bill sent to printer","Close",{duration:3e3}))}splitBill(){this.order&&this.snackBar.open("Bill splitting feature coming soon!","Close",{duration:3e3})}static \u0275fac=function(e){return new(e||d)};static \u0275cmp=O({type:d,selectors:[["app-pos-checkout"]],decls:11,vars:3,consts:[[1,"checkout-container"],[1,"checkout-header"],[1,"pos-title"],[1,"pos-logo"],[1,"material-symbols-outlined"],[1,"header-info"],[1,"loading-container"],[1,"order-info"],[1,"order-number"],[1,"table-number"],[1,"order-time"],["diameter","60"],[1,"order-summary"],[1,"summary-header"],[1,"summary-title"],[1,"order-items"],[1,"order-item"],[1,"order-totals"],[1,"total-row"],[1,"total-row","final"],[1,"payment-panel"],[1,"payment-header"],[1,"payment-title"],[1,"payment-subtitle"],[1,"payment-methods",3,"formGroup"],[1,"payment-option",3,"click"],[1,"option-header"],[1,"option-info"],[1,"option-icon","cash"],[1,"option-details"],[1,"option-radio"],[1,"option-icon","card"],[1,"payment-form","active"],[1,"option-icon","upi"],[1,"option-icon","wallet"],[1,"action-section"],[1,"status-message",3,"ngClass"],[1,"processing"],["mat-raised-button","","color","primary",1,"primary-button",3,"click","disabled"],[1,"button-row"],["mat-stroked-button","","color","primary",1,"secondary-button",3,"click"],[1,"item-details"],[1,"item-name"],[1,"item-addons"],[1,"item-quantity-price"],[1,"quantity-badge"],[1,"item-price"],["appearance","outline",1,"full-width"],["matInput","","formControlName","cardNumber","placeholder","1234 5678 9012 3456","maxlength","19",3,"input"],["matSuffix","",1,"material-symbols-outlined"],[1,"form-row"],["appearance","outline"],["matInput","","formControlName","cardExpiry","placeholder","MM/YY","maxlength","5",3,"input"],["matInput","","formControlName","cardCvv","placeholder","123","maxlength","4","type","password"],["matInput","","formControlName","cardholderName","placeholder","John Doe"],[1,"qr-display"],[1,"qr-amount"],[1,"qr-code"],[1,"qr-placeholder"],[1,"qr-instructions"],[1,"timer"],["formControlName","walletType"],["value",""],["value","paytm"],["value","amazonpay"],["value","mobikwik"],["value","phonepe"],["matInput","","formControlName","walletMobile","placeholder","Enter mobile number","pattern","[0-9]{10}","maxlength","10"],["diameter","24"]],template:function(e,r){e&1&&(i(0,"div",0)(1,"header",1)(2,"div",2)(3,"div",3)(4,"mat-icon",4),n(5,"point_of_sale"),t()(),i(6,"h1"),n(7,"Checkout & Payment"),t()(),y(8,nt,11,3,"div",5),t(),y(9,at,4,0,"div",6)(10,gt,102,28),t()),e&2&&(c(8),g(r.order?8:-1),c(),g(r.isLoading?9:-1),c(),g(!r.isLoading&&r.order?10:-1))},dependencies:[de,re,Ce,_e,ue,be,he,ve,xe,ke,ge,fe,pe,qe,De,ze,Ae,Be,Me,Pe,we,$e,Ge,Oe,Ee,Se,Qe,Ne,Ue,je],styles:[`[_nghost-%COMP%]{--primary-color: #009c4c;--primary-light: #00b359;--primary-dark: #00783a;--accent-color: #ff7979;--background-color: #fff8eb;--card-bg: #ffffff;--text-color: #333333;--text-light: #666666;--urgent-color: #e74c3c;--warning-color: #f39c12;--success-color: #27ae60;--timing-function: cubic-bezier(.34, 1.56, .64, 1);--shadow-light: 0 2px 10px rgba(0, 0, 0, .05);--shadow-medium: 0 10px 30px rgba(0, 0, 0, .08);--shadow-heavy: 0 15px 35px rgba(0, 0, 0, .12)}.checkout-container[_ngcontent-%COMP%]{max-width:1400px;margin:0 auto;padding:24px;display:grid;grid-template-columns:1fr 480px;gap:24px;min-height:100vh;background-color:var(--background-color);background-image:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23fff8eb"/><circle cx="10" cy="10" r="2" fill="%23009c4c" opacity="0.2"/><circle cx="50" cy="10" r="2" fill="%23009c4c" opacity="0.2"/><circle cx="90" cy="10" r="2" fill="%23009c4c" opacity="0.2"/><circle cx="10" cy="50" r="2" fill="%23009c4c" opacity="0.2"/><circle cx="50" cy="50" r="2" fill="%23009c4c" opacity="0.2"/><circle cx="90" cy="50" r="2" fill="%23009c4c" opacity="0.2"/><circle cx="10" cy="90" r="2" fill="%23009c4c" opacity="0.2"/><circle cx="50" cy="90" r="2" fill="%23009c4c" opacity="0.2"/><circle cx="90" cy="90" r="2" fill="%23009c4c" opacity="0.2"/></svg>');background-attachment:fixed}.checkout-header[_ngcontent-%COMP%]{grid-column:1/-1;background-color:var(--card-bg);border-radius:16px;padding:20px 24px;margin-bottom:0;box-shadow:var(--shadow-medium);display:flex;justify-content:space-between;align-items:center;animation:_ngcontent-%COMP%_slideDown .5s var(--timing-function)}@keyframes _ngcontent-%COMP%_slideDown{0%{transform:translateY(-20px);opacity:0}to{transform:translateY(0);opacity:1}}.pos-title[_ngcontent-%COMP%]{display:flex;align-items:center}.pos-logo[_ngcontent-%COMP%]{width:48px;height:48px;background-color:var(--primary-color);border-radius:50%;display:flex;justify-content:center;align-items:center;margin-right:16px;box-shadow:0 5px 15px #009c4c33;position:relative;overflow:hidden}.pos-logo[_ngcontent-%COMP%]:before{content:"";position:absolute;width:100%;height:100%;background:linear-gradient(45deg,transparent,rgba(255,255,255,.2),transparent);top:0;left:-100%;animation:_ngcontent-%COMP%_shimmer 3s infinite linear}@keyframes _ngcontent-%COMP%_shimmer{0%{transform:translate(0)}to{transform:translate(200%)}}.pos-logo[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{color:#fff;font-size:28px}.pos-title[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{color:var(--text-color);margin:0;font-weight:700;font-size:24px}.header-info[_ngcontent-%COMP%]{display:flex;align-items:center;gap:24px;color:var(--text-light)}.order-info[_ngcontent-%COMP%]{text-align:right}.order-number[_ngcontent-%COMP%]{font-size:18px;font-weight:600;color:var(--text-color)}.table-number[_ngcontent-%COMP%]{font-size:14px;color:var(--text-light)}.order-time[_ngcontent-%COMP%]{display:flex;align-items:center;gap:6px}.loading-container[_ngcontent-%COMP%]{grid-column:1/-1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 20px;color:var(--text-light)}.loading-container[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin-top:20px;font-size:16px}.order-summary[_ngcontent-%COMP%]{background-color:var(--card-bg);border-radius:16px;box-shadow:var(--shadow-medium);display:flex;flex-direction:column;animation:_ngcontent-%COMP%_fadeInUp .6s var(--timing-function) .1s backwards}@keyframes _ngcontent-%COMP%_fadeInUp{0%{transform:translateY(30px);opacity:0}to{transform:translateY(0);opacity:1}}.summary-header[_ngcontent-%COMP%]{padding:24px 24px 0;border-bottom:1px solid rgba(0,0,0,.06);margin-bottom:20px}.summary-title[_ngcontent-%COMP%]{font-size:20px;font-weight:700;margin-bottom:16px;color:var(--text-color)}.order-items[_ngcontent-%COMP%]{padding:0 24px;flex:1;overflow-y:auto;max-height:400px}.order-item[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:flex-start;padding:16px 0;border-bottom:1px solid rgba(0,0,0,.05);transition:all .3s ease}.order-item[_ngcontent-%COMP%]:hover{background-color:#009c4c05;margin:0 -12px;padding:16px 12px;border-radius:8px}.item-details[_ngcontent-%COMP%]{flex:1}.item-name[_ngcontent-%COMP%]{font-weight:600;margin-bottom:4px;color:var(--text-color)}.item-addons[_ngcontent-%COMP%]{font-size:13px;color:var(--text-light);margin-bottom:4px}.item-quantity-price[_ngcontent-%COMP%]{display:flex;align-items:center;gap:16px}.quantity-badge[_ngcontent-%COMP%]{background-color:var(--primary-color);color:#fff;padding:2px 8px;border-radius:12px;font-size:12px;font-weight:600;min-width:30px;text-align:center}.item-price[_ngcontent-%COMP%]{font-weight:700;color:var(--text-color);font-size:16px;min-width:80px;text-align:right}.order-totals[_ngcontent-%COMP%]{padding:24px;background-color:#f8f9fa;border-radius:0 0 16px 16px}.total-row[_ngcontent-%COMP%]{display:flex;justify-content:space-between;margin-bottom:12px;font-size:14px}.total-row.final[_ngcontent-%COMP%]{border-top:2px solid var(--primary-color);padding-top:12px;margin-top:16px;font-size:18px;font-weight:700;color:var(--primary-color)}.payment-panel[_ngcontent-%COMP%]{background-color:var(--card-bg);border-radius:16px;box-shadow:var(--shadow-medium);display:flex;flex-direction:column;animation:_ngcontent-%COMP%_fadeInUp .6s var(--timing-function) .2s backwards}.payment-header[_ngcontent-%COMP%]{padding:24px 24px 16px;border-bottom:1px solid rgba(0,0,0,.06)}.payment-title[_ngcontent-%COMP%]{font-size:20px;font-weight:700;color:var(--text-color);margin-bottom:8px}.payment-subtitle[_ngcontent-%COMP%]{color:var(--text-light);font-size:14px}.payment-methods[_ngcontent-%COMP%]{padding:24px;display:flex;flex-direction:column;gap:16px}.payment-option[_ngcontent-%COMP%]{border:2px solid rgba(0,0,0,.1);border-radius:12px;padding:20px;cursor:pointer;transition:all .3s var(--timing-function);position:relative;overflow:hidden}.payment-option[_ngcontent-%COMP%]:hover{border-color:var(--primary-color);transform:translateY(-2px);box-shadow:var(--shadow-light)}.payment-option.active[_ngcontent-%COMP%]{border-color:var(--primary-color);background-color:#009c4c05}.payment-option.active[_ngcontent-%COMP%]:before{content:"";position:absolute;top:0;left:0;width:5px;height:100%;background:linear-gradient(to bottom,var(--primary-color),var(--primary-light))}.option-header[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}.option-info[_ngcontent-%COMP%]{display:flex;align-items:center;gap:12px}.option-icon[_ngcontent-%COMP%]{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:20px}.option-icon.cash[_ngcontent-%COMP%]{background-color:var(--success-color)}.option-icon.card[_ngcontent-%COMP%]{background-color:var(--primary-color)}.option-icon.upi[_ngcontent-%COMP%]{background-color:var(--warning-color)}.option-icon.wallet[_ngcontent-%COMP%]{background-color:#9b59b6}.option-details[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:16px;font-weight:600;margin-bottom:2px;color:var(--text-color)}.option-details[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:12px;color:var(--text-light)}.option-radio[_ngcontent-%COMP%]{width:20px;height:20px;border:2px solid var(--primary-color);border-radius:50%;position:relative;background-color:#fff}.option-radio.checked[_ngcontent-%COMP%]:after{content:"";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:10px;height:10px;background-color:var(--primary-color);border-radius:50%;animation:_ngcontent-%COMP%_checkPulse .3s var(--timing-function)}@keyframes _ngcontent-%COMP%_checkPulse{0%{transform:translate(-50%,-50%) scale(0)}50%{transform:translate(-50%,-50%) scale(1.2)}to{transform:translate(-50%,-50%) scale(1)}}.payment-form[_ngcontent-%COMP%]{margin-top:16px;padding-top:16px;border-top:1px solid rgba(0,0,0,.06)}.payment-form.active[_ngcontent-%COMP%]{animation:_ngcontent-%COMP%_slideDown .4s var(--timing-function)}@keyframes _ngcontent-%COMP%_slideDownForm{0%{transform:translateY(-10px);opacity:0}to{transform:translateY(0);opacity:1}}.full-width[_ngcontent-%COMP%]{width:100%;margin-bottom:16px}.form-row[_ngcontent-%COMP%]{display:grid;grid-template-columns:2fr 1fr;gap:12px;margin-bottom:16px}.form-row[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%]{margin-bottom:0}.qr-display[_ngcontent-%COMP%]{text-align:center;padding:20px}.qr-code[_ngcontent-%COMP%]{background-color:#fff;padding:20px;border-radius:12px;display:inline-block;box-shadow:var(--shadow-light);margin-bottom:16px}.qr-placeholder[_ngcontent-%COMP%]{width:200px;height:200px;border:2px dashed #ccc;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#999}.qr-placeholder[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:48px;margin-bottom:8px}.qr-instructions[_ngcontent-%COMP%]{font-size:14px;color:var(--text-light);line-height:1.5}.qr-amount[_ngcontent-%COMP%]{font-size:24px;font-weight:700;color:var(--primary-color);margin-bottom:16px}.timer[_ngcontent-%COMP%]{color:var(--urgent-color);font-weight:600}.action-section[_ngcontent-%COMP%]{padding:24px;border-top:1px solid rgba(0,0,0,.06);background-color:#f8f9fa;border-radius:0 0 16px 16px}.primary-button[_ngcontent-%COMP%]{width:100%;height:56px;background:linear-gradient(135deg,var(--primary-color),var(--primary-light));color:#fff;border:none;border-radius:12px;font-size:16px;font-weight:600;cursor:pointer;transition:all .3s var(--timing-function);position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;gap:8px}.primary-button[_ngcontent-%COMP%]:before{content:"";position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent);transition:left .5s ease}.primary-button[_ngcontent-%COMP%]:hover:not(:disabled):before{left:100%}.primary-button[_ngcontent-%COMP%]:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 25px #009c4c4d}.primary-button[_ngcontent-%COMP%]:active:not(:disabled){transform:translateY(0)}.primary-button[_ngcontent-%COMP%]:disabled{background:#ccc;cursor:not-allowed;transform:none;box-shadow:none}.button-row[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}.button-row[_ngcontent-%COMP%]:last-child{margin-top:8px}.secondary-button[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;gap:6px;height:44px;transition:all .3s ease}.secondary-button[_ngcontent-%COMP%]:hover{transform:translateY(-1px);box-shadow:var(--shadow-light)}.status-message[_ngcontent-%COMP%]{padding:16px;border-radius:8px;margin-bottom:16px;display:flex;align-items:center;gap:12px;font-weight:500}.status-success[_ngcontent-%COMP%]{background-color:#27ae601a;color:var(--success-color);border:1px solid rgba(39,174,96,.2)}.status-error[_ngcontent-%COMP%]{background-color:#e74c3c1a;color:var(--urgent-color);border:1px solid rgba(231,76,60,.2)}.status-warning[_ngcontent-%COMP%]{background-color:#f39c121a;color:var(--warning-color);border:1px solid rgba(243,156,18,.2)}.processing[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;gap:12px;padding:20px;color:var(--text-light);margin-bottom:16px}@media (max-width: 1024px){.checkout-container[_ngcontent-%COMP%]{grid-template-columns:1fr;grid-template-rows:auto 1fr auto}.payment-panel[_ngcontent-%COMP%]{order:-1}}@media (max-width: 768px){.checkout-container[_ngcontent-%COMP%]{padding:16px;gap:16px}.checkout-header[_ngcontent-%COMP%]{flex-direction:column;gap:16px;text-align:center}.form-row[_ngcontent-%COMP%], .button-row[_ngcontent-%COMP%]{grid-template-columns:1fr}.item-quantity-price[_ngcontent-%COMP%]{flex-direction:column;align-items:flex-end;gap:8px}}  .mat-mdc-form-field .mat-mdc-text-field-wrapper{background-color:transparent}  .mat-mdc-form-field .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,   .mat-mdc-form-field .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,   .mat-mdc-form-field .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing{border-color:#0000001f}  .mat-mdc-form-field .mdc-text-field--outlined:not(.mdc-text-field--disabled):hover .mdc-notched-outline__leading,   .mat-mdc-form-field .mdc-text-field--outlined:not(.mdc-text-field--disabled):hover .mdc-notched-outline__notch,   .mat-mdc-form-field .mdc-text-field--outlined:not(.mdc-text-field--disabled):hover .mdc-notched-outline__trailing{border-color:var(--primary-color)}  .mat-mdc-select-panel{max-height:300px}`]})};export{He as PosCheckoutComponent};
