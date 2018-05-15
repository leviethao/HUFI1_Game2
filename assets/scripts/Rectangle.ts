// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    canvasNode: cc.Node = null;
    speed: number;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.speed = 200;
    }

    update (dt) {
        this.node.y -= this.speed * dt;
    }

    init () {
        let rand = cc.randomMinus1To1();
        let x = this.canvasNode.width / 2 * rand;
        if (x < -this.canvasNode.width / 2 + this.node.width / 2) {
            x = -this.canvasNode.width / 2 + this.node.width / 2;
        }

        if (x > this.canvasNode.width / 2 - this.node.width / 2) {
            x = this.canvasNode.width / 2 - this.node.width / 2;
        }

        let y = this.canvasNode.height / 2 + this.node.height / 2;

        this.node.position = new cc.Vec2(x, y);
    }
}
