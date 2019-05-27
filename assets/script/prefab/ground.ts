const {ccclass, property} = cc._decorator;

@ccclass
export default class GroundPreFabClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    // onCollisionEnter() {
    //     console.log('ground on collision enter')
    // }

    // onCollisionStay() {
    //     console.log('ground on collision stay')
    // }

    // onCollisionExit() {
    //     console.log('ground on collision exit')
    // }
}
