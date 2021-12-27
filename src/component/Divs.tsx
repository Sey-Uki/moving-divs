import React from "react";
import "./Divs.css";

interface IDiv {
  beginX?: number,
  beginY?: number,
  endX?: number,
  endY?: number,
  width?: number,
  height?: number
}

interface IDivsState {
  array: IDiv[],
  current?: IDiv,
  isClicked: boolean,
  pos?: number,
  moveFlag: boolean,

  test: IDiv[]
}

export class Divs extends React.Component<{}, IDivsState>{
  constructor(props: {}) {
    super(props);
    this.state = {
      array: [],
      isClicked: false,
      moveFlag: false,

      test: []
    };
  }

  mouseDown = (e: any) => {
    if (!(e.target as HTMLDivElement).classList.contains("div-selected") && !this.state.moveFlag && !this.state.isClicked) {
      this.setState({
        isClicked: true,
        current: {
          beginX: e.pageX,
          beginY: e.pageY,
        },
      })
    }

    this.mouseMove(e);
  }

  mouseUp = (e: any) => {
      this.setState({
        isClicked: false,
        array: [
          ...this.state.array,
          {
            beginX: this.state.current?.beginX,
            beginY: this.state.current?.beginY,
            endX: e.pageX,
            endY: e.pageY,
            width: Math.abs(e.pageX - this.state.current!.beginX!),
            height: Math.abs(e.pageY - this.state.current!.beginY!),
          },
        ],
        test: []
      })

    this.onDivUp();
  }

  mouseMove = (e: any) => {
    if (this.state.moveFlag && !this.state.isClicked) {
      let myPos = this.state.pos;
      let temp = [...this.state.array]
      this.state.array.map((item, pos) => {
        if (myPos === pos) {
          temp[pos] = {
            beginX: e.pageX,
            beginY: e.pageY,
            endX: Math.abs(e.pageX - temp[pos].width!),
            endY: Math.abs(e.pageY - temp[pos].height!),
            width: temp[pos].width,
            height: temp[pos].height,
          }
        }
      })

      this.setState({
        array: temp
      })
    }

    if (!this.state.moveFlag && this.state.isClicked) {
      this.setState({
        test: [
          {
            beginX: this.state.current?.beginX,
            beginY: this.state.current?.beginY,
            endX: e.pageX,
            endY: e.pageY,
            width: Math.abs(e.pageX - this.state.current!.beginX!),
            height: Math.abs(e.pageY - this.state.current!.beginY!),
          },
        ]
      })
    }

  }

  onDivDown = (e: any, pos: number) => {
    this.setState({
      pos: pos,
      moveFlag: true
    })
  }

  onDivUp = () => {
    this.setState({
      moveFlag: false
    })
  }

  render() {
    return (
      <>
        <div
          className="area"
          onMouseDown={(e) => this.mouseDown(e)}
          onMouseMove={(e) => this.mouseMove(e)}
        >
          {this.state.array.map((item, pos) => {
            return (
              <div
                className="div-selected"
                style={{
                  top:
                    (item.endY || 0) > (item.beginY || 0)
                      ? item.beginY
                      : item.endY,
                  left:
                    (item.endX || 0) > (item.beginX || 0)
                      ? item.beginX
                      : item.endX,
                  width: item.width,
                  height: item.height,
                }}
                onMouseDown={(e) => this.onDivDown(e, pos)}
                onMouseUp={() => this.onDivUp()}
                key={pos + 1}
              >
              </div>
            )
          }
          )}
        </div>

        <div
          className="area"
          onMouseUp={(e) => this.mouseUp(e)}
          onMouseMove={(e) => this.mouseMove(e)}
        >
          {this.state.test.map((item, pos) => {
            return (
              <div
                className="div-selected"
                style={{
                  top:
                    (item.endY || 0) > (item.beginY || 0)
                      ? item.beginY
                      : item.endY,
                  left:
                    (item.endX || 0) > (item.beginX || 0)
                      ? item.beginX
                      : item.endX,
                  width: item.width,
                  height: item.height,
                }}
                key={pos + 1}
              >
              </div>
            )
          }
          )}
        </div>
      </>
    )
  }
}