const {ccclass, property} = cc._decorator;

@ccclass
export default class ManPreFabClass extends cc.Component {

    // 人体Y轴速度
    manYSpeed: number = 0

    // 人体Y轴加速度
    manYAcceleration: number = -200

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    update (dt: any) {
      this._updateMan(dt)
    }

    /**
     * 跳起
     */
    jump():void {
      this.manYSpeed = 200
    }

    // 人体重力
    _updateMan(dt: any): void {
      this.manYSpeed += dt* this.manYAcceleration
      this.node.y += dt * this.manYSpeed
    }

    onCollisionEnter(other: any, self: any) {
      this.manYAcceleration = 0
      this.manYSpeed = 0
      this.node.y = other.node.y + self.node.height / 2
      // console.log('man on collision enter', other, self)
    }

    onCollisionStay() {
      // console.log('man collision stay')
    }

    onCollisionExit() {
      this.manYAcceleration = -200
      // console.log('man on collision exit')
    }
}
