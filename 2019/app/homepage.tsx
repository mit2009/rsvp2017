import * as React from "react";
import * as ReactDOM from "react-dom";
import * as $ from "jQuery";

export class Homepage extends React.PureComponent<{}, {}> {

  private mouseX;
  private mouseY;




  public componentDidMount () {
    document.addEventListener("mousemove", (event) => {
      console.log("("+event.screenX+","+event.screenY+")");
      this.mouseX = event.screenX;
      this.mouseY = event.screenY;

      var threshold = 100;

      var colors = ["red","orange","yellow","green","blue","purple","silver","pink"];

      var i;

      for (i = 0; i < colors.length; i++) {
        var mallowXRef = this.getXCoordinate(colors[i]);
        var mallowYRef = this.getYCoordinate(colors[i]);

        var dist = this.getDistance(mallowXRef,mallowYRef,this.mouseX,this.mouseY);






        // if distance less than 100, move the mallow proportionately
        if (dist < this.threshold){
          var mallowMoveX = Math.abs($(".mallow mallow-"+colors[i]+" in").left - $(".mallow mallow-"+colors[i]+" out").left);
          var mallowMoveY = Math.abs($(".mallow mallow-"+colors[i]+" in").top - $(".mallow mallow-"+colors[i]+" out").top);

          var proportion = dist / threshold;

          $(".mallow mallow-"+colors[i]+" out").left = proportion * mallowMoveX;
          $(".mallow mallow-"+colors[i]+" out").top = proportion * mallowMoveY;
        }

      }



      console.log("mallow coords: "+mallowXRef+","+mallowYRef);
      console.log("mouse coords: "+this.mouseX+","+this.mouseY);



      console.log("distance: "+dist);
      //console.log("distance: ""+dist);
      // your code here to check mallow distance and stuff
      //console.log(this.getDistance(0,0,2,5));

      //var redCoordinates = $( ".mallow mallow-red reference" ).getBoundingClientRect().top;
      //this.getYCoordinate('red');
      //console.log("red-mallow-x: "+this.getXCoordinate("red"));
      //console.log("red-mallow-Y: "+this.getYCoordinate("red"));
      //(435,427)
    })
  }

  public componentWillUnmount() {

  }

  constructor() {
    //console.log($(".mallow-yellow").css("backgroundColor", 'blue'));;
  }

  public render() {
    return <div />
  }

  private getDistance(x1, y1, x2, y2){
    var deltaX = Math.abs(x2 - x1);
    var deltaY = Math.abs(y2 - y1);
    var dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
    return (dist);

    /*
    $(".mallow-actual-yellow").css({
      top: posX + "px",
      left: posY + "px",
    })
    */
  }

  private getYCoordinate(mallowColor){
    return $( "#mallow-"+mallowColor+"-reference" ).get(0).getBoundingClientRect().top;
  }

  private getXCoordinate(mallowColor){
    return $( "#mallow-"+mallowColor+"-reference" ).offset().left;
  }

}

ReactDOM.render(<Homepage />, document.getElementById("home-content"));
