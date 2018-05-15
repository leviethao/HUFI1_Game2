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
import InGame from "./InGame";

@ccclass
export default class NewClass extends cc.Component {

    canvasNode: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
    }

    update (dt) {
        
    }

    init () {

        //init random position
        let rand = cc.randomMinus1To1();
        rand *= 0.5;
        if (this.canvasNode.getComponent(InGame).swapSide) {
            rand = rand < 0 ? -rand : rand;
            this.canvasNode.getComponent(InGame).swapSide = !this.canvasNode.getComponent(InGame).swapSide;
        } else {
            rand = rand > 0 ? -rand : rand;
            this.canvasNode.getComponent(InGame).swapSide = !this.canvasNode.getComponent(InGame).swapSide;
        }

        let x = this.canvasNode.width / 2 * rand + (Math.abs(rand) / rand) * this.canvasNode.width / 4;
        if (x < -this.canvasNode.width / 2 + this.node.width / 2) {
            x = -this.canvasNode.width / 2 + this.node.width / 2;
        }

        if (x > this.canvasNode.width / 2 - this.node.width / 2) {
            x = this.canvasNode.width / 2 - this.node.width / 2;
        }

        let y = this.canvasNode.height / 2 + this.node.height / 2;

        this.node.position = new cc.Vec2(x, y);

        //init box collider
        this.node.getComponent(cc.BoxCollider).size = cc.size(5, this.node.height);

        //init bounding box
        this.node.getChildByName("BoundingBox").getComponent(cc.BoxCollider).size = this.node.getContentSize();
    }

    fall () {
        let scaleToAction = cc.scaleTo(1, 0, 0);
        let rotateByAction = cc.rotateBy(2, 360);
        this.node.runAction(cc.spawn(scaleToAction, rotateByAction));
    }
}
