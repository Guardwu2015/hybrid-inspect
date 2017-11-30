
import html2canvas from './components/html2canvas';

declare var VORLON: any;
const { Core, ClientPlugin } = VORLON;

const ready = function (callback) {
  ///兼容FF,Google
  if (document.addEventListener) {
    const func = () => {
      document.removeEventListener('DOMContentLoaded', func, false);
      callback();
    }
    document.addEventListener('DOMContentLoaded', func, false)
  }
  //兼容IE
  else if (document.attachEvent) {
    document.attachEvent('onreadystatechange', function () {
      if (document.readyState == "complete") {
        document.detachEvent("onreadystatechange", arguments.callee);
        callback();
      }
    })
  }
  else if (document.lastChild == document.body) {
    callback();
  }
}

export class PreviewClient extends ClientPlugin {

  constructor() {
    super("preview"); // Name
    this._ready = true; // No need to wait
    console.log('Started');

  }

  //Return unique id for your plugin
  public getID(): string {
    return "PREVIEW";
  }

  public refresh(): void {
    //override this method with cleanup work that needs to happen
    //as the user switches between clients on the dashboard

    //we don't really need to do anything in this sample
  }

  // This code will run on the client //////////////////////

  // Start the clientside code
  public startClientSide(): void {
    //don't actually need to do anything at startup
    ready(() => {
     
    })

  }

  // Handle messages from the dashboard, on the client
  public onRealtimeMessageReceivedFromDashboardSide(receivedObject: any): void {
    if (receivedObject.message == 'preview') {
        const width= document.body.clientWidth;   //准备截图div的宽
        const height= document.body.clientHeight;  //准备截图div的高
        const varscaleBy = 3;//缩放比例
        const allImages = document.getElementsByTagName('img');
        // 改变页面中img标签的src属性地址
        // for (let index = 0; index < allImages.length; index++ ) {
        //     const image = allImages[index];
        //     if ( image.src.indexOf('proxyToLocal') < 0 ) {
        //         image.src = `/proxyToLocal?url=${encodeURIComponent(image.src)}`;
        //     }
        // }
    
        const node = document.body; // document.getElementById('header'); 

        html2canvas(node,{
            useCORS: true,
            allowTaint:true,
          }).then((canvas) => {
            canvas.id="mycanvas";
            // document.body.appendChild(canvas);
            //生成base64图片数据
            
            var dataUrl= canvas.toDataURL('image/png');
            
            // document.execCommand("dataUrl");
            // var newImg=document.createElement("img");
            // newImg.crossOrigin="anonymous";//关键
            // newImg.src=dataUrl;
            const screen = {
                width: window.screen.width,
                height: window.screen.height
            };
            this.sendToDashboard({data: { dataUrl,  screen }, message: 'preview'});
        }).catch(() => {
            this.sendToDashboard({data: { dataUrl: '' }, message: 'preview'});
        });
      
    }
  }
}

//Register the plugin with vorlon core
Core.RegisterClientPlugin(new PreviewClient());