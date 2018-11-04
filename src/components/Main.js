require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

//获取图片相关的数据
let imageData = require('../data/imageData.json');

//利用函数，将图片名信息转成图片URL路径信息
function genImageURL(imageDataArr) {
  for (let i = 0, j = imageDataArr.length; i < j; i++) {
    let singleImageData = imageDataArr[i];
    singleImageData.imageURL = require('../images/' + singleImageData.fileName);
    imageDataArr[i] = singleImageData;
  }
  return imageDataArr;
}

imageData = genImageURL(imageData);

//获取区间内的一个随机值
function getRangeRandom(low, high) {
  return Math.ceil(Math.random() * (high - low) + low);

}

//获取0-30度之间的一个任意正负值
function get30DegRandom() {
  return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}

class ImgFigure extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    let styleObj = {};
    //如果props属性中制定了这张图片的位置，则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }

    //如果图片的旋转角度有值并且不为0， 添加旋转角度
    if (this.props.arrange.rotate) {
      (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach((value) => {
        styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      })
    }
    if (this.props.arrange.isCenter) {
      styleObj.zIndex = 11;
    }

    let imgFigureClassName = 'img-figure';
        imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageURL}
             alt={this.props.data.title} />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick} >
            <p>{this.props.data.desc}</p>
          </div>
        </figcaption>
      </figure>
    );
  }
}

class ContollerUnit extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    let controllerUnitClassName = 'controller-unit';
    if (this.props.arrange.isCenter) {
      controllerUnitClassName += ' is-center';
      if (this.props.arrange.isInverse) {
        controllerUnitClassName += ' is-inverse';
      }
    }
    return (
      <span className={controllerUnitClassName} onClick={this.handleClick}></span>
    );
  }
}

class AppComponent extends React.Component {
  constructor(props) {
    super(props);
    this.Constant = {
      centerPos: {
        top: 0,
        lef: 0
      },
      hPosRange: {
        leftSecX: [0,0],
        rightSecX: [0,0],
        y: [0,0]
      },
      vPosRange: {
        x: [0,0],
        topY: [0,0]
      }
    };
    this.state = {
      imgsArrangeArr: []
    }
  }

  //翻转图片
  //@param index 输入当前被执行inverse操作的图片index
  //@return {Function} 这是一个必报函数，其内return一个真正待执行的函数
  inverse(index) {
    return () => {
      let imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState({
        imgsArrangeArr: imgsArrangeArr
      });
    }
  }

  //重新布局所有图片
  //param centerIndex制定居中排布哪个图片
  /* rearrange(centerIndex) {
    let imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,
      imgsArrangeTopArr = [], //用来存储布局在上侧区域的图片状态信息
      topImgNum = Math.floor(Math.random() * 2),  //上侧区域有0个或者1个图片
      topImgSpliceIndex = 0,  //用来标记上侧区域的图片序号
      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

      //首先居中centerIndex图片，centerIndex图片不需要旋转
      imgsArrangeCenterArr[0] = centerPos;
      //去除要布局上侧的图片的状态信息
      topImgSpliceIndex = Math.ceil(Math.random() * imgsArrangeArr.length - topImgNum);
      console.log('centerIndex ' + centerIndex + ' topIndex ' + topImgSpliceIndex + ' topNum ' + topImgNum);
      imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
      //布局位于上侧的图片
      imgsArrangeTopArr.forEach((value, index) => {
        imgsArrangeTopArr[index].pos = {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        };
      });

      //布局左右两侧的图片
      for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
        let hPosRangeLORX = null;
        //前半部分布局在左边，后半部分布局在右边
        if (i < k) {
          hPosRangeLORX = hPosRangeLeftSecX;
        } else {
          hPosRangeLORX = hPosRangeRightSecX;
        }
        imgsArrangeArr[i].pos = {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        }
      }

      //重新合并回来
      //如果上侧区域有一个图片
      if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
        imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }

    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
      for ( let i = 1; i < imgsArrangeArr.length; i++) {
        console.log( imgsArrangeArr[i].pos.top + ' ' + imgsArrangeArr[i].pos.left);
      }
      this.setState({
        imgsArrangeArr: this.state.imgsArrangeArr
      });
  } */

  //重新布局所有图片
  rearrange(centerIndex) {
    let imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,
      imgsArrangTopArr = [],
      topImgNum = Math.floor(Math.random() * 2), //取一个或者不取
      topImgSpiceIndex = 0,
      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
      //首先居中centerIndex图片 ,centerIndex图片不需要旋转
      imgsArrangeCenterArr[0] = {
        pos: centerPos,
        rotate: 0,
        isCenter: true
      }
      //取出要布局上测的图片的状态信息
    topImgSpiceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangTopArr = imgsArrangeArr.splice(topImgSpiceIndex, topImgNum);
    //布局位于上侧的图片
    imgsArrangTopArr.forEach((value, index) => {
      imgsArrangTopArr[index] = {
        pos: {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false

      };
    });

    //布局左两侧的图片
    for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      let hPosRangeLORX = null;

      //前半部分布局左边,右边部分布局右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX
      }
      imgsArrangeArr[i] = {
        pos: {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      };
    }

    //debugger;

    if (imgsArrangTopArr && imgsArrangTopArr[0]) {
      imgsArrangeArr.splice(topImgSpiceIndex, 0, imgsArrangTopArr[0]);
    }
    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
    this.setState({
      imgsArrangeArr: imgsArrangeArr
    });
  }

  center(index) {
    return () => {
      this.rearrange(index);
    }
  }

  //组件加载以后为每张图片计算其位置的范围
  componentDidMount() {
    let stageDOM = ReactDOM.findDOMNode(this.refs.stage);
    let stageW = stageDOM.scrollWidth;
    let stageH = stageDOM.scrollHeight;
    let halfStageW = Math.ceil(stageW / 2);
    let halfStageH = Math.ceil(stageH / 2);

    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0);
    let imgW = imgFigureDOM.scrollWidth;
    let imgH = imgFigureDOM.scrollHeight;
    let halfImgW = Math.ceil(imgW / 2);
    let halfImgH = Math.ceil(imgH / 2);

    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };

    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;
    this.rearrange(0);
  }

  render() {
    let controllerUnits = [];
    let imgFigures = [];
    imageData.forEach((item, index) => {
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          inCenter: false
        }
      }
      imgFigures.push(<ImgFigure data={item} key={index} ref={'imgFigure'+index} 
                                 arrange={this.state.imgsArrangeArr[index]} 
                                 inverse={this.inverse(index)} 
                                 center={this.center(index)}/>);
      controllerUnits.push(<ContollerUnit key={index} arrange={this.state.imgsArrangeArr[index]}
                                          inverse={this.inverse(index)}
                                          center={this.center(index)}/>);
    });
    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
