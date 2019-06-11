const {ccclass, property} = cc._decorator;
import { IS_DEBUG, GROUND_SPEED } from './config'

@ccclass
export default class GameSceneClass extends cc.Component {

    // 弓
    @property({
        type: cc.Prefab
    })
    bowPreFab: cc.Prefab = null;

    // 地面图层
    @property({
        type: cc.Node
    })
    groundWrap: cc.Node = null

    // 弹药图层
    @property({
        type: cc.Node
    })
    arrowWrap: cc.Node = null

    // 地面
    @property({
        type: cc.Prefab
    })
    groundPreFab: cc.Prefab = null;

    // 人
    @property({
        type: cc.Node
    })
    man: cc.Node = null;

    // 箭
    @property({
        type: cc.Prefab
    })
    arrowPreFab: cc.Prefab = null;

    // 地面数组
    groundArray: Array<cc.Node> = []

    // 地面移动速度
    groundSpeed: number = GROUND_SPEED

    

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        console.log(`game onload`)
    }

    start () {
        console.log(`game start `, this.node, this.groundPreFab)
        const manager = cc.director.getCollisionManager()
        manager.enabled = true
        if(IS_DEBUG){
            manager.enabledDebugDraw = true
        }
        this._drawGround()
    }

    /**
     * 射箭
     * @param arrowYSpeed Y轴初始速度 
     * @param rotation 初始旋转角度
     */
    addArrow(arrowYSpeed: number = 0,arrowXSpeed:number = 1000, rotation: number = 0): void{
        console.log(`addArrow`)
        const tmpArrow = cc.instantiate(this.arrowPreFab)
        tmpArrow.setPosition(this.man.x, this.man.y + 20)
        tmpArrow.getComponent('arrow').arrowYSpeed = arrowYSpeed
        tmpArrow.getComponent('arrow').arrowXSpeed = arrowXSpeed
        tmpArrow.getComponent('arrow').node.rotation = rotation
        this.arrowWrap.addChild(tmpArrow)
    }

    // 画地板
    _drawGround():void {
        for(var groundWidth=-this.node.width; groundWidth < this.node.width; groundWidth+= this.groundPreFab.data.width) {
            const groundunit = cc.instantiate(this.groundPreFab)
            groundunit.x = groundWidth
            groundunit.y = -120
            this.groundWrap.addChild(groundunit)
            this.groundArray.push(groundunit)
        }
    }

    // 地板更新
    _updateGround(dt: any):void {
        const offsetX = dt * this.groundSpeed
        this.groundArray.forEach((item, index) => {
            item.x -= offsetX
            if(item.x < -this.node.width) {
                item.x = this.node.width + (-this.node.width - item.x)
            }
        })
    }

    

    update (dt:any) {
        this._updateGround(dt)
    }

    onCollisionEnter() {
        console.log('game on collision enter')
    }

    onCollisionStay() {
        console.log('game collision stay')
    }

    onCollisionExit() {
        console.log('game on collision exit')
    }
}
