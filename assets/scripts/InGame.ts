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

    @property (cc.Node)
    player: cc.Node = null;

    @property(cc.Node)
    background: cc.Node = null;

    @property(cc.Node)
    drawing: cc.Node = null;

    @property(cc.Node)
    camera: cc.Node = null;

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property({url: cc.AudioClip})
    scoreAudio: cc.AudioClip = null;    
    
    @property({url: cc.AudioClip})
    gameOverAudio: cc.AudioClip = null;
    
    @property({url: cc.AudioClip})
    backgroundAudio: cc.AudioClip = null;

    // LIFE-CYCLE CALLBACKS:

    rectanglePool: cc.NodePool;
    oldRectPosY: number;
    scoreVal: number;
    swapSide: boolean;
    isBegan: boolean;
    backgroundAudioID: number;
    isGameOver: boolean;

    onLoad () {
        //init pool
        this.rectanglePool = new cc.NodePool("Rectangle");
        for (let i = 0; i < RECTANGLE_INIT_COUNT; i++) {
            let rect = cc.instantiate(this.rectanglePrefab);
            this.rectanglePool.put(rect);
        }

    }

    start () {
        this.isGameOver = false;
        this.isBegan = false;
        this.swapSide = false;
        this.oldRectPosY = 0;
        this.scoreVal = 0;
        this.background.setLocalZOrder(1);
        this.player.setLocalZOrder(3);
        this.drawing.setLocalZOrder(4);
        this.scoreLabel.node.parent.setLocalZOrder(5);

        let initRectCount = 5;
        for (let i = 0; i < initRectCount; i++) {
            this.spawnRectangle();
        }

        let beginRect = this.spawnRectangle();
        beginRect.position = this.player.position;

        this.backgroundAudioID = cc.audioEngine.play(this.backgroundAudio, true, 0.5);
    }

    update (dt) {
        if (this.oldRectPosY - this.camera.y < this.node.height / 2) {
            this.spawnRectangle();
            console.log(this.oldRectPosY);
        }
    }

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


    spawnRectangle () : cc.Node {
        let rect = this.createRectangle();
        this.node.addChild(rect);
        rect.getComponent(Rectangle).init();
        rect.setLocalZOrder(2);
        this.camera.getComponent(cc.Camera).addTarget(rect);

        //set y position
        let randY = Math.random();
        rect.y = this.oldRectPosY + randY * rect.height * 2 + rect.height;

        this.oldRectPosY = rect.y;
        return rect;
    }

    gainScore () {
        this.scoreVal++;
        this.scoreLabel.string = this.scoreVal.toString();
        cc.audioEngine.play(this.scoreAudio, false, 1);
    }

    gameOver () {
        this.isGameOver = true;
        cc.audioEngine.play(this.gameOverAudio, false, 1);
        cc.audioEngine.stop(this.backgroundAudioID);
        
        //save score
        cc.sys.localStorage.setItem("score", this.scoreVal);

        this.node.runAction(cc.sequence(cc.fadeOut(0.2), cc.callFunc(function () {
            cc.director.loadScene("GameOver");
        })));
    }
}
