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
const RECTANGLE_INIT_COUNT = 10;
import Rectangle from "./Rectangle";

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    rectanglePrefab: cc.Prefab = null;
    // LIFE-CYCLE CALLBACKS:

    rectanglePool: cc.NodePool;

    onLoad () {
        //init pool
        this.rectanglePool = new cc.NodePool("Rectangle");
        for (let i = 0; i < RECTANGLE_INIT_COUNT; i++) {
            let rect = cc.instantiate(this.rectanglePrefab);
            this.rectanglePool.put(rect);
        }

    }

    start () {
        this.schedule(this.spawnRectangle, 3);
    }

    // update (dt) {}

    createRectangle () {
        let rect: cc.Node = null;
        if (this.rectanglePool.size() > 0) {
            rect = this.rectanglePool.get();
        } else {
            rect = cc.instantiate(this.rectanglePrefab);
        }

        rect.getComponent(Rectangle).canvasNode = this.node;
        return rect;
    }


    spawnRectangle () {
        let rect = this.createRectangle();
        this.node.addChild(rect);
        rect.getComponent(Rectangle).init();
    }
}
