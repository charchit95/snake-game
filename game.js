//Do Change
var width=256;//640 160
var height=160;//480 120
var growspeed=10;

//Do not Touch
var frame=20;
var xpos=0;
var ypos=0;
var dx=0;
var dy=0;
var segments=0;
var gameover=false;
var appleX=100;
var appleY=100;
var Score=0;
var tx=0;
var ty=0;
var deltax=tx-xpos;
var deltay=ty-ypos;    

let palette = [0,0, 0,//0
               0,0, 255,//3
               0,255,0, //6
               0,255,255,//9
               255,0,0,//12
               255,0,255,//15
               255,255,  0,//18
               255,255,255];//21                                     
   

let snake =    " 212 "+  
               "21112"+ 
               "11111"+   
               "21112"+    
               " 212 ";  

let apple =  "   111"+ 
             "  11  "+  
             " 1121 "+ 
             "111221"+   
             "111121"+    
             " 1111 "+
             "  11  "; 

let GameOver =  "  111   1    1 1   111     1   1 1  111  111 "+
                " 1     1 1  1 1 1  1      1 1  1 1  1    1 1 "+
                " 1     111  1 1 1  111    1 1  1 1  111  111 "+ 
                " 1  1  1 1  1 1 1  1      1 1   1   1    11  "+
                "  111  1 1  1   1  111     1    1   111  1 1 "; 

let numbers =   " 1  1  1 1111 1111111111111111"+
                "1 1 1 1 1  11 11  1    11 11 1"+
                "1 1 1   1111111111111 1 111111"+ 
                "1 1 1  1   1  1  11 11  1 1 1 "+
                " 1  1 111111  11111111  1111  ";  

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d", {
    alpha: false
});
var imgData = ctx.createImageData(width, height);
var myarray = new Int32Array(width * height);
c.width  = width;
c.height = height;
c.addEventListener("touchstart", touch, false);

Init();
animationStartTime = window.performance.now();


//***********************************************
// touch needs some more work.

    function touch() {            
      tx=event.touches[0].pageX / 2; 
      ty=event.touches[0].pageY / 2;     
      deltax=tx-xpos;
      deltay=ty-ypos;      
      if (Math.abs(deltax)>Math.abs(deltay))
      {
       if (deltax<0 && dx!=1) 
         {
           dx=-1;
           dy=0; 
         }
        if (deltax>0 && dx!=-1) 
          {
            dx=1;
            dy=0; 
          }
      }
      else
      {
         if (deltay<0 && dy!=1) 
         {
            dx=0;
            dy=-1;            
         }
        if (deltay>0 && dy!=-1) 
          {
            dx=0;
            dy=1;             
          }
      }
    }



//***********************************************

window.addEventListener('keydown', function(e) {
 
  if (e.keyCode == 37 && dx!=1)
    {
      dx=-1;
      dy=0;       
    }
  if (e.keyCode == 38 && dy!=1)
    {
        dx=0;
        dy=-1;         
    }
  if (e.keyCode == 39 && dx!=-1) 
    {
        dx=1;
        dy=0;             
    }
  if (e.keyCode == 40  && dy!=-1)
    { 
       dx=0;
       dy=1;                
    }  
  
   if (gameover==true)
        Init(); 
});

//***********************************************

function pixel(ax, ay, i) {
    imgData.data[ax * 4 + ay * width * 4] = palette[i];
    imgData.data[ax * 4 + ay * width * 4 + 1] = palette[i + 1];
    imgData.data[ax * 4 + ay * width * 4 + 2] = palette[i + 2];
    imgData.data[ax * 4 + ay * width * 4 + 3] = 255; 
    return (myarray[ax+ay*width]> frame-20) && (frame>20);
}

//***********************************************

function getpixel(ax, ay) {
    return imgData.data[ax * 4 + ay * width * 4]+
      imgData.data[ax * 4 + ay * width * 4+1]*256+
      imgData.data[ax * 4 + ay * width * 4+2]*65536;      
}

//***********************************************

function SetField(ax,ay,idx)
{
    myarray[ax + ay * width] = idx;
}

function GetField(ax,ay)
{
   return  myarray[ax + ay * width];
}

function Init() {
    frame = 0;
    for (j = 0; j < height; j++)
        for (i = 0; i < width; i++)
            SetField(i,j,0)

    var ofsa = 0;
    for (j = 0; j < height; j++)
        for (i = 0; i < width; i++) 
          pixel(i,j,0);     
  
      //**** create field ********
  
    for (j = 0; j < height; j++) {
        pixel(0, j, 12);       
        pixel(1, j, 12);
        pixel(width-1, j, 12);
        pixel(width-2, j, 12);
        SetField(0,j,99999);
        SetField(1,j,99999);
        SetField(width-1,j,99999);
        SetField(width-2,j,99999);      
    }
    for (i = 0; i < width; i++) {
        pixel(i, (0), 12);
        pixel(i, (1), 12);
        pixel(i, (height-1), 12);
        pixel(i, (height-2), 12);
        SetField(i,0,99999);
        SetField(i,1,99999);
        SetField(i,height-1,99999);
        SetField(i,height-2,99999);              
    }

  frame=20;
  xpos=5;
  ypos=60;
  dx=1;
  dy=0;
  segments=20;
  gameover=false;
  appleX=30+Math.floor(Math.random()*(width-60));  
  appleY=30+Math.floor(Math.random()*(height-60));
  Score=0;
  requestId = window.requestAnimationFrame(animate);
}

//***********************************************

function animate() {
    var i, j;
    var ofsa = 0
    var idx = 0;
    var src = 0;

    //******Draw snake ********
  
    idx = 18;
    for (j = 0; j < 5; j++)
        for (i = 0; i < 5; i++)
            if (snake[i + j * 5] == "1")    
              if ( GetField(xpos + i , j + ypos)!=99999 )
                SetField( xpos + i ,j + ypos, frame)                  
     //****** Erase tale ******
  
     for (j = 0; j < height; j++)
        for (i = 0; i < width; i++)
            if (GetField(i , j) == frame-segments)
               SetField(i ,j, 0); 
  
      //****** draw field ******
    var lookup = 0;
    for (j = 2; j < height-2; j++)
        for (i = 2; i < width-2; i++) {
            lookup = GetField(i,j);
            ofsa=i * 4 + j * width * 4;
            if (lookup>0)
              {
               if (((lookup-frame) & 4)==4)
                 idx = 18
                if (((lookup-frame) & 4)==0)
                 idx = 15
              }
            else
                idx = 0;
            imgData.data[ofsa++] = palette[idx++];
            imgData.data[ofsa++] = palette[idx++];
            imgData.data[ofsa++] = palette[idx];
            imgData.data[ofsa++] = 255;
        }
  
    //***** draw apple *********    
    var newpos=false;
    for (j = 0; j < 7; j++)
        for (i = 0; i < 6; i++)
           if ((apple[i + j * 6] == "1") ||  (apple[i + j * 6] == "2"))
             {
               if (apple[i + j * 6] == "1"){idx=6;}
               if (apple[i + j * 6] == "2"){idx=21;}
               if  (pixel(appleX + i , (appleY + j),idx)==true)                           
                 newpos=true;                                                      
             }
  
     if (newpos==true)
     {
       Score++;
       segments=segments+growspeed;
       appleX=30+Math.floor(Math.random()*(width-60));  
       appleY=30+Math.floor(Math.random()*(height-60)); 
     }  
  
     //***** Detect collision *****         
     for (j = 0; j < 5; j++)
       for (i = 0; i < 5; i++)
         if (snake[i + j * 5] == "2")                                
           {
             var scan = GetField( xpos + i , j + ypos);         
              if (((scan>0) && (scan<frame-15) ) || (scan==99999))
              {
               gameover=true;
                 //***** draw Game Over *****             
                 for (var y = 0; y < 5; y ++) 
                   for (var x = 0; x<GameOver.length / 5; x ++)    
                     if (GameOver[x+y*GameOver.length / 5]=="1")
                       pixel(Math.round(width*0.5)+x-20,Math.round(height*0.5)-2+y,6)
                     else
                       pixel(Math.round(width*0.5)+x-20,Math.round(height*0.5)-2+y,0)
               } 
           }
  
     //********* draw score *********
    for (var d=0;d<5;d++)
    {
      var digit = String(100000+Score).charAt(1+d);                    
     for (var y = 0; y < 5; y ++) 
      for (var x= 0; x < 3; x ++)   
         {          
           if (numbers[x+digit*3+y*30]=="1")
             idx=21;
           else
             idx=0;                 
          pixel(width-25+d*4+x,1+y,idx);  
        }     
    }    
  
    ctx.putImageData(imgData, 0, 0);
    //New Frame
    if (gameover==false)
    requestId = window.requestAnimationFrame(animate);

    frame++;
    xpos=xpos+dx;
    ypos=ypos+dy;
          
}
