const {ccclass, property} = cc._decorator;

@ccclass
export default class ArrowPrefabClass extends cc.Component {


    arrowXSpeed: number = 600
    arrowYSpeed: number = 0
    arrowYSpeedA: number = -200

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    _arrowRun(dt: any):void {
        this.arrowYSpeed+=this.arrowYSpeedA*dt
        this.node.x += this.arrowXSpeed*dt
        this.node.y += this.arrowYSpeed*dt
    }

    update (dt: any) {
        // console.log(`arrow update`)
        this._arrowRun(dt)
    }

    onCollisionEnter() {
        console.log('arrow on collision enter')
        this.node.removeFromParent()
    }

    // onCollisionStay() {
    //     console.log('arrow on collision stay')
    // }

    // onCollisionExit() {
    //     console.log('arrow on collision exit')
    // }
}
